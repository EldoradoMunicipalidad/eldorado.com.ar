const express = require('express')
const path = require('path')
const cors = require('cors')
const pool = require('./db.cjs')
const { askUru } = require('./uruService.cjs')
const { verifyAdmin, requireAdminFor, makeLoginLimiter, bcrypt } = require('./authMiddleware.cjs')
// Last deploy: 2026-08-12 - bcrypt + requireAdmin migration for all admin endpoints

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

const ADMIN_TABLE = 'admins'
const requireAdmin = requireAdminFor(pool, ADMIN_TABLE)
const loginLimiter = makeLoginLimiter()

// Serve static files in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// ─── CONFIG (lectura PUBLICA) ─────────────────────────────────────────────
app.get('/api/config', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM config WHERE id = 'default'")
    if (rows.length === 0) {
      const { rows: inserted } = await pool.query(
        "INSERT INTO config (id, max_per_day, turnero_paused) VALUES ('default', 3, true) RETURNING *"
      )
      return res.json(inserted[0])
    }
    return res.json(rows[0])
  } catch (err) {
    console.error('GET /api/config error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/config', requireAdmin, async (req, res) => {
  try {
    const { max_per_day, turnero_paused } = req.body
    const { rows } = await pool.query(
      `UPDATE config SET max_per_day = COALESCE($1, max_per_day), turnero_paused = COALESCE($2, turnero_paused)
       WHERE id = 'default' RETURNING *`,
      [max_per_day, turnero_paused]
    )
    res.json(rows[0])
  } catch (err) {
    console.error('PUT /api/config error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── AREAS ──────────────────────────────────────────────────────────────
// Lectura PUBLICA (la home / ciudadano digital necesita ver nombres de areas)
app.get('/api/areas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM areas ORDER BY id')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Escritura: ADMIN
app.post('/api/areas', requireAdmin, async (req, res) => {
  try {
    const area = req.body
    const { rows } = await pool.query(
      `INSERT INTO areas (id, name, description, color, icon, active, days, interval, slots_per_day, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, description = EXCLUDED.description, color = EXCLUDED.color,
         icon = EXCLUDED.icon, active = EXCLUDED.active, days = EXCLUDED.days,
         interval = EXCLUDED.interval, slots_per_day = EXCLUDED.slots_per_day,
         start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time
       RETURNING *`,
      [area.id, area.name, area.description, area.color, area.icon, area.active,
       area.days, area.interval, area.slotsPerDay || area.slots_per_day,
       area.startTime || area.start_time, area.endTime || area.end_time]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/areas/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM appointments WHERE area_id = $1', [req.params.id])
    await pool.query('DELETE FROM areas WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── APPOINTMENTS ────────────────────────────────────────────────────
// Lista: ADMIN (datos personales sensibles: nombre, apellido, dni, telefono, email, direccion)
app.get('/api/appointments', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit) || 200))
    const offset = (page - 1) * limit
    const statusFilter = req.query.status || ''
    const areaIdFilter = req.query.area_id || ''
    const dateFilter = req.query.date || ''

    const params = []
    const conditions = []
    let idx = 1

    if (statusFilter) {
      conditions.push(`status = $${idx++}`)
      params.push(statusFilter)
    }
    if (areaIdFilter) {
      conditions.push(`area_id = $${idx++}`)
      params.push(areaIdFilter)
    }
    if (dateFilter) {
      conditions.push(`date = $${idx++}`)
      params.push(dateFilter)
    }

    const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM appointments${whereClause}`,
      params
    )
    const total = countResult.rows[0].total

    const dataResult = await pool.query(
      `SELECT * FROM appointments${whereClause} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    )

    res.json({ entries: dataResult.rows, total, page, limit })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Crear: PUBLICO (un ciudadano saca un turno)
// Validaciones en cascada:
//   1) Turnero no pausado (lee config)
//   2) Área activa y (date, time) cae dentro de su ventana horaria
//   3) Capacidad: count(active) < slots_per_day por (area_id, date)
//   4) Slot libre: no existe appointment activo en (area_id, date, time)
//   5) Defensa contra race: UNIQUE INDEX parcial garantiza unicidad incluso
//      si dos requests validan en simultáneo. El INSERT captura unique_violation
//      (PG 23505) y responde 409.
app.post('/api/appointments', async (req, res) => {
  try {
    const a = req.body
    if (!a?.areaId || !a?.date || !a?.time || !a?.nombre || !a?.apellido || !a?.dni) {
      return res.status(400).json({ error: 'Faltan datos requeridos (areaId, date, time, nombre, apellido, dni)' })
    }

    // 1) Turnero pausado?
    const { rows: cfgRows } = await pool.query("SELECT turnero_paused FROM config WHERE id='default'")
    if (cfgRows[0]?.turnero_paused) {
      return res.status(503).json({ error: 'El turnero está pausado. Volvé a intentar más tarde.' })
    }

    // 2) Área activa + ventana horaria
    const { rows: areaRows } = await pool.query(
      'SELECT id, name, active, slots_per_day, start_time, end_time, interval FROM areas WHERE id = $1',
      [a.areaId]
    )
    const area = areaRows[0]
    if (!area) return res.status(404).json({ error: 'Área no encontrada' })
    if (!area.active) return res.status(400).json({ error: 'El área no acepta turnos' })

    const [reqH, reqM] = a.time.split(':').map(Number)
    const reqMin = reqH * 60 + reqM
    const [stH, stM] = area.start_time.split(':').map(Number)
    const [enH, enM] = area.end_time.split(':').map(Number)
    const startMin = stH * 60 + stM
    const endMin = enH * 60 + enM
    if (reqMin < startMin || reqMin >= endMin || (reqMin - startMin) % area.interval !== 0) {
      return res.status(400).json({ error: `Horario fuera de la ventana del área (${area.start_time}–${area.end_time}, intervalo ${area.interval}min)` })
    }

    // 3) Capacidad diaria del área
    const { rows: capRows } = await pool.query(
      `SELECT COUNT(*)::int AS n FROM appointments WHERE area_id=$1 AND date=$2 AND status != 'cancelled'`,
      [a.areaId, a.date]
    )
    if (capRows[0].n >= area.slots_per_day) {
      return res.status(409).json({ error: `No hay más cupos para ${area.name} ese día (${area.slots_per_day} slots)` })
    }

    // 4) Slot específico libre (defensa lógica, no atómica)
    const { rows: slotRows } = await pool.query(
      `SELECT 1 FROM appointments WHERE area_id=$1 AND date=$2 AND time=$3 AND status != 'cancelled' LIMIT 1`,
      [a.areaId, a.date, a.time]
    )
    if (slotRows.length > 0) {
      return res.status(409).json({ error: 'Ese horario ya está ocupado. Elegí otro.' })
    }

    // 5) INSERT. Si entre el check y el INSERT otro request se cuela,
    //    UNIQUE INDEX appointments_active_slot_unique dispara 23505 → 409.
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    try {
      const { rows } = await pool.query(
        `INSERT INTO appointments (id, area_id, area_name, date, time, nombre, apellido, dni, telefono, email, direccion, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending') RETURNING id`,
        [id, a.areaId, area.name, a.date, a.time, a.nombre, a.apellido, a.dni, a.telefono, a.email, a.direccion]
      )
      res.json({ id: rows[0].id })
    } catch (insertErr) {
      if (insertErr.code === '23505') {
        // Race condition: otro request ganó. Devolver mismo 409.
        return res.status(409).json({ error: 'Ese horario ya está ocupado. Elegí otro.' })
      }
      throw insertErr
    }
  } catch (err) {
    console.error('POST /api/appointments error:', err.message)
    res.status(500).json({ error: 'Error interno al crear el turno' })
  }
})

// Cambiar status: ADMIN
app.patch('/api/appointments/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    await pool.query('UPDATE appointments SET status = $1 WHERE id = $2', [status, req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── AUTH ──────────────────────────────────────────────────────────────
// Login: password contra admins. Devuelve token = "username:password" para Bearer en futuras requests.
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ authenticated: false, error: 'Usuario y contraseña requeridos' })
    }
    const result = await verifyAdmin(pool, ADMIN_TABLE, username, password)
    if (!result.ok) {
      return res.status(401).json({ authenticated: false, error: 'Credenciales inválidas' })
    }
    pool.query('UPDATE admins SET last_login = NOW() WHERE username = $1', [username])
      .catch(() => {})
    res.json({
      authenticated: true,
      username: result.username,
      token: `${username}:${password}`,
    })
  } catch (err) {
    console.error('POST /api/auth/login error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── SEED (solo si NO hay datos; admin only por seguridad) ─────────────
app.post('/api/seed', requireAdmin, async (req, res) => {
  try {
    const { rows: existing } = await pool.query('SELECT COUNT(*) as cnt FROM areas')
    if (parseInt(existing[0].cnt) > 0) {
      return res.json({ seeded: false, message: 'Ya existen datos' })
    }
    const DEFAULT_AREAS = [
      { id:'mesa-entradas', name:'Mesa de Entrada', description:'Ingreso y egreso de trámites, consultas generales y recepción de documentación.', color:'bg-sky-500', icon:'inboxIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:10, startTime:'07:00', endTime:'13:00' },
      { id:'topografia', name:'Depto. de Topografía', description:'Levantamientos topográficos, planimetría y relevantamiento territorial.', color:'bg-emerald-500', icon:'landscapeIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:10, startTime:'07:00', endTime:'13:00' },
      { id:'planeamiento', name:'Depto. de Planeamiento', description:'Planificación urbana, trazado de calles y ordenamiento territorial.', color:'bg-violet-500', icon:'mapIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'control-tecnico-obras', name:'Depto. de Control Técnico de Obras Part.', description:'Control técnico y aprobación de planos de obras privadas.', color:'bg-amber-500', icon:'engineeringIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'inspeccion-seguridad-urbana', name:'Depto. de Insp. Seguridad Urbana y de Edificación', description:'Inspección de seguridad urbana y condiciones de edificación.', color:'bg-rose-500', icon:'securityIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'inspecciones-obras', name:'Depto. de Inspecciones de Obras Part.', description:'Inspección y fiscalización de obras particulares en ejecución.', color:'bg-cyan-500', icon:'construction', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'legislacion-urbana', name:'Depto. de Legislación Urbana', description:'Asesoramiento en normativa urbana, códigos de edificación y legislación municipal.', color:'bg-yellow-500', icon:'gavelIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:6, startTime:'07:00', endTime:'13:00' },
    ]
    for (const area of DEFAULT_AREAS) {
      await pool.query(
        `INSERT INTO areas (id, name, description, color, icon, active, days, interval, slots_per_day, start_time, end_time)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [area.id, area.name, area.description, area.color, area.icon, area.active,
         area.days, area.interval, area.slotsPerDay, area.startTime, area.endTime]
      )
    }
    await pool.query("INSERT INTO config (id, max_per_day, turnero_paused) VALUES ('default', 3, true) ON CONFLICT (id) DO NOTHING")
    // NOTA: NO se siembra admin 'admin'/'admin' — riesgo de seguridad.
    // El operador debe crear el primer admin manualmente (ver server/init.sql).
    res.json({ seeded: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── ADMINS MANAGEMENT (admin only) ────────────────────────────
app.get('/api/admins', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT username, rol FROM admins ORDER BY username')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admins', requireAdmin, async (req, res) => {
  try {
    const { username, password, nombre, email } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' })
    }
    const hash = bcrypt.hashSync(password, 12)
    await pool.query(
      `INSERT INTO admins (username, password_hash, rol, nombre, email)
       VALUES ($1, $2, 'admin', $3, $4)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, hash, nombre || '', email || '']
    )
    res.json({ success: true, username })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/admins/:username', requireAdmin, async (req, res) => {
  try {
    if (req.params.username === 'admin') {
      return res.status(400).json({ error: 'No se puede eliminar el admin principal' })
    }
    await pool.query('DELETE FROM admins WHERE username = $1', [req.params.username])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admins/change-password', requireAdmin, async (req, res) => {
  try {
    const { username, newPassword } = req.body
    if (!username || !newPassword) {
      return res.status(400).json({ error: 'Datos requeridos' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' })
    }
    const hash = bcrypt.hashSync(newPassword, 12)
    const { rowCount } = await pool.query(
      'UPDATE admins SET password_hash = $1 WHERE username = $2',
      [hash, username]
    )
    if (rowCount === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── CHAT (proxy a Uru) ─────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body
    const response = await askUru({ messages, system })
    res.json({ response })
  } catch (err) {
    console.error('POST /api/chat error:', err.message)
    res.status(500).json({ error: 'Chat error' })
  }
})

// ─── HABILITACIONES COMMERCIALES + OTROS MÓDULOS (routers externos) ────────
const habilitacionesRoutes = require('./routes/habilitaciones.cjs')
const reclamosRoutes = require('./routes/reclamos.cjs')
const pagesRoutes = require('./routes/pages.cjs')
const ambienteRoutes = require('./routes/ambiente.cjs')
const homeContentRoutes = require('./routes/homeContent.cjs')
const registroVehiculosRoutes = require('./routes/registroVehiculos.cjs')
const escuelaManejoRoutes = require('./routes/escuelaManejo.cjs')
app.use('/api/habilitaciones', habilitacionesRoutes)
app.use('/api/reclamos', reclamosRoutes)
app.use('/api/pages', pagesRoutes)
app.use('/api/ambiente', ambienteRoutes)
app.use('/api/home-content', homeContentRoutes)
app.use('/api/registro-vehiculos', registroVehiculosRoutes)
app.use('/api/escuela-manejo', escuelaManejoRoutes)

// ─── Serve uploads as static files ──────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ─── START ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000

// SPA fallback: serve index.html for any non-API route after all routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' })
  }
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`✅ Turnero API + static server running on http://localhost:${PORT}`)
})

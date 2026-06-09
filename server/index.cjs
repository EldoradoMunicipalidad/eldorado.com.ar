const express = require('express')
const path = require('path')
const cors = require('cors')
const pool = require('./db.cjs')

const app = express()
app.use(cors())
app.use(express.json())

// Serve static files in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// ─── Simple hash function (mirrors frontend) ─────────────────────────────
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

// ─── CONFIG ─────────────────────────────────────────────────────────────
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

app.put('/api/config', async (req, res) => {
  try {
    const { max_per_day, turnero_paused } = req.body
    const { rows } = await pool.query(
      `UPDATE config SET max_per_day = COALESCE($1, max_per_day), turnero_paused = COALESCE($2, turnero_paused)
       WHERE id = 'default' RETURNING *`,
      [max_per_day, turnero_paused]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── AREAS ──────────────────────────────────────────────────────────────
app.get('/api/areas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM areas ORDER BY id')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/areas', async (req, res) => {
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

app.delete('/api/areas/:id', async (req, res) => {
  try {
    // Delete related appointments first
    await pool.query('DELETE FROM appointments WHERE area_id = $1', [req.params.id])
    await pool.query('DELETE FROM areas WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── APPOINTMENTS (paginated) ────────────────────────────────────────
app.get('/api/appointments', async (req, res) => {
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

app.post('/api/appointments', async (req, res) => {
  try {
    const a = req.body
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    const { rows } = await pool.query(
      `INSERT INTO appointments (id, area_id, area_name, date, time, nombre, apellido, dni, telefono, email, direccion, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending') RETURNING id`,
      [id, a.areaId, a.areaName, a.date, a.time, a.nombre, a.apellido, a.dni, a.telefono, a.email, a.direccion]
    )
    res.json({ id: rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    await pool.query('UPDATE appointments SET status = $1 WHERE id = $2', [status, req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── AUTH ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const hash = simpleHash(password)
    const { rows } = await pool.query(
      'SELECT username FROM admins WHERE username = $1 AND password_hash = $2',
      [username, hash]
    )
    if (rows.length > 0) {
      res.json({ authenticated: true, username: rows[0].username })
    } else {
      res.status(401).json({ authenticated: false, error: 'Credenciales inválidas' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── SEED (only if empty) ──────────────────────────────────────────────
app.post('/api/seed', async (req, res) => {
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
    await pool.query("INSERT INTO admins (username, password_hash) VALUES ('admin', '1j67nz') ON CONFLICT (username) DO NOTHING")
    res.json({ seeded: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── ADMINS MANAGEMENT ──────────────────────────────────────────
app.get('/api/admins', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT username FROM admins ORDER BY username')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admins', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
    }
    const hash = simpleHash(password)
    await pool.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash',
      [username, hash]
    )
    res.json({ success: true, username })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/admins/:username', async (req, res) => {
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

// ─── HABILITACIONES COMMERCIALES ───────────────────────────────────
const habilitacionesRoutes = require('./routes/habilitaciones.cjs')
const reclamosRoutes = require('./routes/reclamos.cjs')
app.use('/api/habilitaciones', habilitacionesRoutes)
app.use('/api/reclamos', reclamosRoutes)

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

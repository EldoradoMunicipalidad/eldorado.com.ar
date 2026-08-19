// Turnero Escuela de Manejo — API routes (independiente de Planeamiento y Ambiente)
// Usa tablas propias: areas_escuela_manejo, appointments_escuela_manejo,
// config_escuela_manejo, admins_escuela_manejo
// Área única: Autódromo km 4 (14 a 18 hs, 2 alumnos/hora)
// Diferencias con otros turneros:
//   - Campos extra: vehiculo_propio (bool), cantidad_clases (int 1..6)
//   - Validación de edad mínima (16 años y 6 meses) se hace en frontend

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const { verifyAdmin, requireAdminFor, makeLoginLimiter, bcrypt } = require('../authMiddleware.cjs')

const ADMIN_TABLE = 'admins_escuela_manejo'
const requireAdmin = requireAdminFor(pool, ADMIN_TABLE)
const loginLimiter = makeLoginLimiter()

// ─── CONFIG ────────────────────────────────────────────────────────────
router.get('/config', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM config_escuela_manejo WHERE id = 'default'")
    if (rows.length === 0) {
      const { rows: inserted } = await pool.query(
        "INSERT INTO config_escuela_manejo (id, max_per_day, turnero_paused) VALUES ('default', 1, true) RETURNING *"
      )
      return res.json(inserted[0])
    }
    return res.json(rows[0])
  } catch (err) {
    console.error('GET /api/escuela-manejo/config error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.put('/config', requireAdmin, async (req, res) => {
  try {
    const { max_per_day, turnero_paused } = req.body
    const { rows } = await pool.query(
      `UPDATE config_escuela_manejo SET max_per_day = COALESCE($1, max_per_day), turnero_paused = COALESCE($2, turnero_paused)
       WHERE id = 'default' RETURNING *`,
      [max_per_day, turnero_paused]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── AREAS (lectura PUBLICA; escritura ADMIN) ──────────────────────────
router.get('/areas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM areas_escuela_manejo ORDER BY id')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/areas', requireAdmin, async (req, res) => {
  try {
    const area = req.body
    const { rows } = await pool.query(
      `INSERT INTO areas_escuela_manejo (id, name, description, color, icon, active, days, interval, slots_per_day, start_time, end_time)
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

router.delete('/areas/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM appointments_escuela_manejo WHERE area_id = $1', [req.params.id])
    await pool.query('DELETE FROM areas_escuela_manejo WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── APPOINTMENTS (lista ADMIN, crear PUBLICO) ─────────────────────────
router.get('/appointments', requireAdmin, async (req, res) => {
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
      `SELECT COUNT(*)::int AS total FROM appointments_escuela_manejo${whereClause}`,
      params
    )
    const total = countResult.rows[0].total

    const dataResult = await pool.query(
      `SELECT * FROM appointments_escuela_manejo${whereClause} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    )

    res.json({ entries: dataResult.rows, total, page, limit })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Helper: edad mínima 16 años y 6 meses (defensa en backend) ──────────────
function cumpleEdadMinima(birthDateStr) {
  if (!birthDateStr) return false
  const birth = new Date(birthDateStr)
  if (Number.isNaN(birth.getTime())) return false
  const today = new Date()
  let ageYears = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) ageYears--
  if (ageYears > 16) return true
  if (ageYears < 16) return false
  const sixMonthsAfter = new Date(birth)
  sixMonthsAfter.setMonth(sixMonthsAfter.getMonth() + 6)
  return today >= sixMonthsAfter
}

// ─── Helper: get config (max_per_day) ────────────────────────────────────────
async function getMaxPerDay() {
  const { rows } = await pool.query("SELECT max_per_day FROM config_escuela_manejo WHERE id='default'")
  return rows[0]?.max_per_day ?? 1
}

// ─── POST appointment (PUBLICO: alumno saca turno) ─────────────────────
// Validaciones en backend (defensa en profundidad):
//   1) cantidadClases 1..6
//   2) fechaNacimiento: edad mínima 16 años y 6 meses
//   3) max_per_day por DNI/día (lee config)
//   4) lock de slot (UNIQUE INDEX parcial — integridad DB)
router.post('/appointments', async (req, res) => {
  try {
    const a = req.body
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

    const vehiculoPropio = (a.vehiculoPropio === true || a.vehiculoPropio === 'true' || a.vehiculo_propio === true || a.vehiculo_propio === 'true')
    const cantidadClases = parseInt(a.cantidadClases || a.cantidad_clases, 10)
    const fechaNacimiento = a.fechaNacimiento || a.fecha_nacimiento || ''
    const dni = (a.dni || '').trim()
    const areaId = a.areaId || a.area_id || 'autodromo-km4'
    const areaName = a.areaName || a.area_name || 'Escuela de Manejo — Autódromo km 4'
    const date = a.date
    const time = a.time

    // 1) cantidadClases
    if (!cantidadClases || cantidadClases < 1 || cantidadClases > 6) {
      return res.status(400).json({ error: 'La cantidad de clases debe estar entre 1 y 6' })
    }

    // 2) edad mínima
    if (!cumpleEdadMinima(fechaNacimiento)) {
      return res.status(400).json({ error: 'Necesitás tener al menos 16 años y 6 meses para inscribirte.' })
    }

    // 3) max_per_day por DNI/día
    const maxPerDay = await getMaxPerDay()
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*)::int AS n FROM appointments_escuela_manejo
       WHERE dni = $1 AND date = $2 AND status != 'cancelled'`,
      [dni, date]
    )
    if (countRows[0].n >= maxPerDay) {
      return res.status(409).json({ error: `Ya tenés ${countRows[0].n} turno(s) reservado(s) para ese día. Máximo permitido: ${maxPerDay}.` })
    }

    // 4) INSERT (los UNIQUE INDEX existentes protegen contra race conditions
    //    - idx_appointments_escuela_manejo_slot: evita que 2 DNIs distintos
    //      se solapen en el mismo (area_id, date, time)
    //    - idx_appointments_escuela_manejo_dni_day: evita que el mismo DNI
    //      tenga 2+ turnos activos en el mismo día
    //    Capturamos 23505 y lo convertimos en 409 con mensaje específico)
    let rows
    try {
      const insert = await pool.query(
        `INSERT INTO appointments_escuela_manejo
           (id, area_id, area_name, date, time, nombre, apellido, dni, telefono, email, direccion, fecha_nacimiento, vehiculo_propio, cantidad_clases, archivo_url, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, '', 'pending') RETURNING id`,
        [
          id,
          areaId,
          areaName,
          date,
          time,
          a.nombre,
          a.apellido || '',
          dni,
          a.telefono,
          a.email,
          a.direccion || '',
          fechaNacimiento,
          vehiculoPropio,
          cantidadClases,
        ]
      )
      rows = insert.rows
    } catch (dbErr) {
      // 23505 = unique_violation
      if (dbErr.code === '23505') {
        const constraint = dbErr.constraint || ''
        if (constraint === 'idx_appointments_escuela_manejo_dni_day') {
          return res.status(409).json({
            error: 'Ya tenés un turno reservado para ese día. Si necesitás otro, primero cancelá el anterior.',
            code: 'dni_day_conflict',
          })
        }
        if (constraint === 'idx_appointments_escuela_manejo_slot') {
          return res.status(409).json({
            error: 'Ese horario ya fue reservado por otra persona. Elegí otra fecha u horario.',
            code: 'slot_conflict',
          })
        }
        return res.status(409).json({
          error: 'Conflicto al guardar el turno. Intentá con otro horario.',
          code: 'unique_conflict',
        })
      }
      throw dbErr
    }
    res.json({ id: rows[0].id })
  } catch (err) {
    console.error('POST /api/escuela-manejo/appointments error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Cambiar status: ADMIN
router.patch('/appointments/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    await pool.query('UPDATE appointments_escuela_manejo SET status = $1 WHERE id = $2', [status, req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── AUTH ──────────────────────────────────────────────────────────────
// Login ADMIN (bcrypt con fallback a djb2 legacy)
router.post('/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ authenticated: false, error: 'Usuario y contraseña requeridos' })
    }
    const result = await verifyAdmin(pool, ADMIN_TABLE, username, password)
    if (!result.ok) {
      return res.status(401).json({ authenticated: false, error: 'Credenciales inválidas' })
    }
    pool.query(`UPDATE ${ADMIN_TABLE} SET last_login = NOW() WHERE username = $1`, [username])
      .catch(() => {})
    res.json({
      authenticated: true,
      username: result.username,
      token: `${username}:${password}`,
    })
  } catch (err) {
    console.error('POST /api/escuela-manejo/auth/login error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── ADMINS management (admin only) ────────────────────────────────
router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT username, rol FROM ${ADMIN_TABLE} ORDER BY username`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/admins', requireAdmin, async (req, res) => {
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
      `INSERT INTO ${ADMIN_TABLE} (username, password_hash, rol, nombre, email)
       VALUES ($1, $2, 'admin', $3, $4)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, hash, nombre || '', email || '']
    )
    res.json({ success: true, username })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/admins/:username', requireAdmin, async (req, res) => {
  try {
    if (req.params.username === 'admin') {
      return res.status(400).json({ error: 'No se puede eliminar el admin principal' })
    }
    await pool.query(`DELETE FROM ${ADMIN_TABLE} WHERE username = $1`, [req.params.username])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/admins/change-password', requireAdmin, async (req, res) => {
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
      `UPDATE ${ADMIN_TABLE} SET password_hash = $1 WHERE username = $2`,
      [hash, username]
    )
    if (rowCount === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── SEED (solo si vacío, PUBLICO por compat con bootstrap inicial) ────
router.post('/seed', async (req, res) => {
  try {
    const { rows: existing } = await pool.query('SELECT COUNT(*) as cnt FROM areas_escuela_manejo')
    if (parseInt(existing[0].cnt) > 0) {
      return res.json({ seeded: false, message: 'Ya existen datos' })
    }
    const DEFAULT_AREAS = [
      {
        id: 'autodromo-km4',
        name: 'Escuela de Manejo — Autódromo km 4',
        description:
          'Práctica de manejo en el Autódromo km 4. 2 alumnos por hora, 14 a 18 hs, de lunes a viernes. 6 clases por persona.',
        color: 'bg-rose-500',
        icon: 'directionsCarIcon',
        active: true,
        days: [1, 2, 3, 4, 5],
        interval: 30,
        slotsPerDay: 8,
        startTime: '14:00',
        endTime: '18:00',
      },
    ]
    for (const area of DEFAULT_AREAS) {
      await pool.query(
        `INSERT INTO areas_escuela_manejo (id, name, description, color, icon, active, days, interval, slots_per_day, start_time, end_time)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [area.id, area.name, area.description, area.color, area.icon, area.active,
         area.days, area.interval, area.slotsPerDay, area.startTime, area.endTime]
      )
    }
    await pool.query(
      "INSERT INTO config_escuela_manejo (id, max_per_day, turnero_paused) VALUES ('default', 1, true) ON CONFLICT (id) DO NOTHING"
    )
    // NOTA: NO se siembra admin 'admin'/'admin'. Riesgo de seguridad.
    res.json({ seeded: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

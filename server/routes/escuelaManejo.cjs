// Turnero Escuela de Manejo — API routes (independiente de Planeamiento y Ambiente)
// Usa tablas propias: areas_escuela_manejo, appointments_escuela_manejo,
// config_escuela_manejo, admins_escuela_manejo
// Área única: Autódromo km 4 (14 a 18 hs, 2 alumnos/hora)
// Diferencias con otros turneros:
//   - Adjuntos (documentación) con multer → server/uploads/
//   - Campos extra: vehiculo_propio (bool), cantidad_clases (int 1..6), archivo_url
//   - Validación de edad mínima (16 años y 6 meses) se hace en frontend

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// ─── Multer config (para adjuntos de documentación) ──────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'escuela-' + uniqueSuffix + path.extname(file.originalname))
  },
})
const fileFilter = (_, file, cb) => {
  // Aceptar imágenes y PDFs (documentación del alumno)
  const allowed = /\.(jpg|jpeg|png|gif|webp|pdf)$/i
  if (allowed.test(path.extname(file.originalname))) cb(null, true)
  else cb(new Error('Solo JPG, PNG, GIF, WebP o PDF'), false)
}
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })

// ─── Simple hash (mismo algoritmo que index.cjs y ambiente.cjs) ─────────
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

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

router.put('/config', async (req, res) => {
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

// ─── AREAS ─────────────────────────────────────────────────────────────
// Single-area: Autódromo km 4. Mantenemos la tabla por si a futuro se agregan más.
router.get('/areas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM areas_escuela_manejo ORDER BY id')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/areas', async (req, res) => {
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

router.delete('/areas/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM appointments_escuela_manejo WHERE area_id = $1', [req.params.id])
    await pool.query('DELETE FROM areas_escuela_manejo WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── APPOINTMENTS (paginated) ──────────────────────────────────────────
router.get('/appointments', async (req, res) => {
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

// ─── POST appointment ──────────────────────────────────────────────────
// Recibe todos los datos del formulario + archivo opcional (campo "archivo")
// Valida que la cantidad de clases esté entre 1 y 6.
router.post('/appointments', upload.single('archivo'), async (req, res) => {
  try {
    const a = req.body
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

    // Aceptar tanto camelCase como snake_case para flexibilidad
    const vehiculoPropio = (a.vehiculoPropio === true || a.vehiculoPropio === 'true' || a.vehiculo_propio === true || a.vehiculo_propio === 'true')
    const cantidadClases = parseInt(a.cantidadClases || a.cantidad_clases, 10)

    if (!cantidadClases || cantidadClases < 1 || cantidadClases > 6) {
      return res.status(400).json({ error: 'La cantidad de clases debe estar entre 1 y 6' })
    }

    const archivoUrl = req.file ? `/uploads/${req.file.filename}` : (a.archivoUrl || a.archivo_url || '')

    const { rows } = await pool.query(
      `INSERT INTO appointments_escuela_manejo
         (id, area_id, area_name, date, time, nombre, apellido, dni, telefono, email, direccion, vehiculo_propio, cantidad_clases, archivo_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'pending') RETURNING id`,
      [
        id,
        a.areaId || a.area_id || 'autodromo-km4',
        a.areaName || a.area_name || 'Escuela de Manejo — Autódromo km 4',
        a.date,
        a.time,
        a.nombre,
        a.apellido || '',
        a.dni,
        a.telefono,
        a.email,
        a.direccion || '',
        vehiculoPropio,
        cantidadClases,
        archivoUrl,
      ]
    )
    res.json({ id: rows[0].id, archivoUrl })
  } catch (err) {
    console.error('POST /api/escuela-manejo/appointments error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST sin archivo (legacy / fallback JSON)
router.post('/appointments-json', async (req, res) => {
  try {
    const a = req.body
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    const vehiculoPropio = (a.vehiculoPropio === true || a.vehiculoPropio === 'true')
    const cantidadClases = parseInt(a.cantidadClases, 10)

    if (!cantidadClases || cantidadClases < 1 || cantidadClases > 6) {
      return res.status(400).json({ error: 'La cantidad de clases debe estar entre 1 y 6' })
    }

    const { rows } = await pool.query(
      `INSERT INTO appointments_escuela_manejo
         (id, area_id, area_name, date, time, nombre, apellido, dni, telefono, email, direccion, vehiculo_propio, cantidad_clases, archivo_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'pending') RETURNING id`,
      [
        id,
        a.areaId || 'autodromo-km4',
        a.areaName || 'Escuela de Manejo — Autódromo km 4',
        a.date,
        a.time,
        a.nombre,
        a.apellido || '',
        a.dni,
        a.telefono,
        a.email,
        a.direccion || '',
        vehiculoPropio,
        cantidadClases,
        a.archivoUrl || '',
      ]
    )
    res.json({ id: rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    await pool.query('UPDATE appointments_escuela_manejo SET status = $1 WHERE id = $2', [status, req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── UPLOAD genérico (por si el front prefiere subir primero y luego enviar la URL) ──
router.post('/upload', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se envió ningún archivo' })
  }
  const url = `/uploads/${req.file.filename}`
  res.json({ url })
})

// ─── AUTH ──────────────────────────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const hash = simpleHash(password)
    const { rows } = await pool.query(
      'SELECT username FROM admins_escuela_manejo WHERE username = $1 AND password_hash = $2',
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

// ─── ADMINS management ────────────────────────────────────────────────
router.get('/admins', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT username FROM admins_escuela_manejo ORDER BY username')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/admins', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
    }
    const hash = simpleHash(password)
    await pool.query(
      'INSERT INTO admins_escuela_manejo (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash',
      [username, hash]
    )
    res.json({ success: true, username })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/admins/:username', async (req, res) => {
  try {
    if (req.params.username === 'admin') {
      return res.status(400).json({ error: 'No se puede eliminar el admin principal' })
    }
    await pool.query('DELETE FROM admins_escuela_manejo WHERE username = $1', [req.params.username])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── SEED (solo si vacío) ──────────────────────────────────────────────
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
    await pool.query(
      "INSERT INTO admins_escuela_manejo (username, password_hash) VALUES ('admin', '1j67nz') ON CONFLICT (username) DO NOTHING"
    )
    res.json({ seeded: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
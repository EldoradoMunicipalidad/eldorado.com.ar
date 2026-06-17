// Turnero Ambiente — API routes (independiente de Planeamiento)
// Usa tablas propias: areas_ambiente, appointments_ambiente, config_ambiente, admins_ambiente
// Misma lógica que index.cjs pero con prefijo /api/ambiente

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')

// ─── Simple hash function (mismo algoritmo que index.cjs) ─────────────
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

// ─── CONFIG ───────────────────────────────────────────────────────────
router.get('/config', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM config_ambiente WHERE id = 'default'")
    if (rows.length === 0) {
      const { rows: inserted } = await pool.query(
        "INSERT INTO config_ambiente (id, max_per_day, turnero_paused) VALUES ('default', 3, true) RETURNING *"
      )
      return res.json(inserted[0])
    }
    return res.json(rows[0])
  } catch (err) {
    console.error('GET /api/ambiente/config error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.put('/config', async (req, res) => {
  try {
    const { max_per_day, turnero_paused } = req.body
    const { rows } = await pool.query(
      `UPDATE config_ambiente SET max_per_day = COALESCE($1, max_per_day), turnero_paused = COALESCE($2, turnero_paused)
       WHERE id = 'default' RETURNING *`,
      [max_per_day, turnero_paused]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── AREAS ────────────────────────────────────────────────────────────
router.get('/areas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM areas_ambiente ORDER BY id')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/areas', async (req, res) => {
  try {
    const area = req.body
    const { rows } = await pool.query(
      `INSERT INTO areas_ambiente (id, name, description, color, icon, active, days, interval, slots_per_day, start_time, end_time)
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
    await pool.query('DELETE FROM appointments_ambiente WHERE area_id = $1', [req.params.id])
    await pool.query('DELETE FROM areas_ambiente WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── APPOINTMENTS (paginated) ─────────────────────────────────────────
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
      `SELECT COUNT(*)::int AS total FROM appointments_ambiente${whereClause}`,
      params
    )
    const total = countResult.rows[0].total

    const dataResult = await pool.query(
      `SELECT * FROM appointments_ambiente${whereClause} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    )

    res.json({ entries: dataResult.rows, total, page, limit })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/appointments', async (req, res) => {
  try {
    const a = req.body
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    const { rows } = await pool.query(
      `INSERT INTO appointments_ambiente (id, area_id, area_name, date, time, nombre, apellido, dni, telefono, email, direccion, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending') RETURNING id`,
      [id, a.areaId, a.areaName, a.date, a.time, a.nombre, a.apellido, a.dni, a.telefono, a.email, a.direccion]
    )
    res.json({ id: rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    await pool.query('UPDATE appointments_ambiente SET status = $1 WHERE id = $2', [status, req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── AUTH ─────────────────────────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const hash = simpleHash(password)
    const { rows } = await pool.query(
      'SELECT username FROM admins_ambiente WHERE username = $1 AND password_hash = $2',
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

// ─── SEED (only if empty) ─────────────────────────────────────────────
router.post('/seed', async (req, res) => {
  try {
    const { rows: existing } = await pool.query('SELECT COUNT(*) as cnt FROM areas_ambiente')
    if (parseInt(existing[0].cnt) > 0) {
      return res.json({ seeded: false, message: 'Ya existen datos' })
    }
    const DEFAULT_AREAS = [
      { id:'guardia-ambiental', name:'Guardia Ambiental', description:'Atención de denuncias ambientales, control de ruidos, quema ilegal y residuos peligrosos.', color:'bg-emerald-500', icon:'naturePeopleIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'arbolado', name:'Área de Arbolado Urbano', description:'Podas, extracciones, forestación y planificación del arbolado público.', color:'bg-green-500', icon:'parkIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'educacion-ambiental', name:'Educación Ambiental', description:'Programas educativos, talleres y campañas de concientización ambiental.', color:'bg-teal-500', icon:'schoolIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:6, startTime:'07:00', endTime:'13:00' },
      { id:'residuos', name:'Gestión de Residuos', description:'Recolección diferenciada, puntos verdes, compostaje y disposición final.', color:'bg-amber-500', icon:'deleteSweepIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'higiene-urbana', name:'Higiene Urbana', description:'Control de microbasurales, limpieza de espacios públicos y desmalezado.', color:'bg-lime-500', icon:'cleaningIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'fauna-urbana', name:'Fauna Urbana', description:'Control de plagas, rescate de fauna silvestre y tenencia responsable.', color:'bg-orange-500', icon:'petsIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:6, startTime:'07:00', endTime:'13:00' },
    ]
    for (const area of DEFAULT_AREAS) {
      await pool.query(
        `INSERT INTO areas_ambiente (id, name, description, color, icon, active, days, interval, slots_per_day, start_time, end_time)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [area.id, area.name, area.description, area.color, area.icon, area.active,
         area.days, area.interval, area.slotsPerDay, area.startTime, area.endTime]
      )
    }
    await pool.query("INSERT INTO config_ambiente (id, max_per_day, turnero_paused) VALUES ('default', 3, true) ON CONFLICT (id) DO NOTHING")
    await pool.query("INSERT INTO admins_ambiente (username, password_hash) VALUES ('admin', 'alwd3i') ON CONFLICT (username) DO NOTHING")
    res.json({ seeded: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

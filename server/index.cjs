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

// ─── APPOINTMENTS ──────────────────────────────────────────────────────
app.get('/api/appointments', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM appointments ORDER BY created_at DESC')
    res.json(rows)
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
      { id:'mesa-entradas', name:'Mesa de Entradas', description:'Ingreso y egreso de trámites, consultas generales y recepción de documentación.', color:'bg-sky-500', icon:'inboxIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:10, startTime:'07:00', endTime:'13:00' },
      { id:'catastro', name:'Catastro', description:'Manzaneros catastrales, administración y división territorial.', color:'bg-emerald-500', icon:'gridOnIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:10, startTime:'07:00', endTime:'13:00' },
      { id:'zonificacion', name:'Zonificación', description:'Zonificación urbana, trazado de calles y secciones catastrales.', color:'bg-violet-500', icon:'mapIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'planos', name:'Planos y Digitalización', description:'Planos generales digitalizados, redes hídricas y planimetría barrial.', color:'bg-amber-500', icon:'architectureIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'expedientes', name:'Expedientes de Construcción', description:'Registro y control de expedientes de obras privadas.', color:'bg-rose-500', icon:'folderSharedIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'mensuras', name:'Mensuras y Archivo Técnico', description:'Visado de planos de mensura y organización del archivo técnico.', color:'bg-cyan-500', icon:'straightenIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
      { id:'autorizaciones-electricas', name:'Autorizaciones Eléctricas', description:'Autorización precaria del servicio de energía eléctrica.', color:'bg-yellow-500', icon:'boltIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:6, startTime:'07:00', endTime:'13:00' },
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

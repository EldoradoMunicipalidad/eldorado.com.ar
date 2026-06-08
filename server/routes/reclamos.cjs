const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// ─── Simple hash (mirrors server/index.cjs) ────────────────────────────
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

// ─── Generate unique code ─────────────────────────────────────────────
function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'RC-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ─── Ensure uploads directory ────────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// ─── Multer config ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, 'reclamo-' + uniqueSuffix + ext)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true)
    } else {
      cb(new Error('Solo imágenes JPG, PNG, GIF o WEBP'), false)
    }
  },
})

// ─── AUTH ─────────────────────────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
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

// ─── LIST /api/reclamos ?page &limit &estado &categoria &sort &order &search ─
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 15))
    const offset = (page - 1) * limit
    const estado = req.query.estado || ''
    const categoria = req.query.categoria || ''
    const search = req.query.search || ''
    const sortField = req.query.sort || 'created_at'
    const sortDir = req.query.order === 'asc' ? 'ASC' : 'DESC'

    // Whitelist sort fields to prevent SQL injection
    const allowedSort = ['created_at', 'codigo', 'categoria', 'estado']
    const safeSort = allowedSort.includes(sortField) ? sortField : 'created_at'

    const params = []
    const conditions = []
    let idx = 1

    if (estado && estado !== 'todos') {
      conditions.push(`estado = $${idx++}`)
      params.push(estado)
    }
    if (categoria) {
      conditions.push(`categoria ILIKE $${idx++}`)
      params.push(`%${categoria}%`)
    }
    if (search) {
      conditions.push(`(codigo ILIKE $${idx} OR titulo ILIKE $${idx} OR descripcion ILIKE $${idx} OR email ILIKE $${idx} OR nombre ILIKE $${idx} OR direccion ILIKE $${idx})`)
      params.push(`%${search}%`)
      idx++
    }

    const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM reclamos${whereClause}`,
      params
    )
    const total = countResult.rows[0].total

    const dataResult = await pool.query(
      `SELECT * FROM reclamos${whereClause} ORDER BY ${safeSort} ${sortDir} LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    )

    res.json({ entries: dataResult.rows, total, page, limit })
  } catch (err) {
    console.error('GET /api/reclamos error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── SEARCH by code ──────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const codigo = (req.query.codigo || '').trim().toUpperCase()
    if (!codigo) return res.status(400).json({ error: 'Código requerido' })

    const { rows } = await pool.query(
      'SELECT * FROM reclamos WHERE codigo = $1 LIMIT 1',
      [codigo]
    )
    if (rows.length === 0) return res.json(null)
    res.json(rows[0])
  } catch (err) {
    console.error('GET /api/reclamos/search error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── STATS ────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'pendiente')::int AS pendientes,
        COUNT(*) FILTER (WHERE estado = 'en_revision')::int AS en_revision,
        COUNT(*) FILTER (WHERE estado = 'asignado')::int AS asignados,
        COUNT(*) FILTER (WHERE estado = 'en_proceso')::int AS en_proceso,
        COUNT(*) FILTER (WHERE estado = 'resuelto')::int AS resueltos,
        COUNT(*) FILTER (WHERE estado = 'rechazado')::int AS rechazados
      FROM reclamos
    `)
    res.json(rows[0])
  } catch (err) {
    console.error('GET /api/reclamos/stats error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── CREATE ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const body = req.body

    // Generate unique code (retry on collision)
    let codigo, existing
    do {
      codigo = generarCodigo()
      const { rows } = await pool.query('SELECT id FROM reclamos WHERE codigo = $1', [codigo])
      existing = rows.length > 0
    } while (existing)

    const { rows } = await pool.query(
      `INSERT INTO reclamos (codigo, categoria, titulo, descripcion, direccion, lat, lng, fotos, email, telefono, nombre, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, 'pendiente')
       RETURNING id, codigo`,
      [
        codigo,
        body.categoria || '',
        body.titulo || '',
        body.descripcion || '',
        body.direccion || '',
        body.lat || null,
        body.lng || null,
        JSON.stringify(body.fotos || []),
        body.email || '',
        body.telefono || '',
        body.nombre || '',
      ]
    )
    res.json({ id: rows[0].id, codigo: rows[0].codigo })
    console.log(`📋 Nuevo reclamo: ${codigo}`)
  } catch (err) {
    console.error('POST /api/reclamos error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── UPLOAD photo ─────────────────────────────────────────────────────
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' })
    const url = `/uploads/${req.file.filename}`
    res.json({ url, filename: req.file.filename })
  } catch (err) {
    console.error('POST /api/reclamos/upload error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── UPDATE by ID ────────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const { estado, notas_internas, respuesta_ciudadano, asignado_a } = req.body
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })

    const setClauses = []
    const params = []
    let idx = 1

    if (estado !== undefined) {
      setClauses.push(`estado = $${idx++}`)
      params.push(estado)
    }
    if (notas_internas !== undefined) {
      setClauses.push(`notas_internas = $${idx++}`)
      params.push(notas_internas)
    }
    if (respuesta_ciudadano !== undefined) {
      setClauses.push(`respuesta_ciudadano = $${idx++}`)
      params.push(respuesta_ciudadano)
      // Set respuesta_fecha when adding a response
      setClauses.push(`respuesta_fecha = NOW()`)
    }
    if (asignado_a !== undefined) {
      setClauses.push(`asignado_a = $${idx++}`)
      params.push(asignado_a)
    }

    if (setClauses.length === 0) return res.status(400).json({ error: 'Sin campos para actualizar' })
    setClauses.push(`updated_at = NOW()`)

    params.push(id)
    const { rows } = await pool.query(
      `UPDATE reclamos SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    )
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json(rows[0])
  } catch (err) {
    console.error('PATCH /api/reclamos/:id error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── DELETE by ID ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })
    const { rowCount } = await pool.query('DELETE FROM reclamos WHERE id = $1', [id])
    if (rowCount === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/reclamos/:id error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ═══════════════════════════════════════════════════════════════════════
// CATEGORÍAS
// ═══════════════════════════════════════════════════════════════════════

router.get('/categorias', async (req, res) => {
  try {
    const soloActivas = req.query.activas === 'true'
    let query = 'SELECT * FROM reclamos_categorias'
    if (soloActivas) query += ' WHERE activa = true'
    query += ' ORDER BY orden ASC'
    const { rows } = await pool.query(query)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/categorias', async (req, res) => {
  try {
    const { nombre, icono, color, activa, orden } = req.body
    const { rows } = await pool.query(
      `INSERT INTO reclamos_categorias (nombre, icono, color, activa, orden)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, icono || 'AlertCircle', color || '#3b82f6', activa !== false, orden || 0]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/categorias/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })
    const { nombre, icono, color, activa, orden } = req.body
    const { rows } = await pool.query(
      `UPDATE reclamos_categorias
       SET nombre = COALESCE($1, nombre),
           icono = COALESCE($2, icono),
           color = COALESCE($3, color),
           activa = COALESCE($4, activa),
           orden = COALESCE($5, orden)
       WHERE id = $6 RETURNING *`,
      [nombre, icono, color, activa !== undefined ? activa : null, orden, id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/categorias/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })
    const { rowCount } = await pool.query('DELETE FROM reclamos_categorias WHERE id = $1', [id])
    if (rowCount === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ═══════════════════════════════════════════════════════════════════════
// ADMINS (gestión propia — reusa tabla admins)
// ═══════════════════════════════════════════════════════════════════════

router.get('/admins', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT username, rol, nombre, email FROM admins ORDER BY username`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/admins', async (req, res) => {
  try {
    const { username, password, nombre, email } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
    const hash = simpleHash(password)
    const { rows } = await pool.query(
      `INSERT INTO admins (username, password_hash, rol, nombre, email)
       VALUES ($1, $2, 'admin', $3, $4)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING username, rol, nombre, email`,
      [username, hash, nombre || '', email || '']
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/admins/:username', async (req, res) => {
  try {
    if (req.params.username === 'admin') return res.status(400).json({ error: 'No se puede eliminar el admin principal' })
    const { rowCount } = await pool.query('DELETE FROM admins WHERE username = $1', [req.params.username])
    if (rowCount === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

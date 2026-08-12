const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const rateLimit = require('express-rate-limit')

// ─── Rate limit: 5 intentos cada 15 min por IP ─────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { authenticated: false, error: 'Demasiados intentos. Esperá 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Upload limiter: 30 uploads por hora por IP (ciudadano sube 1-3, spam bots cientos)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { error: 'Demasiados uploads. Esperá una hora e intentá de nuevo.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ─── Auth middleware ───────────────────────────────────────────────────
// Formato del Authorization: Bearer <username>:<secret>
//   - secret = password en claro (para logins con user/pass)
//   - secret = email (para logins con Google @eldorado.gob.ar)
// Si el admin existe y la verificación es válida (bcrypt para password, o
// coincidencia email para cuentas Google-only), pasa la request.
async function verifyAdminCredential(username, secret) {
  const { rows } = await pool.query(
    'SELECT username, password_hash, email FROM admins WHERE username = $1',
    [username]
  )
  if (rows.length === 0) return false
  const admin = rows[0]
  // Caso 1: tiene password_hash bcrypt -> validar con bcrypt
  if (admin.password_hash && admin.password_hash.startsWith('$2')) {
    try {
      return bcrypt.compareSync(secret, admin.password_hash)
    } catch {
      return false
    }
  }
  // Caso 2: cuenta Google-only (sin password) -> validar por email (case-insensitive)
  if (admin.email && secret && admin.email.toLowerCase() === secret.toLowerCase()) {
    return true
  }
  return false
}

function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'] || ''
  const m = auth.match(/^Bearer\s+([^:]+):(.+)$/)
  if (!m) {
    return res.status(401).json({ error: 'No autorizado: credenciales requeridas' })
  }
  const [, username, secret] = m
  verifyAdminCredential(username, secret)
    .then((ok) => {
      if (ok) {
        req.admin = { username }
        next()
      } else {
        res.status(401).json({ error: 'No autorizado: credenciales inválidas' })
      }
    })
    .catch((err) => {
      console.error('requireAdmin error:', err.message)
      res.status(500).json({ error: 'Error de autenticación' })
    })
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

// ─── AUTH ───────────────────────────────────────────────────────────────
const firebaseAdmin = require('../firebase-admin.cjs')

// Password-based login (bcrypt contra password_hash)
router.post('/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ authenticated: false, error: 'Usuario y contraseña requeridos' })
    }
    const { rows } = await pool.query(
      'SELECT username, password_hash FROM admins WHERE username = $1',
      [username]
    )
    if (rows.length === 0) {
      return res.status(401).json({ authenticated: false, error: 'Credenciales inválidas' })
    }
    let ok = false
    try {
      ok = bcrypt.compareSync(password, rows[0].password_hash)
    } catch {
      ok = false
    }
    if (!ok) {
      return res.status(401).json({ authenticated: false, error: 'Credenciales inválidas' })
    }
    // Actualizar last_login sin bloquear la respuesta
    pool.query('UPDATE admins SET last_login = NOW() WHERE username = $1', [username])
      .catch(() => {})
    res.json({
      authenticated: true,
      username: rows[0].username,
      // Token Bearer para futuras requests: "username:password"
      // (mismo patrón que /api/habilitaciones/auth/login)
      token: `${username}:${password}`,
    })
  } catch (err) {
    console.error('POST /api/reclamos/auth/login error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Google Sign-In (replaces password auth in admin panel)
const ALLOWED_DOMAINS = ['eldorado.gob.ar']

router.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) {
      return res.status(400).json({ authenticated: false, error: 'Token requerido' })
    }

    // Verify the Firebase ID token
    let decodedToken
    try {
      decodedToken = await firebaseAdmin.getAuth().verifyIdToken(idToken)
    } catch (err) {
      console.warn('Google token verification failed:', err.message)
      return res.status(401).json({ authenticated: false, error: 'Token inválido o expirado' })
    }

    const { email, email_verified } = decodedToken

    if (!email) {
      return res.status(401).json({ authenticated: false, error: 'Email no disponible en la cuenta' })
    }

    if (!email_verified) {
      return res.status(401).json({ authenticated: false, error: 'Email no verificado en Google' })
    }

    // Check allowed domains
    const emailDomain = email.split('@')[1]?.toLowerCase()
    const domainAllowed = ALLOWED_DOMAINS.some((d) => emailDomain === d.toLowerCase())

    // Also check if the email is directly registered in the admins table
    const { rows: adminRows } = await pool.query(
      'SELECT username, email FROM admins WHERE LOWER(email) = LOWER($1)',
      [email]
    )
    const isRegisteredAdmin = adminRows.length > 0

    if (!domainAllowed && !isRegisteredAdmin) {
      console.warn(`Access denied for ${email} (domain: ${emailDomain})`)
      return res.status(403).json({
        authenticated: false,
        error: `Acceso denegado. Solo cuentas @${ALLOWED_DOMAINS[0]} permitidas.`,
      })
    }

    // Upsert admin record with this email (auto-register on first login)
    await pool.query(
      `INSERT INTO admins (username, password_hash, email, nombre)
       VALUES ($1, '', $2, $3)
       ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email, last_login = NOW()`,
      [email.split('@')[0], email, email.split('@')[0]]
    )

    console.log(`✅ Google login: ${email}`)
    res.json({
      authenticated: true,
      username: email.split('@')[0],
      email,
      displayName: decodedToken.name || email.split('@')[0],
      // Token Bearer para futuras requests: "username:email"
      // (verifyAdminCredential valida contra admin.email para cuentas Google-only)
      token: `${email.split('@')[0]}:${email}`,
    })
  } catch (err) {
    console.error('POST /api/reclamos/auth/google error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── LIST /api/reclamos?page&limit&estado&categoria&sort&order&search ──
// ADMIN: solo admins autenticados pueden ver datos personales (email, telefono, nombre, direccion)
router.get('/', requireAdmin, async (req, res) => {
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
// PUBLICO: un ciudadano busca el estado de su propio reclamo por codigo
// (no expone datos sensibles si el caller solo conoce el codigo)
router.get('/search', async (req, res) => {
  try {
    const codigo = (req.query.codigo || '').trim().toUpperCase()
    if (!codigo) return res.status(400).json({ error: 'Código requerido' })

    const { rows } = await pool.query(
      `SELECT id, codigo, categoria, titulo, descripcion, direccion, lat, lng, estado,
              created_at, updated_at, respuesta_ciudadano, respuesta_fecha
       FROM reclamos WHERE codigo = $1 LIMIT 1`,
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
// ADMIN: estadisticas administrativas (cuantos pendientes, resueltos, etc)
router.get('/stats', requireAdmin, async (req, res) => {
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
// PUBLICO: cualquier ciudadano puede crear un reclamo
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
// PUBLICO: subir foto para un reclamo
router.post('/upload', uploadLimiter, upload.single('file'), (req, res) => {
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
// ADMIN: cambiar estado, agregar notas internas, asignar, responder
router.patch('/:id', requireAdmin, async (req, res) => {
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
// ADMIN: borrar reclamo (operacion destructiva)
router.delete('/:id', requireAdmin, async (req, res) => {
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
// CATEGORÍAS (lectura PUBLICA para que los ciudadanos vean categorías)
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

// ADMIN: crear/modificar/borrar categorías
router.post('/categorias', requireAdmin, async (req, res) => {
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

router.put('/categorias/:id', requireAdmin, async (req, res) => {
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

router.delete('/categorias/:id', requireAdmin, async (req, res) => {
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
// ADMIN: solo admins pueden listar, crear o borrar otros admins
// ═══════════════════════════════════════════════════════════════════════

router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT username, rol, nombre, email FROM admins ORDER BY username`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/admins', requireAdmin, async (req, res) => {
  try {
    const { username, password, nombre, email } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' })
    }
    const hash = bcrypt.hashSync(password, 12)
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

router.delete('/admins/:username', requireAdmin, async (req, res) => {
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

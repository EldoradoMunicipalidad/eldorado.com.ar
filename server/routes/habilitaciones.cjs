const express = require('express')
const { validarDNI, validarCUIT, validarEmail, validarTelefono } = require('../utils/validators.cjs')
const router = express.Router()
const pool = require('../db.cjs')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')

// ─── Email config (FEROZO) ───────────────────────────────────────────
const EMAIL_FROM = 'preinscripciones@eldorado.gob.ar'
const EMAIL_TO   = 'preinscripciones@eldorado.gob.ar'

const emailTransporter = nodemailer.createTransport({
  host: 'mail.eldorado.gob.ar',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: EMAIL_FROM,
    // Tomamos la password de la variable de entorno EMAIL_PASSWORD
    // (configurada en Dokploy). NO commitear al repo.
    pass: process.env.EMAIL_PASSWORD || '',  // caera en fallback vacio si no se setea
  },
  tls: { rejectUnauthorized: false },
})

const ADMIN_PANEL_URL = 'https://eldorado.gob.ar/ciudadano-digital/preinscripcion-comercial/admin'

function buildEmailHtml(body, id) {
  const tipoPersonaLabel = body.tipo_persona === 'fisica' ? 'Persona Física' : 'Persona Jurídica'
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0ea5e9; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">Nueva Preinscripción Comercial</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">Recibida el ${new Date().toLocaleString('es-AR')}</p>
      </div>
      <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <!-- ACCESO DIRECTO AL PANEL -->
        <div style="margin-bottom: 24px; padding: 16px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #166534; font-weight: 600;">
            🔗 Accedé al detalle completo en el panel de administración
          </p>
          <a href="${ADMIN_PANEL_URL}" style="display: inline-block; padding: 10px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">
            Ir al Panel Administrativo →
          </a>
          <p style="margin: 8px 0 0; font-size: 12px; color: #15803d;">
            ${id ? `ID de solicitud: #${id}` : ''}
          </p>
        </div>

        <h2 style="color: #0ea5e9; font-size: 16px; margin: 0 0 16px;">Datos Personales</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${[
            ['Tipo', tipoPersonaLabel],
            ['DNI', body.dni],
            ['CUIT/CUIL', body.cuit],
            ['Apellido y Nombre / Razón Social', body.apellido],
            ['Domicilio Real', body.domicilio],
            ['Email', body.email],
            ['Teléfono', body.telefono],
          ].filter(([_, v]) => v).map(([k, v]) =>
            `<tr><td style="padding: 6px 12px; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 600; width: 40%;">${k}</td><td style="padding: 6px 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${v}</td></tr>`
          ).join('')}
        </table>
        <h2 style="color: #0ea5e9; font-size: 16px; margin: 24px 0 16px;">Ubicación</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${[
            ['Sección', body.seccion],
            ['Manzana', body.manzana],
            ['Parcela', body.parcela],
            ['Dirección completa', body.direccion],
            ['Propietario del local', body.local_oficina],
            ['Barrio', body.barrio],
            ['Superficie Cubierta (m²)', body.superficie_cubierta],
            ['Superficie Semicubierta (m²)', body.superficie_semicubierta],
            ['Superficie Total (m²)', body.superficie_total],
            ['Georreferenciación', body.georeferenciacion],
          ].filter(([_, v]) => v).map(([k, v]) =>
            `<tr><td style="padding: 6px 12px; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 600; width: 40%;">${k}</td><td style="padding: 6px 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${v}</td></tr>`
          ).join('')}
        </table>
        <h2 style="color: #0ea5e9; font-size: 16px; margin: 24px 0 16px;">Actividad Comercial</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${[
            ['Tipo de trámite', body.sub_categoria],
            ['Categoría', body.categoria],
            ['Actividad principal', body.actividad_principal],
            ['Actividad secundaria', body.actividad_secundaria],
            ['Otra actividad', body.otra_actividad],
          ].filter(([_, v]) => v).map(([k, v]) =>
            `<tr><td style="padding: 6px 12px; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 600; width: 40%;">${k}</td><td style="padding: 6px 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${v}</td></tr>`
          ).join('')}
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          Municipalidad de Eldorado — Sistema de Preinscripción Comercial
        </p>
      </div>
    </div>`
}

async function sendNotificationEmail(data, id) {
  try {
    await emailTransporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `Nueva Preinscripción Comercial — ${data.apellido || data.email || 'Sin nombre'}`,
      html: buildEmailHtml(data, id),
    })
    console.log('📧 Email de notificación enviado a', EMAIL_TO)
  } catch (err) {
    console.error('❌ Error enviando email:', err.message)
    // Don't throw — email failure shouldn't break the request
  }
}

// ─── bcrypt para passwords (mirrors frontend helper) ───────────────────
const bcrypt = require('bcrypt')

// ─── Rate limiting: 5 intentos cada 15 minutos por IP ─────────────────
const rateLimit = require('express-rate-limit')
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos. Esperá 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Upload limiter: 30 uploads por hora por IP.
// Un ciudadano sube 1-3 archivos por sesion, un bot/spam llega a cientos.
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { error: 'Demasiados uploads. Esperá una hora e intentá de nuevo.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ─── Auth middleware ──────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'] || ''
  const m = auth.match(/^Bearer\s+([^:]+):(.+)$/)
  if (!m) {
    return res.status(401).json({ error: 'No autorizado: credenciales requeridas' })
  }
  const [, username, password] = m
  const pool = require('../db.cjs')
  pool.query(
    'SELECT username, password_hash FROM admins WHERE username = $1',
    [username]
  ).then(({ rows }) => {
    if (rows.length > 0 && bcrypt.compareSync(password, rows[0].password_hash)) {
      req.admin = { username: rows[0].username }
      next()
    } else {
      res.status(401).json({ error: 'No autorizado: credenciales inválidas' })
    }
  }).catch((err) => {
    console.error('requireAdmin error:', err)
    res.status(500).json({ error: 'Error de autenticación' })
  })
}

// ─── Ensure uploads directory exists ────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// ─── Multer configuration ───────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = /\.(pdf|jpg|jpeg|png|gif|webp)$/i
  if (allowed.test(path.extname(file.originalname))) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos PDF, JPG, JPEG, PNG, GIF o WEBP'), false)
  }
}
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

// ─── 1. GET /api/habilitaciones ─ Lista paginada con search y status filter ─
// Protegido: solo admins autenticados pueden listar datos personales (DNI, CUIT, email).
router.get('/', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10))
    const offset = (page - 1) * limit
    const search = req.query.search || ''
    const status = req.query.status || 'all'

    let whereClause = ''
    const params = []
    let paramIndex = 1

    if (status !== 'all') {
      whereClause += `WHERE status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (search) {
      whereClause += whereClause ? ' AND' : 'WHERE'
      whereClause += ` (dni ILIKE $${paramIndex} OR apellido ILIKE $${paramIndex} OR nombre ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM habilitaciones ${whereClause}`,
      params
    )
    const total = countResult.rows[0].total

    const dataResult = await pool.query(
      `SELECT * FROM habilitaciones ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    )

    res.json({
      entries: dataResult.rows,
      total,
      page,
      limit
    })
  } catch (err) {
    console.error('GET /api/habilitaciones error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── 2. POST /api/habilitaciones ─ Crear nueva solicitud ────────────────
// Publico: cualquier persona puede registrar. Pero validamos servidor-side
// que los datos sensibles (DNI, CUIT, email, telefono) tengan formato valido.
router.post('/', async (req, res) => {
  try {
    const body = req.body

    // Validaciones de formato servidor-side (no confiar en frontend)
    const fieldErrors = []

    // DNI (solo si es persona fisica)
    if (body.tipo_persona === 'fisica' && body.dni) {
      const r = validarDNI(body.dni)
      if (!r.ok) fieldErrors.push(`DNI: ${r.error}`)
    }

    // CUIT (siempre, es obligatorio)
    if (body.cuit) {
      const r = validarCUIT(body.cuit)
      if (!r.ok) fieldErrors.push(`CUIT: ${r.error}`)
    }

    // Email (siempre)
    if (body.email) {
      const r = validarEmail(body.email)
      if (!r.ok) fieldErrors.push(`Email: ${r.error}`)
    }

    // Telefono (siempre)
    if (body.telefono) {
      const r = validarTelefono(body.telefono)
      if (!r.ok) fieldErrors.push(`Telefono: ${r.error}`)
    }

    if (fieldErrors.length > 0) {
      return res.status(400).json({
        error: 'Datos invalidos',
        detalles: fieldErrors,
      })
    }

    const { rows } = await pool.query(
      `INSERT INTO habilitaciones (
        tipo_persona, dni, cuit, apellido, nombre, domicilio, email, telefono,
        seccion, manzana, parcela, direccion, local_oficina, barrio,
        superficie_cubierta, superficie_semicubierta, superficie_total,
        georeferenciacion, categoria, sub_categoria,
        actividad_principal, actividad_secundaria, otra_actividad,
        archivos, status, notas
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17,
        $18, $19, $20,
        $21, $22, $23,
        $24::jsonb, $25, $26
      ) RETURNING id`,
      [
        body.tipo_persona || '', body.dni || '', body.cuit || '',
        body.apellido || '', body.nombre || '', body.domicilio || '',
        body.email || '', body.telefono || '',
        body.seccion || '', body.manzana || '', body.parcela || '',
        body.direccion || '', body.local_oficina || '', body.barrio || '',
        body.superficie_cubierta || '', body.superficie_semicubierta || '',
        body.superficie_total || '',
        body.georeferenciacion || '', body.categoria || '',
        body.sub_categoria || '',
        body.actividad_principal || '', body.actividad_secundaria || '',
        body.otra_actividad || '',
        JSON.stringify(body.archivos || []), body.status || 'pendiente',
        body.notas || ''
      ]
    )
    res.json({ id: rows[0].id })
    // Enviar notificación por email (asíncrono, no bloquea la respuesta)
    sendNotificationEmail(body, rows[0].id)
  } catch (err) {
    console.error('POST /api/habilitaciones error:', err.message)
    // Postgres "value too long" (22001) -> 400 con mensaje entendible
    if (err.code === '22001') {
      return res.status(400).json({ error: 'Uno de los campos excede el largo máximo permitido.' })
    }
    // Postgres "null value violates not-null" (23502) -> 400
    if (err.code === '23502') {
      return res.status(400).json({ error: `Falta un campo obligatorio: ${err.column}` })
    }
    res.status(500).json({ error: err.message })
  }
})

// ─── 3. GET /api/habilitaciones/:id ─ Obtener detalle ───────────────────
// Protegido: solo admins autenticados pueden ver detalle de una solicitud.
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM habilitaciones WHERE id = $1',
      [req.params.id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No encontrado' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error('GET /api/habilitaciones/:id error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── 4. PATCH /api/habilitaciones/:id ─ Actualizar cualquier campo ──────
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const body = req.body

    // Validaciones de formato en patch
    const fieldErrors = []
    if (body.dni !== undefined) {
      const r = validarDNI(body.dni)
      if (!r.ok) fieldErrors.push(`DNI: ${r.error}`)
    }
    if (body.cuit !== undefined) {
      const r = validarCUIT(body.cuit)
      if (!r.ok) fieldErrors.push(`CUIT: ${r.error}`)
    }
    if (body.email !== undefined) {
      const r = validarEmail(body.email)
      if (!r.ok) fieldErrors.push(`Email: ${r.error}`)
    }
    if (body.telefono !== undefined) {
      const r = validarTelefono(body.telefono)
      if (!r.ok) fieldErrors.push(`Telefono: ${r.error}`)
    }
    if (fieldErrors.length > 0) {
      return res.status(400).json({
        error: 'Datos invalidos',
        detalles: fieldErrors,
      })
    }

    const fields = [
      'tipo_persona','dni','cuit','apellido','nombre','domicilio','email','telefono',
      'seccion','manzana','parcela','direccion','local_oficina','barrio',
      'superficie_cubierta','superficie_semicubierta','superficie_total','georeferenciacion',
      'categoria','sub_categoria',
      'actividad_principal','actividad_secundaria','otra_actividad',
      'archivos','status','notas'
    ]
    const updates = []
    const values = []
    let idx = 1

    for (const field of fields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${idx}`)
        if (field === 'archivos') {
          values.push(JSON.stringify(body[field]))
        } else {
          values.push(body[field])
        }
        idx++
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se envió ningún campo para actualizar' })
    }

    updates.push(`updated_at = NOW()`)
    values.push(req.params.id)

    const { rows } = await pool.query(
      `UPDATE habilitaciones SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No encontrado' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error('PATCH /api/habilitaciones/:id error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── 5. DELETE /api/habilitaciones/:id ─ Eliminar ──────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM habilitaciones WHERE id = $1',
      [req.params.id]
    )
    if (rowCount === 0) {
      return res.status(404).json({ error: 'No encontrado' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/habilitaciones/:id error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── 6. POST /api/habilitaciones/upload ─ Subir archivo ────────────────
router.post('/upload', uploadLimiter, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'El archivo supera el máximo de 10MB' })
        }
        return res.status(400).json({ error: err.message })
      }
      return res.status(400).json({ error: err.message })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' })
    }
    res.json({ url: '/uploads/' + req.file.filename })
  })
})

// ─── 7. POST /api/habilitaciones/auth/login ─ Login simple ─────────────
router.post('/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
    }
    const { rows } = await pool.query(
      'SELECT username, password_hash FROM admins WHERE username = $1',
      [username]
    )
    if (rows.length === 0) {
      return res.status(401).json({ authenticated: false, error: 'Credenciales inválidas' })
    }
    const ok = bcrypt.compareSync(password, rows[0].password_hash)
    if (ok) {
      // Actualizar last_login sin bloquear la respuesta
      pool.query('UPDATE admins SET last_login = NOW() WHERE username = $1', [username])
        .catch((err) => console.error('Error actualizando last_login:', err.message))
      res.json({
        authenticated: true,
        username: rows[0].username,
        token: `${username}:${password}`,  // El cliente lo envia como Bearer en futuras requests
      })
    } else {
      res.status(401).json({ authenticated: false, error: 'Credenciales inválidas' })
    }
  } catch (err) {
    console.error('POST /api/habilitaciones/auth/login error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── 8. GET /api/habilitaciones/admins ─ Listar admins ──────────────────
router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT username, rol, nombre, email, last_login FROM admins ORDER BY username'
    )
    res.json(rows)
  } catch (err) {
    console.error('GET /api/habilitaciones/admins error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── 9. POST /api/habilitaciones/admins ─ Crear admin ───────────────────
router.post('/admins', requireAdmin, async (req, res) => {
  try {
    const { username, password, nombre, email } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' })
    }
    if (username.length < 3 || password.length < 4) {
      return res.status(400).json({ error: 'El usuario debe tener al menos 3 caracteres y la contraseña al menos 4' })
    }
    const hash = bcrypt.hashSync(password, 12)
    const { rows } = await pool.query(
      `INSERT INTO admins (username, password_hash, rol, nombre, email)
       VALUES ($1, $2, 'admin', $3, $4)
       ON CONFLICT (username) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         nombre = EXCLUDED.nombre,
         email = EXCLUDED.email
       RETURNING username, rol, nombre, email`,
      [username, hash, nombre || '', email || '']
    )
    res.json(rows[0])
  } catch (err) {
    console.error('POST /api/habilitaciones/admins error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── 10. DELETE /api/habilitaciones/admins/:username ─ Eliminar admin ────
router.delete('/admins/:username', requireAdmin, async (req, res) => {
  try {
    const { username } = req.params
    if (username === 'admin') {
      return res.status(400).json({ error: 'No se puede eliminar el administrador principal' })
    }
    const { rowCount } = await pool.query(
      'DELETE FROM admins WHERE username = $1',
      [username]
    )
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/habilitaciones/admins/:username error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

const express = require('express')
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
    pass: '*5OXyfP@',
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

// ─── Simple hash function (mirrors frontend & server/index.cjs) ──────
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
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
  const allowed = /\.(pdf|jpg|jpeg|png|gif)$/i
  if (allowed.test(path.extname(file.originalname))) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos PDF, JPG, JPEG, PNG o GIF'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

// ─── 1. GET /api/habilitaciones ─ Lista paginada con search y status filter ─
router.get('/', async (req, res) => {
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
router.post('/', async (req, res) => {
  try {
    const body = req.body
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
    res.status(500).json({ error: err.message })
  }
})

// ─── 3. GET /api/habilitaciones/:id ─ Obtener detalle ───────────────────
router.get('/:id', async (req, res) => {
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

// ─── 4. PATCH /api/habilitaciones/:id ─ Actualizar status y notas ──────
router.patch('/:id', async (req, res) => {
  try {
    const { status, notas } = req.body
    const { rows } = await pool.query(
      `UPDATE habilitaciones
       SET status = COALESCE($1, status),
           notas  = COALESCE($2, notas),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status || null, notas !== undefined ? notas : null, req.params.id]
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
router.delete('/:id', async (req, res) => {
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
router.post('/upload', (req, res) => {
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
    console.error('POST /api/habilitaciones/auth/login error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

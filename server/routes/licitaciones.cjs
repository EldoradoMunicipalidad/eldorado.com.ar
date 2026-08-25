// Licitaciones municipales — CRUD admin con upload a Cloudflare R2
//
// GET    /api/licitaciones          — pública, lista todas (no soft-deleted)
// POST   /api/licitaciones          — admin, crea nueva (multipart con PDF opcional)
// PUT    /api/licitaciones/:id      — admin, edita metadatos y/o reemplaza PDF
// DELETE /api/licitaciones/:id      — admin, soft delete (setea deleted_at)
// POST   /api/licitaciones/:id/restore — admin, revierte soft delete
//
// Decisiones de diseño:
//   - Soft delete (campo deleted_at). El operador puede restaurar.
//   - El PDF se sube a Cloudflare R2 (bucket 'sitiomunicipal'), key 'licitaciones/<archivo>'.
//     El backend NO guarda URLs en la DB: guarda el key y firma la URL en cada GET.
//     Si la firma falla, devuelve el path relativo '/api/licitaciones/file/:id' como
//     proxy estable (el frontend siempre puede pedir el PDF).
//   - GET es público (la página /gobierno-abierto/licitaciones no requiere login).
//   - Escritura requiere Bearer contra la tabla 'admins' global (authMiddleware).

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const { requireAdminFor, makeLoginLimiter } = require('../authMiddleware.cjs')
const { uploadToR2, deleteFromR2, getSignedUrl } = require('../lib/r2.cjs')
const multer = require('multer')

const ADMIN_TABLE = 'admins'
const requireAdmin = requireAdminFor(pool, ADMIN_TABLE)
const loginLimiter = makeLoginLimiter()

// ─── Multer: PDF en memoria (no escribimos a disco) ──────────────────
// 25 MB es suficiente para pliegos típicos (<5 MB). Si el operador sube
// pliegos más grandes en el futuro, se sube este límite.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'application/pdf' || /\.pdf$/i.test(file.originalname)) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false)
    }
  },
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
})

// ─── Helpers ─────────────────────────────────────────────────────────

// Convierte fila de DB a objeto listo para serializar (incluye pdfUrl firmada).
async function rowToApi(row) {
  if (!row) return null
  let pdfUrl = null
  if (row.pdf_key) {
    try {
      pdfUrl = await getSignedUrl(row.pdf_key)
    } catch (err) {
      console.error('rowToApi: error firmando PDF', row.pdf_key, err.message)
      // No rompemos la respuesta. pdfUrl queda null, frontend muestra '—'.
    }
  }
  return {
    id: row.id,
    codigo: row.codigo,
    tipo: row.tipo,
    fechaPublicacion: row.fecha_publicacion instanceof Date
      ? row.fecha_publicacion.toISOString().slice(0, 10).split('-').reverse().join('/')
      : row.fecha_publicacion,
    descripcion: row.descripcion,
    pdfUrl,
    pdfKey: row.pdf_key,
    pdfFilename: row.pdf_filename,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  }
}

// Sube un buffer PDF a R2 con key 'licitaciones/<archivo>'.
async function uploadPdfToR2({ buffer, originalName }) {
  // uploadToR2 ya genera key con timestamp+rand+filename sanitizado.
  // Forzamos keyPrefix 'licitaciones'.
  const result = await uploadToR2({
    buffer,
    contentType: 'application/pdf',
    keyPrefix: 'licitaciones',
    originalName,
  })
  return { key: result.key, url: result.url, filename: originalName }
}

// ─── GET / (pública) ─────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM licitaciones
       WHERE deleted_at IS NULL
       ORDER BY fecha_publicacion DESC, id DESC`
    )
    const items = await Promise.all(rows.map(rowToApi))
    res.json({ items })
  } catch (err) {
    console.error('GET /api/licitaciones error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /:id (pública, útil para diagnóstico) ───────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM licitaciones WHERE id = $1',
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json(await rowToApi(rows[0]))
  } catch (err) {
    console.error('GET /api/licitaciones/:id error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST / (admin, crear nueva) ─────────────────────────────────────
// multipart/form-data con campos:
//   - pdf (file, opcional)
//   - codigo (text, requerido)
//   - tipo ('publica' | 'privada', requerido)
//   - fechaPublicacion (DD/MM/YYYY, requerido)
//   - descripcion (text, requerido)
router.post('/', requireAdmin, upload.single('pdf'), async (req, res) => {
  try {
    const { codigo, tipo, fechaPublicacion, descripcion } = req.body

    // Validaciones básicas
    if (!codigo || !tipo || !fechaPublicacion || !descripcion) {
      return res.status(400).json({
        error: 'Faltan campos requeridos (codigo, tipo, fechaPublicacion, descripcion)',
      })
    }
    if (!['publica', 'privada'].includes(tipo)) {
      return res.status(400).json({ error: 'tipo debe ser "publica" o "privada"' })
    }

    // Parsear fecha DD/MM/YYYY
    const m = fechaPublicacion.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (!m) {
      return res.status(400).json({ error: 'fechaPublicacion debe tener formato DD/MM/YYYY' })
    }
    const [, dd, mm, yyyy] = m
    const fechaISO = `${yyyy}-${mm}-${dd}`

    // Subir PDF si se envió
    let pdf_key = null
    let pdf_filename = null
    if (req.file) {
      try {
        const up = await uploadPdfToR2({
          buffer: req.file.buffer,
          originalName: req.file.originalname,
        })
        pdf_key = up.key
        pdf_filename = up.filename
      } catch (r2Err) {
        console.error('R2 upload failed:', r2Err.message)
        return res.status(502).json({
          error: 'No se pudo subir el PDF al storage. Verificá que las variables R2_* estén configuradas.',
          detail: r2Err.message,
        })
      }
    }

    // INSERT
    let inserted
    try {
      const { rows } = await pool.query(
        `INSERT INTO licitaciones (codigo, tipo, fecha_publicacion, descripcion, pdf_key, pdf_filename)
         VALUES ($1, $2, $3::date, $4, $5, $6)
         RETURNING *`,
        [codigo.trim(), tipo, fechaISO, descripcion.trim(), pdf_key, pdf_filename]
      )
      inserted = rows[0]
    } catch (dbErr) {
      // Si falló por UNIQUE en codigo, y subimos un PDF, hay que limpiarlo.
      if (dbErr.code === '23505' && pdf_key) {
        try { await deleteFromR2(pdf_key) } catch (_) {}
      }
      if (dbErr.code === '23505') {
        return res.status(409).json({
          error: `Ya existe una licitación activa con el código "${codigo}". Soft-delete la anterior primero o usá otro código.`,
        })
      }
      throw dbErr
    }

    console.log(`📝 Licitación creada: id=${inserted.id} codigo=${inserted.codigo}`)
    res.status(201).json(await rowToApi(inserted))
  } catch (err) {
    console.error('POST /api/licitaciones error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── PUT /:id (admin, editar) ────────────────────────────────────────
// multipart/form-data con los mismos campos que POST (todos opcionales).
// Si se envía un nuevo PDF, se borra el viejo de R2.
router.put('/:id', requireAdmin, upload.single('pdf'), async (req, res) => {
  try {
    const { id } = req.params
    const { codigo, tipo, fechaPublicacion, descripcion } = req.body

    // Traer fila actual
    const { rows: existing } = await pool.query(
      'SELECT * FROM licitaciones WHERE id = $1',
      [id]
    )
    if (existing.length === 0) return res.status(404).json({ error: 'No encontrado' })
    const row = existing[0]

    // Validar cambios
    const updates = {}
    if (codigo !== undefined) updates.codigo = codigo.trim()
    if (tipo !== undefined) {
      if (!['publica', 'privada'].includes(tipo)) {
        return res.status(400).json({ error: 'tipo debe ser "publica" o "privada"' })
      }
      updates.tipo = tipo
    }
    if (descripcion !== undefined) updates.descripcion = descripcion.trim()

    if (fechaPublicacion !== undefined) {
      const m = fechaPublicacion.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
      if (!m) {
        return res.status(400).json({ error: 'fechaPublicacion debe tener formato DD/MM/YYYY' })
      }
      const [, dd, mm, yyyy] = m
      updates.fecha_publicacion = `${yyyy}-${mm}-${dd}`
    }

    // Manejar reemplazo de PDF
    let oldPdfKey = null
    if (req.file) {
      try {
        const up = await uploadPdfToR2({
          buffer: req.file.buffer,
          originalName: req.file.originalname,
        })
        updates.pdf_key = up.key
        updates.pdf_filename = up.filename
        oldPdfKey = row.pdf_key // borrar el viejo después
      } catch (r2Err) {
        console.error('R2 upload failed:', r2Err.message)
        return res.status(502).json({
          error: 'No se pudo subir el PDF al storage. Verificá que las variables R2_* estén configuradas.',
          detail: r2Err.message,
        })
      }
    }

    // Si no hay nada para actualizar
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' })
    }
    updates.updated_at = new Date()

    // Construir UPDATE dinámico
    const setClauses = Object.keys(updates).map((k, i) => `${k} = $${i + 2}`).join(', ')
    const values = [id, ...Object.values(updates)]

    let updated
    try {
      const { rows } = await pool.query(
        `UPDATE licitaciones SET ${setClauses} WHERE id = $1 RETURNING *`,
        values
      )
      updated = rows[0]
    } catch (dbErr) {
      // Si falló por UNIQUE en codigo, y subimos un PDF nuevo, hay que limpiarlo.
      if (dbErr.code === '23505' && updates.pdf_key) {
        try { await deleteFromR2(updates.pdf_key) } catch (_) {}
      }
      if (dbErr.code === '23505') {
        return res.status(409).json({
          error: `Ya existe otra licitación activa con el código "${updates.codigo}".`,
        })
      }
      throw dbErr
    }

    // Borrar PDF viejo de R2 (best-effort, no fallamos la request si R2 falla)
    if (oldPdfKey) {
      deleteFromR2(oldPdfKey).catch((e) =>
        console.error('No se pudo borrar PDF viejo de R2:', oldPdfKey, e.message)
      )
    }

    console.log(`✏️ Licitación editada: id=${id}`)
    res.json(await rowToApi(updated))
  } catch (err) {
    console.error('PUT /api/licitaciones/:id error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── DELETE /:id (admin, soft delete) ────────────────────────────────
// Setea deleted_at. NO borra el PDF de R2 (preserva auditoría y permite restore).
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { rowCount } = await pool.query(
      `UPDATE licitaciones SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )
    if (rowCount === 0) {
      return res.status(404).json({ error: 'No encontrado o ya eliminado' })
    }
    console.log(`🗑️ Licitación soft-deleted: id=${id}`)
    res.json({ success: true, id })
  } catch (err) {
    console.error('DELETE /api/licitaciones/:id error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /:id/restore (admin, revertir soft delete) ─────────────────
// Devuelve la licitación a activo. NO restaura el PDF si fue borrado de R2
// por separado (en este módulo no borramos PDFs, así que el key sigue válido).
router.post('/:id/restore', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { rowCount } = await pool.query(
      `UPDATE licitaciones SET deleted_at = NULL, updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NOT NULL`,
      [id]
    )
    if (rowCount === 0) {
      return res.status(404).json({ error: 'No encontrado o no está eliminado' })
    }
    const { rows } = await pool.query('SELECT * FROM licitaciones WHERE id = $1', [id])
    console.log(`♻️ Licitación restaurada: id=${id}`)
    res.json(await rowToApi(rows[0]))
  } catch (err) {
    console.error('POST /api/licitaciones/:id/restore error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
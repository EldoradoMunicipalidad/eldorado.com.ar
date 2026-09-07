// Page Content CMS — editable content for dynamic pages
// GET/PUT /api/pages/:pageId — reads/writes JSONB in page_content table

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const { requireAdminFor } = require('../authMiddleware.cjs')
const { uploadToR2, getSignedUrl } = require('../lib/r2.cjs')
const multer = require('multer')

// Las lecturas son públicas; toda modificación del CMS requiere un admin global.
const requireAdmin = requireAdminFor(pool, 'admins')

const documentUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'application/pdf' || /\.pdf$/i.test(file.originalname)) cb(null, true)
    else cb(new Error('Solo se permiten archivos PDF'), false)
  },
  limits: { fileSize: 25 * 1024 * 1024 },
})

const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif|avif)$/i.test(file.mimetype)) cb(null, true)
    else cb(new Error('Solo se permiten imágenes JPG, PNG, WebP, GIF o AVIF'), false)
  },
  limits: { fileSize: 8 * 1024 * 1024 },
})

// URL pública estable para documentos privados en R2. El token solo codifica
// el key; en cada acceso se genera una firma nueva y se redirige al archivo.
router.get('/file/:token', async (req, res) => {
  try {
    const key = Buffer.from(req.params.token, 'base64url').toString('utf8')
    const allowedPrefix = key.startsWith('documentos/') || key.startsWith('agenda/')
    if (!allowedPrefix) return res.status(400).json({ error: 'Archivo inválido' })
    res.redirect(await getSignedUrl(key))
  } catch (err) {
    console.error('GET /api/pages/file error:', err.message)
    res.status(404).json({ error: 'No se pudo abrir el documento' })
  }
})

// Carga de PDFs del CMS (boletines y futuros documentos de transparencia).
router.post('/upload-document', requireAdmin, documentUpload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Seleccioná un archivo PDF' })
    const result = await uploadToR2({
      buffer: req.file.buffer,
      contentType: 'application/pdf',
      keyPrefix: 'documentos',
      originalName: req.file.originalname,
    })
    const token = Buffer.from(result.key, 'utf8').toString('base64url')
    res.status(201).json({
      url: `/api/pages/file/${token}`,
      key: result.key,
      filename: req.file.originalname,
      size: req.file.size,
    })
  } catch (err) {
    console.error('POST /api/pages/upload-document error:', err.message)
    res.status(502).json({ error: 'No se pudo subir el PDF al almacenamiento', detail: err.message })
  }
})

router.post('/upload-image', requireAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Seleccioná una imagen' })
    const result = await uploadToR2({
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
      keyPrefix: 'agenda',
      originalName: req.file.originalname,
    })
    const token = Buffer.from(result.key, 'utf8').toString('base64url')
    res.status(201).json({
      url: `/api/pages/file/${token}`,
      key: result.key,
      filename: req.file.originalname,
      size: req.file.size,
    })
  } catch (err) {
    console.error('POST /api/pages/upload-image error:', err.message)
    res.status(502).json({ error: 'No se pudo subir la imagen al almacenamiento', detail: err.message })
  }
})

// ─── GET page content ────────────────────────────────────────────────
router.get('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params
    const { rows } = await pool.query(
      'SELECT content, updated_at FROM page_content WHERE page_id = $1',
      [pageId]
    )
    if (rows.length === 0) {
      return res.json({ content: null, updated_at: null })
    }
    res.json({
      content: rows[0].content,
      updated_at: rows[0].updated_at,
    })
  } catch (err) {
    console.error(`GET /api/pages/${req.params.pageId} error:`, err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── UPDATE page content ─────────────────────────────────────────────
router.put('/:pageId', requireAdmin, async (req, res) => {
  try {
    const { pageId } = req.params
    const { content } = req.body

    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Content must be a JSON object' })
    }

    const { rows } = await pool.query(
      `INSERT INTO page_content (page_id, content, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (page_id) DO UPDATE SET
         content = EXCLUDED.content,
         updated_at = NOW()
       RETURNING content, updated_at`,
      [pageId, JSON.stringify(content)]
    )

    console.log(`📝 Page content updated: ${pageId}`)
    res.json({
      content: rows[0].content,
      updated_at: rows[0].updated_at,
    })
  } catch (err) {
    console.error(`PUT /api/pages/${req.params.pageId} error:`, err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

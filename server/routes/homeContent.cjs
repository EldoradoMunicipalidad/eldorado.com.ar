// Home Content CMS — editable content for the homepage
// GET/PUT /api/home-content — single JSONB row keyed as 'home'
// POST /api/home-content/upload — convierte la imagen a data URL base64
//   y la devuelve lista para guardarse dentro del JSONB de page_content.
//   Esto evita la dependencia de storage persistente en Dokploy (uploads/
//   se borra en cada redeploy).

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const multer = require('multer')

// ─── Multer config (en memoria — no escribimos a disco) ──────────────
// El tope de 5MB es porque base64 infla 33% el tamaño original,
// y queremos que el JSONB de page_content no se vuelva gigante.
const fileFilter = (_, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i
  if (allowed.test(file.originalname)) cb(null, true)
  else cb(new Error('Solo JPG, PNG, GIF, WebP o SVG'), false)
}
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

// ─── GET home content ────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT content, updated_at FROM page_content WHERE page_id = 'home'"
    )
    if (rows.length === 0) {
      return res.json({ content: null, updated_at: null })
    }
    res.json({
      content: rows[0].content,
      updated_at: rows[0].updated_at,
    })
  } catch (err) {
    console.error('GET /api/home-content error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── UPDATE home content ──────────────────────────────────────────────
router.put('/', async (req, res) => {
  try {
    const { content } = req.body

    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Content must be a JSON object' })
    }

    const { rows } = await pool.query(
      `INSERT INTO page_content (page_id, content, updated_at)
       VALUES ('home', $1::jsonb, NOW())
       ON CONFLICT (page_id) DO UPDATE SET
         content = EXCLUDED.content,
         updated_at = NOW()
       RETURNING content, updated_at`,
      [JSON.stringify(content)]
    )

    console.log('📝 Home content updated')
    res.json({
      content: rows[0].content,
      updated_at: rows[0].updated_at,
    })
  } catch (err) {
    console.error('PUT /api/home-content error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST upload image → devuelve data URL base64 ────────────────────
// El frontend guarda este string en el JSONB de page_content y lo usa
// directo en el <img src="...">. Sobrevive redeploys porque vive en la DB.
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se envió ninguna imagen' })
  }
  const { buffer, mimetype, originalname, size } = req.file
  const dataUrl = `data:${mimetype};base64,${buffer.toString('base64')}`
  console.log(`📷 Image uploaded as data URL: ${originalname} (${size} bytes, ${mimetype})`)
  res.json({
    url: dataUrl,
    size,
    mimeType: mimetype,
    filename: originalname,
  })
})

module.exports = router

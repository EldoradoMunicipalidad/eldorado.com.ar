// Home Content CMS — editable content for the homepage
// GET/PUT /api/home-content — single JSONB row keyed as 'home'
//
// POST /api/home-content/upload — sube la imagen a Cloudflare R2 y
//   devuelve la URL PÚBLICA lista para guardarse en el JSONB.
//   (v1: data URL base64; v2 actual: R2 con CDN edge-cache)
//
// GET /api/home-content/r2-ping — healthcheck de la conexión R2
//   (uso: diagnóstico durante deploy o smoke test).

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const multer = require('multer')
const { uploadToR2, R2_BUCKET, R2_PUBLIC_BASE_URL } = require('../lib/r2.cjs')

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
  limits: { fileSize: 10 * 1024 * 1024 },
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

// ─── POST upload image → sube a R2 y devuelve URL PÚBLICA ──────────
// El frontend guarda SOLO la URL en el JSONB de page_content.
// No hay data URL base64 (eso quedaba en Neon, ejemplo: 7 MB por home).
// Ahora la imagen vive en R2 con CDN edge-cache de Cloudflare.
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' })
    }
    const { buffer, mimetype, originalname, size } = req.file

    let result
    try {
      result = await uploadToR2({
        buffer,
        contentType: mimetype,
        keyPrefix: 'home',
        originalName: originalname,
      })
    } catch (r2Err) {
      console.error('R2 upload failed:', r2Err.message)
      // Si R2 no está configurado o falla, devolvemos un error claro
      // (no usamos base64 como fallback — la idea es no acumular
      // strings gigante en Neon).
      return res.status(502).json({
        error: 'No se pudo subir la imagen al storage. Verificá que R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY estén configurados en Dokploy.',
        detail: r2Err.message,
      })
    }

    console.log(`📷 Image uploaded to R2: ${result.key} (${size} bytes, ${mimetype}) → ${result.url}`)
    res.json({
      url: result.url,
      key: result.key,
      size,
      mimeType: mimetype,
      filename: originalname,
    })
  } catch (err) {
    console.error('POST /upload error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /r2-ping ─ healthcheck de la conexión R2 ──────────────────
// Lee el bucket y verifica que las credenciales sirven.
// Devuelve { ok: true, bucket, publicBaseUrl } o 502 con detail.
router.get('/r2-ping', async (req, res) => {
  try {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      return res.status(503).json({
        ok: false,
        error: 'R2 no configurado',
        detail: 'Faltan variables R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY en el entorno',
      })
    }
    res.json({
      ok: true,
      bucket: R2_BUCKET,
      publicBaseUrl: R2_PUBLIC_BASE_URL,
    })
  } catch (err) {
    res.status(502).json({ ok: false, error: err.message })
  }
})

module.exports = router

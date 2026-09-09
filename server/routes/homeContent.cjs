// Home Content CMS — editable content for the homepage
// GET/PUT /api/home-content — single JSONB row keyed as 'home'
//
// POST /api/home-content/upload — recibe la imagen via multipart/form-data
//   (campo 'image'), la sube a Cloudflare R2 con multer.memoryStorage
//   y devuelve la URL FIRMADA con 6 dias de expiracion.
//   El frontend guarda esa URL en el JSONB de page_content.home.
//   Las URLs se renuevan automaticamente en cada GET del JSONB.
//
// GET /api/home-content/r2-ping — healthcheck de la conexion R2
//   (uso: diagnostico durante deploy o smoke test).
//
// Imagenes:
//   v1 (legacy): data URL base64 embebido en JSONB (7 MB por home)
//   v2 (actual): URLs firmadas de R2 (~4 KB JSONB + imagenes en CDN)

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const multer = require('multer')
const { uploadToR2, getSignedUrl, R2_BUCKET, R2_PUBLIC_BASE_URL } = require('../lib/r2.cjs')
const { requireAdminFor } = require('../authMiddleware.cjs')

const requireAdmin = requireAdminFor(pool, 'admins')

// ─── Multer config (en memoria — no escribimos a disco) ──────────────
// El tope de 5MB es porque base64 infla 33% el tamaño original,
// y queremos que el JSONB de page_content no se vuelva gigante.
// Multer en memoria: no escribimos a disco (Dokploy no tiene storage
// persistente; las imagenes van directo a R2). 25 MB es suficiente para
// imagenes de carousel (tipicamente <2 MB). R2 aguanta hasta 5 GB por
// archivo si mas adelante necesitamos subir cosas mas pesadas.
const fileFilter = (_, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i
  if (allowed.test(file.originalname)) cb(null, true)
  else cb(new Error('Solo JPG, PNG, GIF, WebP o SVG'), false)
}
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
})

// ─── Helper: firmar URLs R2 dentro de un objeto recursivamente ─────
// Detecta 3 formatos de URL/key de R2 y los convierte a signed URL
// (si el bucket no es publico) o los deja como estan (si el bucket es
// publico via R2_PUBLIC_BASE_URL).
//
// Formatos detectados:
//   1) https://<ACCOUNT>.r2.cloudflarestorage.com/<BUCKET>/<key>
//   2) https://pub-*.r2.dev/<BUCKET>/<key>
//   3) <key>             (string crudo sin http)
//
// El <key> es la parte final (ej: 'home/migrated/...jpeg').

function extractR2Key(value) {
  if (typeof value !== 'string') return null
  if (/^home\//.test(value) && !value.startsWith('http')) return value

  try {
    const url = new URL(value)
    const isR2Storage = url.hostname.endsWith('.r2.cloudflarestorage.com')
    const isR2Public = /^pub-[^.]+\.r2\.dev$/i.test(url.hostname)
    if (!isR2Storage && !isR2Public) return null

    const pathParts = decodeURIComponent(url.pathname).split('/').filter(Boolean)
    if (pathParts[0] === R2_BUCKET) pathParts.shift()
    return pathParts.join('/') || null
  } catch {
    return null
  }
}

function normalizeR2RefsInContent(content) {
  if (!content || typeof content !== 'object') return content

  function walk(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(walk)
      return
    }
    for (const key of Object.keys(obj)) {
      const value = obj[key]
      if (typeof value === 'string') {
        const r2Key = extractR2Key(value)
        if (r2Key) obj[key] = r2Key
      } else if (value && typeof value === 'object') {
        walk(value)
      }
    }
  }

  walk(content)
  return content
}

async function signR2UrlsInContent(content) {
  if (!content) return content
  if (R2_PUBLIC_BASE_URL) {
    // Bucket público: convertir keys o URLs R2 antiguas a la URL definitiva.
    function makePublic(obj) {
      if (!obj || typeof obj !== 'object') return
      if (Array.isArray(obj)) {
        obj.forEach(makePublic)
        return
      }
      for (const key of Object.keys(obj)) {
        const value = obj[key]
        if (typeof value === 'string') {
          const r2Key = extractR2Key(value)
          if (r2Key) obj[key] = `${R2_PUBLIC_BASE_URL}/${r2Key}`
        } else if (value && typeof value === 'object') {
          makePublic(value)
        }
      }
    }
    makePublic(content)
    return content
  }
  // Bucket privado: firmar cada URL de R2 detectada
  const urlsToSign = new Set()

  function walk(obj) {
    if (!obj || typeof obj !== 'object') return
    if (Array.isArray(obj)) { obj.forEach(walk); return }
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      if (typeof v === 'string') {
        const key = extractR2Key(v)
        if (key) urlsToSign.add(key)
      } else if (typeof v === 'object') {
        walk(v)
      }
    }
  }
  walk(content)

  if (urlsToSign.size === 0) return content

  // Firmar en paralelo
  const signedMap = new Map()
  await Promise.all(
    Array.from(urlsToSign).map(async (key) => {
      try {
        const url = await getSignedUrl(key)
        signedMap.set(key, url)
      } catch (e) {
        console.error('signR2UrlsInContent: error firmando', key, e.message)
        // Si la firma falla (ej: expiration > 7d), no la firmamos.
        // La entrada queda fuera del signedMap y el replace() deja el valor
        // original intacto (URL completa). El frontend va a mostrar fallback
        // /slider-2.jpg via el onError del <img>.
      }
    })
  )
  // Reemplazar URLs por firmadas
  function replace(obj) {
    if (!obj || typeof obj !== 'object') return
    if (Array.isArray(obj)) {
      obj.forEach(replace)
      return
    }
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      if (typeof v === 'string') {
        const key = extractR2Key(v)
        if (key && signedMap.has(key)) obj[k] = signedMap.get(key)
      } else if (typeof v === 'object') {
        replace(v)
      }
    }
  }
  replace(content)
  return content
}

// ─── GET home content ────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT content, updated_at FROM page_content WHERE page_id = 'home'"
    )
    if (rows.length === 0) {
      return res.json({ content: null, updated_at: null })
    }
    const content = await signR2UrlsInContent(rows[0].content)
    res.json({
      content,
      updated_at: rows[0].updated_at,
    })
  } catch (err) {
    console.error('GET /api/home-content error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── UPDATE home content ──────────────────────────────────────────────
router.put('/', requireAdmin, async (req, res) => {
  try {
    const { content } = req.body

    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Content must be a JSON object' })
    }

    // Las URLs firmadas sólo sirven para mostrar la imagen. En la base guardamos
    // la key estable para poder generar una firma nueva en cada GET.
    const storedContent = R2_PUBLIC_BASE_URL ? content : normalizeR2RefsInContent(content)

    const { rows } = await pool.query(
      `INSERT INTO page_content (page_id, content, updated_at)
       VALUES ('home', $1::jsonb, NOW())
       ON CONFLICT (page_id) DO UPDATE SET
         content = EXCLUDED.content,
         updated_at = NOW()
       RETURNING content, updated_at`,
      [JSON.stringify(storedContent)]
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

// ─── POST upload image → sube a R2 y devuelve URL firmada ──────────
// El frontend guarda SOLO la URL en el JSONB de page_content.
// La URL es una presigned URL con 6 dias de expiracion (maximo permitido
// por AWS Signature V4). El backend renueva la firma en cada GET del
// JSONB, asi que el frontend no necesita preocuparse.
router.post('/upload', requireAdmin, upload.single('image'), async (req, res) => {
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

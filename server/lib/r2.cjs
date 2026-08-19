// R2 client wrapper — Cloudflare R2 (S3-compatible)
//
// Env vars esperadas (configurar en Dokploy):
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME           (default: 'sitiomunicipal')
//   R2_ENDPOINT              (default: https://{ACCOUNT_ID}.r2.cloudflarestorage.com)
//   R2_PUBLIC_BASE_URL       (OPCIONAL — default: URL publica de DESARROLLO
//                            de Cloudflare R2, formato https://pub-*.r2.dev/{BUCKET}.
//                            Funciona apenas el bucket tenga habilitada la opcion
//                            "Public Development URL" en Cloudflare Dashboard.
//                            Si en algun momento se configura un dominio custom
//                            (assets.eldorado.gob.ar), setear R2_PUBLIC_BASE_URL
//                            en Dokploy y este codigo lo respetara).
//
// API expuesta:
//   uploadToR2({ buffer, contentType, keyPrefix, originalName })
//     -> { url, key, size, contentType }
//
//   deleteFromR2(key)
//     -> { ok: true }
//
// Si las env vars no están cargadas, las funciones throw un error descriptivo
// (no se rompe el server, solo el endpoint que intente usar R2).

const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')

const R2_ENDPOINT = process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'sitiomunicipal'
// Default: URL publica de DESARROLLO de R2 (formato: https://pub-*.r2.dev/{BUCKET}).
// Funciona apenas el bucket tenga habilitada la opcion "Public Development URL"
// en Cloudflare Dashboard (es un toggle, no requiere custom domain ni DNS).
// Esta URL es rate-limited (no para produccion de alto volumen), pero sirve para
// volumen bajo/medio. Es la unica URL publica sin credenciales.
// Si se configura un dominio custom (assets.eldorado.gob.ar), setear
// R2_PUBLIC_BASE_URL en Dokploy y este codigo lo respetara.
const R2_PUBLIC_BASE_URL = (process.env.R2_PUBLIC_BASE_URL
  || `https://pub-8ee00443a7304320af03eb5c196650ce.r2.dev/${R2_BUCKET}`)
  .replace(/\/+$/, '')

let _client = null

function getClient() {
  if (_client) return _client
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 no configurado: faltan R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY en env')
  }
  _client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  })
  return _client
}

function sanitizeFilename(name) {
  if (!name) return 'file'
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80) || 'file'
}

async function uploadToR2({ buffer, contentType, keyPrefix = 'home', originalName }) {
  if (!buffer) throw new Error('uploadToR2: buffer requerido')
  if (!contentType) throw new Error('uploadToR2: contentType requerido')

  const safe = sanitizeFilename(originalName)
  const ts = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  const key = `${keyPrefix}/${ts}-${rand}-${safe}`

  const cmd = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  })
  await getClient().send(cmd)

  return {
    url: `${R2_PUBLIC_BASE_URL}/${key}`,
    key,
    size: buffer.length,
    contentType,
  }
}

async function deleteFromR2(key) {
  if (!key) throw new Error('deleteFromR2: key requerido')
  const cmd = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  })
  await getClient().send(cmd)
  return { ok: true }
}

module.exports = {
  uploadToR2,
  deleteFromR2,
  R2_BUCKET,
  R2_PUBLIC_BASE_URL,
  R2_ENDPOINT,
}

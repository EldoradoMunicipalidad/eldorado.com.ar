// R2 client wrapper — Cloudflare R2 (S3-compatible)
//
// Env vars esperadas (configurar en Dokploy):
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME           (default: 'sitiomunicipal')
//   R2_ENDPOINT              (default: https://{ACCOUNT_ID}.r2.cloudflarestorage.com)
//   R2_PUBLIC_BASE_URL       (OPCIONAL — default: URL publica directa del bucket
//                            R2. Si en el futuro se agrega un dominio custom
//                            como cdn.eldorado.gob.ar, setear esta var para
//                            que las URLs queden más lindas).
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
// Default: URL publica directa del bucket R2 (formato:
// https://{ACCOUNT_ID}.r2.cloudflarestorage.com/{BUCKET}). Funciona apenas
// creadas las credenciales, sin requerir DNS adicional.
// Si en algun momento se configura un custom domain (cdn.eldorado.gob.ar),
// setear R2_PUBLIC_BASE_URL en Dokploy y este codigo lo respetara.
const R2_PUBLIC_BASE_URL = (process.env.R2_PUBLIC_BASE_URL
  || `https://${process.env.R2_ACCOUNT_ID || 'r2-cloudflarestorage'}.r2.cloudflarestorage.com/${R2_BUCKET}`)
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

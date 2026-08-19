// R2 client wrapper — Cloudflare R2 (S3-compatible)
//
// Env vars esperadas (configurar en Dokploy):
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME           (default: 'sitiomunicipal')
//   R2_ENDPOINT              (default: https://{ACCOUNT_ID}.r2.cloudflarestorage.com)
//   R2_PUBLIC_BASE_URL       (OPCIONAL — si esta definido, se usa para construir
//                            URLs publicas. Si NO esta definido, se generan
//                            URLs FIRMADAS con getSignedUrl del SDK — esto
//                            permite servir imagenes sin necesidad de hacer
//                            el bucket publico en Cloudflare Dashboard).
//
// API expuesta:
//   uploadToR2({ buffer, contentType, keyPrefix, originalName })
//     -> { url, key, size, contentType }  (URL firmada con expiracion 30 dias)
//
//   getSignedUrl(key, expiresIn)
//     -> URL firmada con expiracion personalizable (segundos)
//
//   deleteFromR2(key)
//     -> { ok: true }
//
// Si las env vars no están cargadas, las funciones throw un error descriptivo
// (no se rompe el server, solo el endpoint que intente usar R2).

const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl: awsGetSignedUrl } = require('@aws-sdk/s3-request-presigner')

const R2_ENDPOINT = process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'sitiomunicipal'
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL
  ? process.env.R2_PUBLIC_BASE_URL.replace(/\/+$/, '')
  : null

let _client = null

function getClient() {
  if (_client) return _client
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 no configurado: faltan R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY en env')
  }
  _client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    forcePathStyle: false, // R2 usa virtual-hosted style: <bucket>.<account>.r2.cloudflarestorage.com
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

// Default expiration: 30 dias. Las URLs se renuevan cada vez que el backend
// serializa el JSONB (porque el bucket no es publico -> no podemos servir
// URLs publicas estaticas).
const DEFAULT_EXPIRES_IN = 30 * 24 * 60 * 60 // 30 dias en segundos

async function getSignedUrl(key, expiresIn = DEFAULT_EXPIRES_IN) {
  if (!key) throw new Error('getSignedUrl: key requerido')
  const cmd = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  })
  return await awsGetSignedUrl(getClient(), cmd, { expiresIn })
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

  // Si hay R2_PUBLIC_BASE_URL configurado, usamos esa URL (es publica).
  // Si no, generamos URL firmada para servir el objeto sin necesidad
  // de hacer el bucket publico. Esto es necesario porque R2 no siempre
  // expone una opcion 'Public Access' en todos los planes.
  let url
  if (R2_PUBLIC_BASE_URL) {
    url = `${R2_PUBLIC_BASE_URL}/${key}`
  } else {
    url = await getSignedUrl(key)
  }

  return {
    url,
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
  getSignedUrl,
  R2_BUCKET,
  R2_PUBLIC_BASE_URL,
  R2_ENDPOINT,
}

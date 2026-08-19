// Migración one-shot: base64 -> URLs de R2 para page_content.home
//
// Qué hace:
//   1) Lee el JSONB de page_content.home
//   2) Busca todos los strings "data:image/...;base64,..."
//   3) Para cada uno: sube a R2 (dedup por hash) y reemplaza con URL
//   4) Guarda el JSONB nuevo
//
// Idempotente: si se corre 2 veces, la 2da no hace nada (no encuentra
// mas data:image/... base64 en el JSONB).
//
// Rollback: NO se puede ejecutar solo. El usuario tiene que restaurar
// desde el backup manualmente con restore-page-content.cjs.

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Cargar env vars desde .env del root si existe (para uso local)
const envFile = path.join(__dirname, '..', '..', '.env')
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) process.env[m[1]] = m[2]
  }
}

const { uploadToR2, R2_BUCKET } = require('../lib/r2.cjs')

const DATA_URL_RE = /data:image\/(jpeg|jpg|png|gif|webp|svg);base64,([A-Za-z0-9+/=]+)/g

function contentTypeFromExt(ext) {
  const e = ext.toLowerCase()
  if (e === 'jpg' || e === 'jpeg') return 'image/jpeg'
  if (e === 'png') return 'image/png'
  if (e === 'gif') return 'image/gif'
  if (e === 'webp') return 'image/webp'
  if (e === 'svg') return 'image/svg+xml'
  return 'image/jpeg'
}

;(async () => {
  const conn = process.env.DATABASE_URL
  if (!conn) {
    console.error('❌ Falta DATABASE_URL en env')
    process.exit(1)
  }
  if (!process.env.R2_ACCESS_KEY_ID) {
    console.error('❌ Faltan vars de R2')
    process.exit(1)
  }

  const c = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } })
  await c.connect()

  // 1) Leer el JSONB
  const { rows } = await c.query("SELECT content FROM page_content WHERE page_id='home'")
  if (rows.length === 0) {
    console.log('No hay fila page_content con page_id=home')
    await c.end()
    return
  }
  const content = rows[0].content
  const contentStr = JSON.stringify(content)
  console.log(`📄 JSONB leído: ${(contentStr.length / 1024).toFixed(1)} KB`)

  // 2) Buscar data URLs
  const matches = []
  let m
  while ((m = DATA_URL_RE.exec(contentStr)) !== null) {
    matches.push({
      full: m[0],
      ext: m[1],
      b64: m[2],
      index: m.index,
    })
  }
  console.log(`🔍 Encontrados ${matches.length} imágenes base64`)

  if (matches.length === 0) {
    console.log('✅ Nada que migrar — JSONB ya está limpio')
    await c.end()
    return
  }

  // 3) Deduplicar por hash y subir
  const hashToUrl = new Map() // sha256(b64) -> R2 URL
  let uploaded = 0
  let deduped = 0

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const buf = Buffer.from(match.b64, 'base64')
    const hash = crypto.createHash('sha256').update(buf).digest('hex')

    if (hashToUrl.has(hash)) {
      deduped++
      continue
    }

    try {
      const r = await uploadToR2({
        buffer: buf,
        contentType: contentTypeFromExt(match.ext),
        keyPrefix: 'home/migrated',
        originalName: `migrated-${hash.slice(0, 8)}.${match.ext}`,
      })
      hashToUrl.set(hash, r.url)
      uploaded++
      if ((i + 1) % 5 === 0 || i === matches.length - 1) {
        console.log(`  ${i + 1}/${matches.length}: ${(buf.length / 1024).toFixed(1)} KB → ${r.key}`)
      }
    } catch (e) {
      console.error(`  ❌ Error subiendo imagen ${i + 1}: ${e.message}`)
      throw e
    }
  }

  console.log(`📤 Subidas a R2: ${uploaded} (deduplicadas: ${deduped})`)

  // 4) Reemplazar base64 con URLs en el JSONB
  let newContentStr = contentStr
  const replacements = new Map() // base64 string -> URL
  for (const match of matches) {
    const buf = Buffer.from(match.b64, 'base64')
    const hash = crypto.createHash('sha256').update(buf).digest('hex')
    const url = hashToUrl.get(hash)
    if (!replacements.has(match.full)) {
      replacements.set(match.full, url)
    }
  }

  for (const [dataUrl, url] of replacements) {
    newContentStr = newContentStr.split(dataUrl).join(url)
  }

  console.log(`🔄 Reemplazos: ${replacements.size}`)

  // 5) Validar que ya no queden base64
  const remainingMatches = newContentStr.match(DATA_URL_RE)
  if (remainingMatches && remainingMatches.length > 0) {
    console.error(`❌ Quedan ${remainingMatches.length} base64 sin reemplazar — abortando`)
    await c.end()
    process.exit(1)
  }

  // 6) Guardar
  const newContent = JSON.parse(newContentStr)
  const newSize = JSON.stringify(newContent).length
  console.log(`💾 Nuevo JSONB: ${(newSize / 1024).toFixed(1)} KB (antes: ${(contentStr.length / 1024).toFixed(1)} KB)`)
  console.log(`   Reducción: ${((1 - newSize / contentStr.length) * 100).toFixed(1)}%`)

  const { rowCount } = await c.query(
    "UPDATE page_content SET content = $1::jsonb, updated_at = NOW() WHERE page_id='home'",
    [JSON.stringify(newContent)]
  )
  console.log(`✅ Migración aplicada. Rows affected: ${rowCount}`)

  await c.end()
})().catch(e => {
  console.error('❌ Error fatal:', e.message)
  console.error(e.stack)
  process.exit(1)
})

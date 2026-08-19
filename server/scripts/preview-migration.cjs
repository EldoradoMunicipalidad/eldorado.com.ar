// Dry-run del script de migracion: NO sube a R2, solo cuenta
const { Client } = require('pg')

const DATA_URL_RE = /data:image\/(jpeg|jpg|png|gif|webp|svg);base64,([A-Za-z0-9+/=]+)/g

;(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await c.connect()
  const { rows } = await c.query("SELECT content FROM page_content WHERE page_id='home'")
  const contentStr = JSON.stringify(rows[0].content)

  const matches = []
  let m
  while ((m = DATA_URL_RE.exec(contentStr)) !== null) {
    matches.push({ ext: m[1], b64: m[2] })
  }

  // Tamaños por tipo
  const byExt = {}
  let totalBytes = 0
  for (const match of matches) {
    const bytes = Buffer.from(match.b64, 'base64').length
    totalBytes += bytes
    byExt[match.ext] = byExt[match.ext] || { count: 0, bytes: 0 }
    byExt[match.ext].count++
    byExt[match.ext].bytes += bytes
  }

  console.log(`Total imágenes base64: ${matches.length}`)
  console.log(`Total bytes (decoded): ${(totalBytes / 1024 / 1024).toFixed(2)} MB`)
  console.log()
  console.log('Por tipo:')
  for (const ext of Object.keys(byExt)) {
    const s = byExt[ext]
    console.log(`  ${ext}: ${s.count} imgs, ${(s.bytes / 1024).toFixed(1)} KB`)
  }

  await c.end()
})()

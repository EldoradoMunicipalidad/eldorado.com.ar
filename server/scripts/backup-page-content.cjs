// Backup page_content.home a un archivo local JSON
// (corre una sola vez antes de la migración)
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

;(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await c.connect()
  const { rows } = await c.query("SELECT content, updated_at FROM page_content WHERE page_id='home'")
  if (rows.length === 0) {
    console.log('No hay fila page_content con page_id=home')
    await c.end()
    return
  }

  const backupDir = path.join(__dirname, '..', 'backups')
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true })

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupFile = path.join(backupDir, `page_content-home-${ts}.json`)

  const backup = {
    page_id: 'home',
    content: rows[0].content,
    updated_at: rows[0].updated_at,
    backed_up_at: new Date().toISOString(),
  }
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2))

  const size = fs.statSync(backupFile).size
  console.log(`✓ Backup guardado: ${backupFile}`)
  console.log(`  Tamaño: ${(size / 1024 / 1024).toFixed(2)} MB`)

  await c.end()
})()

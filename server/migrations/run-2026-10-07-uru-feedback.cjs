// Ejecutar con DATABASE_URL configurada:
// node server/migrations/run-2026-10-07-uru-feedback.cjs
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('Falta DATABASE_URL en el entorno.')
  process.exit(1)
}

const sqlPath = path.join(__dirname, '2026-10-07-uru-feedback.sql')
const sql = fs.readFileSync(sqlPath, 'utf8')

;(async () => {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    await client.query(sql)
    console.log('Migración de valoraciones URU ejecutada correctamente.')
  } catch (error) {
    console.error('No se pudo ejecutar la migración:', error.message)
    process.exitCode = 1
  } finally {
    await client.end()
  }
})()

// Crea la tabla `licitaciones` en NeonDB.
// Uso: node server/migrations/run-2026-08-25-licitaciones.cjs
//
// Idempotente (CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS).

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const connStr = process.env.DATABASE_URL
if (!connStr) {
  console.error('❌ Falta DATABASE_URL en el entorno. Ejemplo:')
  console.error('   export DATABASE_URL=postgres://... && node server/migrations/run-2026-08-25-licitaciones.cjs')
  process.exit(1)
}

const sqlFile = path.join(__dirname, '2026-08-25-licitaciones.sql')
const sql = fs.readFileSync(sqlFile, 'utf-8')

;(async () => {
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    console.log(`📄 Ejecutando: ${path.basename(sqlFile)}`)
    await client.query(sql)
    console.log('✅ Migración ejecutada correctamente')

    // Verificación adicional
    const { rows } = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM pg_tables WHERE schemaname='public' AND tablename='licitaciones') AS tabla,
        (SELECT COUNT(*) FROM pg_indexes WHERE schemaname='public' AND tablename='licitaciones' AND indexname='idx_licitaciones_codigo_active') AS idx_unique,
        (SELECT COUNT(*) FROM pg_indexes WHERE schemaname='public' AND tablename='licitaciones' AND indexname='idx_licitaciones_fecha_desc') AS idx_fecha
    `)
    const r = rows[0]
    console.log(`🔍 tabla licitaciones: ${r.tabla === '1' ? '✅ OK' : '❌ FALTA'}`)
    console.log(`🔍 idx_licitaciones_codigo_active: ${r.idx_unique === '1' ? '✅ OK' : '❌ FALTA'}`)
    console.log(`🔍 idx_licitaciones_fecha_desc: ${r.idx_fecha === '1' ? '✅ OK' : '❌ FALTA'}`)

    await client.end()
  } catch (e) {
    console.error('❌ Error:', e.message)
    await client.end()
    process.exit(1)
  }
})()
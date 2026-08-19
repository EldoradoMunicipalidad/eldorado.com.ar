// Run 2026-08-19-escuela-manejo-no-overlap-dni.sql against NeonDB
// Uso: node server/migrations/run-2026-08-19-escuela-manejo-no-overlap-dni.cjs
//
// Qué hace:
//   1) Cancela duplicados preexistentes (mantiene el más reciente)
//   2) Crea UNIQUE INDEX PARCIAL (dni, date) WHERE status != 'cancelled'
//   3) Verifica el resultado
//
// Idempotente.

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const connStr = process.env.DATABASE_URL
if (!connStr) {
  console.error('❌ Falta DATABASE_URL en el entorno. Ejemplo:')
  console.error('   export DATABASE_URL=postgres://... && node server/migrations/run-2026-08-19-escuela-manejo-no-overlap-dni.cjs')
  process.exit(1)
}

const sqlFile = path.join(__dirname, '2026-08-19-escuela-manejo-no-overlap-dni.sql')
const sql = fs.readFileSync(sqlFile, 'utf-8')

;(async () => {
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    console.log(`📄 Ejecutando: ${path.basename(sqlFile)}`)
    await client.query(sql)
    console.log('✅ Migración ejecutada correctamente')

    // Verificación
    const { rows: idx } = await client.query(`
      SELECT COUNT(*)::int AS n FROM pg_indexes
      WHERE schemaname = 'public' AND tablename = 'appointments_escuela_manejo'
        AND indexname = 'idx_appointments_escuela_manejo_dni_day'
    `)
    console.log(`🔍 UNIQUE INDEX 'idx_appointments_escuela_manejo_dni_day': ${idx[0].n === 1 ? '✅ OK' : '❌ FALTA'}`)

    const { rows: dup } = await client.query(`
      SELECT COUNT(*)::int AS n FROM (
        SELECT 1 FROM appointments_escuela_manejo
        WHERE status != 'cancelled'
        GROUP BY dni, date
        HAVING COUNT(*) > 1
      ) t
    `)
    console.log(`🔍 Duplicados activos restantes: ${dup[0].n}`)

    await client.end()
  } catch (e) {
    console.error('❌ Error:', e.message)
    await client.end()
    process.exit(1)
  }
})()

// Run fix-appointments-uniqueness.sql against NeonDB
// Uso: node server/migrations/run-fix-appointments-uniqueness.cjs
// (con DATABASE_URL seteado, o usa el fallback del db.cjs)
//
// Qué hace:
//   1) Cancela duplicados preexistentes (mantiene el más nuevo)
//   2) Crea UNIQUE INDEX PARCIAL sobre (area_id, date, time) WHERE status != 'cancelled'
//   3) Verifica el resultado
//
// Idempotente: se puede correr varias veces sin error.

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Extrae el connectionString del db.cjs (patrón consistente con otros runners)
const dbSrc = fs.readFileSync(path.join(__dirname, '..', 'db.cjs'), 'utf8')
const match = dbSrc.match(/connectionString:\s*process\.env\.DATABASE_URL\s*\|\|\s*'([^']+)'/)
const connStr = process.env.DATABASE_URL || match?.[1]

if (!connStr) {
  console.error('❌ No se pudo obtener DATABASE_URL ni del env ni del db.cjs')
  process.exit(1)
}

;(async () => {
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } })
  await client.connect()
  const sqlPath = path.join(__dirname, 'fix-appointments-uniqueness.sql')
  console.log(`📄 Ejecutando: ${path.basename(sqlPath)}`)
  try {
    await client.query(fs.readFileSync(sqlPath, 'utf8'))
    console.log('✅ Migración ejecutada correctamente')
  } catch (e) {
    console.error('❌ Error en la migración:', e.message)
    await client.end()
    process.exit(1)
  }

  // Verificación post-migración
  try {
    const { rows: dups } = await client.query(`
      SELECT area_id, date, time, COUNT(*)::int AS n
      FROM appointments
      WHERE status != 'cancelled'
      GROUP BY area_id, date, time
      HAVING COUNT(*) > 1
    `)
    console.log(`\n🔍 Duplicados activos restantes: ${dups.length}`)
    dups.forEach(r => console.log(`   - ${r.area_id} ${r.date} ${r.time} × ${r.n}`))

    const { rows: idx } = await client.query(`
      SELECT indexname FROM pg_indexes
      WHERE tablename='appointments' AND indexname='appointments_active_slot_unique'
    `)
    console.log(`\n🛡  UNIQUE INDEX 'appointments_active_slot_unique': ${idx.length === 1 ? '✅ OK' : '❌ NO CREADO'}`)

    const { rows: cancelled } = await client.query(`
      SELECT COUNT(*)::int AS n FROM appointments WHERE status='cancelled'
    `)
    console.log(`📦 Total turnos cancelados (incluye cleanup): ${cancelled[0].n}`)
  } catch (e) {
    console.error('⚠  Error en verificación:', e.message)
  }

  await client.end()
})()
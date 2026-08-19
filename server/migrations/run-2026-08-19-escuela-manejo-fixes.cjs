// Run 2026-08-19-escuela-manejo-fixes.sql against NeonDB
// Uso: node server/migrations/run-2026-08-19-escuela-manejo-fixes.cjs
// (con DATABASE_URL seteado en el env)
//
// Qué hace:
//   1) ALTER TABLE appointments_escuela_manejo ADD COLUMN IF NOT EXISTS fecha_nacimiento
//   2) Cancela duplicados preexistentes (mantiene el más nuevo)
//   3) Crea UNIQUE INDEX PARCIAL sobre (area_id, date, time) WHERE status != 'cancelled'
//   4) Verifica el resultado
//
// Idempotente: se puede correr varias veces sin error.

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const connStr = process.env.DATABASE_URL
if (!connStr) {
  console.error('❌ Falta DATABASE_URL en el entorno. Ejemplo:')
  console.error('   export DATABASE_URL=postgres://... && node server/migrations/run-2026-08-19-escuela-manejo-fixes.cjs')
  process.exit(1)
}

;(async () => {
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } })
  await client.connect()
  const sqlPath = path.join(__dirname, '2026-08-19-escuela-manejo-fixes.sql')
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
    const { rows: cols } = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name='appointments_escuela_manejo' AND column_name='fecha_nacimiento'
    `)
    console.log(`\n🔍 Columna fecha_nacimiento: ${cols.length === 1 ? '✅ OK' : '❌ NO CREADA'}`)

    const { rows: dups } = await client.query(`
      SELECT area_id, date, time, COUNT(*)::int AS n
      FROM appointments_escuela_manejo
      WHERE status != 'cancelled'
      GROUP BY area_id, date, time
      HAVING COUNT(*) > 1
    `)
    console.log(`🔍 Duplicados activos restantes: ${dups.length}`)
    dups.forEach(r => console.log(`   - ${r.area_id} ${r.date} ${r.time} × ${r.n}`))

    const { rows: idx } = await client.query(`
      SELECT indexname FROM pg_indexes
      WHERE tablename='appointments_escuela_manejo'
      AND indexname='idx_appointments_escuela_manejo_slot'
    `)
    console.log(`🛡  UNIQUE INDEX 'idx_appointments_escuela_manejo_slot': ${idx.length === 1 ? '✅ OK' : '❌ NO CREADO'}`)
  } catch (e) {
    console.error('⚠  Error en verificación:', e.message)
  }

  await client.end()
})()

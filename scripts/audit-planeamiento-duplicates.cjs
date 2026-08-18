#!/usr/bin/env node
/**
 * Audita duplicados activos en `appointments` (Turnero Planeamiento).
 * Detecta conflictos (area_id, date, time) repetidos con status != 'cancelled'.
 *
 * Ejecuta contra la NeonDB del proyecto leyendo la connection string de server/db.cjs.
 *
 * Uso:
 *   node scripts/audit-planeamiento-duplicates.cjs
 *   node scripts/audit-planeamiento-duplicates.cjs --table appointments_ambiente
 */
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

// 1. Usar DATABASE_URL del environment (recomendado), o extraer del .env/secret manager local.
//    Para correr el script:  DATABASE_URL='postgresql://...' node scripts/audit-planeamiento-duplicates.cjs
const connStr = process.env.DATABASE_URL
if (!connStr) {
  console.error('❌ DATABASE_URL no está definida. Pasala como env var:')
  console.error('   DATABASE_URL="postgresql://..." node scripts/audit-planeamiento-duplicates.cjs')
  process.exit(1)
}

// 2. Parse args
const args = process.argv.slice(2)
const tableArg = args.find((a) => a.startsWith('--table='))
const table = tableArg ? tableArg.split('=')[1] : 'appointments'

console.log(`🔍 Auditando duplicados en tabla: ${table}`)
console.log(`🔌 Conectando a NeonDB...`)

const pool = new Pool({
  connectionString: connStr,
  ssl: { rejectUnauthorized: false },
})

;(async () => {
  try {
    // 2a. Verificar que la tabla existe
    const exists = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1) AS ok`,
      [table]
    )
    if (!exists.rows[0].ok) {
      console.error(`❌ La tabla "${table}" no existe.`)
      process.exit(1)
    }

    // 2b. Contar total de turnos activos
    const totalResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM ${table} WHERE status != 'cancelled'`
    )
    const totalActive = totalResult.rows[0].total
    console.log(`\n📊 Turnos activos (status != 'cancelled'): ${totalActive}`)

    // 2c. Detectar duplicados activos por (area_id, date, time)
    const dupResult = await pool.query(
      `SELECT area_id, date, time, COUNT(*)::int AS cnt,
              array_agg(dni ORDER BY created_at) AS dnis,
              array_agg(id ORDER BY created_at) AS ids,
              array_agg(status ORDER BY created_at) AS statuses
       FROM ${table}
       WHERE status != 'cancelled'
       GROUP BY area_id, date, time
       HAVING COUNT(*) > 1
       ORDER BY cnt DESC, date DESC, time`
    )

    if (dupResult.rows.length === 0) {
      console.log('✅ No hay duplicados activos. Se puede crear el UNIQUE INDEX sin problemas.')
    } else {
      console.log(`\n⚠️  DUPLICADOS DETECTADOS: ${dupResult.rows.length} grupos\n`)
      dupResult.rows.forEach((r, i) => {
        console.log(`  [${i + 1}] area_id=${r.area_id} | date=${r.date} | time=${r.time} | count=${r.cnt}`)
        console.log(`      DNIs: [${r.dnis.join(', ')}]`)
        console.log(`      Statuses: [${r.statuses.join(', ')}]`)
      })
    }

    // 2d. Detectar días sobrecapacidad (más turnos que slots_per_day del área)
    const overcapResult = await pool.query(
      `SELECT a.area_id, a.date, COUNT(*)::int AS booked, areas.slots_per_day
       FROM ${table} a
       LEFT JOIN areas ON areas.id = a.area_id
       WHERE a.status != 'cancelled'
       GROUP BY a.area_id, a.date, areas.slots_per_day
       HAVING COUNT(*) > COALESCE(areas.slots_per_day, 999)
       ORDER BY booked DESC`
    )
    if (overcapResult.rows.length > 0) {
      console.log(`\n⚠️  DÍAS CON SOBRE-CAPACIDAD: ${overcapResult.rows.length}`)
      overcapResult.rows.forEach((r, i) => {
        console.log(`  [${i + 1}] area_id=${r.area_id} | date=${r.date} | booked=${r.booked} / cap=${r.slots_per_day}`)
      })
    } else {
      console.log(`\n✅ Sin días sobrecapacidad (vs slots_per_day del área).`)
    }

    // 2e. Verificar si ya existe UNIQUE INDEX
    const idxResult = await pool.query(
      `SELECT indexname, indexdef
       FROM pg_indexes
       WHERE tablename = $1
         AND indexdef LIKE '%UNIQUE%'
         AND indexdef LIKE '%area_id%'`,
      [table]
    )
    if (idxResult.rows.length > 0) {
      console.log(`\n🔒 UNIQUE INDEX ya existente:`)
      idxResult.rows.forEach((r) => console.log(`   ${r.indexname}: ${r.indexdef}`))
    } else {
      console.log(`\n🚫 NO hay UNIQUE INDEX sobre (area_id, ...) aún. Es el momento de crearlo.`)
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
})()

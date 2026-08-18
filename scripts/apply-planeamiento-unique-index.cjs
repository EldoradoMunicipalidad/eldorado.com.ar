#!/usr/bin/env node
/**
 * Limpia duplicados activos en `appointments` (Turnero Planeamiento) y crea
 * UNIQUE INDEX CONCURRENTLY sobre (area_id, date, time) WHERE status != 'cancelled'.
 *
 * Paso 1: DELETE manteniendo el ctid menor (más antiguo).
 * Paso 2: CREATE UNIQUE INDEX CONCURRENTLY (no lockea la tabla).
 * Paso 3: Verificación.
 *
 * Uso:
 *   DATABASE_URL='postgresql://...' node scripts/apply-planeamiento-unique-index.cjs
 *   DATABASE_URL='postgresql://...' node scripts/apply-planeamiento-unique-index.cjs --table appointments_ambiente
 */
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

const connStr = process.env.DATABASE_URL
if (!connStr) {
  console.error('❌ DATABASE_URL no está definida.')
  console.error('   DATABASE_URL="postgresql://..." node scripts/apply-planeamiento-unique-index.cjs')
  process.exit(1)
}

const args = process.argv.slice(2)
const tableArg = args.find((a) => a.startsWith('--table='))
const table = tableArg ? tableArg.split('=')[1] : 'appointments'

const indexName = `idx_${table}_slot_unique`
const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: false } })

;(async () => {
  try {
    console.log(`🔧 Aplicando fix slot-uniqueness sobre tabla: ${table}`)

    // Paso 1: auditoría previa (subquery para evitar USING en COUNT)
    const before = await pool.query(
      `SELECT COUNT(*)::int AS n FROM (
         SELECT a.ctid
         FROM ${table} a, ${table} b
         WHERE a.ctid < b.ctid
           AND a.area_id = b.area_id AND a.date = b.date AND a.time = b.time
           AND a.status != 'cancelled' AND b.status != 'cancelled'
       ) sub`
    )
    const dupCount = before.rows[0].n
    console.log(`📊 Duplicados a eliminar (manteniendo el más antiguo): ${dupCount}`)

    // Paso 2: DELETE
    if (dupCount > 0) {
      const del = await pool.query(
        `DELETE FROM ${table} a USING ${table} b
         WHERE a.ctid < b.ctid
           AND a.area_id = b.area_id AND a.date = b.date AND a.time = b.time
           AND a.status != 'cancelled' AND b.status != 'cancelled'
         RETURNING a.id, a.area_id, a.date, a.time, a.dni`
      )
      console.log(`🗑️  Eliminados ${del.rowCount} turnos duplicados:`)
      del.rows.forEach((r, i) => {
        console.log(`   [${i + 1}] id=${r.id} | ${r.area_id} ${r.date} ${r.time} | dni=${r.dni}`)
      })
    } else {
      console.log('✅ Nada que limpiar.')
    }

    // Paso 3: verificar si el índice ya existe
    const idxExists = await pool.query(
      `SELECT 1 FROM pg_indexes WHERE tablename = $1 AND indexname = $2`,
      [table, indexName]
    )
    if (idxExists.rowCount > 0) {
      console.log(`\n� El índice ${indexName} ya existe. Saltando creación.`)
    } else {
      console.log(`\n🔨 Creando UNIQUE INDEX CONCURRENTLY ${indexName}...`)
      // CONCURRENTLY requiere estar fuera de transaction block. No usamos BEGIN.
      await pool.query(
        `CREATE UNIQUE INDEX CONCURRENTLY ${indexName}
         ON ${table} (area_id, date, time)
         WHERE status != 'cancelled'`
      )
      console.log('✅ Índice creado.')
    }

    // Paso 4: verificación final
    const verify = await pool.query(
      `SELECT indexdef FROM pg_indexes WHERE tablename = $1 AND indexname = $2`,
      [table, indexName]
    )
    if (verify.rowCount > 0) {
      console.log(`\n🎉 Confirmado en pg_indexes:`)
      console.log(`   ${verify.rows[0].indexdef}`)
    }

    // Paso 5: re-run auditoría para confirmar 0 duplicados
    const after = await pool.query(
      `SELECT COUNT(*)::int AS n FROM (
         SELECT area_id, date, time
         FROM ${table}
         WHERE status != 'cancelled'
         GROUP BY area_id, date, time
         HAVING COUNT(*) > 1
       ) sub`
    )
    const remainDup = after.rows[0].n
    console.log(`\n📊 Duplicados activos restantes: ${remainDup === 0 ? '0 ✅' : remainDup + ' ⚠️'}`)
  } catch (err) {
    console.error('� Error:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
})()

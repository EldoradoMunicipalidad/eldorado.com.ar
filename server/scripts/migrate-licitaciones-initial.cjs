// Migración inicial de licitaciones — public/licitaciones/*.pdf → R2 + Neon
//
// Qué hace:
//   1) Lee src/data/GobiernoAbierto/licitacionesData.js (las 20 entradas actuales)
//   2) Para cada entrada:
//      - Lee el PDF de public/licitaciones/<archivo>
//      - Lo sube a Cloudflare R2 con key 'licitaciones/<archivo>'
//      - Inserta la fila en la tabla licitaciones (id, codigo, tipo, fecha_publicacion,
//        descripcion, pdf_key, pdf_filename)
//      - Si el código ya existe (idempotente): skip y log
//      - Si falla: rollback del R2 upload (best-effort) y continue con la siguiente
//
// Idempotente: correr 2 veces produce el mismo resultado (la 2da no inserta nada nuevo,
// y los R2 uploads previos se detectan y reusan si el key coincide).
//
// Requisitos de entorno:
//   - DATABASE_URL (Neon Postgres)
//   - R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
//   - (opcional) R2_BUCKET_NAME (default 'sitiomunicipal')
//
// Uso:
//   DATABASE_URL=... R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... \
//     node server/scripts/migrate-licitaciones-initial.cjs
//
// Rollback:
//   DELETE FROM licitaciones WHERE codigo IN (...);  -- y borrar manualmente los keys de R2

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')
const { uploadToR2 } = require('../lib/r2.cjs')

// ─── Cargar .env del root si existe ────────────────────────────────
const envFile = path.join(__dirname, '..', '..', '.env')
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && m[1] && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}

const conn = process.env.DATABASE_URL
if (!conn) {
  console.error('❌ Falta DATABASE_URL en env')
  process.exit(1)
}
if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  console.error('❌ Faltan R2_* en env. Necesarios: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY')
  process.exit(1)
}

// ─── Cargar licitacionesData.js (el source of truth actual) ──────
// Como el archivo usa `export const` (ESM), usamos import() dinámico.
;(async () => {
  const url = require('url').pathToFileURL(
    path.join(__dirname, '..', '..', 'src', 'data', 'GobiernoAbierto', 'licitacionesData.js')
  ).href
  const mod = await import(url)
  const items = mod.LICITACIONES_DATA
  console.log(`📦 ${items.length} licitaciones en licitacionesData.js`)
  await runMigration(items)
})()

async function runMigration(items) {
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } })
  await client.connect()
  console.log('🔌 Conectado a Neon')

  // Mapear enlacePliego a path local (decodificando el %20)
  const publicDir = path.join(__dirname, '..', '..', 'public')
  const stats = { inserted: 0, skipped: 0, errors: 0 }

  for (const it of items) {
    const relativePath = decodeURIComponent(it.enlacePliego.replace(/^\/+/, ''))
    const localPath = path.join(publicDir, relativePath)

    if (!fs.existsSync(localPath)) {
      console.error(`❌ [id=${it.id}] ${it.codigo}: PDF no encontrado en ${localPath}`)
      stats.errors++
      continue
    }

    // Verificar si ya existe en DB (idempotencia)
    const { rowCount } = await client.query(
      'SELECT 1 FROM licitaciones WHERE codigo = $1',
      [it.codigo]
    )
    if (rowCount > 0) {
      console.log(`⏭️  [id=${it.id}] ${it.codigo}: ya existe en DB, skip`)
      stats.skipped++
      continue
    }

    // Subir PDF a R2
    const buffer = fs.readFileSync(localPath)
    const filename = path.basename(localPath)
    let uploadResult
    try {
      uploadResult = await uploadToR2({
        buffer,
        contentType: 'application/pdf',
        keyPrefix: 'licitaciones',
        originalName: filename,
      })
    } catch (r2Err) {
      console.error(`❌ [id=${it.id}] ${it.codigo}: error subiendo a R2: ${r2Err.message}`)
      stats.errors++
      continue
    }

    // Insertar fila
    const [dd, mm, yyyy] = it.fechaPublicacion.split('/')
    const fechaISO = `${yyyy}-${mm}-${dd}`
    try {
      await client.query(
        `INSERT INTO licitaciones (codigo, tipo, fecha_publicacion, descripcion, pdf_key, pdf_filename)
         VALUES ($1, $2, $3::date, $4, $5, $6)`,
        [it.codigo, it.tipo, fechaISO, it.descripcion, uploadResult.key, filename]
      )
      console.log(`✅ [id=${it.id}] ${it.codigo}: subido a R2 (${(buffer.length / 1024).toFixed(0)} KB) + insertado en DB`)
      stats.inserted++
    } catch (dbErr) {
      console.error(`❌ [id=${it.id}] ${it.codigo}: error INSERT (${dbErr.message}). Limpiando PDF en R2...`)
      // Rollback del upload
      try {
        const { deleteFromR2 } = require('../lib/r2.cjs')
        await deleteFromR2(uploadResult.key)
      } catch (cleanupErr) {
        console.error(`   ⚠️  No se pudo limpiar R2 key ${uploadResult.key}: ${cleanupErr.message}`)
      }
      stats.errors++
    }
  }

  console.log('\n📊 Resumen:')
  console.log(`   Insertados: ${stats.inserted}`)
  console.log(`   Saltados (ya existían): ${stats.skipped}`)
  console.log(`   Errores: ${stats.errors}`)

  // Verificación final
  const { rows: count } = await client.query('SELECT COUNT(*)::int AS n FROM licitaciones WHERE deleted_at IS NULL')
  console.log(`\n🔍 Total filas activas en DB: ${count[0].n}`)

  await client.end()
  console.log('🔌 Desconectado')
  process.exit(stats.errors > 0 ? 1 : 0)
}
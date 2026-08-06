// Verify tables created in NeonDB for the turnero Escuela de Manejo
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const dbSrc = fs.readFileSync(path.join(__dirname, '..', 'db.cjs'), 'utf8')
const match = dbSrc.match(/connectionString:\s*process\.env\.DATABASE_URL\s*\|\|\s*'([^']+)'/)
const connStr = process.env.DATABASE_URL || match[1]

;(async () => {
    const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } })
    await client.connect()
    const res = await client.query(`
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_name IN ('areas_escuela_manejo', 'appointments_escuela_manejo',
                              'config_escuela_manejo', 'admins_escuela_manejo')
        ORDER BY table_name, ordinal_position
    `)
    const tables = {}
    for (const row of res.rows) {
        if (!tables[row.table_name]) tables[row.table_name] = []
        tables[row.table_name].push(`${row.column_name} (${row.data_type})`)
    }
    for (const [name, cols] of Object.entries(tables)) {
        console.log(`\n=== ${name} ===  (${cols.length} columnas)`)
        cols.forEach(c => console.log(`  - ${c}`))
    }

    // Seed check
    const seed = await client.query(`
        SELECT
            (SELECT COUNT(*) FROM areas_escuela_manejo) AS areas,
            (SELECT COUNT(*) FROM admins_escuela_manejo) AS admins,
            (SELECT id FROM config_escuela_manejo LIMIT 1) AS config_id
    `)
    console.log('\n=== SEED ===')
    console.log(`  areas: ${seed.rows[0].areas}`)
    console.log(`  admins: ${seed.rows[0].admins}`)
    console.log(`  config_id: ${seed.rows[0].config_id}`)

    await client.end()
})()
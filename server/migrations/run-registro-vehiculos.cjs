// Run init-registro-vehiculos.sql against NeonDB
// Uso: node server/migrations/run-registro-vehiculos.cjs
// Crea las tablas vehiculos_colectivos, vehiculos_especializados,
// admins_registro_vehiculos y config_registro_vehiculos + seed del admin.

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const dbSrc = fs.readFileSync(path.join(__dirname, '..', 'db.cjs'), 'utf8')
const match = dbSrc.match(/connectionString:\s*process\.env\.DATABASE_URL\s*\|\|\s*'([^']+)'/)
const connStr = process.env.DATABASE_URL || match[1]

;(async () => {
    const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } })
    await client.connect()
    const sql = fs.readFileSync(path.join(__dirname, '..', 'init-registro-vehiculos.sql'), 'utf8')
    try {
        await client.query(sql)
        console.log('✅ init-registro-vehiculos.sql ejecutado correctamente')

        // Verificación rápida
        const { rows: admins } = await client.query('SELECT username, nombre, rol FROM admins_registro_vehiculos ORDER BY username')
        console.log(`\n📋 Administradores en la DB (${admins.length}):`)
        admins.forEach(a => console.log(`   - ${a.username} (${a.nombre || 'sin nombre'}) [${a.rol}]`))

        const { rows: cfg } = await client.query("SELECT * FROM config_registro_vehiculos WHERE id = 'default'")
        console.log(`\n⚙️  Config: modulo_pausado=${cfg[0]?.modulo_pausado}, permitir_publico=${cfg[0]?.permitir_publico}`)
    } catch (e) {
        console.error('❌ Error:', e.message)
        process.exitCode = 1
    }
    await client.end()
})()

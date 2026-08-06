// Run init-escuela-manejo.sql against NeonDB
// Uso: node server/migrations/run-escuela-manejo.cjs
// Ejecuta el DDL + seed del turnero de la Escuela de Manejo.

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const dbSrc = fs.readFileSync(path.join(__dirname, '..', 'db.cjs'), 'utf8')
const match = dbSrc.match(/connectionString:\s*process\.env\.DATABASE_URL\s*\|\|\s*'([^']+)'/)
const connStr = process.env.DATABASE_URL || match[1]

;(async () => {
    const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } })
    await client.connect()
    const sql = fs.readFileSync(path.join(__dirname, '..', 'init-escuela-manejo.sql'), 'utf8')
    try {
        await client.query(sql)
        console.log('✅ init-escuela-manejo.sql ejecutado correctamente')
    } catch (e) {
        console.error('❌ Error:', e.message)
        process.exitCode = 1
    }
    await client.end()
})()
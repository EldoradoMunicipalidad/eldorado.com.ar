const { Pool } = require('pg')

// Se exige DATABASE_URL. Si no está configurada (en Dokploy → Environment), el
// servidor debe fallar al iniciar — NO caer a un fallback con credenciales.
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('[db] Falta la variable de entorno DATABASE_URL. Configurala en Dokploy → Environment y redeploy.')
  process.exit(1)
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 5,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

module.exports = pool

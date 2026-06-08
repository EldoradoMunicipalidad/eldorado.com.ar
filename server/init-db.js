// Run: node server/init-db.js
// Initializes Neon PostgreSQL tables for Turnero + Habilitaciones

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3KXGx5UgBmrO@ep-nameless-heart-aplwptdo.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
})

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('📁 Created uploads directory')
}

async function init() {
  console.log('Connecting to Neon PostgreSQL...')

  // Run turnero schema
  const turneroSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8')
  try {
    await pool.query(turneroSql)
    console.log('✅ Turnero tables initialized successfully!')
  } catch (err) {
    console.error('❌ Error initializing turnero tables:', err.message)
    process.exit(1)
  }

  // Run habilitaciones schema
  const habilitacionesSql = fs.readFileSync(path.join(__dirname, 'habilitaciones.sql'), 'utf8')
  try {
    await pool.query(habilitacionesSql)
    console.log('✅ Habilitaciones table initialized successfully!')
  } catch (err) {
    console.error('❌ Error initializing habilitaciones table:', err.message)
    process.exit(1)
  }

  await pool.end()
  console.log('🎉 All done!')
}

init()

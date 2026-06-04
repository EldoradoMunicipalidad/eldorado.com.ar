// Run: node server/init-db.js
// Initializes Neon PostgreSQL tables for Turnero

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_3KXGx5UgBmrO@ep-nameless-heart-aplwptdo.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
})

async function init() {
  console.log('Connecting to Neon PostgreSQL...')
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8')
  
  try {
    await pool.query(sql)
    console.log('✅ Database initialized successfully!')
  } catch (err) {
    console.error('❌ Error initializing database:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

init()

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3KXGx5UgBmrO@ep-nameless-heart-aplwptdo.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
  max: 5,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

module.exports = pool

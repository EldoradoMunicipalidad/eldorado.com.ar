// Diagnóstico: ¿hay turnos duplicados por DNI/día en Neon?
// (para saber si la migración los va a auto-cancelar)
const { Client } = require('pg')
;(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await c.connect()
  const { rows } = await c.query(`
    SELECT dni, date, COUNT(*)::int AS n
    FROM appointments_escuela_manejo
    WHERE status != 'cancelled'
    GROUP BY dni, date
    HAVING COUNT(*) > 1
  `)
  console.log('duplicados activos (pre-migracion):', rows.length)
  rows.forEach(r => console.log(`  DNI=${r.dni} date=${r.date} n=${r.n}`))

  const { rows: total } = await c.query("SELECT COUNT(*)::int AS n FROM appointments_escuela_manejo")
  console.log('total turnos:', total[0].n)

  const { rows: cancel } = await c.query("SELECT COUNT(*)::int AS n FROM appointments_escuela_manejo WHERE status='cancelled'")
  console.log('cancelados:', cancel[0].n)

  await c.end()
})()

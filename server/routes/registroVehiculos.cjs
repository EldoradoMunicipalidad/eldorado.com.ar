// Registro de Vehículos — Dirección de Tránsito y Transporte
// Endpoints para Colectivos y Transporte Especializado.
// Auth independiente: tabla admins_registro_vehiculos con hash simpleHash.

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')

// ─── Helpers ───────────────────────────────────────────────────────
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

// ─── Auth middleware ──────────────────────────────────────────────
// Verifica header Authorization: Bearer <username>:<hash>
// El frontend guarda el hash de la contraseña del admin en localStorage
// (es la misma función simpleHash que se usa en el login) y lo envía
// directamente. El backend compara contra password_hash en la DB.
function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'] || ''
  const m = auth.match(/^Bearer\s+([^:]+):(.+)$/)
  if (!m) {
    return res.status(401).json({ error: 'No autorizado: credenciales requeridas' })
  }
  const [, username, hash] = m
  // Comparamos directamente contra la DB (hash ya viene hasheado del cliente).
  pool.query(
    'SELECT username FROM admins_registro_vehiculos WHERE username = $1 AND password_hash = $2',
    [username, hash]
  ).then(({ rows }) => {
    if (rows.length > 0) {
      req.admin = { username: rows[0].username }
      next()
    } else {
      res.status(401).json({ error: 'No autorizado: credenciales inválidas' })
    }
  }).catch((err) => {
    console.error('requireAdmin error:', err)
    res.status(500).json({ error: 'Error de autenticación' })
  })
}

// ─── CONFIG ────────────────────────────────────────────────────────
router.get('/config', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM config_registro_vehiculos WHERE id = 'default'")
    if (rows.length === 0) {
      const { rows: ins } = await pool.query(
        "INSERT INTO config_registro_vehiculos (id, modulo_pausado, permitir_publico) VALUES ('default', false, true) RETURNING *"
      )
      return res.json(ins[0])
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/config', async (req, res) => {
  try {
    const { modulo_pausado, permitir_publico, notas } = req.body
    const { rows } = await pool.query(
      `UPDATE config_registro_vehiculos
       SET modulo_pausado = COALESCE($1, modulo_pausado),
           permitir_publico = COALESCE($2, permitir_publico),
           notas = COALESCE($3, notas)
       WHERE id = 'default' RETURNING *`,
      [modulo_pausado, permitir_publico, notas]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── COLECTIVOS ────────────────────────────────────────────────────
router.get('/colectivos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vehiculos_colectivos ORDER BY fecha_registro DESC')
    res.json(rows)
  } catch (err) {
    console.error('GET /colectivos:', err)
    res.status(500).json({ error: 'Error al obtener colectivos' })
  }
})

router.post('/colectivos', requireAdmin, async (req, res) => {
  try {
    const data = req.body
    const required = ['tipo_vehiculo', 'marca', 'modelo', 'patente', 'titular']
    const missing = required.filter(k => !data[k])
    if (missing.length) return res.status(400).json({ error: `Faltan campos: ${missing.join(', ')}` })

    const { rows } = await pool.query(
      `INSERT INTO vehiculos_colectivos
          (tipo_vehiculo, marca, modelo, patente, titular, asientos, largo, ano_fabricacion,
           tipo_motor, tipo_combustible, vencimiento_vtv, numero_poliza, vencimiento_poliza)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        data.tipo_vehiculo, data.marca, data.modelo, data.patente.toUpperCase(), data.titular,
        data.asientos || null, data.largo || null, data.ano_fabricacion || null,
        data.tipo_motor || null, data.tipo_combustible || null,
        data.vencimiento_vtv || null, data.numero_poliza || null, data.vencimiento_poliza || null
      ]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('POST /colectivos:', err)
    if (err.code === '23505') return res.status(409).json({ error: 'Patente ya registrada' })
    res.status(500).json({ error: 'Error al registrar colectivo' })
  }
})

router.delete('/colectivos/:id', requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM vehiculos_colectivos WHERE id = $1', [req.params.id])
    if (!rowCount) return res.status(404).json({ error: 'No encontrado' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' })
  }
})

// ─── TRANSPORTE ESPECIALIZADO ─────────────────────────────────────
router.get('/especializados', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vehiculos_especializados ORDER BY fecha_registro DESC')
    res.json(rows)
  } catch (err) {
    console.error('GET /especializados:', err)
    res.status(500).json({ error: 'Error al obtener especializados' })
  }
})

router.post('/especializados', requireAdmin, async (req, res) => {
  try {
    const data = req.body
    const required = ['apellido', 'dni', 'dominio', 'marca', 'modelo', 'licencia', 'resolucion',
                       'fecha_resolucion', 'tipo_servicio', 'empresa', 'propietario', 'direccion']
    const missing = required.filter(k => !data[k])
    if (missing.length) return res.status(400).json({ error: `Faltan campos: ${missing.join(', ')}` })

    const { rows } = await pool.query(
      `INSERT INTO vehiculos_especializados
          (apellido, dni, dominio, marca, modelo, observaciones,
           licencia, resolucion, fecha_resolucion, tipo_servicio, parada,
           fecha_vto_vtv, fecha_vto_seguro, numero_poliza, fecha_habilitacion,
           empresa, propietario, direccion, movil, telefono)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       RETURNING *`,
      [
        data.apellido, data.dni, data.dominio.toUpperCase(), data.marca, data.modelo, data.observaciones || null,
        data.licencia, data.resolucion, data.fecha_resolucion, data.tipo_servicio, data.parada || null,
        data.fecha_vto_vtv || null, data.fecha_vto_seguro || null, data.numero_poliza || null,
        data.fecha_habilitacion || null,
        data.empresa, data.propietario, data.direccion, data.movil || null, data.telefono || null
      ]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('POST /especializados:', err)
    if (err.code === '23505') return res.status(409).json({ error: 'Dominio ya registrado' })
    res.status(500).json({ error: 'Error al registrar vehículo especializado' })
  }
})

router.delete('/especializados/:id', requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM vehiculos_especializados WHERE id = $1', [req.params.id])
    if (!rowCount) return res.status(404).json({ error: 'No encontrado' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' })
  }
})

// ─── AUTH ──────────────────────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Faltan credenciales' })
    const hash = simpleHash(password)
    const { rows } = await pool.query(
      'SELECT username, nombre, rol FROM admins_registro_vehiculos WHERE username = $1 AND password_hash = $2',
      [username, hash]
    )
    if (rows.length > 0) {
      res.json({ authenticated: true, username: rows[0].username, nombre: rows[0].nombre, rol: rows[0].rol })
    } else {
      res.status(401).json({ authenticated: false, error: 'Credenciales inválidas' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── ADMINS management ─────────────────────────────────────────────
router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT username, nombre, rol, email, created_at FROM admins_registro_vehiculos ORDER BY username'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/admins', requireAdmin, async (req, res) => {
  try {
    const { username, password, nombre, email, rol } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
    const hash = simpleHash(password)
    await pool.query(
      `INSERT INTO admins_registro_vehiculos (username, password_hash, nombre, email, rol)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         nombre = EXCLUDED.nombre,
         email = EXCLUDED.email,
         rol = EXCLUDED.rol`,
      [username, hash, nombre || '', email || '', rol || 'admin']
    )
    res.json({ ok: true, username })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/admins/:username', requireAdmin, async (req, res) => {
  try {
    if (req.params.username === 'Usuario1') {
      return res.status(400).json({ error: 'No se puede eliminar el admin principal' })
    }
    const { rowCount } = await pool.query('DELETE FROM admins_registro_vehiculos WHERE username = $1', [req.params.username])
    if (!rowCount) return res.status(404).json({ error: 'No encontrado' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

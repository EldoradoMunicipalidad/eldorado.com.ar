// Registro de Vehículos — Dirección de Tránsito y Transporte
// Endpoints para Colectivos y Transporte Especializado.
// Auth: tabla admins_registro_vehiculos con bcrypt (factor 12).

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')
const { verifyAdmin, requireAdminFor, makeLoginLimiter, bcrypt } = require('../authMiddleware.cjs')

const ADMIN_TABLE = 'admins_registro_vehiculos'
const requireAdmin = requireAdminFor(pool, ADMIN_TABLE)
const loginLimiter = makeLoginLimiter()

// ─── CONFIG (lectura PUBLICA — indica si el módulo está pausado) ──────────
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

router.put('/config', requireAdmin, async (req, res) => {
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

// ─── COLECTIVOS ─────────────────────────────────────────────────────
// Lectura PUBLICA (la lista de colectivos registrados es de interes publico)
router.get('/colectivos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vehiculos_colectivos ORDER BY fecha_registro DESC')
    res.json(rows)
  } catch (err) {
    console.error('GET /colectivos:', err)
    res.status(500).json({ error: 'Error al obtener colectivos' })
  }
})

// Crear / Borrar: ADMIN
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
// Lectura PUBLICA
router.get('/especializados', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vehiculos_especializados ORDER BY fecha_registro DESC')
    res.json(rows)
  } catch (err) {
    console.error('GET /especializados:', err)
    res.status(500).json({ error: 'Error al obtener especializados' })
  }
})

// Crear / Borrar: ADMIN
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
// Login ADMIN (bcrypt + fallback djb2 legacy para hashes viejos)
router.post('/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ authenticated: false, error: 'Faltan credenciales' })
    }
    const result = await verifyAdmin(pool, ADMIN_TABLE, username, password)
    if (!result.ok) {
      return res.status(401).json({ authenticated: false, error: 'Credenciales inválidas' })
    }
    pool.query(`UPDATE ${ADMIN_TABLE} SET last_login = NOW() WHERE username = $1`, [username])
      .catch(() => {})
    res.json({
      authenticated: true,
      username: result.username,
      token: `${username}:${password}`,
    })
  } catch (err) {
    console.error('POST /api/registro-vehiculos/auth/login:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── ADMINS management (admin only) ─────────────────────────────────
router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT username, nombre, rol, email, created_at FROM ${ADMIN_TABLE} ORDER BY username`
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
    if (password.length < 8) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' })
    const hash = bcrypt.hashSync(password, 12)
    await pool.query(
      `INSERT INTO ${ADMIN_TABLE} (username, password_hash, nombre, email, rol)
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
    // No permitir borrar el primer admin sembrado. Si en el futuro se cambia el
    // username principal, actualizar este check.
    if (req.params.username === 'Usuario1') {
      return res.status(400).json({ error: 'No se puede eliminar el admin principal' })
    }
    const { rowCount } = await pool.query(`DELETE FROM ${ADMIN_TABLE} WHERE username = $1`, [req.params.username])
    if (!rowCount) return res.status(404).json({ error: 'No encontrado' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/admins/change-password', requireAdmin, async (req, res) => {
  try {
    const { username, newPassword } = req.body
    if (!username || !newPassword) return res.status(400).json({ error: 'Datos requeridos' })
    if (newPassword.length < 8) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' })
    const hash = bcrypt.hashSync(newPassword, 12)
    const { rowCount } = await pool.query(
      `UPDATE ${ADMIN_TABLE} SET password_hash = $1 WHERE username = $2`,
      [hash, username]
    )
    if (!rowCount) return res.status(404).json({ error: 'No encontrado' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

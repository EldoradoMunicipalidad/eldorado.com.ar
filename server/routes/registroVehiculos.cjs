const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')

// ─── COLECTIVOS ─────────────────────────────────────────────────────
router.get('/colectivos', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM vehiculos_colectivos ORDER BY fecha_registro DESC')
        res.json(rows)
    } catch (err) {
        console.error('Error GET /colectivos:', err)
        res.status(500).json({ error: 'Error al obtener colectivos' })
    }
})

router.post('/colectivos', async (req, res) => {
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
            [data.tipo_vehiculo, data.marca, data.modelo, data.patente.toUpperCase(), data.titular,
             data.asientos || null, data.largo || null, data.ano_fabricacion || null,
             data.tipo_motor || null, data.tipo_combustible || null,
             data.vencimiento_vtv || null, data.numero_poliza || null, data.vencimiento_poliza || null]
        )
        res.status(201).json(rows[0])
    } catch (err) {
        console.error('Error POST /colectivos:', err)
        if (err.code === '23505') return res.status(409).json({ error: 'Patente ya registrada' })
        res.status(500).json({ error: 'Error al registrar colectivo' })
    }
})

router.delete('/colectivos/:id', async (req, res) => {
    try {
        const { rowCount } = await pool.query('DELETE FROM vehiculos_colectivos WHERE id = $1', [req.params.id])
        if (!rowCount) return res.status(404).json({ error: 'No encontrado' })
        res.json({ ok: true })
    } catch (err) {
        console.error('Error DELETE /colectivos/:id:', err)
        res.status(500).json({ error: 'Error al eliminar' })
    }
})

// ─── TRANSPORTE ESPECIALIZADO ──────────────────────────────────────
router.get('/especializados', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM vehiculos_especializados ORDER BY fecha_registro DESC')
        res.json(rows)
    } catch (err) {
        console.error('Error GET /especializados:', err)
        res.status(500).json({ error: 'Error al obtener especializados' })
    }
})

router.post('/especializados', async (req, res) => {
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
            [data.apellido, data.dni, data.dominio.toUpperCase(), data.marca, data.modelo, data.observaciones || null,
             data.licencia, data.resolucion, data.fecha_resolucion, data.tipo_servicio, data.parada || null,
             data.fecha_vto_vtv || null, data.fecha_vto_seguro || null, data.numero_poliza || null,
             data.fecha_habilitacion || null,
             data.empresa, data.propietario, data.direccion, data.movil || null, data.telefono || null]
        )
        res.status(201).json(rows[0])
    } catch (err) {
        console.error('Error POST /especializados:', err)
        if (err.code === '23505') return res.status(409).json({ error: 'Dominio ya registrado' })
        res.status(500).json({ error: 'Error al registrar vehículo especializado' })
    }
})

router.delete('/especializados/:id', async (req, res) => {
    try {
        const { rowCount } = await pool.query('DELETE FROM vehiculos_especializados WHERE id = $1', [req.params.id])
        if (!rowCount) return res.status(404).json({ error: 'No encontrado' })
        res.json({ ok: true })
    } catch (err) {
        console.error('Error DELETE /especializados/:id:', err)
        res.status(500).json({ error: 'Error al eliminar' })
    }
})

module.exports = router
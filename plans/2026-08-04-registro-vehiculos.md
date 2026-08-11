# Registro de Vehículos — Integración al Sitio Municipal

> **Para Hermes:** Plan bite-sized. Cada task = 2-5 min. Commits frecuentes.

## Goal

Integrar la app React standalone `registro-de-vehiculos-react` al sitio municipal de Eldorado como **funcionalidad nueva oculta** (sin links en el menú, acceso solo por URL directa `/xcsda/*`), con persistencia en Neon PostgreSQL y diseño adaptado al estilo del sitio municipal.

## Architecture

- **Frontend**: páginas nuevas dentro del mismo build Vite/React del sitio (`src/pages/RegistroVehiculos/`)
- **Backend**: ruta nueva `/api/registro-vehiculos` en `server/index.cjs` con su router `server/routes/registroVehiculos.cjs`
- **DB**: 2 tablas nuevas en Neon (`vehiculos_colectivos`, `vehiculos_especializados`)
- **Ocultamiento**: ruta en `App.jsx` sin entrada en `navigationData.jsx`. Sidebar/TOP BAR propias (no usa el layout municipal — es un sistema interno)
- **Estilo**: adaptar colores al azul del sitio (`#1e40af` / `#0ea5e9`), reemplazar indigo por paleta municipal, mantener estructura de cards/secciones del zip original

## Tech Stack

- React 18.3.1 + react-router-dom 6.26.0 (mismo del sitio)
- TypeScript no aplica — el sitio usa `.jsx`
- Tailwind CSS ya configurado en el sitio (`tailwind.config.js`)
- Express 5 + `pg` + Neon PostgreSQL (mismo del sitio)
- Sin auth (no es requerido por ahora — solo URL oculta)

---

## Decisiones clave (acordadas con el usuario)

1. **No publicar**: rutas registradas pero NO en `navigationData.jsx` → invisibles en el menú
2. **URL secreta**: prefijo `/xcsda/*` (no figura en navbar, footer ni breadcrumbs)
3. **Sin auth por ahora**: el flag de URL es la protección. Login queda para más adelante
4. **Persistencia Neon**: 2 tablas, una por tipo de vehículo
5. **Diseño municipal**: azul `#1e40af` reemplaza indigo `#6366f1`. Cards mantienen patrón pero con colores del sitio

---

## Tareas

### Task 1: Crear SQL de tablas en Neon

**Files:**
- Create: `server/migrations/2026-08-04-registro-vehiculos.sql`

**Step 1:** Crear el archivo con las 2 tablas (id serial, campos del form, timestamps).

```sql
-- Tabla para colectivos
CREATE TABLE IF NOT EXISTS vehiculos_colectivos (
    id SERIAL PRIMARY KEY,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_vehiculo VARCHAR(50) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    patente VARCHAR(20) NOT NULL UNIQUE,
    titular VARCHAR(200) NOT NULL,
    asientos INTEGER,
    largo VARCHAR(20),
    ano_fabricacion INTEGER,
    tipo_motor VARCHAR(50),
    tipo_combustible VARCHAR(50),
    vencimiento_vtv DATE,
    numero_poliza VARCHAR(100),
    vencimiento_poliza DATE,
    observaciones TEXT
);

-- Tabla para transporte especializado
CREATE TABLE IF NOT EXISTS vehiculos_especializados (
    id SERIAL PRIMARY KEY,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    dominio VARCHAR(20) NOT NULL UNIQUE,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    observaciones TEXT,
    licencia VARCHAR(50) NOT NULL,
    resolucion VARCHAR(50) NOT NULL,
    fecha_resolucion DATE NOT NULL,
    tipo_servicio VARCHAR(50) NOT NULL,
    parada VARCHAR(200),
    fecha_vto_vtv DATE,
    fecha_vto_seguro DATE,
    numero_poliza VARCHAR(100),
    fecha_habilitacion DATE,
    empresa VARCHAR(200) NOT NULL,
    propietario VARCHAR(200) NOT NULL,
    direccion VARCHAR(300) NOT NULL,
    movil VARCHAR(50),
    telefono VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_colectivos_patente ON vehiculos_colectivos(patente);
CREATE INDEX IF NOT EXISTS idx_especializados_dominio ON vehiculos_especializados(dominio);
CREATE INDEX IF NOT EXISTS idx_especializados_dni ON vehiculos_especializados(dni);
```

**Step 2:** Commit (no se ejecuta todavía — solo queda el archivo para revisión manual).

```bash
git add server/migrations/2026-08-04-registro-vehiculos.sql
git commit -m "feat(registro-vehiculos): schema SQL para tablas de colectivos y especializados"
```

---

### Task 2: Crear router backend `/api/registro-vehiculos`

**Files:**
- Create: `server/routes/registroVehiculos.cjs`

**Step 1:** Crear el archivo con endpoints REST para ambos tipos de vehículos.

```js
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
```

**Step 2:** Commit.

```bash
git add server/routes/registroVehiculos.cjs
git commit -m "feat(registro-vehiculos): router backend con CRUD para colectivos y especializados"
```

---

### Task 3: Registrar router en `server/index.cjs`

**Files:**
- Modify: `server/index.cjs` (líneas cerca del final, después de `homeContentRoutes`)

**Step 1:** Agregar el require y el `app.use`.

Buscar:
```js
const homeContentRoutes = require('./routes/homeContent.cjs')
app.use('/api/home-content', homeContentRoutes)
```

Agregar después:
```js
const registroVehiculosRoutes = require('./routes/registroVehiculos.cjs')
app.use('/api/registro-vehiculos', registroVehiculosRoutes)
```

**Step 2:** Verificar sintaxis.

```bash
cd "/c/Users/ECO-1/Desktop/municipalidad_page-main (1)/municipalidad_page-main"
node -c server/index.cjs
```

Expected: sin errores.

**Step 3:** Commit.

```bash
git add server/index.cjs
git commit -m "feat(registro-vehiculos): registrar router /api/registro-vehiculos en el servidor"
```

---

### Task 4: Crear layout interno del Registro Vehículos

**Files:**
- Create: `src/pages/RegistroVehiculos/RegistroVehiculosLayout.jsx`

**Step 1:** Layout propio (no usa Navbar/Footer del sitio — es una herramienta interna).

```jsx
import { Outlet, NavLink } from 'react-router-dom'

export default function RegistroVehiculosLayout() {
    const navItems = [
        { to: '/xcsda', label: 'Inicio', icon: 'dashboard', end: true },
        { to: '/xcsda/colectivo', label: 'Reg. Colectivo', icon: 'directions_bus' },
        { to: '/xcsda/transporte-especializado', label: 'Reg. Transp. Especializado', icon: 'directions_car' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-20">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-md">
                            RV
                        </div>
                        <div>
                            <h1 className="text-base font-semibold text-slate-900">Registro Vehicular</h1>
                            <p className="text-xs text-slate-500">Municipalidad de Eldorado</p>
                        </div>
                    </div>

                    <nav className="flex-1 flex flex-col gap-1">
                        {navItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="text-xs text-slate-400 pt-4 border-t border-slate-100">
                        Acceso restringido
                    </div>
                </div>
            </aside>

            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <h2 className="text-base font-semibold text-slate-900">Sistema de Registro Vehicular</h2>
                    <a
                        href="https://eldorado.gob.ar"
                        className="text-xs text-slate-500 hover:text-blue-700 transition-colors"
                    >
                        ← Volver al sitio
                    </a>
                </header>

                <main className="flex-1 px-4 md:px-8 py-8">
                    <div className="max-w-4xl mx-auto w-full pb-12">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
```

**Step 2:** Verificar compilación.

```bash
cd "/c/Users/ECO-1/Desktop/municipalidad_page-main (1)/municipalidad_page-main"
npm run build 2>&1 | tail -5
```

Expected: build OK (otros warnings de chunks grandes son preexistentes).

**Step 3:** Commit.

```bash
git add src/pages/RegistroVehiculos/RegistroVehiculosLayout.jsx
git commit -m "feat(registro-vehiculos): layout interno con sidebar municipal"
```

---

### Task 5: Crear página Home del Registro Vehículos

**Files:**
- Create: `src/pages/RegistroVehiculos/HomeVehiculos.jsx`

**Step 1:** Dashboard con KPIs que cargan del backend.

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function HomeVehiculos() {
    const [stats, setStats] = useState({ colectivos: 0, especializados: 0, loading: true })

    useEffect(() => {
        Promise.all([
            fetch('/api/registro-vehiculos/colectivos').then(r => r.json()).catch(() => []),
            fetch('/api/registro-vehiculos/especializados').then(r => r.json()).catch(() => []),
        ]).then(([col, esp]) => {
            setStats({ colectivos: col.length, especializados: esp.length, loading: false })
        })
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Registro Vehicular Municipal</h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Sistema interno para la gestión del parque vehicular registrado en el municipio.
                    Seleccione una opción del menú lateral para registrar un vehículo o consultar
                    información de la flota.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <Link
                        to="/xcsda/colectivo"
                        className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                    >
                        <div className="flex items-center gap-2 text-blue-700 mb-3">
                            <span className="material-symbols-outlined text-2xl">directions_bus</span>
                            <span className="text-xs font-semibold uppercase tracking-wider">Colectivos</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">
                            {stats.loading ? '—' : stats.colectivos}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Unidades registradas</p>
                    </Link>

                    <Link
                        to="/xcsda/transporte-especializado"
                        className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                    >
                        <div className="flex items-center gap-2 text-blue-700 mb-3">
                            <span className="material-symbols-outlined text-2xl">directions_car</span>
                            <span className="text-xs font-semibold uppercase tracking-wider">T. Especializado</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">
                            {stats.loading ? '—' : stats.especializados}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Vehículos registrados</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
```

**Step 2:** Commit.

```bash
git add src/pages/RegistroVehiculos/HomeVehiculos.jsx
git commit -m "feat(registro-vehiculos): home con KPIs en vivo del backend"
```

---

### Task 6: Crear página Registro Colectivo (con submit real)

**Files:**
- Create: `src/pages/RegistroVehiculos/RegistroColectivoVehiculos.jsx`

**Step 1:** Adaptar el form del zip con colores municipales, validaciones y POST.

```jsx
import { useState } from 'react'

const sectionClass = "bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
const titleClass = "flex items-center gap-3 text-blue-700 font-semibold text-lg mb-6"
const numberClass = "w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold"
const labelClass = "block text-xs font-medium text-slate-600 mb-1.5"
const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"

export default function RegistroColectivoVehiculos() {
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setMessage(null)
        const fd = new FormData(e.currentTarget)
        const data = Object.fromEntries(fd.entries())

        try {
            const res = await fetch('/api/registro-vehiculos/colectivos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Error')
            setMessage({ type: 'success', text: `Registro guardado correctamente (ID #${json.id})` })
            e.currentTarget.reset()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-slate-900">Registro de Colectivo</h1>

            {message && (
                <div className={`p-4 rounded-lg border ${
                    message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>1</span>
                    Información General
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="tipo_vehiculo">Tipo de vehículo *</label>
                        <select className={inputClass} id="tipo_vehiculo" name="tipo_vehiculo" required defaultValue="">
                            <option disabled value="">Seleccione un tipo</option>
                            <option value="urbano">Urbano</option>
                            <option value="interurbano">Interurbano</option>
                            <option value="larga_distancia">Larga Distancia</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="marca">Marca *</label>
                        <input className={inputClass} id="marca" name="marca" placeholder="Ej. Mercedes-Benz" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="modelo">Modelo *</label>
                        <input className={inputClass} id="modelo" name="modelo" placeholder="Ej. O 500 U" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="patente">Dominio / Patente *</label>
                        <input className={inputClass + " uppercase"} id="patente" name="patente" placeholder="Ej. AB 123 CD" type="text" required />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className={labelClass} htmlFor="titular">Titular *</label>
                        <input className={inputClass} id="titular" name="titular" placeholder="Nombre de la empresa o propietario" type="text" required />
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>2</span>
                    Especificaciones Técnicas
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="asientos">Número de asientos</label>
                        <input className={inputClass} id="asientos" name="asientos" type="number" min="0" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="largo">Largo del coche</label>
                        <input className={inputClass} id="largo" name="largo" placeholder="Ej. 12m" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="ano_fabricacion">Año de fabricación</label>
                        <input className={inputClass} id="ano_fabricacion" name="ano_fabricacion" type="number" min="1900" max="2100" placeholder="YYYY" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="tipo_motor">Tipo de motor</label>
                        <select className={inputClass} id="tipo_motor" name="tipo_motor" defaultValue="">
                            <option disabled value="">Seleccionar</option>
                            <option value="diesel">Diésel</option>
                            <option value="gnc">GNC</option>
                            <option value="electrico">Eléctrico</option>
                            <option value="hibrido">Híbrido</option>
                        </select>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className={labelClass} htmlFor="tipo_combustible">Tipo de combustible</label>
                        <select className={inputClass} id="tipo_combustible" name="tipo_combustible" defaultValue="">
                            <option disabled value="">Seleccionar</option>
                            <option value="gasoil_grado_2">Gasoil Grado 2</option>
                            <option value="gasoil_grado_3">Gasoil Grado 3</option>
                            <option value="gas_natural">Gas Natural</option>
                            <option value="electricidad">Electricidad</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>3</span>
                    Documentación y Vencimientos
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="vencimiento_vtv">Vencimiento VTV</label>
                        <input className={inputClass} id="vencimiento_vtv" name="vencimiento_vtv" type="date" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="numero_poliza">Número de Póliza de Seguro</label>
                        <input className={inputClass} id="numero_poliza" name="numero_poliza" placeholder="Ej. POL-987654321" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="vencimiento_poliza">Vencimiento Póliza</label>
                        <input className={inputClass} id="vencimiento_poliza" name="vencimiento_poliza" type="date" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pb-12">
                <button
                    type="button"
                    onClick={(e) => e.currentTarget.form.reset()}
                    className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Guardando…' : 'Guardar Registro'}
                </button>
            </div>
        </form>
    )
}
```

**Step 2:** Commit.

```bash
git add src/pages/RegistroVehiculos/RegistroColectivoVehiculos.jsx
git commit -m "feat(registro-vehiculos): form colectivo con submit al backend y estilo municipal"
```

---

### Task 7: Crear página Registro Transporte Especializado

**Files:**
- Create: `src/pages/RegistroVehiculos/RegistroEspecializadoVehiculos.jsx`

**Step 1:** Mismo patrón — form completo con submit.

```jsx
import { useState } from 'react'

const sectionClass = "bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
const titleClass = "flex items-center gap-3 text-blue-700 font-semibold text-lg mb-6"
const numberClass = "w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold"
const labelClass = "block text-xs font-medium text-slate-600 mb-1.5"
const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"

export default function RegistroEspecializadoVehiculos() {
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setMessage(null)
        const fd = new FormData(e.currentTarget)
        const data = Object.fromEntries(fd.entries())

        try {
            const res = await fetch('/api/registro-vehiculos/especializados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Error')
            setMessage({ type: 'success', text: `Registro guardado correctamente (ID #${json.id})` })
            e.currentTarget.reset()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-slate-900">Registro de Transporte Especializado</h1>

            {message && (
                <div className={`p-4 rounded-lg border ${
                    message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>1</span>
                    Datos Particulares y Vehiculares
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="apellido">Apellido *</label>
                        <input className={inputClass} id="apellido" name="apellido" placeholder="Ej. González" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="dni">D.N.I. *</label>
                        <input className={inputClass} id="dni" name="dni" placeholder="Sin puntos ni espacios" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="dominio">Dominio (Patente) *</label>
                        <input className={inputClass + " uppercase"} id="dominio" name="dominio" placeholder="AA 123 BB" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="marca">Marca *</label>
                        <input className={inputClass} id="marca" name="marca" placeholder="Ej. Toyota" type="text" required />
                    </div>
                    <div className="flex flex-col lg:col-span-2">
                        <label className={labelClass} htmlFor="modelo">Modelo *</label>
                        <input className={inputClass} id="modelo" name="modelo" placeholder="Ej. Corolla XEI 2.0" type="text" required />
                    </div>
                    <div className="flex flex-col md:col-span-2 lg:col-span-3">
                        <label className={labelClass} htmlFor="observaciones">Observaciones</label>
                        <textarea className={inputClass + " resize-none h-24"} id="observaciones" name="observaciones" placeholder="Detalles adicionales..." />
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>2</span>
                    Datos Resolutivos
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="licencia">Licencia *</label>
                        <input className={inputClass} id="licencia" name="licencia" placeholder="N° de Licencia" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="resolucion">Resolución *</label>
                        <input className={inputClass} id="resolucion" name="resolucion" placeholder="N° Resolución" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="fecha_resolucion">Fecha Resolución *</label>
                        <input className={inputClass} id="fecha_resolucion" name="fecha_resolucion" type="date" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="tipo_servicio">Tipo Servicio *</label>
                        <select className={inputClass} id="tipo_servicio" name="tipo_servicio" required defaultValue="">
                            <option disabled value="">Seleccione un tipo</option>
                            <option value="auto">Auto</option>
                            <option value="taxi">Taxi</option>
                            <option value="remis">Remis</option>
                            <option value="transporte_escolar">Transporte Escolar</option>
                        </select>
                    </div>
                    <div className="flex flex-col lg:col-span-2">
                        <label className={labelClass} htmlFor="parada">Parada en</label>
                        <input className={inputClass} id="parada" name="parada" placeholder="Ubicación asignada" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="fecha_vto_vtv">Fecha Vto. VTV</label>
                        <input className={inputClass} id="fecha_vto_vtv" name="fecha_vto_vtv" type="date" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="fecha_vto_seguro">Fecha Vto. Seguro</label>
                        <input className={inputClass} id="fecha_vto_seguro" name="fecha_vto_seguro" type="date" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="numero_poliza">Póliza N°</label>
                        <input className={inputClass} id="numero_poliza" name="numero_poliza" placeholder="Número de póliza" type="text" />
                    </div>
                    <div className="flex flex-col md:col-span-2 lg:col-span-3 pt-4 border-t border-slate-100">
                        <label className={labelClass} htmlFor="fecha_habilitacion">Fecha de Habilitación</label>
                        <div className="w-full md:w-1/3">
                            <input className={inputClass} id="fecha_habilitacion" name="fecha_habilitacion" type="date" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>3</span>
                    Datos de la Empresa
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="flex flex-col lg:col-span-2">
                        <label className={labelClass} htmlFor="empresa">Empresa *</label>
                        <input className={inputClass} id="empresa" name="empresa" placeholder="Razón Social" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="propietario">Propietario *</label>
                        <input className={inputClass} id="propietario" name="propietario" placeholder="Nombre del Propietario" type="text" required />
                    </div>
                    <div className="flex flex-col md:col-span-2 lg:col-span-3">
                        <label className={labelClass} htmlFor="direccion">Dirección *</label>
                        <input className={inputClass} id="direccion" name="direccion" placeholder="Calle, Número, Localidad" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="movil">Móvil (Asignación)</label>
                        <input className={inputClass} id="movil" name="movil" placeholder="N° Interno/Móvil" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="telefono">Teléfono Contacto</label>
                        <input className={inputClass} id="telefono" name="telefono" placeholder="Cod. Área + Número" type="tel" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pb-12">
                <button
                    type="button"
                    onClick={(e) => e.currentTarget.form.reset()}
                    className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Guardando…' : 'Guardar Registro'}
                </button>
            </div>
        </form>
    )
}
```

**Step 2:** Commit.

```bash
git add src/pages/RegistroVehiculos/RegistroEspecializadoVehiculos.jsx
git commit -m "feat(registro-vehiculos): form transporte especializado con submit al backend"
```

---

### Task 8: Registrar rutas en App.jsx

**Files:**
- Modify: `src/App.jsx`

**Step 1:** Agregar imports (después de los existentes, antes del bloque `import { allNavigationLinks }`).

```jsx
import RegistroVehiculosLayout from './pages/RegistroVehiculos/RegistroVehiculosLayout'
import HomeVehiculos from './pages/RegistroVehiculos/HomeVehiculos'
import RegistroColectivoVehiculos from './pages/RegistroVehiculos/RegistroColectivoVehiculos'
import RegistroEspecializadoVehiculos from './pages/RegistroVehiculos/RegistroEspecializadoVehiculos'
```

**Step 2:** Agregar las rutas (después de la última ruta existente, antes de `<Route path="*"`).

```jsx
{/* REGISTRO VEHICULOS - RUTA OCULTA (no aparece en navigationData) */}
<Route path="/xcsda" element={<RegistroVehiculosLayout />}>
    <Route index element={<HomeVehiculos />} />
    <Route path="colectivo" element={<RegistroColectivoVehiculos />} />
    <Route path="transporte-especializado" element={<RegistroEspecializadoVehiculos />} />
</Route>
```

**Step 3:** Build de verificación.

```bash
cd "/c/Users/ECO-1/Desktop/municipalidad_page-main (1)/municipalidad_page-main"
npm run build 2>&1 | tail -8
```

Expected: build OK.

**Step 4:** Commit.

```bash
git add src/App.jsx
git commit -m "feat(registro-vehiculos): registrar rutas /xcsda/* (ocultas, sin entry en nav)"
```

---

### Task 9: Verificar build y commit final

**Step 1:** Build completo final.

```bash
cd "/c/Users/ECO-1/Desktop/municipalidad_page-main (1)/municipalidad_page-main"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` sin errores.

**Step 2:** Push.

```bash
git push origin HEAD
```

---

## Resumen de archivos

| Archivo | Acción |
|---|---|
| `server/migrations/2026-08-04-registro-vehiculos.sql` | Crear |
| `server/routes/registroVehiculos.cjs` | Crear |
| `server/index.cjs` | Modificar (agregar 2 líneas) |
| `src/pages/RegistroVehiculos/RegistroVehiculosLayout.jsx` | Crear |
| `src/pages/RegistroVehiculos/HomeVehiculos.jsx` | Crear |
| `src/pages/RegistroVehiculos/RegistroColectivoVehiculos.jsx` | Crear |
| `src/pages/RegistroVehiculos/RegistroEspecializadoVehiculos.jsx` | Crear |
| `src/App.jsx` | Modificar (4 imports + 5 líneas de rutas) |

## Acciones manuales requeridas por el usuario

1. **Ejecutar el SQL en Neon** (`server/migrations/2026-08-04-registro-vehiculos.sql`) — vía panel de Neon o `psql`
2. **Redeploy en Dokploy** después del push para que el backend Express cargue el nuevo router

## Lo que NO se hace (YAGNI)

- Auth/login — la URL oculta es la protección por ahora
- Listado/tabla de registros cargados — solo KPIs en home
- Las 3 páginas placeholder (maintenance/routes/compliance) del zip original
- TypeScript — el sitio usa `.jsx`
- Integración con `navigationData.jsx` — es lo que mantiene las rutas ocultas
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegistroColectivoVehiculos() {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState(null)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [showForm, setShowForm] = useState(false)

    useEffect(() => { loadList() }, [])

    async function loadList() {
        setLoading(true)
        try {
            const res = await fetch('/api/registro-vehiculos/colectivos')
            const data = await res.json()
            setList(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error cargando colectivos:', err)
        } finally {
            setLoading(false)
        }
    }

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
            await loadList()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id, patente) {
        if (!confirm(`¿Eliminar el colectivo con patente ${patente}? Esta acción no se puede deshacer.`)) return
        try {
            const res = await fetch(`/api/registro-vehiculos/colectivos/${id}`, { method: 'DELETE' })
            if (!res.ok) {
                const j = await res.json().catch(() => ({}))
                throw new Error(j.error || 'Error al eliminar')
            }
            setMessage({ type: 'success', text: 'Registro eliminado' })
            await loadList()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        }
    }

    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase()
        if (!q) return list
        return list.filter(c =>
            [c.patente, c.marca, c.modelo, c.titular, c.tipo_vehiculo]
                .filter(Boolean).some(v => v.toLowerCase().includes(q))
        )
    }, [list, filter])

    const fechaCorta = (iso) => {
        if (!iso) return ''
        return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    return (
        <div className="flex flex-col gap-6">
            {/* ─── Header + acciones ─── */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-light text-sky-500">
                        Registro de<br />
                        <span className="text-4xl md:text-5xl font-semibold">Colectivo</span>
                    </h1>
                    <p className="text-slate-600 mt-3 text-sm">
                        Alta y consulta de unidades de transporte colectivo.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(s => !s)}
                    className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-sky-600 transition-all"
                >
                    <span className="material-symbols-outlined text-lg leading-none">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Cancelar' : 'Nuevo registro'}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg border ${
                    message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            {/* ─── Formulario ─── */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-8">
                    <div>
                        <div className="flex items-center gap-3 text-sky-600 font-semibold text-lg mb-6">
                            <span className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold">1</span>
                            Información General
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="tipo_vehiculo">Tipo de vehículo *</label>
                                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="tipo_vehiculo" name="tipo_vehiculo" required defaultValue="">
                                    <option disabled value="">Seleccione un tipo</option>
                                    <option value="urbano">Urbano</option>
                                    <option value="interurbano">Interurbano</option>
                                    <option value="larga_distancia">Larga Distancia</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="marca">Marca *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="marca" name="marca" placeholder="Ej. Mercedes-Benz" type="text" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="modelo">Modelo *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="modelo" name="modelo" placeholder="Ej. O 500 U" type="text" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="patente">Dominio / Patente *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm uppercase" id="patente" name="patente" placeholder="Ej. AB 123 CD" type="text" required />
                            </div>
                            <div className="flex flex-col md:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="titular">Titular *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="titular" name="titular" placeholder="Nombre de la empresa o propietario" type="text" required />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 text-sky-600 font-semibold text-lg mb-6">
                            <span className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold">2</span>
                            Especificaciones Técnicas
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="asientos">Número de asientos</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="asientos" name="asientos" type="number" min="0" />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="largo">Largo del coche</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="largo" name="largo" placeholder="Ej. 12m" type="text" />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="ano_fabricacion">Año de fabricación</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="ano_fabricacion" name="ano_fabricacion" type="number" min="1900" max="2100" placeholder="YYYY" />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="tipo_motor">Tipo de motor</label>
                                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="tipo_motor" name="tipo_motor" defaultValue="">
                                    <option disabled value="">Seleccionar</option>
                                    <option value="diesel">Diésel</option>
                                    <option value="gnc">GNC</option>
                                    <option value="electrico">Eléctrico</option>
                                    <option value="hibrido">Híbrido</option>
                                </select>
                            </div>
                            <div className="flex flex-col md:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="tipo_combustible">Tipo de combustible</label>
                                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="tipo_combustible" name="tipo_combustible" defaultValue="">
                                    <option disabled value="">Seleccionar</option>
                                    <option value="gasoil_grado_2">Gasoil Grado 2</option>
                                    <option value="gasoil_grado_3">Gasoil Grado 3</option>
                                    <option value="gas_natural">Gas Natural</option>
                                    <option value="electricidad">Electricidad</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 text-sky-600 font-semibold text-lg mb-6">
                            <span className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold">3</span>
                            Documentación y Vencimientos
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="vencimiento_vtv">Vencimiento VTV</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="vencimiento_vtv" name="vencimiento_vtv" type="date" />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="numero_poliza">Número de Póliza de Seguro</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="numero_poliza" name="numero_poliza" placeholder="Ej. POL-987654321" type="text" />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="vencimiento_poliza">Vencimiento Póliza</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="vencimiento_poliza" name="vencimiento_poliza" type="date" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={(e) => { e.currentTarget.form.reset(); setShowForm(false) }} className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={submitting} className="px-8 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-sky-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {submitting ? 'Guardando…' : 'Guardar Registro'}
                        </button>
                    </div>
                </form>
            )}

            {/* ─── Listado ─── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sky-500 text-xl leading-none">directions_bus</span>
                        <h2 className="font-semibold text-slate-900">
                            Colectivos registrados
                            <span className="ml-2 text-sm font-normal text-slate-500">({filtered.length})</span>
                        </h2>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg leading-none pointer-events-none">search</span>
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Buscar por patente, marca, modelo o titular…"
                            className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-400">Cargando…</div>
                ) : filtered.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-400">
                        {filter ? 'No hay resultados para la búsqueda.' : 'Sin registros todavía. Usá "Nuevo registro" para agregar uno.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold">ID</th>
                                    <th className="text-left px-4 py-3 font-semibold">Patente</th>
                                    <th className="text-left px-4 py-3 font-semibold">Tipo</th>
                                    <th className="text-left px-4 py-3 font-semibold">Marca / Modelo</th>
                                    <th className="text-left px-4 py-3 font-semibold">Titular</th>
                                    <th className="text-left px-4 py-3 font-semibold">Asientos</th>
                                    <th className="text-left px-4 py-3 font-semibold">Vto. VTV</th>
                                    <th className="text-left px-4 py-3 font-semibold">Fecha reg.</th>
                                    <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 text-slate-500">#{c.id}</td>
                                        <td className="px-4 py-3 font-semibold text-slate-900 uppercase">{c.patente}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-xs font-medium capitalize">
                                                {c.tipo_vehiculo?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-700">{c.marca} {c.modelo}</td>
                                        <td className="px-4 py-3 text-slate-600">{c.titular}</td>
                                        <td className="px-4 py-3 text-slate-600">{c.asientos ?? '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{c.vencimiento_vtv || '—'}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{fechaCorta(c.fecha_registro)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(c.id, c.patente)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <span className="material-symbols-outlined text-base leading-none">delete</span>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
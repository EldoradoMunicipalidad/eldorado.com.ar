import { useState, useEffect, useMemo } from 'react'

export default function RegistroEspecializadoVehiculos() {
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
            const res = await fetch('/api/registro-vehiculos/especializados')
            const data = await res.json()
            setList(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error cargando especializados:', err)
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
            const res = await fetch('/api/registro-vehiculos/especializados', {
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

    async function handleDelete(id, dominio) {
        if (!confirm(`¿Eliminar el vehículo con dominio ${dominio}? Esta acción no se puede deshacer.`)) return
        try {
            const res = await fetch(`/api/registro-vehiculos/especializados/${id}`, { method: 'DELETE' })
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
        return list.filter(v =>
            [v.dominio, v.apellido, v.dni, v.marca, v.modelo, v.empresa, v.tipo_servicio, v.resolucion]
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
                        <span className="text-4xl md:text-5xl font-semibold">Transporte Especializado</span>
                    </h1>
                    <p className="text-slate-600 mt-3 text-sm">
                        Alta y consulta de vehículos taxi, remis, auto y transporte escolar.
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
                            Datos Particulares y Vehiculares
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="apellido">Apellido *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="apellido" name="apellido" placeholder="Ej. González" type="text" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="dni">D.N.I. *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="dni" name="dni" placeholder="Sin puntos ni espacios" type="text" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="dominio">Dominio (Patente) *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm uppercase" id="dominio" name="dominio" placeholder="AA 123 BB" type="text" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="marca">Marca *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="marca" name="marca" placeholder="Ej. Toyota" type="text" required />
                            </div>
                            <div className="flex flex-col lg:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="modelo">Modelo *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="modelo" name="modelo" placeholder="Ej. Corolla XEI 2.0" type="text" required />
                            </div>
                            <div className="flex flex-col md:col-span-2 lg:col-span-3">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="observaciones">Observaciones</label>
                                <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm resize-none h-24" id="observaciones" name="observaciones" placeholder="Detalles adicionales..." />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 text-sky-600 font-semibold text-lg mb-6">
                            <span className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold">2</span>
                            Datos Resolutivos
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="licencia">Licencia *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="licencia" name="licencia" placeholder="N° de Licencia" type="text" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="resolucion">Resolución *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="resolucion" name="resolucion" placeholder="N° Resolución" type="text" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="fecha_resolucion">Fecha Resolución *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="fecha_resolucion" name="fecha_resolucion" type="date" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="tipo_servicio">Tipo Servicio *</label>
                                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="tipo_servicio" name="tipo_servicio" required defaultValue="">
                                    <option disabled value="">Seleccione un tipo</option>
                                    <option value="auto">Auto</option>
                                    <option value="taxi">Taxi</option>
                                    <option value="remis">Remis</option>
                                    <option value="transporte_escolar">Transporte Escolar</option>
                                </select>
                            </div>
                            <div className="flex flex-col lg:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="parada">Parada en</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="parada" name="parada" placeholder="Ubicación asignada" type="text" />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="fecha_vto_vtv">Fecha Vto. VTV</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="fecha_vto_vtv" name="fecha_vto_vtv" type="date" />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="fecha_vto_seguro">Fecha Vto. Seguro</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="fecha_vto_seguro" name="fecha_vto_seguro" type="date" />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="numero_poliza">Póliza N°</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="numero_poliza" name="numero_poliza" placeholder="Número de póliza" type="text" />
                            </div>
                            <div className="flex flex-col md:col-span-2 lg:col-span-3 pt-4 border-t border-slate-100">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="fecha_habilitacion">Fecha de Habilitación</label>
                                <div className="w-full md:w-1/3">
                                    <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="fecha_habilitacion" name="fecha_habilitacion" type="date" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 text-sky-600 font-semibold text-lg mb-6">
                            <span className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold">3</span>
                            Datos de la Empresa
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                            <div className="flex flex-col lg:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="empresa">Empresa *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="empresa" name="empresa" placeholder="Razón Social" type="text" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="propietario">Propietario *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="propietario" name="propietario" placeholder="Nombre del Propietario" type="text" required />
                            </div>
                            <div className="flex flex-col md:col-span-2 lg:col-span-3">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="direccion">Dirección *</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="direccion" name="direccion" placeholder="Calle, Número, Localidad" type="text" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="movil">Móvil (Asignación)</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="movil" name="movil" placeholder="N° Interno/Móvil" type="text" />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="telefono">Teléfono Contacto</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm" id="telefono" name="telefono" placeholder="Cod. Área + Número" type="tel" />
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
                        <span className="material-symbols-outlined text-sky-500 text-xl leading-none">directions_car</span>
                        <h2 className="font-semibold text-slate-900">
                            Transporte especializado registrado
                            <span className="ml-2 text-sm font-normal text-slate-500">({filtered.length})</span>
                        </h2>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg leading-none pointer-events-none">search</span>
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Buscar por dominio, DNI, apellido, empresa…"
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
                                    <th className="text-left px-4 py-3 font-semibold">Dominio</th>
                                    <th className="text-left px-4 py-3 font-semibold">Titular</th>
                                    <th className="text-left px-4 py-3 font-semibold">DNI</th>
                                    <th className="text-left px-4 py-3 font-semibold">Vehículo</th>
                                    <th className="text-left px-4 py-3 font-semibold">Servicio</th>
                                    <th className="text-left px-4 py-3 font-semibold">Resolución</th>
                                    <th className="text-left px-4 py-3 font-semibold">Empresa</th>
                                    <th className="text-left px-4 py-3 font-semibold">Fecha reg.</th>
                                    <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map(v => (
                                    <tr key={v.id} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 text-slate-500">#{v.id}</td>
                                        <td className="px-4 py-3 font-semibold text-slate-900 uppercase">{v.dominio}</td>
                                        <td className="px-4 py-3 text-slate-700">{v.apellido}</td>
                                        <td className="px-4 py-3 text-slate-600">{v.dni}</td>
                                        <td className="px-4 py-3 text-slate-600">{v.marca} {v.modelo}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-xs font-medium capitalize">
                                                {v.tipo_servicio?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{v.resolucion}</td>
                                        <td className="px-4 py-3 text-slate-600 truncate max-w-[180px]">{v.empresa}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{fechaCorta(v.fecha_registro)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(v.id, v.dominio)}
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
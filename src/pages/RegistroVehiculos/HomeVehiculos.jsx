import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function HomeVehiculos() {
    const [stats, setStats] = useState({ colectivos: 0, especializados: 0, loading: true })
    const [recent, setRecent] = useState({ colectivos: [], especializados: [] })

    useEffect(() => {
        Promise.all([
            fetch('/api/registro-vehiculos/colectivos').then(r => r.json()).catch(() => []),
            fetch('/api/registro-vehiculos/especializados').then(r => r.json()).catch(() => []),
        ]).then(([col, esp]) => {
            setStats({ colectivos: col.length, especializados: esp.length, loading: false })
            setRecent({
                colectivos: col.slice(0, 3),
                especializados: esp.slice(0, 3),
            })
        })
    }, [])

    const fechaCorta = (iso) => {
        if (!iso) return ''
        const d = new Date(iso)
        return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    return (
        <div className="flex flex-col gap-8">
            {/* ─── Hero ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
                <div>
                    <h1 className="text-4xl md:text-5xl font-light text-sky-500 leading-tight">
                        Registro<br />
                        <span className="text-5xl md:text-6xl font-semibold">Vehicular</span>
                    </h1>
                </div>
                <div>
                    <p className="text-slate-600 leading-relaxed pl-0 lg:pl-6">
                        Sistema interno de la Municipalidad de Eldorado para la gestión del parque
                        vehicular registrado. Permite cargar y consultar unidades de transporte
                        colectivo y especializado.
                    </p>
                </div>
            </div>

            {/* ─── Accesos rápidos (cards patrón municipal) ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    to="/xcsda/colectivo"
                    className="group bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                        <span className="material-symbols-outlined text-white text-[26px] leading-none">directions_bus</span>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-1.5">
                        Reg. Colectivo
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Alta de unidades de transporte colectivo urbano, interurbano y de larga
                        distancia.
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Total registrados</span>
                        <span className="text-2xl font-bold text-sky-600">
                            {stats.loading ? '—' : stats.colectivos}
                        </span>
                    </div>
                </Link>

                <Link
                    to="/xcsda/transporte-especializado"
                    className="group bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                        <span className="material-symbols-outlined text-white text-[26px] leading-none">directions_car</span>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-1.5">
                        Reg. Transporte Especializado
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Alta de vehículos taxi, remis, auto y transporte escolar con datos
                        resolutivos y habilitación.
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Total registrados</span>
                        <span className="text-2xl font-bold text-sky-600">
                            {stats.loading ? '—' : stats.especializados}
                        </span>
                    </div>
                </Link>
            </div>

            {/* ─── Últimos registros ─── */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Últimos registros</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Colectivos */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-sky-500 text-xl leading-none">directions_bus</span>
                            <h3 className="font-semibold text-slate-900">Colectivos</h3>
                        </div>
                        {recent.colectivos.length === 0 ? (
                            <p className="text-sm text-slate-400 py-4">
                                {stats.loading ? 'Cargando…' : 'Sin registros todavía.'}
                            </p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {recent.colectivos.map(c => (
                                    <li key={c.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">
                                                {c.marca} {c.modelo}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {c.patente} · {c.titular}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-400 shrink-0">
                                            {fechaCorta(c.fecha_registro)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Especializados */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-sky-500 text-xl leading-none">directions_car</span>
                            <h3 className="font-semibold text-slate-900">Transporte Especializado</h3>
                        </div>
                        {recent.especializados.length === 0 ? (
                            <p className="text-sm text-slate-400 py-4">
                                {stats.loading ? 'Cargando…' : 'Sin registros todavía.'}
                            </p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {recent.especializados.map(v => (
                                    <li key={v.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">
                                                {v.apellido} · {v.marca} {v.modelo}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {v.dominio} · {v.tipo_servicio}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-400 shrink-0">
                                            {fechaCorta(v.fecha_registro)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
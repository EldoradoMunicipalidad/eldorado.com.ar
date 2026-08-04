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
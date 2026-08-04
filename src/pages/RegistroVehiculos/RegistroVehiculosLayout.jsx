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
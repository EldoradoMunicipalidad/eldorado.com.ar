import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const SESSION_KEY = 'vehiculo_auth'

export default function RegistroVehiculosLayout() {
    const navigate = useNavigate()
    const [session, setSession] = useState(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const raw = localStorage.getItem(SESSION_KEY)
        if (raw) {
            try {
                setSession(JSON.parse(raw))
            } catch {
                localStorage.removeItem(SESSION_KEY)
            }
        }
        setReady(true)
    }, [])

    function handleLogout() {
        localStorage.removeItem(SESSION_KEY)
        navigate('/xcsda/login', { replace: true })
    }

    // Mientras valida localStorage, no renderiza nada (evita flash)
    if (!ready) return null

    // Si no hay sesión, redirige al login
    if (!session) {
        window.location.replace('/xcsda/login')
        return null
    }

    const navItems = [
        { to: '/xcsda', label: 'Inicio', icon: 'dashboard', end: true },
        { to: '/xcsda/colectivo', label: 'Reg. Colectivo', icon: 'directions_bus' },
        { to: '/xcsda/transporte-especializado', label: 'Reg. Transp. Especializado', icon: 'directions_car' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* ─── Sidebar ─── */}
            <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-screen bg-white border-r border-slate-100 z-20">
                <div className="p-6 flex flex-col h-full">
                    {/* Logo / Branding */}
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-white text-xl leading-none">directions_car</span>
                        </div>
                        <div>
                            <h1 className="text-base font-semibold text-slate-900 leading-tight">Registro Vehicular</h1>
                            <p className="text-xs text-slate-500 leading-tight">Municipalidad de Eldorado</p>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 flex flex-col gap-1">
                        {navItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? 'bg-sky-50 text-sky-600'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined text-xl leading-none">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Sesión / logout */}
                    <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 px-2 text-xs text-slate-500">
                            <span className="material-symbols-outlined text-base leading-none">person</span>
                            <span className="font-semibold text-slate-700">{session.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-xl transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl leading-none">logout</span>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* ─── Contenido ─── */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Franja de gradiente (identidad del sitio) */}
                <div className="h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 shrink-0" />

                {/* Top bar */}
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 shrink-0">
                    <h2 className="text-base font-semibold text-slate-900">
                        Registro Vehicular
                    </h2>
                    <a
                        href="https://eldorado.gob.ar"
                        className="text-xs text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-base leading-none">arrow_back</span>
                        Volver al sitio
                    </a>
                </header>

                {/* Contenido */}
                <main className="flex-1 px-6 md:px-10 py-10 md:py-16">
                    <div className="max-w-7xl mx-auto w-full pb-12">
                        <Outlet />
                    </div>
                </main>

                {/* Footer simple */}
                <footer className="px-6 md:px-10 py-4 border-t border-slate-100 bg-white">
                    <p className="text-xs text-slate-400 text-center">
                        © Municipalidad de Eldorado · Registro Vehicular · Acceso restringido
                    </p>
                </footer>
            </div>
        </div>
    )
}
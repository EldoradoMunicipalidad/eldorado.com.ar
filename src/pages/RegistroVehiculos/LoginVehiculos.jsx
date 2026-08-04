import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginVehiculos() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })
            const json = await res.json()
            if (!res.ok || !json.authenticated) {
                throw new Error(json.error || 'Credenciales inválidas')
            }
            // Guardamos flag de sesión para esta app específica
            localStorage.setItem('vehiculo_auth', JSON.stringify({
                username: json.username,
                ts: Date.now(),
            }))
            navigate('/xcsda', { replace: true })
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center text-white text-base font-bold shadow-md">
                            RV
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">Registro Vehicular</h1>
                            <p className="text-xs text-slate-500">Municipalidad de Eldorado</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-6">Iniciar sesión</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="username">
                                Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                                placeholder="vehiculos"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-4 px-6 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Ingresando…' : 'Ingresar'}
                        </button>
                    </form>

                    <p className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100 text-center">
                        Acceso restringido al personal autorizado
                    </p>
                </div>
            </div>
        </div>
    )
}
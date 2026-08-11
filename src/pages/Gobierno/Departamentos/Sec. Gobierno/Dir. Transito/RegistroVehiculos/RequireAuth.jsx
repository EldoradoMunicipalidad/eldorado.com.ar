import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  authenticateAdmin,
  getStoredAuth,
} from '../../../../../../data/registroVehiculos'

// Wrapper que protege páginas restringidas a usuarios con login.
// Muestra un mini-form de login si no hay sesión, en lugar del contenido.
// Al autenticarse correctamente, recarga la página padre para mostrar el contenido.
export default function RequireAuth({ children, title }) {
    const [auth, setAuth] = useState(getStoredAuth())
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    if (auth) {
        return children
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            const a = await authenticateAdmin(username, password)
            setAuth(a)
        } catch (err) {
            setError(err.message || 'Credenciales inválidas')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-6">
            <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-sky-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zM18 9v2m0 0v2m0-2h2m-2 0h-2" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Acceso restringido</h2>
                <p className="text-sm text-slate-500 mt-1">
                    {title || 'Esta sección requiere inicio de sesión.'}
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="reqUsername">
                        Usuario
                    </label>
                    <input
                        id="reqUsername"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        autoComplete="username"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="reqPassword">
                        Contraseña
                    </label>
                    <input
                        id="reqPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        autoComplete="current-password"
                        required
                    />
                </div>
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-sky-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-500/20 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {submitting ? 'Ingresando…' : 'Ingresar'}
                </button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500">
                ¿No tenés usuario? Contactá al administrador del sistema.
            </p>

            <div className="mt-6 text-center">
                <Link
                    to="/gobierno/secretaria-gobierno/transito-y-transporte/registro-vehiculos"
                    className="text-xs text-sky-600 hover:text-sky-800 hover:underline"
                >
                    ← Volver al índice del módulo
                </Link>
            </div>
        </div>
    )
}

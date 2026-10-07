import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Loader2, LogOut, RefreshCw, Shield } from 'lucide-react'
import { clearCmsAuth, getCmsToken, loginCmsAdmin } from '../../lib/cmsAuth'

const TOPIC_LABELS = {
  general: 'Consultas generales',
  tramites: 'Trámites',
  turnos: 'Turnos',
  reclamos: 'Reclamos',
  ambiente: 'Ambiente',
  preinscripcion: 'Preinscripción comercial',
  contacto: 'Contacto',
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const result = await loginCmsAdmin(username, password)
    setSubmitting(false)
    if (result.ok) onLogin()
    else setError(result.error || 'No se pudo iniciar sesión')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-sky-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Valoraciones de URU</h1>
            <p className="text-sm text-slate-500">Ingresá con tu cuenta municipal</p>
          </div>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Usuario
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" autoComplete="username" required value={username} onChange={event => setUsername(event.target.value)} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Contraseña
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white disabled:opacity-60">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Ingresar
        </button>
      </form>
    </main>
  )
}

export default function UruFeedbackAdminPage() {
  const [authenticated, setAuthenticated] = useState(Boolean(getCmsToken()))
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadSummary = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const token = getCmsToken()
      const response = await fetch('/api/chat/feedback/summary', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (response.status === 401) {
        clearCmsAuth()
        setAuthenticated(false)
        return
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'No se pudieron cargar las valoraciones')
      setRows(data.results || [])
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las valoraciones')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authenticated) return undefined
    const timer = window.setTimeout(() => loadSummary(), 0)
    return () => window.clearTimeout(timer)
  }, [authenticated, loadSummary])

  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />

  const topics = Object.entries(rows.reduce((summary, row) => {
    summary[row.topic] ||= { up: 0, down: 0 }
    summary[row.topic][Number(row.rating) > 0 ? 'up' : 'down'] += Number(row.votes)
    return summary
  }, {}))

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Valoraciones de URU</h1>
            <p className="text-sm text-slate-600">Resumen de los últimos 30 días. No incluye textos de conversaciones.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadSummary} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium disabled:opacity-60">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
            </button>
            <button onClick={() => { clearCmsAuth(); setAuthenticated(false) }} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium">
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        </header>

        {error && <div role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><AlertCircle className="h-4 w-4" />{error}</div>}
        {loading && rows.length === 0 ? (
          <div className="flex items-center gap-2 p-6 text-slate-600"><Loader2 className="h-5 w-5 animate-spin" /> Cargando resumen…</div>
        ) : topics.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Todavía no hay valoraciones registradas.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map(([topic, counts]) => {
              const total = counts.up + counts.down
              const positive = total ? Math.round((counts.up / total) * 100) : 0
              return (
                <section key={topic} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="font-semibold text-slate-900">{TOPIC_LABELS[topic] || topic}</h2>
                  <p className="mt-3 text-3xl font-bold text-slate-800">{total}</p>
                  <p className="text-sm text-slate-500">valoraciones</p>
                  <div className="mt-4 flex justify-between text-sm">
                    <span className="text-emerald-700">👍 {counts.up}</span>
                    <span className="text-rose-700">👎 {counts.down}</span>
                    <span className="text-slate-600">{positive}% positivas</span>
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

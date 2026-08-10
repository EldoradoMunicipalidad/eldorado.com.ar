import React, { useState, useEffect } from 'react'
import SectionLayout from '../../../../../../assets/components/SectionLayout'
import { Section } from '../../../../../../assets/components/Section'
import {
  authenticateAdmin,
  clearStoredAuth,
  getStoredAuth,
  getColectivos,
  getEspecializados,
  deleteColectivo,
  deleteEspecializado,
  getAdmins,
  createAdmin,
  deleteAdmin,
  getConfig,
} from '../../../../../../data/registroVehiculos'

const formatDate = (v) => {
  if (!v) return '—'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const TABS = [
  { key: 'colectivos', label: 'Colectivos' },
  { key: 'especializados', label: 'Transporte Especializado' },
  { key: 'admins', label: 'Administradores' },
  { key: 'config', label: 'Configuración' },
]

const inputClass =
  'w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500'

const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5'

export default function RegistroVehiculosAdminPage() {
  const [auth, setAuth] = useState(getStoredAuth())
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [tab, setTab] = useState('colectivos')
  const [colectivos, setColectivos] = useState([])
  const [especializados, setEspecializados] = useState([])
  const [admins, setAdmins] = useState([])
  const [config, setConfig] = useState({ modulo_pausado: false, permitir_publico: true, notas: '' })
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', nombre: '', email: '' })
  const [adminMsg, setAdminMsg] = useState('')
  const [adminErr, setAdminErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!auth) return
    loadAll()
  }, [auth])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [c, e, a, cfg] = await Promise.all([
        getColectivos(),
        getEspecializados(),
        getAdmins(),
        getConfig(),
      ])
      setColectivos(c)
      setEspecializados(e)
      setAdmins(a)
      setConfig(cfg)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    try {
      const a = await authenticateAdmin(loginForm.username, loginForm.password)
      setAuth(a)
      setLoginForm({ username: '', password: '' })
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setLoggingIn(false)
    }
  }

  const handleLogout = () => {
    clearStoredAuth()
    setAuth(null)
  }

  const handleDeleteColectivo = async (id, patente) => {
    if (!confirm(`¿Eliminar el colectivo con patente ${patente}?`)) return
    try {
      await deleteColectivo(id)
      setColectivos((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  const handleDeleteEsp = async (id, dominio) => {
    if (!confirm(`¿Eliminar el vehículo con dominio ${dominio}?`)) return
    try {
      await deleteEspecializado(id)
      setEspecializados((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setAdminMsg('')
    setAdminErr('')
    if (!newAdmin.username || !newAdmin.password) {
      return setAdminErr('Usuario y contraseña son obligatorios')
    }
    try {
      await createAdmin(newAdmin)
      setNewAdmin({ username: '', password: '', nombre: '', email: '' })
      setAdminMsg('Administrador creado con éxito')
      const a = await getAdmins()
      setAdmins(a)
    } catch (err) {
      setAdminErr(err.message)
    }
  }

  const handleDeleteAdmin = async (username) => {
    if (!confirm(`¿Eliminar al administrador "${username}"?`)) return
    try {
      await deleteAdmin(username)
      setAdmins((prev) => prev.filter((a) => a.username !== username))
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  // ─── LOGIN ─────────────────────────────────────────────────────
  if (!auth) {
    return (
      <>
        <SectionLayout
          title="Panel de"
          highlight="Administración"
          description="Acceso restringido para gestores del Registro de Vehículos."
        />
        <Section>
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Iniciar sesión</h2>
            <p className="text-sm text-slate-500 mb-6">Ingresá tus credenciales para acceder al panel.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="username">Usuario</label>
                <input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
                  className={inputClass}
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  className={inputClass}
                  autoComplete="current-password"
                  required
                />
              </div>
              {loginError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{loginError}</div>
              )}
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-2.5 bg-sky-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-500/20 hover:bg-sky-600 disabled:opacity-50 transition-all"
              >
                {loggingIn ? 'Ingresando…' : 'Ingresar'}
              </button>
            </form>
          </div>
        </Section>
      </>
    )
  }

  // ─── PANEL ─────────────────────────────────────────────────────
  return (
    <>
      <SectionLayout
        title="Panel de"
        highlight="Administración"
        description={`Sesión iniciada como ${auth.username}`}
      />
      <Section>
        <div className="max-w-7xl mx-auto">
          {/* Header bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                    tab === t.key
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl bg-white"
            >
              Cerrar sesión
            </button>
          </div>

          {loading && <div className="text-center text-slate-500 py-8">Cargando…</div>}

          {/* TAB: Colectivos */}
          {tab === 'colectivos' && !loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Colectivos registrados ({colectivos.length})</h3>
              </div>
              {colectivos.length === 0 ? (
                <div className="p-10 text-center text-slate-500">No hay colectivos registrados todavía.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-left">Patente</th>
                        <th className="px-4 py-3 text-left">Marca / Modelo</th>
                        <th className="px-4 py-3 text-left">Tipo</th>
                        <th className="px-4 py-3 text-left">Titular</th>
                        <th className="px-4 py-3 text-left">Asientos</th>
                        <th className="px-4 py-3 text-left">VTV</th>
                        <th className="px-4 py-3 text-left">Póliza</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {colectivos.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{c.patente}</td>
                          <td className="px-4 py-3">{c.marca} {c.modelo}</td>
                          <td className="px-4 py-3 capitalize">{c.tipo_vehiculo?.replace('_', ' ')}</td>
                          <td className="px-4 py-3">{c.titular}</td>
                          <td className="px-4 py-3">{c.asientos || '—'}</td>
                          <td className="px-4 py-3">{formatDate(c.vencimiento_vtv)}</td>
                          <td className="px-4 py-3">{formatDate(c.vencimiento_poliza)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteColectivo(c.id, c.patente)}
                              className="text-red-600 hover:text-red-800 text-xs font-semibold"
                            >
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
          )}

          {/* TAB: Especializados */}
          {tab === 'especializados' && !loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Transporte Especializado ({especializados.length})</h3>
              </div>
              {especializados.length === 0 ? (
                <div className="p-10 text-center text-slate-500">No hay vehículos especializados registrados todavía.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-left">Dominio</th>
                        <th className="px-4 py-3 text-left">Apellido / DNI</th>
                        <th className="px-4 py-3 text-left">Marca / Modelo</th>
                        <th className="px-4 py-3 text-left">Servicio</th>
                        <th className="px-4 py-3 text-left">Empresa</th>
                        <th className="px-4 py-3 text-left">Resolución</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {especializados.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{v.dominio}</td>
                          <td className="px-4 py-3">{v.apellido}<br /><span className="text-xs text-slate-500">{v.dni}</span></td>
                          <td className="px-4 py-3">{v.marca} {v.modelo}</td>
                          <td className="px-4 py-3 capitalize">{v.tipo_servicio?.replace('_', ' ')}</td>
                          <td className="px-4 py-3">{v.empresa}</td>
                          <td className="px-4 py-3">{v.resolucion}<br /><span className="text-xs text-slate-500">{formatDate(v.fecha_resolucion)}</span></td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteEsp(v.id, v.dominio)}
                              className="text-red-600 hover:text-red-800 text-xs font-semibold"
                            >
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
          )}

          {/* TAB: Admins */}
          {tab === 'admins' && !loading && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Agregar administrador</h3>
                <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Usuario"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin((p) => ({ ...p, username: e.target.value }))}
                    className={inputClass}
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Nombre (opcional)"
                    value={newAdmin.nombre}
                    onChange={(e) => setNewAdmin((p) => ({ ...p, nombre: e.target.value }))}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    placeholder="Email (opcional)"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))}
                    className={inputClass}
                  />
                  <div className="md:col-span-2 lg:col-span-4 flex items-center gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-sky-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-500/20 hover:bg-sky-600 transition-all"
                    >
                      Crear admin
                    </button>
                    {adminMsg && <span className="text-sm text-emerald-600">{adminMsg}</span>}
                    {adminErr && <span className="text-sm text-red-600">{adminErr}</span>}
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800">Administradores actuales ({admins.length})</h3>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Usuario</th>
                      <th className="px-4 py-3 text-left">Nombre</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Rol</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {admins.map((a) => (
                      <tr key={a.username} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-semibold">{a.username}</td>
                        <td className="px-4 py-3">{a.nombre || '—'}</td>
                        <td className="px-4 py-3">{a.email || '—'}</td>
                        <td className="px-4 py-3 capitalize">{a.rol || 'admin'}</td>
                        <td className="px-4 py-3 text-right">
                          {a.username !== 'Usuario1' && (
                            <button
                              onClick={() => handleDeleteAdmin(a.username)}
                              className="text-red-600 hover:text-red-800 text-xs font-semibold"
                            >
                              Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Config */}
          {tab === 'config' && !loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Configuración del módulo</h3>
              <pre className="text-xs bg-slate-50 rounded-xl p-4 overflow-x-auto border border-slate-200">
{JSON.stringify(config, null, 2)}
              </pre>
              <p className="mt-3 text-xs text-slate-500">La configuración detallada se gestiona desde la base de datos. Este panel refleja el estado actual.</p>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

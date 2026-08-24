import React, { useState, useEffect } from 'react'
import SectionLayout from '../../../../../../assets/components/SectionLayout'
import { Section } from '../../../../../../assets/components/Section'
import Icon from '../../../../../../assets/Icons/Icon'
import {
  subscribeAppointments,
  getAppointments,
  updateAppointmentStatus,
  authenticateAdmin,
  getConfig,
  saveConfig,
} from '../../../../../../data/turneroEscuelaManejo'

const PAGE_SIZE = 15

export default function TurneroEscuelaManejoAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('escuela_manejo_admin_auth') === 'true'
  )
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [appointments, setAppointments] = useState([])
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [turneroPaused, setTurneroPaused] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedAppts, setPaginatedAppts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalAppts, setTotalAppts] = useState(0)
  const [apptsLoading, setApptsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    if (!loginUser.trim() || !loginPass.trim()) {
      setLoginError('Completá usuario y contraseña')
      return
    }
    const ok = await authenticateAdmin(loginUser.trim(), loginPass)
    if (ok) {
      sessionStorage.setItem('escuela_manejo_admin_auth', 'true')
      setIsAuthenticated(true)
    } else {
      setLoginError('Usuario o contraseña incorrectos')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('escuela_manejo_admin_auth')
    setIsAuthenticated(false)
    setLoginUser('')
    setLoginPass('')
  }

  const handleTogglePause = async () => {
    const newVal = !turneroPaused
    const cfg = await getConfig()
    await saveConfig({ ...cfg, turneroPaused: newVal })
    setTurneroPaused(newVal)
    showMsg(newVal ? 'Inscripciones pausadas' : 'Inscripciones reanudadas')
  }

  useEffect(() => {
      if (!isAuthenticated) return
      const unsubAppts = subscribeAppointments((data) => {
        setAppointments(data)
      })
      getConfig().then((cfg) => setTurneroPaused(cfg.turneroPaused || false))
      setLoading(false)
      return () => unsubAppts()
    }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
    setApptsLoading(true)
    getAppointments(currentPage, PAGE_SIZE, {
      status: filterStatus !== 'all' ? filterStatus : '',
      areaId: '',
      date: filterDate,
    }).then((result) => {
      setPaginatedAppts(result.appointments || [])
      setTotalAppts(result.total || 0)
      setTotalPages(Math.max(1, Math.ceil((result.total || 0) / PAGE_SIZE)))
      setApptsLoading(false)
    })
  }, [currentPage, filterDate, filterStatus, isAuthenticated])

  useEffect(() => {
    setCurrentPage(1)
  }, [filterDate, filterStatus])

  const showMsg = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700',
      attended: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-600',
    }
    const labels = { pending: 'Pendiente', attended: 'Atendido', cancelled: 'Cancelado' }
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  const handleMarkAttended = (apptId) => {
    updateAppointmentStatus(apptId, 'attended')
  }

  const handleCancelAppointment = (apptId) => {
    updateAppointmentStatus(apptId, 'cancelled')
  }

  if (!isAuthenticated) {
    return (
      <>
        <SectionLayout
          title="Acceso"
          highlight="Administrativo"
          description="Ingresá con tu usuario y contraseña para gestionar las inscripciones a la Escuela de Manejo."
        />
        <section className="bg-gray-50 py-10 flex justify-center">
          <div className="w-[95%] max-w-md">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="settingsAlertIcon" size={32} className="text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Panel de Administración</h3>
                <p className="text-sm text-slate-500 mt-1">Escuela de Manejo · Ingresá tus credenciales</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                  <input
                    type="text"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="admin"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="••••••"
                  />
                </div>
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                    <Icon name="warningIcon" size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
                >
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </section>
      </>
    )
  }

  if (loading) {
    return <SectionLayout title="Panel de" highlight="Administración" description="Cargando..." />
  }

  return (
    <>
      <SectionLayout
        title="Panel de"
        highlight="Administración"
        description="Gestioná las inscripciones y revisá los turnos solicitados para la Escuela de Manejo — Autódromo km 4."
      >
        <div className="flex flex-wrap gap-2 mt-6 items-center">
          <div className="flex-1" />
          <button
            onClick={handleTogglePause}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-colors ${
              turneroPaused
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
            title={turneroPaused ? 'Reanudar inscripciones' : 'Pausar inscripciones'}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${turneroPaused ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {turneroPaused ? 'Reanudar' : 'Pausar'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
            title="Cerrar sesión"
          >
            <Icon name="closeIcon" size={18} />
            Salir
          </button>
        </div>
      </SectionLayout>

      {message && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse">
          {message}
        </div>
      )}

      <Section>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Inscripciones a la Escuela de Manejo</h3>

          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="attended">Atendidos</option>
              <option value="cancelled">Cancelados</option>
            </select>
            {(filterDate || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setFilterDate('')
                  setFilterStatus('all')
                }}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-sm hover:bg-slate-50"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-bold text-sky-600">{appointments.length}</div>
              <div className="text-xs text-slate-500 mt-1">Total</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {appointments.filter((a) => a.status === 'pending').length}
              </div>
              <div className="text-xs text-slate-500 mt-1">Pendientes</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {appointments.filter((a) => a.status === 'attended').length}
              </div>
              <div className="text-xs text-slate-500 mt-1">Atendidos</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-bold text-red-500">
                {appointments.filter((a) => a.status === 'cancelled').length}
              </div>
              <div className="text-xs text-slate-500 mt-1">Cancelados</div>
            </div>
          </div>

          {apptsLoading ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Cargando inscripciones...</p>
            </div>
          ) : paginatedAppts.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center">
              <Icon name="eventBusyIcon" size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No hay inscripciones con los filtros seleccionados</p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <th className="text-left px-4 py-3">N°</th>
                      <th className="text-left px-4 py-3">Alumno</th>
                      <th className="text-left px-4 py-3">DNI</th>
                      <th className="text-left px-4 py-3">Teléfono</th>
                      <th className="text-left px-4 py-3">Fecha</th>
                      <th className="text-left px-4 py-3">Hora</th>
                      <th className="text-left px-4 py-3">Clases</th>
                      <th className="text-left px-4 py-3">Vehículo</th>
                      <th className="text-left px-4 py-3">Estado</th>
                      <th className="text-left px-4 py-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedAppts.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">
                          {appt.id?.slice(0, 8) || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <div className="font-medium text-slate-800">
                            {appt.apellido}, {appt.nombre}
                          </div>
                          <div className="text-xs text-slate-500">{appt.email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono">{appt.dni}</td>
                        <td className="px-4 py-3 text-slate-600">{appt.telefono}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {appt.date
                            ? new Date(appt.date + 'T12:00:00').toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                              })
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{appt.time || '—'}</td>
                        <td className="px-4 py-3 text-slate-600 text-center">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {appt.cantidadClases || 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-center">
                          {appt.vehiculoPropio ? (
                            <span className="text-emerald-600" title="Sí">✓</span>
                          ) : (
                            <span className="text-slate-400" title="No">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          —
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(appt.status)}</td>
                        <td className="px-4 py-3">
                          {appt.status === 'pending' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleMarkAttended(appt.id)}
                                className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-colors"
                              >
                                Atendido
                              </button>
                              <button
                                onClick={() => handleCancelAppointment(appt.id)}
                                className="px-2.5 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-1">
                  <span className="text-sm text-slate-500">
                    Página {currentPage} de {totalPages} ({totalAppts} turnos)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        currentPage <= 1
                          ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ‹
                    </button>

                    {(() => {
                      const pages = []
                      const startPage = Math.max(1, currentPage - 2)
                      const endPage = Math.min(totalPages, currentPage + 2)
                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => setCurrentPage(1)}
                            className="w-8 h-8 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
                          >
                            1
                          </button>
                        )
                        if (startPage > 2) {
                          pages.push(<span key="dots-start" className="text-slate-300 text-xs">···</span>)
                        }
                      }
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium border transition-colors ${
                              i === currentPage
                                ? 'bg-sky-500 text-white border-sky-500'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {i}
                          </button>
                        )
                      }
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(<span key="dots-end" className="text-slate-300 text-xs">···</span>)
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-8 h-8 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
                          >
                            {totalPages}
                          </button>
                        )
                      }
                      return pages
                    })()}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        currentPage >= totalPages
                          ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
    </>
  )
}
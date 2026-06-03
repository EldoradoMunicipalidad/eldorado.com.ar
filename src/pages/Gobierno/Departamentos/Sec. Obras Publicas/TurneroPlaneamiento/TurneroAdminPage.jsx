import React, { useState, useMemo, useEffect } from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { Section } from '../../../../../assets/components/Section'
import Icon from '../../../../../assets/Icons/Icon'
import {
  subscribeAreas,
  subscribeAppointments,
  saveArea,
  deleteArea,
  updateAppointmentStatus,
  authenticateAdmin,
  getConfig,
  saveConfig,
  DAYS_OF_WEEK,
} from '../../../../../data/turneroFirebase'

const TABS = [
  { id: 'areas', label: 'Áreas', icon: 'appsIcon' },
  { id: 'turnos', label: 'Turnos', icon: 'calendarIcon' },
]

const emptyArea = {
  name: '',
  description: '',
  icon: 'assignmentIcon',
  active: true,
  days: [1, 2, 3, 4, 5],
  interval: 40,
  slotsPerDay: 8,
  startTime: '07:00',
  endTime: '13:00',
}

const COLORS = [
  'bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-indigo-500',
  'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-lime-500',
]

export default function TurneroAdminPage() {
  const [tab, setTab] = useState('areas')
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('turnero_admin_auth') === 'true')
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [areas, setAreas] = useState([])
  const [appointments, setAppointments] = useState([])
  const [editingArea, setEditingArea] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [filterArea, setFilterArea] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [message, setMessage] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [turneroPaused, setTurneroPaused] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')
    if (!loginUser.trim() || !loginPass.trim()) {
      setLoginError('Completá usuario y contraseña')
      return
    }
    if (authenticateAdmin(loginUser.trim(), loginPass)) {
      sessionStorage.setItem('turnero_admin_auth', 'true')
      setIsAuthenticated(true)
    } else {
      setLoginError('Usuario o contraseña incorrectos')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('turnero_admin_auth')
    setIsAuthenticated(false)
    setLoginUser('')
    setLoginPass('')
  }

  const handleTogglePause = async () => {
    const newVal = !turneroPaused
    const cfg = await getConfig()
    await saveConfig({ ...cfg, turneroPaused: newVal })
    setTurneroPaused(newVal)
    showMsg(newVal ? 'Turnero pausado' : 'Turnero reanudado')
  }

  useEffect(() => {
    const unsubAreas = subscribeAreas((data) => {
      setAreas(data)
      setLoading(false)
    })
    const unsubAppts = subscribeAppointments((data) => {
      setAppointments(data)
    })
    getConfig().then((cfg) => setTurneroPaused(cfg.turneroPaused || false))
    return () => { unsubAreas(); unsubAppts() }
  }, [])

  const showMsg = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleToggleActive = async (areaId) => {
    const area = areas.find((a) => a.id === areaId)
    if (area) {
      await saveArea({ ...area, active: !area.active })
    }
  }

  const handleSaveArea = async () => {
    if (!editingArea?.name?.trim()) {
      showMsg('El nombre del área es obligatorio')
      return
    }
    const isNew = !areas.find((a) => a.id === editingArea.id)
    const areaToSave = {
      ...editingArea,
      name: editingArea.name.trim(),
      description: editingArea.description.trim(),
    }
    if (isNew) {
      areaToSave.color = COLORS[areas.length % COLORS.length]
    }
    await saveArea(areaToSave)
    setEditingArea(null)
    setShowAddForm(false)
    showMsg('Área guardada correctamente')
  }

  const handleDeleteArea = async (areaId) => {
    await deleteArea(areaId)
    setShowDeleteConfirm(null)
    showMsg('Área eliminada')
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

  const filteredAppointments = useMemo(() => {
    let apps = [...appointments]
    if (filterArea !== 'all') apps = apps.filter((a) => a.areaId === filterArea)
    if (filterDate) apps = apps.filter((a) => a.date === filterDate)
    if (filterStatus !== 'all') apps = apps.filter((a) => a.status === filterStatus)
    return apps.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0
      const bTime = b.createdAt?.toMillis?.() || 0
      return bTime - aTime
    })
  }, [appointments, filterArea, filterDate, filterStatus])

  if (!isAuthenticated) {
    return (
      <>
        <SectionLayout
          title="Acceso"
          highlight="Administrativo"
          description="Ingresá con tu usuario y contraseña para gestionar el sistema de turnos."
        />
        <section className="bg-gray-50 py-10 flex justify-center">
          <div className="w-[95%] max-w-md">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="settingsAlertIcon" size={32} className="text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Panel de Administración</h3>
                <p className="text-sm text-slate-500 mt-1">Ingresá tus credenciales</p>
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
        description="Gestioná las áreas, configurá días y horarios, y revisá los turnos solicitados para la Dirección de Planeamiento."
      >
        <div className="flex gap-2 mt-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                tab === t.id
                  ? 'bg-white text-sky-600 shadow-sm border border-slate-200'
                  : 'bg-white/50 text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
            >
              <Icon name={t.icon} size={18} />
              {t.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={handleTogglePause}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-colors ${
              turneroPaused
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
            title={turneroPaused ? 'Reanudar turnero' : 'Pausar turnero'}
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
        <div className="max-w-5xl mx-auto">
          {/* TAB: AREAS */}
          {tab === 'areas' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Áreas de Atención</h3>
                <button
                  onClick={() => {
                    setEditingArea({ ...emptyArea, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) })
                    setShowAddForm(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition-colors"
                >
                  <Icon name="addIcon" size={18} />
                  Agregar Área
                </button>
              </div>

              <div className="space-y-3">
                {areas.map((area) => (
                  <div
                    key={area.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                      area.active ? 'border-slate-200' : 'border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="p-5 flex items-start gap-4">
                      <div className={`w-12 h-12 ${area.color || 'bg-slate-400'} rounded-xl flex items-center justify-center shadow-sm shrink-0`}>
                        <Icon name={area.icon || 'assignmentIcon'} size={22} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-800">{area.name}</h4>
                          {!area.active && (
                            <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">Oculta</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1 mb-2">{area.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="bg-slate-50 px-2 py-1 rounded-lg">
                            {area.interval} min entre turnos
                          </span>
                          <span className="bg-slate-50 px-2 py-1 rounded-lg">
                            {area.slotsPerDay} turnos/día
                          </span>
                          <span className="bg-slate-50 px-2 py-1 rounded-lg">
                            {area.startTime} - {area.endTime}
                          </span>
                          <span className="bg-slate-50 px-2 py-1 rounded-lg">
                            {area.days?.map((d) => {
                              const name = DAYS_OF_WEEK.find((dw) => dw.value === d)?.label
                              return name ? name.charAt(0) : ''
                            }).join(' · ') || ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleActive(area.id)}
                          className={`w-10 h-6 rounded-full transition-colors relative ${
                            area.active ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                              area.active ? 'translate-x-[18px]' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => { setEditingArea({ ...area }); setShowAddForm(true) }}
                          className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                          title="Editar"
                        >
                          <Icon name="editIcon" size={20} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(area.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Icon name="deleteSweepIcon" size={20} />
                        </button>
                      </div>
                    </div>

                    {showDeleteConfirm === area.id && (
                      <div className="px-5 pb-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                          <span className="text-sm text-red-700">
                            ¿Eliminar <strong>{area.name}</strong>? También se eliminarán los turnos de esta área.
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteArea(area.id)}
                              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600"
                            >
                              Eliminar
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-white"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add/Edit Area Form Modal */}
              {showAddForm && editingArea && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-10 px-4">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                      <h3 className="text-lg font-bold text-slate-800">
                        {areas.find((a) => a.id === editingArea.id) ? 'Editar Área' : 'Nueva Área'}
                      </h3>
                      <button onClick={() => { setShowAddForm(false); setEditingArea(null) }} className="p-1 text-slate-400 hover:text-slate-600">
                        <Icon name="closeIcon" size={24} />
                      </button>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del área *</label>
                          <input
                            type="text"
                            value={editingArea.name}
                            onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                          <textarea
                            value={editingArea.description}
                            onChange={(e) => setEditingArea({ ...editingArea, description: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Intervalo (minutos)</label>
                          <select
                            value={editingArea.interval}
                            onChange={(e) => setEditingArea({ ...editingArea, interval: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                          >
                            {[20, 30, 40, 45, 60, 90].map((v) => (
                              <option key={v} value={v}>{v} min</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Turnos por día</label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={editingArea.slotsPerDay}
                            onChange={(e) => setEditingArea({ ...editingArea, slotsPerDay: Math.max(1, Number(e.target.value)) })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Horario inicio</label>
                          <input
                            type="time"
                            value={editingArea.startTime}
                            onChange={(e) => setEditingArea({ ...editingArea, startTime: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Horario fin</label>
                          <input
                            type="time"
                            value={editingArea.endTime}
                            onChange={(e) => setEditingArea({ ...editingArea, endTime: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Días de atención</label>
                          <div className="flex flex-wrap gap-2">
                            {DAYS_OF_WEEK.filter((d) => d.value > 0 && d.value < 6).map((day) => {
                              const selected = (editingArea.days || []).includes(day.value)
                              return (
                                <button
                                  key={day.value}
                                  onClick={() => {
                                    const days = selected
                                      ? (editingArea.days || []).filter((d) => d !== day.value)
                                      : [...(editingArea.days || []), day.value]
                                    setEditingArea({ ...editingArea, days: days.sort() })
                                  }}
                                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                                    selected
                                      ? 'bg-sky-50 border-sky-300 text-sky-700'
                                      : 'bg-white border-slate-200 text-slate-500 hover:border-sky-200'
                                  }`}
                                >
                                  {day.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                      <button
                        onClick={() => { setShowAddForm(false); setEditingArea(null) }}
                        className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveArea}
                        className="px-5 py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: TURNOS */}
          {tab === 'turnos' && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-6">Turnos Solicitados</h3>

              <div className="flex flex-wrap gap-3 mb-6">
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  <option value="all">Todas las áreas</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                  ))}
                </select>
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
                {(filterArea !== 'all' || filterDate || filterStatus !== 'all') && (
                  <button
                    onClick={() => { setFilterArea('all'); setFilterDate(''); setFilterStatus('all') }}
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
                  <div className="text-2xl font-bold text-amber-600">{appointments.filter(a => a.status === 'pending').length}</div>
                  <div className="text-xs text-slate-500 mt-1">Pendientes</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{appointments.filter(a => a.status === 'attended').length}</div>
                  <div className="text-xs text-slate-500 mt-1">Atendidos</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <div className="text-2xl font-bold text-red-500">{appointments.filter(a => a.status === 'cancelled').length}</div>
                  <div className="text-xs text-slate-500 mt-1">Cancelados</div>
                </div>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center">
                  <Icon name="eventBusyIcon" size={48} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No hay turnos con los filtros seleccionados</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <th className="text-left px-4 py-3">N°</th>
                        <th className="text-left px-4 py-3">Área</th>
                        <th className="text-left px-4 py-3">Persona</th>
                        <th className="text-left px-4 py-3">DNI</th>
                        <th className="text-left px-4 py-3">Teléfono</th>
                        <th className="text-left px-4 py-3">Fecha</th>
                        <th className="text-left px-4 py-3">Hora</th>
                        <th className="text-left px-4 py-3">Estado</th>
                        <th className="text-left px-4 py-3">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-slate-400">
                            {appt.id?.slice(0, 8) || '—'}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">{appt.areaName}</td>
                          <td className="px-4 py-3 text-slate-700">{appt.apellido}, {appt.nombre}</td>
                          <td className="px-4 py-3 text-slate-600 font-mono">{appt.dni}</td>
                          <td className="px-4 py-3 text-slate-600">{appt.telefono}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {appt.date ? new Date(appt.date + 'T12:00:00').toLocaleDateString('es-AR', {
                              day: '2-digit', month: '2-digit', year: '2-digit'
                            }) : '—'}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{appt.time || '—'}</td>
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
              )}
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

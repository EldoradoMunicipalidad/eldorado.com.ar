import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { Section } from '../../../../../assets/components/Section'
import Icon from '../../../../../assets/Icons/Icon'
import {
  subscribeAreas,
  subscribeAppointments,
  createAppointment,
  getConfig,
  generateTimeSlots,
  getAvailableDates,
  getTodayAppointmentsCount,
  getTodayAreaIds,
  getDayName,
} from '../../../../../data/turneroPostgres'

const STEPS = ['Tus Datos', 'Seleccionar Áreas', 'Elegir Fecha', 'Elegir Horarios', 'Confirmar']

const initialForm = {
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  email: '',
  direccion: '',
}

export default function TurneroPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [selectedAreas, setSelectedAreas] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimes, setSelectedTimes] = useState({})
  const [error, setError] = useState('')
  const [confirmedAppts, setConfirmedAppts] = useState(null)
  const [areas, setAreas] = useState([])
  const [appointments, setAppointments] = useState([])
  const [config, setConfig] = useState({ maxPerDay: 3, turneroPaused: false })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Real-time subscriptions
  useEffect(() => {
    const unsubAreas = subscribeAreas((data) => {
      setAreas(data)
      setLoading(false)
    })
    const unsubAppts = subscribeAppointments((data) => {
      setAppointments(data)
    })
    getConfig().then(setConfig)
    return () => { unsubAreas(); unsubAppts() }
  }, [])

  const activeAreas = areas.filter((a) => a.active)

  const goToStep = (s) => {
    setError('')
    if (s <= 1) { setSelectedAreas([]); setSelectedTimes({}) }
    if (s <= 2) { setSelectedDate(null); setSelectedTimes({}) }
    if (s <= 3) setSelectedTimes({})
    setStep(s)
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const validatePersonalData = () => {
    if (!form.nombre.trim()) return 'Ingresá tu nombre'
    if (!form.apellido.trim()) return 'Ingresá tu apellido'
    if (!form.dni.trim() || !/^\d{7,9}$/.test(form.dni.trim())) return 'Ingresá un DNI válido (7-9 dígitos)'
    if (!form.telefono.trim()) return 'Ingresá tu teléfono'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Ingresá un email válido'
    if (!form.direccion.trim()) return 'Ingresá tu dirección'
    return ''
  }

  const handleStep1Submit = () => {
    const err = validatePersonalData()
    if (err) { setError(err); return }
    const count = getTodayAppointmentsCount(form.dni, appointments)
    if (count >= config.maxPerDay) {
      setError(`Ya solicitaste ${config.maxPerDay} turnos hoy. No podés solicitar más.`)
      return
    }
    goToStep(1)
  }

  // ─── Multi-area selection ────────────────────────────
  const todayAreaIds = useMemo(() => getTodayAreaIds(form.dni, appointments), [form.dni, appointments])

  const handleToggleArea = (area) => {
    setError('')

    // If already selected, remove it
    if (selectedAreas.some((a) => a.id === area.id)) {
      const newSelected = selectedAreas.filter((a) => a.id !== area.id)
      setSelectedAreas(newSelected)
      // Clean up associated time
      setSelectedTimes((prev) => {
        const { [area.id]: _, ...rest } = prev
        return rest
      })
      return
    }

    // Check if already has a turno in this area today
    if (todayAreaIds.has(area.id)) {
      setError('Ya tenés un turno en ' + area.name + ' hoy. Seleccioná otra área.')
      return
    }

    // Max 3 areas
    if (selectedAreas.length >= 3) {
      setError('Podés seleccionar hasta 3 áreas como máximo.')
      return
    }

    setSelectedAreas([...selectedAreas, area])
  }

  // Available dates = intersection of all selected areas' available dates
  const availableDates = useMemo(() => {
    if (selectedAreas.length === 0) return []
    const dateSets = selectedAreas.map((area) => new Set(getAvailableDates(area, 30)))
    // Intersection of all date sets
    const reference = dateSets[0]
    const intersection = []
    for (const dateStr of reference) {
      if (dateSets.every((ds) => ds.has(dateStr))) {
        intersection.push(dateStr)
      }
    }
    return intersection.sort()
  }, [selectedAreas])

  // Time slots for each area on the selected date
  const timeSlotsByArea = useMemo(() => {
    if (!selectedDate) return {}
    const result = {}
    for (const area of selectedAreas) {
      result[area.id] = generateTimeSlots(
        area.startTime,
        area.endTime,
        area.interval,
        selectedDate,
        area.id,
        appointments
      )
    }
    return result
  }, [selectedAreas, selectedDate, appointments])

  const allTimesChosen = useMemo(() => {
    return selectedAreas.length > 0 && selectedAreas.every((a) => selectedTimes[a.id])
  }, [selectedAreas, selectedTimes])

  const getAppointmentsLimit = useCallback(() => {
    return config.maxPerDay - getTodayAppointmentsCount(form.dni, appointments)
  }, [config.maxPerDay, form.dni, appointments])

  // ─── Confirm all appointments ────────────────────────
  const handleConfirmAll = async () => {
    setSubmitting(true)
    setError('')

    const remaining = getAppointmentsLimit()
    if (selectedAreas.length > remaining) {
      setError(`Solo podés solicitar ${remaining} turno(s) más hoy. Seleccioná menos áreas.`)
      setSubmitting(false)
      return
    }

    const results = []
    for (const area of selectedAreas) {
      const apptId = await createAppointment({
        areaId: area.id,
        areaName: area.name,
        date: selectedDate,
        time: selectedTimes[area.id],
        ...form,
      })
      if (apptId) {
        results.push({
          id: apptId,
          areaId: area.id,
          areaName: area.name,
          date: selectedDate,
          time: selectedTimes[area.id],
          ...form,
          status: 'pending',
        })
      } else {
        setError(`Error al guardar el turno para "${area.name}". Los turnos anteriores se guardaron correctamente.`)
        break
      }
    }

    setSubmitting(false)
    if (results.length > 0) {
      setConfirmedAppts(results)
    }
  }

  // ─── RENDER: Paused ──────────────────────────────────
  if (config.turneroPaused) {
    return (
      <>
        <SectionLayout
          title="Sistema de"
          highlight="Turnos"
          description="Reservá tu turno para trámites de la Dirección de Planeamiento."
        />
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 shadow-sm">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="eventBusyIcon" size={40} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">Turnos no disponibles</h3>
              <p className="text-amber-600 mb-6">
                Por el momento no se están otorgando turnos. Pronto estaremos habilitando nuevos horarios. Consultá nuevamente más tarde.
              </p>
              <button
                onClick={() => navigate('/gobierno/secretaria-obras-publicas/planeamiento')}
                className="px-6 py-3 border border-amber-300 text-amber-700 rounded-xl font-semibold hover:bg-amber-100 transition-colors"
              >
                Volver a Planeamiento
              </button>
            </div>
          </div>
        </Section>
      </>
    )
  }

  // ─── RENDER: Loading ─────────────────────────────────
  if (loading) {
    return (
      <SectionLayout title="Sistema de" highlight="Turnos" description="Cargando..." />
    )
  }

  // ─── RENDER: Confirmed ───────────────────────────────
  if (confirmedAppts) {
    return (
      <>
        <SectionLayout
          title="Turnos"
          highlight="Confirmados"
          description={confirmedAppts.length > 1
            ? `Tus ${confirmedAppts.length} turnos fueron registrados correctamente.`
            : 'Tu turno fue registrado correctamente.'}
        />
        <Section>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="checkCircleIcon" size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Turno{confirmedAppts.length > 1 ? 's' : ''} Confirmado{confirmedAppts.length > 1 ? 's' : ''}!</h3>
              <p className="text-slate-500 mb-6">Presentate en la Dirección de Planeamiento</p>

              <div className="space-y-4 mb-6">
                {confirmedAppts.map((appt, idx) => (
                  <div key={appt.id} className="bg-slate-50 rounded-xl p-5 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{appt.areaName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400 text-xs block">Fecha</span>
                        <span className="font-medium text-slate-700">
                          {new Date(appt.date + 'T12:00:00').toLocaleDateString('es-AR', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Horario</span>
                        <span className="font-medium text-slate-700">{appt.time} hs</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-slate-50 rounded-xl p-4 text-left">
                  <div className="text-xs text-slate-400 uppercase font-medium mb-1">Persona</div>
                  <div className="font-semibold text-slate-800">{confirmedAppts[0].apellido}, {confirmedAppts[0].nombre}</div>
                  <div className="text-sm text-slate-500">DNI: {confirmedAppts[0].dni}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setConfirmedAppts(null)
                    setForm(initialForm)
                    setSelectedAreas([])
                    setSelectedDate(null)
                    setSelectedTimes({})
                    setStep(0)
                  }}
                  className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
                >
                  Solicitar otro turno
                </button>
                <button
                  onClick={() => navigate('/gobierno/secretaria-obras-publicas/planeamiento')}
                  className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Volver a Planeamiento
                </button>
              </div>
            </div>
          </div>
        </Section>
      </>
    )
  }

  // ─── RENDER: Main ────────────────────────────────────
  return (
    <>
      <SectionLayout
        title="Sistema de"
        highlight="Turnos"
        description="Reservá tu turno para trámites de la Dirección de Planeamiento. Podés solicitar hasta 3 turnos por día de áreas distintas."
      >
        <div className="flex items-center gap-2 mt-4">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  i === step
                    ? 'bg-sky-500 text-white'
                    : i < step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${i === step ? 'text-sky-600 font-semibold' : 'text-slate-400'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>
      </SectionLayout>

      <Section>
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
              <Icon name="warningIcon" size={20} className="text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 0: Personal Data */}
          {step === 0 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Tus Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellido *</label>
                  <input
                    type="text"
                    value={form.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">DNI *</label>
                  <input
                    type="text"
                    value={form.dni}
                    onChange={(e) => handleChange('dni', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="12345678"
                    maxLength={9}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono *</label>
                  <input
                    type="text"
                    value={form.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="3751-123456"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dirección *</label>
                  <input
                    type="text"
                    value={form.direccion}
                    onChange={(e) => handleChange('direccion', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="Calle y número"
                  />
                </div>
              </div>
              <button
                onClick={handleStep1Submit}
                className="mt-6 w-full md:w-auto px-8 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 1: Select Areas (multi-select up to 3) */}
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-800">Seleccioná las Áreas</h3>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  selectedAreas.length >= 3
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-sky-50 text-sky-600'
                }`}>
                  {selectedAreas.length}/3 seleccionadas
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Elegí hasta 3 áreas donde querés realizar tus trámites. Cada área tendrá su propio horario.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAreas.map((area) => {
                  const isSelected = selectedAreas.some((a) => a.id === area.id)
                  const isDisabled = !isSelected && selectedAreas.length >= 3
                  const hasTurnoToday = todayAreaIds.has(area.id)
                  return (
                    <button
                      key={area.id}
                      onClick={() => !hasTurnoToday && handleToggleArea(area)}
                      disabled={hasTurnoToday}
                      className={`group relative bg-white p-5 rounded-2xl border flex items-start gap-4 text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200 shadow-sm'
                          : isDisabled
                            ? 'border-slate-100 opacity-60 cursor-not-allowed'
                            : hasTurnoToday
                              ? 'border-slate-100 opacity-50 cursor-not-allowed'
                              : 'border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1'
                      }`}
                    >
                      {/* Selection indicator */}
                      {isSelected ? (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          ✓
                        </div>
                      ) : null}

                      <div className={`w-12 h-12 ${area.color} rounded-xl flex items-center justify-center shadow-sm shrink-0 ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-sky-100' : ''
                      }`}>
                        <Icon name={area.icon} size={22} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 mb-0.5">{area.name}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{area.description}</p>
                        {hasTurnoToday && (
                          <span className="inline-block mt-1.5 text-xs text-amber-600 font-medium">
                            Ya tenés turno hoy
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between mt-6">
                <button onClick={() => goToStep(0)} className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                  ← Volver a datos personales
                </button>
                <button
                  onClick={() => {
                    if (selectedAreas.length === 0) {
                      setError('Seleccioná al menos un área.')
                      return
                    }
                    goToStep(2)
                  }}
                  className="px-6 py-2.5 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50"
                  disabled={selectedAreas.length === 0}
                >
                  Continuar ({selectedAreas.length} área{selectedAreas.length !== 1 ? 's' : ''})
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Date (shared for all selected areas) */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Elegí una Fecha</h3>
              <p className="text-slate-500 text-sm mb-6">
                Fecha disponible para <strong>todas las áreas seleccionadas</strong>
              </p>

              {/* Selected areas summary */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedAreas.map((area) => (
                  <span key={area.id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${area.color} text-white text-xs font-medium rounded-full`}>
                    <Icon name={area.icon} size={12} />
                    {area.name}
                  </span>
                ))}
              </div>

              {availableDates.length === 0 ? (
                <div className="p-8 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-center">
                  No hay fechas comunes disponibles para las áreas seleccionadas. Probá seleccionando otras áreas.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {availableDates.map((dateStr) => {
                    const d = new Date(dateStr + 'T12:00:00')
                    const dayName = getDayName(d.getDay())
                    const dayNum = d.getDate()
                    const month = d.toLocaleDateString('es-AR', { month: 'short' })
                    const isSelected = selectedDate === dateStr
                    return (
                      <button
                        key={dateStr}
                        onClick={() => { setSelectedDate(dateStr); setSelectedTimes({}); setError(''); goToStep(3) }}
                        className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200'
                            : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="text-xs text-slate-400 uppercase font-medium">{dayName}</div>
                        <div className="text-2xl font-bold text-slate-800 my-1">{dayNum}</div>
                        <div className="text-xs text-slate-500 capitalize">{month}</div>
                      </button>
                    )
                  })}
                </div>
              )}
              <button onClick={() => goToStep(1)} className="mt-6 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                ← Cambiar áreas
              </button>
            </div>
          )}

          {/* Step 3: Select Time for Each Area */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Elegí un Horario para Cada Área</h3>
              <p className="text-slate-500 text-sm mb-2">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="text-xs text-slate-400 mb-6">
                Seleccioná un horario disponible para cada área
              </p>

              <div className="space-y-6">
                {selectedAreas.map((area, idx) => {
                  const slots = timeSlotsByArea[area.id] || []
                  const chosen = selectedTimes[area.id]
                  const available = slots.filter((s) => s.available)
                  return (
                    <div key={area.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-7 h-7 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className={`w-8 h-8 ${area.color} rounded-lg flex items-center justify-center shrink-0`}>
                          <Icon name={area.icon} size={16} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-800">{area.name}</h4>
                        {chosen && (
                          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                            {chosen} hs
                          </span>
                        )}
                      </div>

                      {available.length === 0 ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm text-center">
                          No hay horarios disponibles para esta fecha.
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {slots.map((slot) => (
                            <button
                              key={slot.time}
                              disabled={!slot.available}
                              onClick={() => {
                                setSelectedTimes((prev) => ({ ...prev, [area.id]: slot.time }))
                                setError('')
                              }}
                              className={`p-2.5 rounded-xl border text-center text-sm font-medium transition-all ${
                                !slot.available
                                  ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                                  : chosen === slot.time
                                    ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-200'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:shadow-sm'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mt-6">
                <button onClick={() => goToStep(2)} className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                  ← Cambiar fecha
                </button>
                <button
                  onClick={() => {
                    if (!allTimesChosen) {
                      setError('Seleccioná un horario para cada área.')
                      return
                    }
                    goToStep(4)
                  }}
                  className="px-6 py-2.5 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50"
                  disabled={!allTimesChosen}
                >
                  Revisar y confirmar
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm All */}
          {step === 4 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Confirmar Turnos</h3>

              <div className="space-y-4 mb-6">
                {selectedAreas.map((area, idx) => (
                  <div key={area.id} className="bg-slate-50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${area.color}`} />
                      <span className="font-semibold text-slate-800">{area.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-slate-400 block mb-0.5">Fecha</span>
                        <span className="font-medium text-slate-700">
                          {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
                            weekday: 'long', day: 'numeric', month: 'long'
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block mb-0.5">Horario</span>
                        <span className="font-medium text-slate-700">{selectedTimes[area.id]} hs</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs text-slate-400 uppercase font-medium mb-1">Titular</div>
                  <div className="font-semibold text-slate-800">{form.apellido}, {form.nombre}</div>
                  <div className="text-sm text-slate-500">DNI: {form.dni} | Tel: {form.telefono}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <button
                  onClick={() => goToStep(3)}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  ← Cambiar horarios
                </button>
                <button
                  onClick={handleConfirmAll}
                  disabled={submitting}
                  className={`px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                    submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-600'
                  }`}
                >
                  {submitting ? (
                    <>Guardando...</>
                  ) : (
                    <>Confirmar {selectedAreas.length} turno{selectedAreas.length !== 1 ? 's' : ''}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

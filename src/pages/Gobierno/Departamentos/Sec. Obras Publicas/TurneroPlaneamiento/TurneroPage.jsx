import React, { useState, useMemo, useEffect } from 'react'
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

const STEPS = ['Tus Datos', 'Seleccionar Área', 'Elegir Fecha', 'Elegir Horario', 'Confirmar']

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
  const [selectedArea, setSelectedArea] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [error, setError] = useState('')
  const [confirmedAppt, setConfirmedAppt] = useState(null)
  const [areas, setAreas] = useState([])
  const [appointments, setAppointments] = useState([])
  const [config, setConfig] = useState({ maxPerDay: 3, turneroPaused: false })
  const [loading, setLoading] = useState(true)

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
    if (s <= 1) setSelectedArea(null)
    if (s <= 2) { setSelectedDate(null); setSelectedTime(null) }
    if (s <= 3) setSelectedTime(null)
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

  const handleAreaSelect = (area) => {
    const todayAreas = getTodayAreaIds(form.dni, appointments)
    if (todayAreas.has(area.id)) {
      setError('Ya tenés un turno en esta área hoy. Seleccioná otra área.')
      return
    }
    setSelectedArea(area)
    setError('')
    goToStep(2)
  }

  const availableDates = useMemo(() => {
    if (!selectedArea) return []
    return getAvailableDates(selectedArea, 30)
  }, [selectedArea])

  const timeSlots = useMemo(() => {
    if (!selectedArea || !selectedDate) return []
    return generateTimeSlots(
      selectedArea.startTime,
      selectedArea.endTime,
      selectedArea.interval,
      selectedDate,
      selectedArea.id,
      appointments
    )
  }, [selectedArea, selectedDate, appointments])

  const handleConfirm = async () => {
    const apptId = await createAppointment({
      areaId: selectedArea.id,
      areaName: selectedArea.name,
      date: selectedDate,
      time: selectedTime,
      ...form,
    })
    if (apptId) {
      setConfirmedAppt({
        id: apptId,
        areaId: selectedArea.id,
        areaName: selectedArea.name,
        date: selectedDate,
        time: selectedTime,
        ...form,
        status: 'pending',
      })
    } else {
      setError('Error al guardar el turno. Intentá de nuevo.')
    }
  }

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

  if (loading) {
    return (
      <SectionLayout title="Sistema de" highlight="Turnos" description="Cargando..." />
    )
  }

  if (confirmedAppt) {
    return (
      <>
        <SectionLayout
          title="Turno"
          highlight="Confirmado"
          description="Tu turno fue registrado correctamente."
        />
        <Section>
          <div className="max-w-xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="checkCircleIcon" size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Turno Confirmado!</h3>
              <p className="text-slate-500 mb-6">Presentate en la Dirección de Planeamiento</p>

              <div className="bg-slate-50 rounded-xl p-6 text-left space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Área</span>
                  <span className="font-semibold text-slate-800">{confirmedAppt.areaName}</span>
                </div>
                <div className="border-t border-slate-200" />
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(confirmedAppt.date + 'T12:00:00').toLocaleDateString('es-AR', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="border-t border-slate-200" />
                <div className="flex justify-between">
                  <span className="text-slate-500">Horario</span>
                  <span className="font-semibold text-slate-800">{confirmedAppt.time} hs</span>
                </div>
                <div className="border-t border-slate-200" />
                <div className="flex justify-between">
                  <span className="text-slate-500">Persona</span>
                  <span className="font-semibold text-slate-800">{confirmedAppt.apellido}, {confirmedAppt.nombre}</span>
                </div>
                <div className="border-t border-slate-200" />
                <div className="flex justify-between">
                  <span className="text-slate-500">DNI</span>
                  <span className="font-semibold text-slate-800">{confirmedAppt.dni}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setConfirmedAppt(null)
                    setForm(initialForm)
                    setSelectedArea(null)
                    setSelectedDate(null)
                    setSelectedTime(null)
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

          {/* Step 1: Select Area */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Seleccioná el Área</h3>
              <p className="text-slate-500 text-sm mb-6">Elegí el área donde querés realizar tu trámite</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAreas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => handleAreaSelect(area)}
                    className="group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 ${area.color} rounded-xl flex items-center justify-center shadow-sm shrink-0`}>
                      <Icon name={area.icon} size={22} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-0.5">{area.name}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{area.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => goToStep(0)} className="mt-6 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                ← Volver a datos personales
              </button>
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Elegí una Fecha</h3>
              <p className="text-slate-500 text-sm mb-6">
                Turnos disponibles para <strong>{selectedArea?.name}</strong>
              </p>
              {availableDates.length === 0 ? (
                <div className="p-8 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-center">
                  No hay fechas disponibles para esta área. Consultá la configuración del administrador.
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
                        onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); setError(''); goToStep(3) }}
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
                ← Cambiar área
              </button>
            </div>
          )}

          {/* Step 3: Select Time */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Elegí un Horario</h3>
              <p className="text-slate-500 text-sm mb-2">
                <strong>{selectedArea?.name}</strong> — {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="text-xs text-slate-400 mb-6">
                Intervalo de {selectedArea?.interval} minutos entre turnos
              </p>
              {timeSlots.filter(s => s.available).length === 0 ? (
                <div className="p-8 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-center">
                  No hay horarios disponibles para esta fecha. Seleccioná otra fecha.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => { setSelectedTime(slot.time); setError(''); goToStep(4) }}
                      className={`p-3 rounded-xl border text-center font-medium transition-all ${
                        !slot.available
                          ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                          : selectedTime === slot.time
                            ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-200'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:shadow-sm'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => goToStep(2)} className="mt-6 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                ← Cambiar fecha
              </button>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Confirmar Turno</h3>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs text-slate-400 uppercase font-medium mb-1">Área</div>
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedArea?.color}`} />
                      {selectedArea?.name}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs text-slate-400 uppercase font-medium mb-1">Fecha</div>
                    <div className="font-semibold text-slate-800">
                      {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs text-slate-400 uppercase font-medium mb-1">Horario</div>
                    <div className="font-semibold text-slate-800">{selectedTime} hs</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs text-slate-400 uppercase font-medium mb-1">Persona</div>
                    <div className="font-semibold text-slate-800">{form.apellido}, {form.nombre}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs text-slate-400 uppercase font-medium mb-1">DNI</div>
                    <div className="font-semibold text-slate-800">{form.dni}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs text-slate-400 uppercase font-medium mb-1">Email</div>
                    <div className="font-semibold text-slate-800">{form.email}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleConfirm}
                  className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Confirmar Turno
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

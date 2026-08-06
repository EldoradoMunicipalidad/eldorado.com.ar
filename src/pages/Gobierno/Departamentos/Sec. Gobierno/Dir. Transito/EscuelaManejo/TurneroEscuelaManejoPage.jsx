import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionLayout from '../../../../../../assets/components/SectionLayout'
import { Section } from '../../../../../../assets/components/Section'
import Icon from '../../../../../../assets/Icons/Icon'
import {
  subscribeAreas,
  subscribeAppointments,
  createAppointment,
  getConfig,
  generateTimeSlots,
  getAvailableDates,
  getTodayAppointmentsCount,
  getDayName,
  meetsMinAge,
} from '../../../../../../data/turneroEscuelaManejo'

const STEPS = ['Tus Datos', 'Elegí Día y Horario', 'Confirmar']

const initialForm = {
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  email: '',
  fechaNacimiento: '',
  vehiculoPropio: false,
  cantidadClases: 6,
}

export default function TurneroEscuelaManejoPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [area, setArea] = useState(null) // single area (Autódromo km 4)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [archivo, setArchivo] = useState(null) // File object (no se sube hasta confirmar)
  const [error, setError] = useState('')
  const [confirmedAppt, setConfirmedAppt] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [config, setConfig] = useState({ maxPerDay: 1, turneroPaused: false })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Real-time subscriptions
  useEffect(() => {
    const unsubAreas = subscribeAreas((data) => {
      // Single-area: tomamos la primera activa
      const firstActive = data.find((a) => a.active) || data[0]
      setArea(firstActive)
      setLoading(false)
    })
    const unsubAppts = subscribeAppointments((data) => {
      setAppointments(data)
    })
    getConfig().then(setConfig)
    return () => {
      unsubAreas()
      unsubAppts()
    }
  }, [])

  const goToStep = (s) => {
    setError('')
    if (s <= 0) setSelectedDate(null)
    if (s <= 1) setSelectedTime(null)
    setStep(s)
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleArchivo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo imágenes (JPG, PNG, GIF, WebP) o PDF.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo supera el máximo de 10 MB.')
      return
    }
    setArchivo(file)
    setError('')
  }

  const removeArchivo = () => {
    setArchivo(null)
  }

  const validatePersonalData = () => {
    if (!form.nombre.trim()) return 'Ingresá tu nombre'
    if (!form.apellido.trim()) return 'Ingresá tu apellido'
    if (!form.dni.trim() || !/^\d{7,9}$/.test(form.dni.trim())) return 'Ingresá un DNI válido (7-9 dígitos)'
    if (!form.telefono.trim()) return 'Ingresá tu teléfono'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Ingresá un email válido'
    if (!form.fechaNacimiento) return 'Ingresá tu fecha de nacimiento'
    if (!meetsMinAge(form.fechaNacimiento)) {
      return 'Necesitás tener al menos 16 años y 6 meses para inscribirte.'
    }
    if (!form.cantidadClases || form.cantidadClases < 1 || form.cantidadClases > 6) {
      return 'La cantidad de clases debe estar entre 1 y 6'
    }
    if (!archivo) return 'Adjuntá la documentación básica'
    return ''
  }

  const handleStep1Submit = () => {
    const err = validatePersonalData()
    if (err) {
      setError(err)
      return
    }
    // Límite por persona/día
    const count = getTodayAppointmentsCount(form.dni, appointments)
    if (count >= config.maxPerDay) {
      setError(`Ya solicitaste ${config.maxPerDay} turno hoy. No podés solicitar más.`)
      return
    }
    goToStep(1)
  }

  const availableDates = useMemo(() => {
    if (!area) return []
    return getAvailableDates(area, 30)
  }, [area])

  const timeSlots = useMemo(() => {
    if (!area || !selectedDate) return []
    return generateTimeSlots(area.startTime, area.endTime, area.interval, selectedDate, area.id, appointments)
  }, [area, selectedDate, appointments])

  const handleConfirm = async () => {
    if (!area || !selectedDate || !selectedTime) return
    setSubmitting(true)
    setError('')
    try {
      const result = await createAppointment(
        {
          areaId: area.id,
          areaName: area.name,
          date: selectedDate,
          time: selectedTime,
          ...form,
        },
        archivo
      )
      setSubmitting(false)
      if (result?.id) {
        setConfirmedAppt({
          id: result.id,
          areaId: area.id,
          areaName: area.name,
          date: selectedDate,
          time: selectedTime,
          ...form,
          archivoUrl: result.archivoUrl,
          status: 'pending',
        })
      } else {
        setError('No se pudo registrar el turno. Intentá de nuevo.')
      }
    } catch (e) {
      setSubmitting(false)
      setError(e.message || 'Error al guardar el turno')
    }
  }

  // ─── RENDER: Paused ────────────────────────────────
  if (!loading && config.turneroPaused) {
    return (
      <>
        <SectionLayout
          title="Escuela de"
          highlight="Manejo"
          description="Inscripción a las clases prácticas de manejo en el Autódromo km 4."
        />
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 shadow-sm">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="eventBusyIcon" size={40} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">Inscripciones no disponibles</h3>
              <p className="text-amber-600 mb-6">
                Por el momento no se están otorgando turnos para la Escuela de Manejo. Consultá nuevamente más tarde.
              </p>
              <button
                onClick={() =>
                  navigate('/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias/escuela-manejo')
                }
                className="px-6 py-3 border border-amber-300 text-amber-700 rounded-xl font-semibold hover:bg-amber-100 transition-colors"
              >
                Volver a Escuela de Manejo
              </button>
            </div>
          </div>
        </Section>
      </>
    )
  }

  // ─── RENDER: Loading ───────────────────────────────
  if (loading) {
    return <SectionLayout title="Escuela de" highlight="Manejo" description="Cargando..." />
  }

  // ─── RENDER: Confirmed ─────────────────────────────
  if (confirmedAppt) {
    return (
      <>
        <SectionLayout
          title="Inscripción"
          highlight="Confirmada"
          description="Tu turno fue registrado correctamente. Presentate en el Autódromo km 4."
        />
        <Section>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="checkCircleIcon" size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Inscripción confirmada!</h3>
              <p className="text-slate-500 mb-6">
                {confirmedAppt.cantidadClases} {confirmedAppt.cantidadClases === 1 ? 'clase' : 'clases'} en el{' '}
                <strong>Autódromo km 4</strong>
              </p>

              <div className="space-y-4 mb-6 text-left">
                <div className="bg-slate-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="directionsCarIcon" size={18} className="text-rose-600" />
                    <span className="font-semibold text-slate-800">Detalles del turno</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400 text-xs block">Fecha</span>
                      <span className="font-medium text-slate-700">
                        {new Date(confirmedAppt.date + 'T12:00:00').toLocaleDateString('es-AR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs block">Horario</span>
                      <span className="font-medium text-slate-700">{confirmedAppt.time} hs</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs block">Cantidad de clases</span>
                      <span className="font-medium text-slate-700">{confirmedAppt.cantidadClases}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs block">Vehículo propio</span>
                      <span className="font-medium text-slate-700">
                        {confirmedAppt.vehiculoPropio ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs text-slate-400 uppercase font-medium mb-1">Alumno</div>
                  <div className="font-semibold text-slate-800">
                    {confirmedAppt.apellido}, {confirmedAppt.nombre}
                  </div>
                  <div className="text-sm text-slate-500">DNI: {confirmedAppt.dni}</div>
                  <div className="text-sm text-slate-500">Tel: {confirmedAppt.telefono}</div>
                  <div className="text-sm text-slate-500">{confirmedAppt.email}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setConfirmedAppt(null)
                    setForm(initialForm)
                    setSelectedDate(null)
                    setSelectedTime(null)
                    setArchivo(null)
                    setStep(0)
                  }}
                  className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
                >
                  Solicitar otro turno
                </button>
                <button
                  onClick={() =>
                    navigate('/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias/escuela-manejo')
                  }
                  className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Volver a Escuela de Manejo
                </button>
              </div>
            </div>
          </div>
        </Section>
      </>
    )
  }

  // ─── RENDER: Main ──────────────────────────────────
  return (
    <>
      <SectionLayout
        title="Escuela de"
        highlight="Manejo"
        description="Reservá tu turno para clases prácticas de manejo en el Autódromo km 4. Edad mínima: 16 años y 6 meses."
      >
        <div className="flex items-center gap-2 mt-4">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  i === step
                    ? 'bg-rose-500 text-white'
                    : i < step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${i === step ? 'text-rose-600 font-semibold' : 'text-slate-400'}`}>
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

          {/* Step 0: Personal Data + Adjunto */}
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
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellido *</label>
                  <input
                    type="text"
                    value={form.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">DNI *</label>
                  <input
                    type="text"
                    value={form.dni}
                    onChange={(e) => handleChange('dni', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="12345678"
                    maxLength={9}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="3751-123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de nacimiento *</label>
                  <input
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Mínimo 16 años y 6 meses</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad de clases *</label>
                  <select
                    value={form.cantidadClases}
                    onChange={(e) => handleChange('cantidadClases', parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'clase' : 'clases'}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Hasta 6 clases por persona</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.vehiculoPropio}
                      onChange={(e) => handleChange('vehiculoPropio', e.target.checked)}
                      className="w-5 h-5 text-rose-500 border-slate-300 rounded focus:ring-rose-500"
                    />
                    <div>
                      <div className="font-medium text-slate-800">¿Tenés vehículo propio?</div>
                      <div className="text-xs text-slate-500">Marcá esta opción si vas a traer tu vehículo para las prácticas.</div>
                    </div>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Documentación básica *</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
                    onChange={handleArchivo}
                    className="block w-full text-sm text-slate-700 border border-slate-300 rounded-xl cursor-pointer focus:outline-none file:mr-3 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:bg-rose-500 file:text-white file:font-semibold hover:file:bg-rose-600"
                  />
                  <p className="text-xs text-slate-500 mt-1">Imágenes (JPG, PNG, GIF, WebP) o PDF. Máximo 10 MB.</p>
                  {archivo && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-sm">
                      <Icon name="descriptionIcon" size={16} className="text-slate-500" />
                      <span className="flex-1 truncate text-slate-700">{archivo.name}</span>
                      <button
                        type="button"
                        onClick={removeArchivo}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleStep1Submit}
                className="mt-6 w-full md:w-auto px-8 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 1: Elegir día y horario */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Elegí día y horario</h3>
              <p className="text-slate-500 text-sm mb-6">
                Autódromo km 4 · Lunes a viernes · 14 a 18 hs · 2 alumnos por hora
              </p>

              {!selectedDate && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {availableDates.length === 0 ? (
                    <div className="col-span-full p-8 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-center">
                      No hay fechas disponibles. Probá de nuevo en otro momento.
                    </div>
                  ) : (
                    availableDates.map((dateStr) => {
                      const d = new Date(dateStr + 'T12:00:00')
                      const dayName = getDayName(d.getDay())
                      const dayNum = d.getDate()
                      const month = d.toLocaleDateString('es-AR', { month: 'short' })
                      return (
                        <button
                          key={dateStr}
                          onClick={() => {
                            setSelectedDate(dateStr)
                            setSelectedTime(null)
                            setError('')
                          }}
                          className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                            selectedDate === dateStr
                              ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200'
                              : 'border-slate-200 bg-white hover:border-rose-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="text-xs text-slate-400 uppercase font-medium">{dayName}</div>
                          <div className="text-2xl font-bold text-slate-800 my-1">{dayNum}</div>
                          <div className="text-xs text-slate-500 capitalize">{month}</div>
                        </button>
                      )
                    })
                  )}
                </div>
              )}

              {selectedDate && (
                <div>
                  <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs text-rose-600 font-medium uppercase">Fecha elegida</div>
                      <div className="font-semibold text-slate-800">
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Cambiar
                    </button>
                  </div>

                  <h4 className="font-semibold text-slate-800 mb-3">Elegí un horario</h4>

                  {timeSlots.length === 0 || timeSlots.every((s) => !s.available) ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm text-center">
                      No hay horarios disponibles para esta fecha. Elegí otra fecha.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => {
                            setSelectedTime(slot.time)
                            setError('')
                          }}
                          className={`p-2.5 rounded-xl border text-center text-sm font-medium transition-all ${
                            !slot.available
                              ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                              : selectedTime === slot.time
                                ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:shadow-sm'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => goToStep(0)}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  ← Volver a datos personales
                </button>
                <button
                  onClick={() => {
                    if (!selectedDate) {
                      setError('Elegí una fecha.')
                      return
                    }
                    if (!selectedTime) {
                      setError('Elegí un horario.')
                      return
                    }
                    goToStep(2)
                  }}
                  disabled={!selectedDate || !selectedTime}
                  className="px-6 py-2.5 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  Revisar y confirmar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmar */}
          {step === 2 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Confirmar Inscripción</h3>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="directionsCarIcon" size={18} className="text-rose-600" />
                    <span className="font-semibold text-slate-800">{area?.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-400 block">Fecha</span>
                      <span className="font-medium text-slate-700">
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Horario</span>
                      <span className="font-medium text-slate-700">{selectedTime} hs</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Cantidad de clases</span>
                      <span className="font-medium text-slate-700">{form.cantidadClases}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Vehículo propio</span>
                      <span className="font-medium text-slate-700">{form.vehiculoPropio ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs text-slate-400 uppercase font-medium mb-1">Alumno</div>
                  <div className="font-semibold text-slate-800">
                    {form.apellido}, {form.nombre}
                  </div>
                  <div className="text-sm text-slate-500">
                    DNI: {form.dni} · Tel: {form.telefono} · {form.email}
                  </div>
                </div>

                {archivo && (
                  <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-2">
                    <Icon name="descriptionIcon" size={18} className="text-slate-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-400 uppercase font-medium">Documentación adjunta</div>
                      <div className="text-sm text-slate-700 truncate">{archivo.name}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <button
                  onClick={() => goToStep(1)}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  ← Cambiar día u horario
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className={`px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                    submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-600'
                  }`}
                >
                  {submitting ? 'Enviando documentación…' : 'Confirmar Inscripción'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}
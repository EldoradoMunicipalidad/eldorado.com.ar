import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  CircleCheck,
  AlertCircle,
  Loader2,
  Lightbulb,
  TriangleAlert,
  Trash2,
  Footprints,
  TrafficCone,
  Trees,
  VolumeX,
  Send,
  ArrowRight,
  ArrowLeft,
  ClipboardCopy,
  CheckCheck,
  ExternalLink,
} from 'lucide-react'
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore'
import { guardarReclamo, generarCodigo, getCategorias, CATEGORIAS_POR_DEFECTO } from '../../lib/reclamos'
import MapPicker from '../../assets/components/Reclamos/MapPicker'
import FileUpload from '../../assets/components/Reclamos/FileUpload'

const ICON_MAP = {
  Lightbulb,
  TriangleAlert,
  Trash2,
  Footprints,
  TrafficCone,
  Trees,
  VolumeX,
  AlertCircle,
}

const STEPS = [
  { id: 1, label: 'Datos del reclamo' },
  { id: 2, label: 'Ubicación' },
  { id: 3, label: 'Confirmación' },
]

export default function ReportarReclamoPage() {
  const navigate = useNavigate()

  // ─── State ──────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1)
  const [categorias, setCategorias] = useState(CATEGORIAS_POR_DEFECTO)
  const [formData, setFormData] = useState({
    categoria: '',
    titulo: '',
    descripcion: '',
    direccion: '',
    lat: '',
    lng: '',
    fotos: [],
    email: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)
  const [codigoGenerado, setCodigoGenerado] = useState('')
  const [codigoCopiado, setCodigoCopiado] = useState(false)

  // ─── Cargar categorías desde Firestore ──────────────
  useEffect(() => {
    async function load() {
      try {
        const data = await getCategorias()
        if (data && data.length > 0) setCategorias(data)
      } catch {
        // fallback a por defecto
      }
    }
    load()
  }, [])

  // ─── Manejo de campos ──────────────────────────────
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev }
        delete next[field]
        return next
      }
      return prev
    })
  }, [])

  const handlePositionChange = useCallback(
    (lat, lng) => {
      setFormData((prev) => ({ ...prev, lat: String(lat), lng: String(lng) }))
    },
    []
  )

  // ─── Validación ────────────────────────────────────
  const validateStep = (step) => {
    const errs = {}
    if (step === 1) {
      if (!formData.categoria) errs.categoria = 'Seleccioná una categoría'
      if (!formData.titulo.trim()) errs.titulo = 'El título es obligatorio'
      if (!formData.descripcion.trim()) errs.descripcion = 'La descripción es obligatoria'
    } else if (step === 2) {
      if (!formData.direccion.trim()) errs.direccion = 'Ingresá la dirección'
      if (!formData.lat || !formData.lng) errs.ubicacion = 'Seleccioná la ubicación en el mapa'
    } else if (step === 3) {
      if (!formData.email.trim()) errs.email = 'Ingresá tu correo electrónico'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errs.email = 'Ingresá un correo electrónico válido'
    }
    return errs
  }

  // ─── Navegación entre pasos ───────────────────────
  const handleNext = () => {
    const errs = validateStep(currentStep)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrev = () => {
    setErrors({})
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // ─── Envío final ────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validateStep(3)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    setSubmitError('')

    const codigo = generarCodigo()

    try {
      await guardarReclamo({
        codigo,
        categoria: formData.categoria,
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        direccion: formData.direccion.trim(),
        lat: formData.lat,
        lng: formData.lng,
        fotos: formData.fotos,
        email: formData.email.trim(),
      })
      setCodigoGenerado(codigo)
      setSuccess(true)
    } catch (error) {
      setSubmitError(error?.message || 'Ocurrió un error al enviar el reclamo. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Copiar código ─────────────────────────────────
  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigoGenerado)
      setCodigoCopiado(true)
      setTimeout(() => setCodigoCopiado(false), 3000)
    } catch {
      // fallback
    }
  }

  // ─── Obtener ícono de categoría ────────────────────
  const getIcono = (nombre) => {
    const found = categorias.find((c) => c.nombre === nombre || c.id === nombre)
    const iconName = found?.icono || 'AlertCircle'
    const Icon = ICON_MAP[iconName] || AlertCircle
    return Icon
  }

  const getCategoriaNombre = (idOrName) => {
    const found = categorias.find((c) => c.id === idOrName || c.nombre === idOrName)
    return found?.nombre || idOrName
  }

  const categoriaSeleccionada = categorias.find(
    (c) => c.id === formData.categoria || c.nombre === formData.categoria
  )

  // ─── Pantalla de éxito ─────────────────────────────
  if (success) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        {/* Hero header */}
        <div className="bg-sky-500">
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-sm">
                <CircleCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-light text-white leading-tight">
                  Reclamo <span className="font-semibold">Enviado</span>
                </h1>
              </div>
            </div>
            <p className="text-lg text-white/80 pl-6 border-l-2 border-white/30 max-w-2xl">
              Tu reclamo fue registrado correctamente. Usá el código para hacer el seguimiento.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 md:p-12 text-center">
              {/* Ícono de éxito */}
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CircleCheck className="w-10 h-10 text-emerald-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                ¡Reclamo Registrado!
              </h2>
              <p className="text-slate-500 mb-8">
                Tu reclamo fue recibido y será procesado por el área correspondiente.
              </p>

              {/* Código */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-8">
                <p className="text-sm text-sky-600 font-medium mb-2">
                  Código de seguimiento
                </p>
                <p className="text-3xl font-bold text-sky-700 tracking-widest mb-4">
                  {codigoGenerado}
                </p>
                <button
                  onClick={copiarCodigo}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-sky-200 rounded-lg text-sm font-medium text-sky-600 hover:bg-sky-50 transition-colors"
                >
                  {codigoCopiado ? (
                    <>
                      <CheckCheck className="w-4 h-4" /> Copiado
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-4 h-4" /> Copiar código
                    </>
                  )}
                </button>
              </div>

              {/* Acciones */}
              <div className="space-y-3">
                <Link
                  to="/reclamos/seguimiento"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Hacer seguimiento del reclamo
                </Link>
                <button
                  onClick={() => navigate('/reclamos')}
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a Reclamos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Formulario activo ─────────────────────────────
  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      {/* Hero header */}
      <div className="bg-sky-500">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-sm">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-light text-white leading-tight">
                Reportar <span className="font-semibold">Reclamo</span>
              </h1>
            </div>
          </div>
          <p className="text-lg text-white/80 pl-6 border-l-2 border-white/30 max-w-2xl">
            Completá los pasos para reportar un reclamo ciudadano. Recibirá seguimiento por parte del área municipal correspondiente.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="max-w-3xl mx-auto">
          {/* ─── Step Indicator ──────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map(({ id, label }) => (
                <div key={id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      currentStep === id
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
                        : currentStep > id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    {currentStep > id ? (
                      <CheckCheck className="w-5 h-5" />
                    ) : (
                      id
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep === id ? 'text-sky-600' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="relative mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* ─── Card principal ──────────────────────── */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4">
              <h2 className="text-white text-base font-semibold flex items-center gap-2">
                {currentStep === 1 && <>Paso 1 — Datos del reclamo</>}
                {currentStep === 2 && <>Paso 2 — Ubicación y fotos</>}
                {currentStep === 3 && <>Paso 3 — Confirmación y envío</>}
              </h2>
            </div>

            <div className="p-6 md:p-8">
              {/* ─── Error de envío ─────────────────── */}
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              {/* ─── Errores de validación ──────────── */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700 mb-1">
                        Corregí los siguientes errores:
                      </p>
                      <ul className="text-sm text-red-600 list-disc list-inside space-y-0.5">
                        {Object.values(errors).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════ STEP 1: Datos ═══════ */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="categoria">
                      Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoria"
                      value={formData.categoria}
                      onChange={(e) => updateField('categoria', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    >
                      <option value="">Seleccionar categoría…</option>
                      {categorias.map((cat, i) => {
                        const value = cat.id || cat.nombre || i
                        const Icon = ICON_MAP[cat.icono] || AlertCircle
                        return (
                          <option key={value} value={value}>
                            {cat.nombre}
                          </option>
                        )
                      })}
                    </select>
                    {errors.categoria && (
                      <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>
                    )}

                    {/* Categorías visuales */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {categorias.map((cat, i) => {
                        const value = cat.id || cat.nombre || i
                        const isActive = formData.categoria === value
                        const Icon = ICON_MAP[cat.icono] || AlertCircle
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => updateField('categoria', value)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                              isActive
                                ? 'border-sky-500 bg-sky-50 text-sky-700'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:bg-sky-50/50'
                            }`}
                          >
                            <Icon
                              className="w-5 h-5"
                              style={isActive ? { color: cat.color || '#0ea5e9' } : undefined}
                            />
                            <span className="text-center leading-tight">{cat.nombre}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="titulo">
                      Título del reclamo <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="titulo"
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => updateField('titulo', e.target.value)}
                      placeholder="Ej: Bache en la calle principal"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                    {errors.titulo && (
                      <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="descripcion">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="descripcion"
                      rows={4}
                      value={formData.descripcion}
                      onChange={(e) => updateField('descripcion', e.target.value)}
                      placeholder="Describí el problema con el mayor detalle posible…"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-y"
                    />
                    {errors.descripcion && (
                      <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ═══════ STEP 2: Ubicación ═══════ */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Mapa */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Ubicación en el mapa <span className="text-red-500">*</span>
                    </label>
                    <MapPicker
                      lat={formData.lat ? parseFloat(formData.lat) : 0}
                      lng={formData.lng ? parseFloat(formData.lng) : 0}
                      onPositionChange={handlePositionChange}
                      height="320px"
                    />
                    {errors.ubicacion && (
                      <p className="text-red-500 text-xs mt-1">{errors.ubicacion}</p>
                    )}
                    {formData.lat && formData.lng && (
                      <p className="text-xs text-slate-400 mt-1">
                        Coordenadas: {parseFloat(formData.lat).toFixed(6)},{' '}
                        {parseFloat(formData.lng).toFixed(6)}
                      </p>
                    )}
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="direccion">
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="direccion"
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => updateField('direccion', e.target.value)}
                      placeholder="Ej: Av. San Martín 1234, Eldorado"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                    {errors.direccion && (
                      <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>
                    )}
                  </div>

                  {/* Fotos */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Fotos del reclamo
                    </label>
                    <p className="text-xs text-slate-400 mb-3">
                      Agregá hasta 3 fotos para documentar el reclamo (opcional)
                    </p>
                    <FileUpload
                      fotos={formData.fotos}
                      onFotosChange={(urls) => updateField('fotos', urls)}
                      maxFiles={3}
                    />
                  </div>
                </div>
              )}

              {/* ═══════ STEP 3: Confirmación ═══════ */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Resumen */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">
                      Revisá los datos antes de enviar
                    </h3>

                    <div className="bg-slate-50 rounded-lg border border-slate-100 divide-y divide-slate-100">
                      {/* Categoría */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        {(() => {
                          const Icon = getIcono(formData.categoria)
                          return <Icon className="w-5 h-5 text-sky-500 shrink-0" />
                        })()}
                        <div>
                          <p className="text-xs text-slate-400">Categoría</p>
                          <p className="text-sm font-medium text-slate-700">
                            {getCategoriaNombre(formData.categoria)}
                          </p>
                        </div>
                      </div>

                      {/* Título */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <AlertCircle className="w-5 h-5 text-sky-500 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-400">Título</p>
                          <p className="text-sm font-medium text-slate-700">
                            {formData.titulo}
                          </p>
                        </div>
                      </div>

                      {/* Descripción */}
                      <div className="px-4 py-3">
                        <p className="text-xs text-slate-400 mb-1">Descripción</p>
                        <p className="text-sm text-slate-700 whitespace-pre-line">
                          {formData.descripcion}
                        </p>
                      </div>

                      {/* Dirección */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <MapPin className="w-5 h-5 text-sky-500 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-400">Dirección</p>
                          <p className="text-sm font-medium text-slate-700">
                            {formData.direccion}
                          </p>
                        </div>
                      </div>

                      {/* Coordenadas */}
                      {formData.lat && formData.lng && (
                        <div className="flex items-center gap-3 px-4 py-3">
                          <MapPin className="w-5 h-5 text-sky-500 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-400">Coordenadas</p>
                            <p className="text-sm font-medium text-slate-700">
                              {parseFloat(formData.lat).toFixed(6)},{' '}
                              {parseFloat(formData.lng).toFixed(6)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Fotos */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-sky-500">
                            {formData.fotos.length}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Fotos adjuntas</p>
                          <p className="text-sm font-medium text-slate-700">
                            {formData.fotos.length === 0
                              ? 'Sin fotos'
                              : `${formData.fotos.length} foto${formData.fotos.length !== 1 ? 's' : ''}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Te enviaremos el código de seguimiento a este correo
                    </p>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ─── Botones de navegación ───────────── */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Anterior
                    </button>
                  )}
                </div>

                <div>
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      Siguiente
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar reclamo
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

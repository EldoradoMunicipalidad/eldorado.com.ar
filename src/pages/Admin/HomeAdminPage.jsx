import React, { useState, useEffect, useCallback } from 'react'
import {
  Shield, Save, Loader2, AlertCircle, CheckCircle2, LogOut,
  Plus, Trash2, Pencil, X, ArrowUp, ArrowDown, Eye, EyeOff,
  ChevronRight, Image,
} from 'lucide-react'
import SectionLayout from '../../assets/components/SectionLayout'
import { getHomeContent, updateHomeContent } from '../../lib/homeContent'

// ─── Default content (mirrors initial SQL migration) ─────────────────
const DEFAULT_CONTENT = {
  carousel: [
    { id: 1, img: '/slider-2.jpg', title: '', subtitle: '' },
  ],
  guiaTramites: {
    title: 'Guía de Trámites',
    subtitle: 'Consulta todos los pasos para realizar tus trámites municipales',
    buttonText: 'Ir a la guía',
    buttonHref: '/guia-de-tramites',
    enabled: true,
  },
  tramites: [
    { id: 1, icon: 'TributarioIcon', title: 'Portal Tributario', subtitle: 'Consultá y aboná tus tasas municipales en línea', to: 'https://www.municipalidad.com/eldo/home/menu' },
    { id: 2, icon: 'ComercialIcon', title: 'Preinscripción Comercial', subtitle: 'Iniciá la habilitación comercial de tu emprendimiento', to: '/ciudadano-digital/preinscripcion-comercial' },
    { id: 3, icon: 'LicenciasIcon', title: 'Licencias de Conducir', subtitle: 'Solicitá turnos e información para tu licencia', to: '/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias' },
    { id: 4, icon: 'EstacionamientoIcon', title: 'Estacionamiento Medido', subtitle: 'Gestioná tu estacionamiento y consultá zonas habilitadas', to: 'https://sem.eldorado.gob.ar/#/fines' },
    { id: 5, icon: 'LicitacionesIcon', title: 'Licitaciones', subtitle: 'Accedé a convocatorias y pliegos municipales vigentes', to: '/gobierno-abierto/licitaciones' },
    { id: 6, icon: 'TurnosPlaneamientoIcon', title: 'Turnos Planeamiento', subtitle: 'Reservá tu turno para trámites de obras y planeamiento', to: '/gobierno/secretaria-obras-publicas/planeamiento/turnero' },
    { id: 7, icon: 'EscuelaManejoIcon', title: 'Escuela de Manejo', subtitle: 'Inscribite y preparate para obtener tu licencia', to: '/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias/escuela-manejo/turnero' },
    { id: 8, icon: 'ParqueIndustrialIcon', title: 'Parque Industrial', subtitle: 'Conocé oportunidades, servicios e información del predio', to: '/gobierno/secretaria-gobierno/parque-industrial' },
    { id: 9, icon: 'ReclamosIcon', title: 'Reclamos', subtitle: 'Registrá incidencias y seguí el estado de tu solicitud', to: '/ciudadano-digital/reclamos' },
    { id: 10, icon: 'ArboladoIcon', title: 'Arbolado Urbano', subtitle: 'Solicitá intervenciones y gestiones vinculadas al arbolado', to: 'https://docs.google.com/forms/d/e/1FAIpQLSdVyYicbRfgh3iY9vi7R4ZqZsuivRg0q24Ok0M6urSYz6MhNA/viewform' },
    { id: 11, icon: 'JuzgadoIcon', title: 'Juzgado de Faltas', subtitle: 'Consultá trámites, actas y gestiones del juzgado', to: '/gobierno/juzgado-de-faltas' },
    { id: 12, icon: 'BoletinIcon', title: 'Boletín Oficial', subtitle: 'Accedé a publicaciones y normativa municipal actualizada', to: '/gobierno-abierto/boletin-oficial' },
  ],
  infoAdicional: {
    cards: [
      { id: 1, icon: 'location_city', bgImage: '/card-ciudad.jpg', title: 'Ciudad', subtitle: 'Conocé todo sobre nuestra ciudad: historia, turismo, barrios, escudo e insignias.', href: '/ciudad' },
      { id: 2, icon: 'account_balance', bgImage: '/card-gobierno.jpg', title: 'Gobierno', subtitle: 'Enterate sobre el adentro, secretarías, departamentos y el staff gubernamental.', href: '/gobierno' },
      { id: 3, icon: 'touch_app', bgImage: '/card-ciudadano_digital.jpg', title: 'Ciudadano Digital', subtitle: 'Accedé a trámites online, licencias, tasas, reclamos y preinscripción comercial.', href: '/ciudadano-digital' },
      { id: 4, icon: 'visibility', bgImage: '/card-gobierno_abierto.jpg', title: 'Gobierno Abierto', subtitle: 'Consultá licitaciones, boletín oficial, finanzas públicas, escala salarial y más.', href: '/gobierno-abierto' },
    ],
    stats: [],
  },
  appSection: {
    enabled: true,
    title: 'MI MUNI MI CUENTA',
    subtitle: 'Accedé a trámites, pagos, noticias y servicios municipales desde tu celular. Rápido, seguro y siempre a mano.',
    features: [
      { icon: 'smartphone', label: 'Trámites online' },
      { icon: 'payments', label: 'Pagos digitales' },
      { icon: 'notifications', label: 'Alertas y noticias' },
      { icon: 'verified', label: 'Seguro y confiable' },
    ],
    videoId: 'wcDWGr0ygSg',
  },
}

const TABS = [
  { id: 'carousel', label: 'Carrusel' },
  { id: 'guia', label: 'Guía de Trámites' },
  { id: 'tramites', label: 'Trámites y Servicios' },
  { id: 'info', label: 'Info Adicional' },
  { id: 'app', label: 'App Section' },
]

// ─── Simple login ────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (creds.username === 'admin' && creds.password === 'admin') {
      onLogin()
    } else {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-sky-600" />
          <h1 className="text-xl font-bold text-slate-800">Admin Home</h1>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Usuario</label>
          <input
            type="text"
            value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle className="w-4 h-4" /> {error}</div>}
        <button type="submit" className="w-full bg-sky-600 text-white rounded-lg py-2 font-semibold hover:bg-sky-700 transition-colors">
          Ingresar
        </button>
      </form>
    </div>
  )
}

// ─── Field components ───────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, ...props }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
      {...props}
    />
  )
}

function Textarea({ value, onChange, ...props }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
      {...props}
    />
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-sky-600' : 'bg-slate-300'}`}
        onClick={() => onChange(!checked)}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  )
}

// ─── Section: Carrusel ───────────────────────────────────────────────
function CarouselEditor({ data, onChange }) {
  const slides = data || []
  const [uploading, setUploading] = useState(null) // { id, uploading }

  const addSlide = () => {
    onChange([...slides, { id: Date.now(), img: '/slider-2.jpg', title: '', subtitle: '' }])
  }

  const removeSlide = (id) => {
    if (slides.length === 1) { alert('Debe haber al menos una imagen'); return }
    onChange(slides.filter((s) => s.id !== id))
  }

  const updateSlide = (id, key, value) => {
    onChange(slides.map((s) => s.id === id ? { ...s, [key]: value } : s))
  }

  const handleUpload = async (id, file) => {
    setUploading({ id })
    try {
      const { uploadHomeImage } = await import('../../lib/homeContent')
      const { url } = await uploadHomeImage(file)
      updateSlide(id, 'img', url)
    } catch (err) {
      alert('Error subiendo imagen: ' + err.message)
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Imágenes del Carrusel</h3>
        <button onClick={addSlide} className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700">
          <Plus className="w-4 h-4" /> Agregar imagen
        </button>
      </div>

      <div className="space-y-4">
        {slides.map((slide, idx) => (
          <div key={slide.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Imagen {idx + 1}</span>
              <button onClick={() => removeSlide(slide.id)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Preview + Upload */}
            <div className="flex gap-4 items-start">
              <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                {uploading?.id === slide.id ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                    <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
                  </div>
                ) : slide.img ? (
                  <img src={slide.img} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Image className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-white border border-sky-300 text-sky-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-sky-50 transition-colors w-fit">
                  <Image className="w-4 h-4" />
                  <span>{uploading?.id === slide.id ? 'Subiendo...' : 'Subir imagen'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => { if (e.target.files[0]) handleUpload(slide.id, e.target.files[0]) }}
                    disabled={uploading?.id === slide.id}
                  />
                </label>
                <p className="text-xs text-slate-400">JPG, PNG, GIF, WebP, SVG — máx 10MB</p>
              </div>
            </div>

            <Field label="URL de imagen (ingresala manualmente o usá el botón de arriba)">
              <Input value={slide.img} onChange={(v) => updateSlide(slide.id, 'img', v)} placeholder="/uploads/xxx.jpg" />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Título (opcional)">
                <Input value={slide.title} onChange={(v) => updateSlide(slide.id, 'title', v)} placeholder="" />
              </Field>
              <Field label="Subtítulo (opcional)">
                <Input value={slide.subtitle} onChange={(v) => updateSlide(slide.id, 'subtitle', v)} placeholder="" />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section: Guía de Trámites ──────────────────────────────────────
function GuiaEditor({ data, onChange }) {
  const d = data || DEFAULT_CONTENT.guiaTramites
  const set = (key, val) => onChange({ ...d, [key]: val })

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800">Banner Guía de Trámites</h3>
      <Toggle checked={d.enabled} onChange={(v) => set('enabled', v)} label={d.enabled ? 'Visible' : 'Oculto'} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Título">
          <Input value={d.title} onChange={(v) => set('title', v)} />
        </Field>
        <Field label="Texto del botón">
          <Input value={d.buttonText} onChange={(v) => set('buttonText', v)} />
        </Field>
        <Field label="URL del botón">
          <Input value={d.buttonHref} onChange={(v) => set('buttonHref', v)} />
        </Field>
      </div>
      <Field label="Subtítulo">
        <Textarea value={d.subtitle} onChange={(v) => set('subtitle', v)} rows={2} />
      </Field>
    </div>
  )
}

// ─── Section: Trámites y Servicios ───────────────────────────────────
const ICON_OPTIONS = [
  'TributarioIcon','ComercialIcon','LicenciasIcon','EstacionamientoIcon',
  'LicitacionesIcon','TurnosPlaneamientoIcon','EscuelaManejoIcon','ParqueIndustrialIcon',
  'ReclamosIcon','ArboladoIcon','JuzgadoIcon','BoletinIcon',
  'TraficoIcon','SaludIcon','EducacionIcon','TransporteIcon',
  'SeguridadIcon','UrbanismoIcon','MedioAmbienteIcon','CulturaIcon',
  'DeportesIcon','TurismoIcon','HigieneIcon','LimpiezaIcon',
]

function TramitesEditor({ data, onChange }) {
  const items = data || []

  const addItem = () => {
    onChange([...items, { id: Date.now(), icon: 'TributarioIcon', title: '', subtitle: '', to: '' }])
  }

  const removeItem = (id) => {
    if (items.length === 1) { alert('Debe haber al menos un trámite'); return }
    onChange(items.filter((s) => s.id !== id))
  }

  const updateItem = (id, key, value) => {
    onChange(items.map((s) => s.id === id ? { ...s, [key]: value } : s))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Trámites y Servicios ({items.length} items)</h3>
        <button onClick={addItem} className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700">
          <Plus className="w-4 h-4" /> Agregar trámite
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={item.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">#{idx + 1}</span>
              <div className="flex gap-2">
                {idx > 0 && (
                  <button onClick={() => { const arr = [...items]; [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]]; onChange(arr) }} className="text-slate-400 hover:text-sky-600 p-1" title="Mover arriba">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                )}
                {idx < items.length - 1 && (
                  <button onClick={() => { const arr = [...items]; [arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]]; onChange(arr) }} className="text-slate-400 hover:text-sky-600 p-1" title="Mover abajo">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Icono">
                <select
                  value={item.icon}
                  onChange={(e) => updateItem(item.id, 'icon', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </Field>
              <Field label="Título">
                <Input value={item.title} onChange={(v) => updateItem(item.id, 'title', v)} />
              </Field>
              <Field label="URL de destino">
                <Input value={item.to} onChange={(v) => updateItem(item.id, 'to', v)} />
              </Field>
            </div>
            <Field label="Descripción">
              <Textarea value={item.subtitle} onChange={(v) => updateItem(item.id, 'subtitle', v)} rows={2} />
            </Field>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section: Info Adicional ─────────────────────────────────────────
function InfoAdicionalEditor({ data, onChange }) {
  const d = data || { cards: DEFAULT_CONTENT.infoAdicional.cards, stats: [] }
  const cards = d.cards || []
  const [uploading, setUploading] = useState(null)

  const updateCard = (id, key, value) => {
    onChange({ ...d, cards: cards.map((c) => c.id === id ? { ...c, [key]: value } : c) })
  }

  const handleBgUpload = async (id, file) => {
    setUploading({ id })
    try {
      const { uploadHomeImage } = await import('../../lib/homeContent')
      const { url } = await uploadHomeImage(file)
      updateCard(id, 'bgImage', url)
    } catch (err) {
      alert('Error subiendo imagen: ' + err.message)
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800">Información Adicional ({cards.length} tarjetas)</h3>
      <div className="space-y-4">
        {cards.map((card, idx) => (
          <div key={card.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <span className="text-sm font-semibold text-slate-700">Tarjeta {idx + 1}: {card.title}</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Título">
                <Input value={card.title} onChange={(v) => updateCard(card.id, 'title', v)} />
              </Field>
              <div className="space-y-1">
                <Field label="Imagen de fondo">
                  <div className="flex items-center gap-2">
                    <Input value={card.bgImage} onChange={(v) => updateCard(card.id, 'bgImage', v)} placeholder="/card-ciudad.jpg" />
                    <label className="flex items-center gap-1 px-3 py-2 bg-white border border-sky-300 text-sky-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-sky-50 shrink-0">
                      <Image className="w-4 h-4" />
                      <input type="file" accept="image/*" className="sr-only"
                        onChange={(e) => { if (e.target.files[0]) handleBgUpload(card.id, e.target.files[0]) }}
                        disabled={uploading?.id === card.id}
                      />
                    </label>
                  </div>
                  {uploading?.id === card.id && <span className="text-xs text-sky-600 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Subiendo...</span>}
                </Field>
              </div>
              <Field label="URL de destino">
                <Input value={card.href} onChange={(v) => updateCard(card.id, 'href', v)} />
              </Field>
            </div>
            <Field label="Descripción">
              <Textarea value={card.subtitle} onChange={(v) => updateCard(card.id, 'subtitle', v)} rows={2} />
            </Field>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section: App Section ────────────────────────────────────────────
function AppSectionEditor({ data, onChange }) {
  const d = data || DEFAULT_CONTENT.appSection
  const features = d.features || []

  const setFeature = (idx, key, val) => {
    const arr = [...features]
    arr[idx] = { ...arr[idx], [key]: val }
    onChange({ ...d, features: arr })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800">Sección App (MI MUNI MI CUENTA)</h3>
      <Toggle checked={d.enabled} onChange={(v) => onChange({ ...d, enabled: v })} label={d.enabled ? 'Visible' : 'Oculta'} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Título (separado por espacio, ej: MI MUNI MI CUENTA)">
          <Input value={d.title} onChange={(v) => onChange({ ...d, title: v })} />
        </Field>
        <Field label="ID de Video YouTube">
          <Input value={d.videoId} onChange={(v) => onChange({ ...d, videoId: v })} />
        </Field>
      </div>
      <Field label="Descripción">
        <Textarea value={d.subtitle} onChange={(v) => onChange({ ...d, subtitle: v })} rows={2} />
      </Field>
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Features</h4>
        <div className="space-y-2">
          {features.map((f, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
              <span className="text-sm text-slate-500 w-6">{idx + 1}</span>
              <Input value={f.icon} onChange={(v) => setFeature(idx, 'icon', v)} placeholder="icon name" className="flex-1" />
              <Input value={f.label} onChange={(v) => setFeature(idx, 'label', v)} placeholder="label" className="flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main HomeAdminPage ──────────────────────────────────────────────
export default function HomeAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [content, setContent] = useState(null)
  const [activeTab, setActiveTab] = useState('carousel')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success'|'error', msg: '' }

  const loadContent = useCallback(async () => {
    try {
      const data = await getHomeContent()
      // Merge with defaults so any missing keys get filled
      setContent({ ...DEFAULT_CONTENT, ...data.content })
    } catch (err) {
      setContent(DEFAULT_CONTENT)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) loadContent()
  }, [isAuthenticated, loadContent])

  const handleSave = async () => {
    setSaving(true)
    setStatus(null)
    try {
      await updateHomeContent(content)
      setStatus({ type: 'success', msg: 'Contenido guardado correctamente' })
    } catch (err) {
      setStatus({ type: 'error', msg: `Error: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  const updateSection = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-sky-600" />
          <h1 className="text-lg font-bold text-slate-800">Admin Home — Gestión de Contenido</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <a href="/" target="_blank" className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-sky-600 text-sm border border-slate-300 rounded-lg hover:border-sky-400 transition-colors">
            <Eye className="w-4 h-4" /> Ver sitio
          </a>
        </div>
      </div>

      {/* Status banner */}
      {status && (
        <div className={`mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
          status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {status.msg}
          <button onClick={() => setStatus(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tabs */}
      <div className="mx-6 mt-4">
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="mx-6 my-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {!content ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            </div>
          ) : (
            <>
              {activeTab === 'carousel' && (
                <CarouselEditor data={content.carousel} onChange={(v) => updateSection('carousel', v)} />
              )}
              {activeTab === 'guia' && (
                <GuiaEditor data={content.guiaTramites} onChange={(v) => updateSection('guiaTramites', v)} />
              )}
              {activeTab === 'tramites' && (
                <TramitesEditor data={content.tramites} onChange={(v) => updateSection('tramites', v)} />
              )}
              {activeTab === 'info' && (
                <InfoAdicionalEditor data={content.infoAdicional} onChange={(v) => updateSection('infoAdicional', v)} />
              )}
              {activeTab === 'app' && (
                <AppSectionEditor data={content.appSection} onChange={(v) => updateSection('appSection', v)} />
              )}
            </>
          )}
        </div>

        {/* Preview link */}
        <div className="mt-4 text-center">
          <a href="/" target="_blank" className="text-sm text-sky-600 hover:text-sky-800 underline flex items-center justify-center gap-1">
            <Eye className="w-3 h-3" /> Ver cambios en el sitio (recargar home)
          </a>
        </div>
      </div>
    </div>
  )
}

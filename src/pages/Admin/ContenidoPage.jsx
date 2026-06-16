import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Shield, Save, Loader2, AlertCircle, CheckCircle2, LogOut,
  Plus, Trash2, Pencil, X, ArrowUp, ArrowDown, GripVertical,
} from 'lucide-react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import { getPageContent, updatePageContent } from '../../lib/pages'

const ICON_OPTIONS = [
  'mapIcon', 'shareLocationIcon', 'cityIcon', 'gridOnIcon', 'architectureIcon',
  'folderSharedIcon', 'engineeringIcon', 'construction', 'gavelIcon', 'descriptionIcon',
  'menuBookIcon', 'boltIcon', 'aprovationIcon', 'ruleIcon', 'certificationAssignatureIcon',
  'editDocumentIcon', 'deleteSweepIcon', 'cleaningServicesIcon', 'waterDropIcon',
  'homeRepairIcon', 'landscapeIcon', 'inventoryIcon', 'assignmentIcon',
  'analitycsIcon', 'factCheckIcon', 'requestQuoteIcon', 'addRoadIcon',
  'waterPumpIcon', 'parkIcon', 'toyIcon', 'carRepairIcon', 'editRoadIcon',
  'localShippingIcon', 'precisionManufacturingIcon',
]

export default function ContenidoPage() {
  const { pageId } = useParams()
  const navigate = useNavigate()

  // ─── Auth (independiente del panel de reclamos) ─────
  const ADMIN_USER = 'contenido'
  const ADMIN_PASS = 'contenido2025'

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('contenido_admin_auth') === 'true'
  )
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const username = sessionStorage.getItem('contenido_admin_username') || ''

  // ─── Content state ─────────────────────────────────
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  // Load content
  useEffect(() => {
    if (!isAuthenticated) return
    setLoading(true)
    getPageContent(pageId)
      .then((data) => {
        if (data.content) {
          setContent(data.content)
        } else {
          // Default structure for first time
          setContent({
            header: { title: '', highlight: '', description: '' },
            mision: '',
            funciones: [],
            accordionItems: [],
          })
        }
      })
      .catch(() => setError('Error al cargar contenido'))
      .finally(() => setLoading(false))
  }, [pageId, isAuthenticated])

  // ─── Field updaters ────────────────────────────────
  const updateHeader = (field, value) => {
    setContent((prev) => ({
      ...prev,
      header: { ...(prev?.header || {}), [field]: value },
    }))
  }

  const updateFuncion = (index, field, value) => {
    setContent((prev) => {
      const funciones = [...(prev?.funciones || [])]
      funciones[index] = { ...funciones[index], [field]: value }
      return { ...prev, funciones }
    })
  }

  const addFuncion = () => {
    setContent((prev) => ({
      ...prev,
      funciones: [...(prev?.funciones || []), { icono: 'engineeringIcon', titulo: '', descripcion: '' }],
    }))
  }

  const removeFuncion = (index) => {
    setContent((prev) => {
      const funciones = [...(prev?.funciones || [])]
      funciones.splice(index, 1)
      return { ...prev, funciones }
    })
  }

  const moveFuncion = (index, direction) => {
    setContent((prev) => {
      const funciones = [...(prev?.funciones || [])]
      const target = index + direction
      if (target < 0 || target >= funciones.length) return prev
      ;[funciones[index], funciones[target]] = [funciones[target], funciones[index]]
      return { ...prev, funciones }
    })
  }

  // ─── Accordion handlers ────────────────────────────
  const updateAccordion = (idx, field, value) => {
    setContent((prev) => {
      const items = [...(prev?.accordionItems || [])]
      items[idx] = { ...items[idx], [field]: value }
      return { ...prev, accordionItems: items }
    })
  }

  const addAccordion = () => {
    setContent((prev) => ({
      ...prev,
      accordionItems: [...(prev?.accordionItems || []), { title: '', icon: 'descriptionIcon', cards: [] }],
    }))
  }

  const removeAccordion = (idx) => {
    setContent((prev) => {
      const items = [...(prev?.accordionItems || [])]
      items.splice(idx, 1)
      return { ...prev, accordionItems: items }
    })
  }

  // ─── Card handlers (within accordion) ──────────────
  const updateCard = (accIdx, cardIdx, field, value) => {
    setContent((prev) => {
      const items = [...(prev?.accordionItems || [])]
      const cards = [...(items[accIdx]?.cards || [])]
      cards[cardIdx] = { ...cards[cardIdx], [field]: value }
      items[accIdx] = { ...items[accIdx], cards }
      return { ...prev, accordionItems: items }
    })
  }

  const addCard = (accIdx) => {
    setContent((prev) => {
      const items = [...(prev?.accordionItems || [])]
      const cards = [...(items[accIdx]?.cards || []), { title: '', description: '', to: '', icon: 'descriptionIcon' }]
      items[accIdx] = { ...items[accIdx], cards }
      return { ...prev, accordionItems: items }
    })
  }

  const removeCard = (accIdx, cardIdx) => {
    setContent((prev) => {
      const items = [...(prev?.accordionItems || [])]
      const cards = [...(items[accIdx]?.cards || [])]
      cards.splice(cardIdx, 1)
      items[accIdx] = { ...items[accIdx], cards }
      return { ...prev, accordionItems: items }
    })
  }

  // ─── Save ──────────────────────────────────────────
  const handleSave = async () => {
    setError('')
    setSaveSuccess(false)
    setSaving(true)
    try {
      await updatePageContent(pageId, content)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  // ─── Logout ────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')
    if (!loginUser.trim() || !loginPass.trim()) {
      setLoginError('Completá usuario y contraseña')
      return
    }
    if (loginUser.trim() !== ADMIN_USER || loginPass !== ADMIN_PASS) {
      setLoginError('Usuario o contraseña incorrectos')
      return
    }
    sessionStorage.setItem('contenido_admin_auth', 'true')
    sessionStorage.setItem('contenido_admin_username', loginUser.trim())
    setIsAuthenticated(true)
    setLoginUser('')
    setLoginPass('')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('contenido_admin_auth')
    sessionStorage.removeItem('contenido_admin_username')
    setIsAuthenticated(false)
  }

  // ─── Not authenticated ─────────────────────────────
  if (!isAuthenticated) {
    return (
      <SectionLayout
        title="Editor de"
        highlight="Contenido"
        description={`Ingresá para editar el contenido de: ${pageId}`}
      >
        <Section>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Acceso al Editor</h3>
                <p className="text-sm text-slate-500 mt-1">Ingresá con tu usuario y contraseña</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                  <input
                    type="text"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="usuario"
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
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-60"
                >
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </Section>
      </SectionLayout>
    )
  }

  // ─── Loading ───────────────────────────────────────
  if (loading) {
    return (
      <SectionLayout title="Cargando..." highlight="" description="">
        <Section>
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        </Section>
      </SectionLayout>
    )
  }

  return (
    <>
      <SectionLayout
        title="Editor de"
        highlight="Contenido"
        description={`Editá el contenido de la página: ${pageId}`}
      >
        <div className="flex gap-2 mt-6 flex-wrap items-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> Guardado
            </span>
          )}
          <div className="flex-1" />
          <span className="text-sm text-slate-400">{username}</span>
          <button onClick={handleLogout} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </SectionLayout>

      <Section>
        <div className="max-w-4xl mx-auto space-y-8">

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ═══ HEADER ═══ */}
          <CardSection title="Encabezado de la página">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Título" value={content?.header?.title || ''} onChange={(v) => updateHeader('title', v)} placeholder="Dirección de" />
              <Field label="Highlight" value={content?.header?.highlight || ''} onChange={(v) => updateHeader('highlight', v)} placeholder="Planeamiento" />
            </div>
            <Field label="Descripción" value={content?.header?.description || ''} onChange={(v) => updateHeader('description', v)} placeholder="Descripción principal..." textarea />
          </CardSection>

          {/* ═══ MISIÓN ═══ */}
          <CardSection title="Misión">
            <Field label="Texto de misión" value={content?.mision || ''} onChange={(v) => setContent((p) => ({ ...p, mision: v }))} placeholder="Escribí la misión del área..." textarea rows={4} />
          </CardSection>

          {/* ═══ FUNCIONES ═══ */}
          <CardSection title="Funciones Principales">
            {(content?.funciones || []).length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No hay funciones. Agregá una.</p>
            )}
            <div className="space-y-3">
              {(content?.funciones || []).map((fn, i) => (
                <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-600">Funci&oacute;n #{i + 1}</span>
                    <div className="flex gap-1">
                      <button onClick={() => moveFuncion(i, -1)} disabled={i === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => moveFuncion(i, 1)} disabled={i >= (content?.funciones?.length || 0) - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                      <button onClick={() => removeFuncion(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Ícono" value={fn.icono || ''} onChange={(v) => updateFuncion(i, 'icono', v)} placeholder="engineeringIcon" />
                    <Field label="Título" value={fn.titulo || ''} onChange={(v) => updateFuncion(i, 'titulo', v)} placeholder="Planos Digitalizados" />
                  </div>
                  <div className="mt-3">
                    <Field label="Descripción" value={fn.descripcion || ''} onChange={(v) => updateFuncion(i, 'descripcion', v)} placeholder="Descripción de la función..." textarea rows={2} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addFuncion} className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-600 border-2 border-dashed border-sky-200 rounded-xl hover:bg-sky-50 transition-colors w-full justify-center">
              <Plus className="w-4 h-4" /> Agregar Función
            </button>
          </CardSection>

          {/* ═══ ACCORDION ITEMS ═══ */}
          <CardSection title="Acordeones (Secciones con tarjetas)">
            {(content?.accordionItems || []).length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No hay secciones. Agregá una.</p>
            )}
            <div className="space-y-4">
              {(content?.accordionItems || []).map((section, accIdx) => (
                <div key={accIdx} className="bg-white rounded-xl border-2 border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-700">{section.title || `Sección #${accIdx + 1}`}</span>
                    <button onClick={() => removeAccordion(accIdx)} className="p-1 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Field label="Título" value={section.title || ''} onChange={(v) => updateAccordion(accIdx, 'title', v)} placeholder="Códigos y Ordenanzas" />
                    <Field label="Ícono" value={section.icon || ''} onChange={(v) => updateAccordion(accIdx, 'icon', v)} placeholder="gavelIcon" />
                  </div>

                  {/* Cards dentro del acordeón */}
                  <div className="ml-4 space-y-2">
                    {(section.cards || []).length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-2">Sin tarjetas</p>
                    )}
                    {(section.cards || []).map((card, cIdx) => (
                      <div key={cIdx} className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500">Tarjeta #{cIdx + 1}</span>
                          <button onClick={() => removeCard(accIdx, cIdx)} className="p-1 text-red-400 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none" value={card.title || ''} onChange={(e) => updateCard(accIdx, cIdx, 'title', e.target.value)} placeholder="Título" />
                          <input className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none" value={card.icon || ''} onChange={(e) => updateCard(accIdx, cIdx, 'icon', e.target.value)} placeholder="Icono" />
                        </div>
                        <input className="w-full mt-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none" value={card.description || ''} onChange={(e) => updateCard(accIdx, cIdx, 'description', e.target.value)} placeholder="Descripción" />
                        <input className="w-full mt-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none font-mono text-xs" value={card.to || ''} onChange={(e) => updateCard(accIdx, cIdx, 'to', e.target.value)} placeholder="https:// o /ruta-interna" />
                      </div>
                    ))}
                    <button onClick={() => addCard(accIdx)} className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                      <Plus className="w-3 h-3" /> Agregar Tarjeta
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addAccordion} className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-600 border-2 border-dashed border-sky-200 rounded-xl hover:bg-sky-50 transition-colors w-full justify-center">
              <Plus className="w-4 h-4" /> Agregar Sección
            </button>
          </CardSection>

          {/* Bottom save */}
          <div className="flex justify-center pt-4 pb-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-3 px-8 py-4 bg-sky-500 text-white rounded-xl font-bold text-lg hover:bg-sky-600 transition-colors shadow-lg disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>

        </div>
      </Section>
    </>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────

function CardSection({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, textarea, rows = 3 }) {
  const id = label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

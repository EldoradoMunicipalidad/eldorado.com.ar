import React, { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Plus,
  X,
  Edit3,
  Trash2,
  Palette,
  Eye,
  EyeOff,
  LayoutGrid,
} from 'lucide-react'
import { authenticateAdmin, getCategorias, crearCategoria, actualizarCategoria, eliminarCategoria, CATEGORIAS_POR_DEFECTO } from '../../lib/reclamos'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'

const ICONOS_DISPONIBLES = [
  'Lightbulb', 'TriangleAlert', 'Trash2', 'Footprints', 'TrafficCone',
  'Trees', 'VolumeX', 'AlertCircle', 'Wrench', 'Bug', 'Zap', 'Droplets',
  'Flame', 'Wind', 'Snowflake',
]

const ICONO_EMOJIS = {
  Lightbulb: '💡',
  TriangleAlert: '⚠️',
  Trash2: '🗑️',
  Footprints: '🦶',
  TrafficCone: '🚧',
  Trees: '🌳',
  VolumeX: '🔇',
  AlertCircle: '⚠️',
  Wrench: '🔧',
  Bug: '🐛',
  Zap: '⚡',
  Droplets: '💧',
  Flame: '🔥',
  Wind: '🌬️',
  Snowflake: '❄️',
}

function getIconoEmoji(icono) {
  return ICONO_EMOJIS[icono] || '📋'
}

const initialFormState = {
  nombre: '',
  color: '#3b82f6',
  icono: 'AlertCircle',
  activa: true,
  orden: 1,
}

export default function CategoriasPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('reclamos_admin_auth') === 'true'
  )
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialFormState)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [toast, setToast] = useState(null)
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // Auth
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    if (!loginUser.trim() || !loginPass.trim()) {
      setLoginError('Completá usuario y contraseña')
      return
    }
    setAuthLoading(true)
    const ok = await authenticateAdmin(loginUser.trim(), loginPass)
    setAuthLoading(false)
    if (ok) {
      sessionStorage.setItem('reclamos_admin_auth', 'true')
      sessionStorage.setItem('reclamos_admin_username', loginUser.trim())
      setIsAuthenticated(true)
    } else {
      setLoginError('Usuario o contraseña incorrectos')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('reclamos_admin_auth')
    sessionStorage.removeItem('reclamos_admin_username')
    setIsAuthenticated(false)
    setLoginUser('')
    setLoginPass('')
  }

  // Data
  const loadCategorias = useCallback(async () => {
    try {
      const data = await getCategorias(false)
      setCategorias(data.length > 0 ? data : CATEGORIAS_POR_DEFECTO)
    } catch {
      setCategorias(CATEGORIAS_POR_DEFECTO)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    loadCategorias()
  }, [isAuthenticated, loadCategorias])

  const openNew = () => {
    setEditingId(null)
    setForm(initialFormState)
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditingId(cat.id)
    setForm({
      nombre: cat.nombre || '',
      color: cat.color || '#3b82f6',
      icono: cat.icono || 'AlertCircle',
      activa: cat.activa !== false,
      orden: cat.orden || 1,
    })
    setFormError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      setFormError('El nombre es obligatorio')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      if (editingId) {
        await actualizarCategoria(editingId, form)
        showToast('Categoría actualizada')
      } else {
        await crearCategoria(form)
        showToast('Categoría creada')
      }
      setShowModal(false)
      loadCategorias()
    } catch (err) {
      setFormError('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleteLoading(true)
    try {
      await eliminarCategoria(id)
      showToast('Categoría eliminada')
      setDeleteConfirm(null)
      loadCategorias()
    } catch {
      showToast('Error al eliminar', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Auth screen
  if (!isAuthenticated) {
    return (
      <>
        <SectionLayout title="Categorías de" highlight="Reclamos" description="Gestioná las categorías de reclamos ciudadanos." />
        <Section>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Acceso al Panel</h3>
                <p className="text-sm text-slate-500 mt-1">Ingresá con tu cuenta municipal</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                  <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" placeholder="admin" autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                  <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" placeholder="••••••" />
                </div>
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}
                <button type="submit" disabled={authLoading}
                  className="w-full px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-60">
                  {authLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Iniciar Sesión'}
                </button>
              </form>
            </div>
          </div>
        </Section>
      </>
    )
  }

  if (loading) {
    return <SectionLayout title="Categorías de" highlight="Reclamos" description="Cargando..." />
  }

  return (
    <>
      <SectionLayout
        title="Categorías de"
        highlight="Reclamos"
        description="Administrá las categorías disponibles para los reclamos ciudadanos."
      >
        <div className="flex gap-2 mt-6">
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </SectionLayout>

      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>{toast.message}</div>
      )}

      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Categorías</h3>
            <button onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition-colors">
              <Plus className="w-4 h-4" /> Nueva Categoría
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((cat) => (
              <div key={cat.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                cat.activa !== false ? 'border-slate-200' : 'border-slate-100 opacity-60'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: (cat.color || '#3b82f6') + '20' }}>
                    <span>{getIconoEmoji(cat.icono)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm">{cat.nombre}</h4>
                    <p className="text-xs text-slate-400">Orden: {cat.orden || '—'}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(cat)} className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteConfirm(cat.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    cat.activa !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {cat.activa !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {cat.activa !== false ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Delete confirm */}
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                <h3 className="font-bold text-slate-800 mb-2">¿Eliminar categoría?</h3>
                <p className="text-sm text-slate-500 mb-4">Esta acción no se puede deshacer.</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setDeleteConfirm(null)} disabled={deleteLoading}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold">Cancelar</button>
                  <button onClick={() => handleDelete(deleteConfirm)} disabled={deleteLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                    {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">
                    {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                    <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                    <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-300 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ícono</label>
                    <div className="grid grid-cols-5 gap-2">
                      {ICONOS_DISPONIBLES.map((ico) => (
                        <button key={ico} onClick={() => setForm({ ...form, icono: ico })}
                          className={`p-2 rounded-lg border text-lg transition-all ${
                            form.icono === ico ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200' : 'border-slate-200 hover:border-sky-200'
                          }`} title={ico}>
                          {getIconoEmoji(ico)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Orden</label>
                      <input type="number" min={1} value={form.orden} onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                      <button onClick={() => setForm({ ...form, activa: !form.activa })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          form.activa ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}>
                        {form.activa ? 'Activa' : 'Inactiva'}
                      </button>
                    </div>
                  </div>
                  {formError && <p className="text-sm text-red-500">{formError}</p>}
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm">Cancelar</button>
                  <button onClick={handleSave} disabled={saving}
                    className="px-5 py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {editingId ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

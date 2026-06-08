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
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  doc,
} from 'firebase/firestore'
import { db, auth } from '../../lib/firebase'
import { getUserRole, ROLE_LABELS } from '../../lib/adminUtils'
import { CATEGORIAS_POR_DEFECTO } from '../../lib/reclamos'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'

const ICONOS_DISPONIBLES = [
  'Lightbulb',
  'TriangleAlert',
  'Trash2',
  'Footprints',
  'TrafficCone',
  'Trees',
  'VolumeX',
  'AlertCircle',
  'Wrench',
  'Bug',
  'Zap',
  'Droplets',
  'Flame',
  'Wind',
  'Snowflake',
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
  // ─── Auth state ──────────────────────────────────────
  const [user, setUser] = useState(null)
  const [userRole, setUserRoleState] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ─── Data state ──────────────────────────────────────
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  // ─── Modal state ─────────────────────────────────────
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialFormState)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // ─── Delete confirm ──────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ─── Toast ───────────────────────────────────────────
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // ─── Auth handler ────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true)
      if (firebaseUser) {
        setUser(firebaseUser)
        setLoginError('')
        const role = await getUserRole(firebaseUser)
        setUserRoleState(role)
      } else {
        setUser(null)
        setUserRoleState(null)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoginError('')
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setLoginError('Email o contraseña incorrectos.')
      } else if (err.code === 'auth/invalid-email') {
        setLoginError('El formato del email no es válido.')
      } else if (err.code === 'auth/too-many-requests') {
        setLoginError('Demasiados intentos. Intentá de nuevo más tarde.')
      } else {
        setLoginError('Error al iniciar sesión. Intentá de nuevo.')
      }
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    setCategorias([])
    setUserRoleState(null)
  }

  const isAdmin = userRole === 'admin'

  // ─── Fetch categorias ────────────────────────────────
  const fetchCategorias = useCallback(async () => {
    if (!userRole) return
    setLoading(true)
    try {
      const q = query(
        collection(db, 'categorias_reclamos'),
        orderBy('orden', 'asc')
      )
      const snap = await getDocs(q)
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setCategorias(items)
    } catch (err) {
      console.error('Error fetching categorias:', err)
      showToast('Error al cargar categorías', 'error')
    } finally {
      setLoading(false)
    }
  }, [userRole, showToast])

  useEffect(() => {
    if (userRole) {
      fetchCategorias()
    }
  }, [userRole, fetchCategorias])

  // ─── Open create modal ───────────────────────────────
  const handleOpenCreate = () => {
    setEditingId(null)
    setForm({
      ...initialFormState,
      orden: categorias.length + 1,
    })
    setFormError('')
    setShowModal(true)
  }

  // ─── Open edit modal ─────────────────────────────────
  const handleOpenEdit = (cat) => {
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

  // ─── Save (create or update) ─────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) {
      setFormError('El nombre de la categoría es obligatorio.')
      return
    }

    setSaving(true)
    setFormError('')

    try {
      const data = {
        nombre: form.nombre.trim(),
        color: form.color,
        icono: form.icono,
        activa: form.activa,
        orden: Number(form.orden) || 1,
        updated_at: new Date().toISOString(),
      }

      if (editingId) {
        await updateDoc(doc(db, 'categorias_reclamos', editingId), data)
        showToast('Categoría actualizada correctamente')
      } else {
        await addDoc(collection(db, 'categorias_reclamos'), {
          ...data,
          created_at: new Date().toISOString(),
        })
        showToast('Categoría creada correctamente')
      }

      setShowModal(false)
      setEditingId(null)
      fetchCategorias()
    } catch (err) {
      console.error('Error saving categoria:', err)
      setFormError('Error al guardar la categoría. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  // ─── Delete categoria ────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirm) return
    setDeleteLoading(true)
    try {
      await deleteDoc(doc(db, 'categorias_reclamos', deleteConfirm.id))
      showToast(`Categoría "${deleteConfirm.nombre}" eliminada`)
      setDeleteConfirm(null)
      fetchCategorias()
    } catch (err) {
      console.error('Error deleting categoria:', err)
      showToast('Error al eliminar la categoría', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  // ─── Loading state ───────────────────────────────────
  if (authLoading) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Gestión de"
          highlight="Categorías"
          description="Verificando sesión..."
        />
        <Section>
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        </Section>
      </div>
    )
  }

  // ─── Not authenticated ───────────────────────────────
  if (!user) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Gestión de"
          highlight="Categorías"
          description="Iniciá sesión con tu cuenta para gestionar las categorías de reclamos."
        />
        <Section>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Acceso al Panel
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Ingresá con tu cuenta municipal
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@municipio.gob.ar"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-sky-500 border border-sky-500 rounded-xl font-semibold text-white hover:bg-sky-600 transition-all shadow-sm"
                >
                  Iniciar Sesión
                </button>
              </form>

              <p className="text-xs text-slate-400 text-center mt-4">
                Solo usuarios autorizados pueden acceder a este panel.
              </p>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  // ─── Not authorized ──────────────────────────────────
  if (!userRole) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Sin"
          highlight="Acceso"
          description="No tenés permisos para acceder a este panel."
        >
          <div className="flex gap-2 mt-6 flex-wrap justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </SectionLayout>
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Acceso Restringido
              </h3>
              <p className="text-sm text-slate-500">
                Tu cuenta <strong>{user.email}</strong> no tiene un rol asignado
                en el panel de reclamos.
              </p>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  // ─── Main panel ──────────────────────────────────────
  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Eliminar Categoría
                </h3>
                <p className="text-sm text-slate-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              ¿Estás seguro de que querés eliminar la categoría{' '}
              <strong>{deleteConfirm.nombre}</strong>? Los reclamos existentes
              con esta categoría no se verán afectados.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-8 px-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden">
            <div className="bg-sky-500 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5" />
                <h3 className="font-bold text-lg">
                  {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingId(null)
                  setFormError('')
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  placeholder="Ej: Alumbrado Público"
                  required
                  autoFocus
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
                      className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                  </div>
                  <span className="text-sm text-slate-500 font-mono">
                    {form.color}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full border border-slate-200"
                    style={{ backgroundColor: form.color }}
                  />
                </div>
              </div>

              {/* Icono */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Icono
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {ICONOS_DISPONIBLES.map((icono) => (
                    <button
                      key={icono}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, icono }))
                      }
                      className={`p-2 rounded-lg border text-lg transition-all ${
                        form.icono === icono
                          ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      title={icono}
                    >
                      {getIconoEmoji(icono)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activa */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, activa: !prev.activa }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.activa ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.activa ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-slate-700">
                  {form.activa ? 'Activa' : 'Inactiva'}
                </span>
                {form.activa ? (
                  <Eye className="w-4 h-4 text-emerald-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {/* Orden */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Orden
                </label>
                <input
                  type="number"
                  value={form.orden}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      orden: parseInt(e.target.value) || 1,
                    }))
                  }
                  min={1}
                  max={999}
                  className="w-24 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingId(null)
                    setFormError('')
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : editingId ? (
                    'Guardar Cambios'
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Crear
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <SectionLayout
        title="Gestión de"
        highlight="Categorías"
        description="Administrá las categorías de reclamos que ven los ciudadanos al reportar."
      >
        {/* Admin bar */}
        <div className="bg-sky-500 text-white p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {user.displayName || user.email}
              </p>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {ROLE_LABELS[userRole] || userRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-lg">
              {categorias.length} categorías
            </span>

            {isAdmin && (
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/15 hover:bg-white/25 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Nueva
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/15 hover:bg-white/25 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
      </SectionLayout>

      {/* Main content */}
      <Section>
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          ) : categorias.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
              <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">
                No hay categorías
              </h3>
              <p className="text-sm text-slate-400">
                Todavía no se crearon categorías en la base de datos. Usá el
                botón "Nueva" para crear la primera.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Color
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Icono
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {categorias.map((cat) => (
                      <tr
                        key={cat.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {getIconoEmoji(cat.icono)}
                            </span>
                            <span className="text-sm font-medium text-slate-800">
                              {cat.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border border-slate-200"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-xs text-slate-500 font-mono">
                              {cat.color}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono text-slate-500">
                            {cat.icono || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {cat.activa !== false ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                              <Eye className="w-3 h-3" />
                              Activa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                              <EyeOff className="w-3 h-3" />
                              Inactiva
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {cat.orden || '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => handleOpenEdit(cat)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
                                  title="Editar"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(cat)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {!isAdmin && (
                              <span className="text-xs text-slate-400">
                                —
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  )
}

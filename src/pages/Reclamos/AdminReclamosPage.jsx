import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  MapPin,
  Search,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  LogOut,
  Shield,
  Users,
  Image,
  ChevronUp,
  ChevronDown,
  Settings2,
  ArrowUpDown,
  Mail,
  X,
  Plus,
  UserPlus,
  Pencil,
} from 'lucide-react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getCountFromServer,
  Timestamp,
  startAfter,
} from 'firebase/firestore'
import { db, auth } from '../../lib/firebase'
import { getUserRole, ROLE_LABELS } from '../../lib/adminUtils'
import { ESTADO_LABELS, ESTADO_COLORS } from '../../lib/reclamos'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'

// ─── Dynamic import for Leaflet map ─────────────────────
const MapPicker = React.lazy(() => import('../../assets/components/Reclamos/MapPicker'))

// ─── Constants ──────────────────────────────────────────
const PAGE_SIZE = 15

const ESTADOS = Object.entries(ESTADO_LABELS).map(([value, label]) => ({
  value,
  label,
  color: ESTADO_COLORS[value] || 'bg-gray-50 text-gray-700 border-gray-200',
}))

const FILTER_ESTADOS = [
  { value: 'todos', label: 'Todos los estados' },
  ...ESTADOS,
]

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Fecha' },
  { value: 'codigo', label: 'Código' },
  { value: 'categoria', label: 'Categoría' },
  { value: 'estado', label: 'Estado' },
]

// ─── Helper: format date ───────────────────────────────
function formatDate(ts) {
  if (!ts) return '-'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Helper: format timestamp for CSV ──────────────────
function formatDateCSV(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toISOString()
}

// ─── Helper: capitalize first letter ───────────────────
function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ─── Component ─────────────────────────────────────────
export default function AdminReclamosPage() {
  const navigate = useNavigate()

  // ─── Auth state ──────────────────────────────────────
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ─── Data state ──────────────────────────────────────
  const [reclamos, setReclamos] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [lastDoc, setLastDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // ─── Filters & search ────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('todos')
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')

  // ─── View mode ───────────────────────────────────────
  const [viewMode, setViewMode] = useState('table') // 'table' | 'map'

  // ─── Detail modal ────────────────────────────────────
  const [selectedReclamo, setSelectedReclamo] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [editEstado, setEditEstado] = useState('')
  const [editNotas, setEditNotas] = useState('')
  const [editRespuesta, setEditRespuesta] = useState('')
  const [saving, setSaving] = useState(false)

  // ─── Delete confirm ──────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // ─── Toast ───────────────────────────────────────────
  const [toast, setToast] = useState(null)

  // ─── Map markers ─────────────────────────────────────
  const [mapMarkers, setMapMarkers] = useState([])

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
        setUserRole(role)
      } else {
        setUser(null)
        setUserRole(null)
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
    setReclamos([])
    setLastDoc(null)
    setHasMore(true)
    setTotalCount(0)
  }

  const canEdit = userRole === 'admin' || userRole === 'inspector'
  const canDelete = userRole === 'admin'
  const canView = !!userRole

  // ─── Fetch reclamos ──────────────────────────────────
  const fetchReclamos = useCallback(async (isInitial = true) => {
    if (!canView) return
    try {
      if (isInitial) {
        setLoading(true)
        setReclamos([])
        setLastDoc(null)
        setHasMore(true)
      } else {
        setLoadingMore(true)
      }

      // Build query
      const constraints = [collection(db, 'reclamos')]
      const filters = []

      // Status filter
      if (estadoFilter !== 'todos') {
        filters.push(where('estado', '==', estadoFilter))
      }

      // Sort
      const sortDir = sortDirection === 'asc' ? 'asc' : 'desc'
      filters.push(orderBy(sortField, sortDir))

      // Pagination
      filters.push(limit(PAGE_SIZE))

      // After cursor
      if (!isInitial && lastDoc) {
        filters.push(startAfter(lastDoc))
      }

      const q = query(collection(db, 'reclamos'), ...filters)
      const snap = await getDocs(q)

      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))

      if (isInitial) {
        setReclamos(items)
      } else {
        setReclamos((prev) => [...prev, ...items])
      }

      setLastDoc(snap.docs[snap.docs.length - 1] || null)
      setHasMore(snap.docs.length === PAGE_SIZE)

      // Get total count (once)
      if (isInitial) {
        try {
          const countSnap = await getCountFromServer(collection(db, 'reclamos'))
          setTotalCount(countSnap.data().count || 0)
        } catch {
          setTotalCount(items.length)
        }
      }
    } catch (err) {
      console.error('Error fetching reclamos:', err)
      showToast('Error al cargar reclamos', 'error')
      if (isInitial) setReclamos([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [canView, estadoFilter, sortField, sortDirection, lastDoc, showToast])

  // ─── Refetch when filters change ─────────────────────
  useEffect(() => {
    if (canView) {
      fetchReclamos(true)
    }
  }, [canView, estadoFilter, sortField, sortDirection])

  // ─── Load more ───────────────────────────────────────
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchReclamos(false)
    }
  }

  // ─── Search (client-side) ────────────────────────────
  const filteredReclamos = React.useMemo(() => {
    if (!searchTerm.trim()) return reclamos
    const term = searchTerm.toLowerCase()
    return reclamos.filter(
      (r) =>
        (r.codigo && r.codigo.toLowerCase().includes(term)) ||
        (r.nombre && r.nombre.toLowerCase().includes(term)) ||
        (r.email && r.email.toLowerCase().includes(term)) ||
        (r.telefono && r.telefono.toLowerCase().includes(term)) ||
        (r.direccion && r.direccion.toLowerCase().includes(term)) ||
        (r.categoria && r.categoria.toLowerCase().includes(term)) ||
        (r.descripcion && r.descripcion.toLowerCase().includes(term))
    )
  }, [reclamos, searchTerm])

  // ─── Update map markers when data changes ────────────
  useEffect(() => {
    const markers = filteredReclamos
      .filter((r) => r.lat && r.lng)
      .map((r) => ({
        id: r.id,
        lat: r.lat,
        lng: r.lng,
        label: r.codigo || r.id,
        estado: r.estado,
      }))
    setMapMarkers(markers)
  }, [filteredReclamos])

  // ─── Open detail ─────────────────────────────────────
  const handleOpenDetail = (reclamo) => {
    setSelectedReclamo(reclamo)
    setEditEstado(reclamo.estado || 'pendiente')
    setEditNotas(reclamo.notas_internas || '')
    setEditRespuesta(reclamo.respuesta_ciudadano || '')
    setShowDetail(true)
  }

  // ─── Save detail ─────────────────────────────────────
  const handleSaveDetail = async () => {
    if (!selectedReclamo || !canEdit) return
    setSaving(true)
    try {
      const ref = doc(db, 'reclamos', selectedReclamo.id)
      await updateDoc(ref, {
        estado: editEstado,
        notas_internas: editNotas,
        respuesta_ciudadano: editRespuesta,
        updated_at: Timestamp.now(),
        updated_by: user?.email || '',
      })

      setReclamos((prev) =>
        prev.map((r) =>
          r.id === selectedReclamo.id
            ? {
                ...r,
                estado: editEstado,
                notas_internas: editNotas,
                respuesta_ciudadano: editRespuesta,
                updated_at: Timestamp.now(),
                updated_by: user?.email || '',
              }
            : r
        )
      )

      showToast('Reclamo actualizado correctamente')
      setShowDetail(false)
      setSelectedReclamo(null)
    } catch (err) {
      console.error('Error updating reclamo:', err)
      showToast('Error al actualizar el reclamo', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ─── Delete reclamo ──────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirm || !canDelete) return
    try {
      await deleteDoc(doc(db, 'reclamos', deleteConfirm))

      setReclamos((prev) => prev.filter((r) => r.id !== deleteConfirm))
      setTotalCount((prev) => Math.max(0, prev - 1))
      showToast('Reclamo eliminado correctamente')
      setDeleteConfirm(null)

      if (showDetail && selectedReclamo?.id === deleteConfirm) {
        setShowDetail(false)
        setSelectedReclamo(null)
      }
    } catch (err) {
      console.error('Error deleting reclamo:', err)
      showToast('Error al eliminar el reclamo', 'error')
    }
  }

  // ─── Export CSV ──────────────────────────────────────
  const handleExportCSV = () => {
    const headers = [
      'Código',
      'Fecha',
      'Categoría',
      'Estado',
      'Nombre',
      'Email',
      'Teléfono',
      'Dirección',
      'Descripción',
      'Notas Internas',
      'Respuesta',
      'Latitud',
      'Longitud',
    ]

    const rows = filteredReclamos.map((r) => [
      r.codigo || '',
      formatDateCSV(r.created_at),
      r.categoria || '',
      ESTADO_LABELS[r.estado] || r.estado || '',
      r.nombre || '',
      r.email || '',
      r.telefono || '',
      r.direccion || '',
      (r.descripcion || '').replace(/"/g, '""'),
      (r.notas_internas || '').replace(/"/g, '""'),
      (r.respuesta_ciudadano || '').replace(/"/g, '""'),
      r.lat || '',
      r.lng || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `reclamos_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast(`Exportados ${rows.length} reclamos`)
  }

  // ─── Estado badge ────────────────────────────────────
  const EstadoBadge = ({ estado }) => {
    const config = ESTADOS.find((e) => e.value === estado) || ESTADOS[0]
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${config.color}`}
      >
        {estado === 'pendiente' && <Clock className="w-3 h-3" />}
        {estado === 'en_revision' && <Search className="w-3 h-3" />}
        {estado === 'asignado' && <Users className="w-3 h-3" />}
        {estado === 'en_proceso' && <Loader2 className="w-3 h-3" />}
        {estado === 'resuelto' && <CheckCircle2 className="w-3 h-3" />}
        {estado === 'rechazado' && <AlertCircle className="w-3 h-3" />}
        {config.label}
      </span>
    )
  }

  // ─── Toast renderer ──────────────────────────────────
  const ToastMessage = () => {
    if (!toast) return null
    return (
      <div
        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all animate-in slide-in-from-right ${
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
    )
  }

  // ─── Loading state ───────────────────────────────────
  if (authLoading) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Panel de"
          highlight="Administración"
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
          title="Panel de"
          highlight="Administración"
          description="Iniciá sesión con tu cuenta para gestionar los reclamos ciudadanos."
        />
        <Section>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-sky-600" />
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

  // ─── Not authorized (no role assigned) ───────────────
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
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Acceso Restringido
              </h3>
              <p className="text-sm text-slate-500">
                Tu cuenta <strong>{user.email}</strong> no tiene un rol asignado
                en el panel de reclamos. Contactá al administrador del sistema
                para solicitar acceso.
              </p>
              <button
                onClick={handleLogout}
                className="mt-6 px-6 py-2.5 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
              >
                Cerrar Sesión
              </button>
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
      <ToastMessage />

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
                  Eliminar Reclamo
                </h3>
                <p className="text-sm text-slate-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              ¿Estás seguro de que querés eliminar este reclamo? Se borrará
              permanentemente de la base de datos.
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
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {showDetail && selectedReclamo && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-8 px-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="bg-sky-500 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-lg">
                    {selectedReclamo.codigo || 'Reclamo'}
                  </h3>
                  <p className="text-sm text-white/80">
                    {ESTADO_LABELS[selectedReclamo.estado] || selectedReclamo.estado}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetail(false)
                  setSelectedReclamo(null)
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Fecha
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(selectedReclamo.created_at)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Categoría
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedReclamo.categoria || '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nombre
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedReclamo.nombre || '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedReclamo.email || '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Teléfono
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedReclamo.telefono || '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Dirección
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedReclamo.direccion || '-'}
                  </p>
                </div>
                {selectedReclamo.lat && selectedReclamo.lng && (
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Ubicación
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedReclamo.lat.toFixed(5)}, {selectedReclamo.lng.toFixed(5)}
                    </p>
                    <div className="h-40 rounded-lg overflow-hidden border border-slate-200 mt-1">
                      <React.Suspense
                        fallback={
                          <div className="h-full flex items-center justify-center bg-slate-100 text-sm text-slate-400">
                            Cargando mapa...
                          </div>
                        }
                      >
                        <MapPicker
                          lat={selectedReclamo.lat}
                          lng={selectedReclamo.lng}
                          onPositionChange={() => {}}
                          height="100%"
                        />
                      </React.Suspense>
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Descripción
                </p>
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedReclamo.descripcion || 'Sin descripción'}
                </div>
              </div>

              {/* Fotos */}
              {selectedReclamo.fotos && selectedReclamo.fotos.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    Fotos ({selectedReclamo.fotos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedReclamo.fotos.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square rounded-lg overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={url}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Editable fields */}
              {canEdit && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                      Estado
                    </label>
                    <select
                      value={editEstado}
                      onChange={(e) => setEditEstado(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
                    >
                      {ESTADOS.map((est) => (
                        <option key={est.value} value={est.value}>
                          {est.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                      Notas Internas
                    </label>
                    <textarea
                      value={editNotas}
                      onChange={(e) => setEditNotas(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-y"
                      placeholder="Notas internas del área..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                      Respuesta al Ciudadano
                    </label>
                    <textarea
                      value={editRespuesta}
                      onChange={(e) => setEditRespuesta(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-y"
                      placeholder="Respuesta que se enviará al ciudadano..."
                    />
                  </div>
                </>
              )}

              {/* Updated by */}
              {selectedReclamo.updated_by && (
                <div className="text-xs text-slate-400 italic">
                  Última actualización por: {selectedReclamo.updated_by} —{' '}
                  {formatDate(selectedReclamo.updated_at)}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                {canDelete && (
                  <button
                    onClick={() => {
                      setShowDetail(false)
                      setDeleteConfirm(selectedReclamo.id)
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDetail(false)
                    setSelectedReclamo(null)
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cerrar
                </button>
                {canEdit && (
                  <button
                    onClick={handleSaveDetail}
                    disabled={saving}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <SectionLayout
        title="Panel de"
        highlight="Administración"
        description="Gestioná los reclamos ciudadanos: revisá, asigná y respondé a cada solicitud."
      >
        {/* Admin bar */}
        <div className="bg-sky-500 text-white p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{user.displayName || user.email}</p>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {ROLE_LABELS[userRole] || userRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-lg">
              {totalCount} reclamos
            </span>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/15 hover:bg-white/25 transition-colors"
              title="Exportar CSV"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>

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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por código, nombre, email, dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
              </div>

              {/* Status filter */}
              <div className="w-full md:w-48">
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
                >
                  {FILTER_ESTADOS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                  }
                  className="px-3 py-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                  title="Cambiar orden"
                >
                  {sortDirection === 'asc' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* View toggle */}
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-sky-500 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Tabla
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-1 ${
                    viewMode === 'map'
                      ? 'bg-sky-500 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Mapa
                </button>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredReclamos.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">
                No hay reclamos
              </h3>
              <p className="text-sm text-slate-400">
                {searchTerm
                  ? 'No se encontraron reclamos con ese criterio de búsqueda.'
                  : 'No hay reclamos registrados en la base de datos.'}
              </p>
            </div>
          )}

          {/* Table View */}
          {!loading && viewMode === 'table' && filteredReclamos.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReclamos.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                            {r.codigo || r.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                          {formatDate(r.created_at)}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-xs font-medium">
                          {r.categoria || '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-xs">
                          {r.nombre || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <EstadoBadge estado={r.estado} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenDetail(r)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
                              title="Ver detalle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {canDelete && (
                              <button
                                onClick={() => setDeleteConfirm(r.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Mostrando {filteredReclamos.length} de {totalCount} reclamos
                  {searchTerm && ` (filtrados)`}
                </p>
                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-sky-500 hover:bg-sky-50 disabled:opacity-50 transition-colors"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      'Cargar más'
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Map View */}
          {!loading && viewMode === 'map' && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  Mapa de Reclamos
                  <span className="text-xs font-normal text-slate-400">
                    ({mapMarkers.length} ubicaciones)
                  </span>
                </h3>
              </div>
              <div className="h-[500px]">
                <React.Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center bg-slate-100 text-sm text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Cargando mapa...
                    </div>
                  }
                >
                  {mapMarkers.length > 0 ? (
                    <MapViewer markers={mapMarkers} />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-slate-100 text-sm text-slate-400">
                      No hay reclamos con ubicación para mostrar en el mapa.
                    </div>
                  )}
                </React.Suspense>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  )
}

// ─── MapViewer component (lazy import for DOM-only lib) ──
function MapViewer({ markers }) {
  const [RL, setRL] = React.useState(null)

  useEffect(() => {
    let cancelled = false
    import('react-leaflet')
      .then((mod) => {
        if (!cancelled) setRL(mod)
      })
      .catch(() => {
        if (!cancelled) setRL(null)
      })
    return () => { cancelled = true }
  }, [])

  const MapContainer = RL?.MapContainer
  const TileLayer   = RL?.TileLayer
  const Marker      = RL?.Marker
  const Popup       = RL?.Popup

  if (!MapContainer) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-100 text-sm text-slate-400">
        No se pudo cargar el mapa
      </div>
    )
  }

  const center =
    markers.length > 0
      ? [markers[0].lat, markers[0].lng]
      : [-26.3983, -54.6167] // Eldorado center

  const getPinColor = (estado) => {
    const colors = {
      pendiente: '#eab308',
      en_revision: '#3b82f6',
      asignado: '#6366f1',
      en_proceso: '#f97316',
      resuelto: '#22c55e',
      rechazado: '#ef4444',
    }
    return colors[estado] || '#6b7280'
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">{m.label}</p>
              <p className="text-slate-500">{ESTADO_LABELS[m.estado] || m.estado}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

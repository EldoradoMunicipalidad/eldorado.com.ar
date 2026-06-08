import React, { useState, useEffect, useMemo, useCallback } from 'react'
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
  ArrowUpDown,
  Mail,
  X,
  Plus,
  UserPlus,
  Pencil,
} from 'lucide-react'
import { authenticateAdmin, getReclamos, getReclamosStats, updateReclamo, deleteReclamo, ESTADO_LABELS, ESTADO_COLORS } from '../../lib/reclamos'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'

const MapPicker = React.lazy(() => import('../../assets/components/Reclamos/MapPicker'))

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

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateCSV(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString()
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function AdminReclamosPage() {
  const navigate = useNavigate()

  // ─── Auth state ────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('reclamos_admin_auth') === 'true'
  )
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [username, setUsername] = useState(() => sessionStorage.getItem('reclamos_admin_username') || '')

  // ─── Data state ────────────────────────────────────
  const [reclamos, setReclamos] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalReclamos, setTotalReclamos] = useState(0)
  const [dataLoading, setDataLoading] = useState(false)

  // ─── Filters ───────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')

  // ─── Detail modal ────────────────────────────────
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailStatus, setDetailStatus] = useState('')
  const [detailNotas, setDetailNotas] = useState('')
  const [detailRespuesta, setDetailRespuesta] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmSave, setConfirmSave] = useState(false)

  // ─── Toast ─────────────────────────────────────────
  const [toast, setToast] = useState(null)
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // ─── Auth ─────────────────────────────────────────
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
      setUsername(loginUser.trim())
    } else {
      setLoginError('Usuario o contraseña incorrectos')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('reclamos_admin_auth')
    sessionStorage.removeItem('reclamos_admin_username')
    setIsAuthenticated(false)
    setUsername('')
    setLoginUser('')
    setLoginPass('')
  }

  // ─── Data fetching ─────────────────────────────────
  const fetchData = useCallback(async (page = 1, append = false) => {
    setDataLoading(true)
    try {
      const filters = {}
      if (statusFilter !== 'todos') filters.estado = statusFilter
      if (searchTerm.trim()) filters.search = searchTerm.trim()
      filters.sort = sortField
      filters.order = sortDirection

      const result = await getReclamos(page, PAGE_SIZE, filters)
      setReclamos(append ? [...reclamos, ...result.entries] : result.entries)
      setTotalReclamos(result.total)
      setTotalPages(Math.max(1, Math.ceil(result.total / PAGE_SIZE)))
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching reclamos:', err)
      showToast('Error al cargar reclamos', 'error')
    } finally {
      setDataLoading(false)
      setLoading(false)
    }
  }, [statusFilter, searchTerm, sortField, sortDirection, showToast])

  const fetchStats = useCallback(async () => {
    try {
      const s = await getReclamosStats()
      setStats(s)
    } catch {}
  }, [])

  // Initial load
  useEffect(() => {
    if (!isAuthenticated) return
    setLoading(true)
    fetchData(1)
    fetchStats()
  }, [isAuthenticated])

  // Refetch when filters/page change
  useEffect(() => {
    if (!isAuthenticated || loading) return
    fetchData(currentPage)
  }, [currentPage, statusFilter, searchTerm, sortField, sortDirection])

  // ─── Filter/search handlers ─────────────────────────
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
    return sortDirection === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-sky-500" />
      : <ChevronDown className="w-3.5 h-3.5 text-sky-500" />
  }

  // ─── Detail modal ──────────────────────────────────
  const openDetail = (item) => {
    setSelectedItem(item)
    setDetailStatus(item.estado || 'pendiente')
    setDetailNotas(item.notas_internas || '')
    setDetailRespuesta(item.respuesta_ciudadano || '')
    setConfirmSave(false)
    setShowDetailModal(true)
  }

  const handleSaveDetail = async () => {
    if (!selectedItem) return
    setSaving(true)
    try {
      const updated = await updateReclamo(selectedItem.id, {
        estado: detailStatus,
        notas_internas: detailNotas,
        respuesta_ciudadano: detailRespuesta,
      })
      if (updated) {
        setReclamos((prev) =>
          prev.map((r) =>
            r.id === selectedItem.id
              ? { ...r, estado: detailStatus, notas_internas: detailNotas, respuesta_ciudadano: detailRespuesta }
              : r
          )
        )
        showToast('Reclamo actualizado correctamente')
        setShowDetailModal(false)
        setSelectedItem(null)
        fetchStats()
      } else {
        showToast('Error al actualizar el reclamo', 'error')
      }
    } catch {
      showToast('Error al actualizar el reclamo', 'error')
    } finally {
      setSaving(false)
      setConfirmSave(false)
    }
  }

  // ─── Delete ────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDelete = async (id) => {
    setDeleteLoading(true)
    try {
      const ok = await deleteReclamo(id)
      if (ok) {
        setReclamos((prev) => prev.filter((r) => r.id !== id))
        setTotalReclamos((prev) => prev - 1)
        setTotalPages(Math.max(1, Math.ceil((totalReclamos - 1) / PAGE_SIZE)))
        showToast('Reclamo eliminado correctamente')
        setDeleteConfirm(null)
        fetchStats()
      } else {
        showToast('Error al eliminar el reclamo', 'error')
      }
    } catch {
      showToast('Error al eliminar el reclamo', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  // ─── CSV Export ────────────────────────────────────
  const exportCSV = () => {
    const headers = [
      'Código', 'Fecha', 'Categoría', 'Estado', 'Nombre', 'Email', 'Teléfono',
      'Dirección', 'Descripción', 'Notas Internas', 'Respuesta', 'Latitud', 'Longitud',
    ]
    const rows = reclamos.map((r) => [
      r.codigo || '', formatDateCSV(r.created_at), r.categoria || '', ESTADO_LABELS[r.estado] || r.estado || '',
      r.nombre || '', r.email || '', r.telefono || '', r.direccion || '',
      (r.descripcion || '').replace(/"/g, '""'),
      (r.notas_internas || '').replace(/"/g, '""'),
      (r.respuesta_ciudadano || '').replace(/"/g, '""'),
      r.lat || '', r.lng || '',
    ])
    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((v) => `"${v}"`).join(',')),
    ].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reclamos_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('CSV exportado correctamente')
  }

  // ─── Auth screen ──────────────────────────────────
  if (!isAuthenticated) {
    return (
      <>
        <SectionLayout
          title="Panel de"
          highlight="Administración"
          description="Gestión de reclamos ciudadanos — Ingresá con tu usuario y contraseña."
        />
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
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Iniciar Sesión
                </button>
              </form>
              <p className="text-xs text-slate-400 text-center mt-6">
                Solo usuarios autorizados pueden acceder a este panel.
              </p>
            </div>
          </div>
        </Section>
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
        description="Gestioná los reclamos ciudadanos: revisá, asigná, respondé y actualizá el estado de cada solicitud."
      >
        <div className="flex gap-2 mt-6 flex-wrap items-center">
          <Link
            to="/ciudadano-digital/reclamos/admin/categorias"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Categorías
          </Link>
          <Link
            to="/ciudadano-digital/reclamos/admin/users"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Usuarios
          </Link>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4 text-sky-500" />
            {username}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </SectionLayout>

      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-lg font-bold text-slate-800">{stats.total}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Total</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center">
                <div className="text-lg font-bold text-amber-600">{stats.pendientes}</div>
                <div className="text-[10px] text-amber-500 mt-0.5">Pendiente</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-200 text-center">
                <div className="text-lg font-bold text-blue-600">{stats.en_revision}</div>
                <div className="text-[10px] text-blue-500 mt-0.5">Revisión</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-indigo-200 text-center">
                <div className="text-lg font-bold text-indigo-600">{stats.asignados + stats.en_proceso}</div>
                <div className="text-[10px] text-indigo-500 mt-0.5">En Proceso</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center">
                <div className="text-lg font-bold text-emerald-600">{stats.resueltos}</div>
                <div className="text-[10px] text-emerald-500 mt-0.5">Resuelto</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-red-200 text-center">
                <div className="text-lg font-bold text-red-500">{stats.rechazados}</div>
                <div className="text-[10px] text-red-400 mt-0.5">Rechazado</div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por código, título, email..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </form>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
              className="px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white"
            >
              {FILTER_ESTADOS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          {dataLoading && reclamos.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Cargando reclamos...</p>
            </div>
          ) : reclamos.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No hay reclamos con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <th className="text-left px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('codigo')}>
                      <div className="flex items-center gap-1">
                        Código <SortIcon field="codigo" />
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('created_at')}>
                      <div className="flex items-center gap-1">
                        Fecha <SortIcon field="created_at" />
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('categoria')}>
                      <div className="flex items-center gap-1">
                        Categoría <SortIcon field="categoria" />
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('estado')}>
                      <div className="flex items-center gap-1">
                        Estado <SortIcon field="estado" />
                      </div>
                    </th>
                    <th className="text-left px-4 py-3">Título</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reclamos.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-sky-600">
                        {item.codigo || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {item.categoria || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ESTADO_COLORS[item.estado] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {ESTADO_LABELS[item.estado] || item.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-[200px] truncate">
                        {item.titulo || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {item.email || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openDetail(item)}
                            className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-slate-500">
                Página {currentPage} de {totalPages} ({totalReclamos} reclamos)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    currentPage <= 1
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ‹
                </button>
                {(() => {
                  const pages = []
                  const startPage = Math.max(1, currentPage - 2)
                  const endPage = Math.min(totalPages, currentPage + 2)
                  if (startPage > 1) {
                    pages.push(
                      <button key={1} onClick={() => setCurrentPage(1)}
                        className="w-8 h-8 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
                      >1</button>
                    )
                    if (startPage > 2) pages.push(<span key="ds" className="text-slate-300 text-xs">···</span>)
                  }
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button key={i} onClick={() => setCurrentPage(i)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium border transition-colors ${
                          i === currentPage
                            ? 'bg-sky-500 text-white border-sky-500'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >{i}</button>
                    )
                  }
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) pages.push(<span key="de" className="text-slate-300 text-xs">···</span>)
                    pages.push(
                      <button key={totalPages} onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
                      >{totalPages}</button>
                    )
                  }
                  return pages
                })()}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    currentPage >= totalPages
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ›
                </button>
              </div>
            </div>
          )}

          {/* Delete confirmation */}
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Eliminar reclamo</h3>
                    <p className="text-sm text-slate-500">Esta acción no se puede deshacer.</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    disabled={deleteLoading}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60 flex items-center gap-2"
                  >
                    {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Detail Modal */}
          {showDetailModal && selectedItem && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                  <h3 className="text-lg font-bold text-slate-800">
                    Reclamo {selectedItem.codigo}
                  </h3>
                  <button onClick={() => setShowDetailModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Código</p>
                      <p className="font-mono text-sm font-semibold text-sky-600">{selectedItem.codigo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Fecha</p>
                      <p className="text-sm text-slate-700">{formatDate(selectedItem.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Categoría</p>
                      <p className="text-sm text-slate-700">{selectedItem.categoria || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Email</p>
                      <p className="text-sm text-slate-700">{selectedItem.email || '—'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Título</p>
                    <p className="text-sm font-medium text-slate-800">{selectedItem.titulo}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Descripción</p>
                    <p className="text-sm text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-lg">{selectedItem.descripcion || '—'}</p>
                  </div>

                  {selectedItem.direccion && (
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Dirección</p>
                      <p className="text-sm text-slate-700">{selectedItem.direccion}</p>
                    </div>
                  )}

                  {selectedItem.fotos && selectedItem.fotos.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Fotos ({selectedItem.fotos.length})</p>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedItem.fotos.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-slate-200"
                          >
                            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Edit form */}
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <h4 className="font-semibold text-slate-800 text-sm">Actualizar reclamo</h4>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Estado</label>
                      <select
                        value={detailStatus}
                        onChange={(e) => {
                          setDetailStatus(e.target.value)
                          setConfirmSave(false)
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                      >
                        {ESTADOS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Notas internas</label>
                      <textarea
                        value={detailNotas}
                        onChange={(e) => {
                          setDetailNotas(e.target.value)
                          setConfirmSave(false)
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                        placeholder="Notas visibles solo para administradores..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Respuesta al ciudadano</label>
                      <textarea
                        value={detailRespuesta}
                        onChange={(e) => {
                          setDetailRespuesta(e.target.value)
                          setConfirmSave(false)
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                        placeholder="Escribí una respuesta pública para el ciudadano..."
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50"
                  >
                    Cerrar
                  </button>
                  {!confirmSave ? (
                    <button
                      onClick={() => setConfirmSave(true)}
                      className="px-5 py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600"
                    >
                      Guardar Cambios
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmSave(false)}
                        className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveDetail}
                        disabled={saving}
                        className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Confirmar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

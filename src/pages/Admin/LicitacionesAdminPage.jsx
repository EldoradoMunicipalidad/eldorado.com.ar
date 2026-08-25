// Admin Licitaciones — gestión CRUD de licitaciones municipales.
//
// - Login con Bearer contra /api/auth/login (tabla 'admins' global).
// - Listado con búsqueda, filtros, acciones (editar, eliminar).
// - Modal de crear/editar con upload de PDF a R2.
// - Soft delete: el botón "Eliminar" pide confirmación.
// - Logout limpia el token de sessionStorage.

import React, { useState, useEffect, useCallback } from 'react'
import {
  Shield, Save, Loader2, AlertCircle, CheckCircle2, LogOut,
  Plus, Trash2, Pencil, X, Eye, FileText, Upload, RefreshCw,
} from 'lucide-react'
import {
  loginAdmin, listLicitaciones, createLicitacion,
  updateLicitacion, deleteLicitacion, clearStoredToken, getStoredToken,
} from '../../lib/licitacionesAdmin'

// ─── Login screen ─────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [creds, setCredds] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const res = await loginAdmin(creds.username, creds.password)
    setSubmitting(false)
    if (res.ok) {
      onLogin(res.username)
    } else {
      setError(res.error || 'No se pudo iniciar sesión')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-sky-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Admin Licitaciones</h1>
            <p className="text-xs text-slate-500">Municipalidad de Eldorado</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Usuario</label>
          <input
            type="text"
            value={creds.username}
            onChange={(e) => setCredds({ ...creds, username: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={creds.password}
              onChange={(e) => setCredds({ ...creds, password: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoComplete="current-password"
              required
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPw ? '🙈' : '👁'}
            </button>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-sky-600 text-white rounded-lg py-2 font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Ingresando...</> : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

// ─── Field components ────────────────────────────────────────────────
function Field({ label, children, hint }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

// ─── Date conversion (DD/MM/YYYY <-> YYYY-MM-DD) ─────────────────────
const isoToDMY = (iso) => {
  if (!iso) return ''
  // Acepta 'YYYY-MM-DD' o Date ISO
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[3]}/${m[2]}/${m[1]}`
  // Si ya viene en DD/MM/YYYY (caso legacy), devolver tal cual
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(iso)) return iso
  return ''
}

const dmyToIso = (dmy) => {
  if (!dmy) return ''
  const m = dmy.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return ''
  return `${m[3]}-${m[2]}-${m[1]}`
}

// ─── Form Modal (crear / editar) ──────────────────────────────────────
function LicitacionFormModal({ item, onClose, onSaved }) {
  const isEdit = !!item
  const [codigo, setCodigo] = useState(item?.codigo || '')
  const [tipo, setTipo] = useState(item?.tipo || 'publica')
  const [fecha, setFecha] = useState(isoToDMY(item?.fechaPublicacion) || '')
  const [descripcion, setDescripcion] = useState(item?.descripcion || '')
  const [pdf, setPdf] = useState(null) // File object (solo si se reemplazó)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validación local
    if (!codigo.trim() || !fecha || !descripcion.trim()) {
      setError('Código, fecha y descripción son obligatorios')
      return
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      setError('Fecha debe tener formato DD/MM/YYYY')
      return
    }

    setSaving(true)
    try {
      const payload = {
        codigo: codigo.trim(),
        tipo,
        fechaPublicacion: fecha,
        descripcion: descripcion.trim(),
        pdf: pdf || undefined,
      }
      const result = isEdit
        ? await updateLicitacion(item.id, payload)
        : await createLicitacion(payload)
      onSaved(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {isEdit ? <><Pencil className="w-5 h-5 text-sky-600" /> Editar licitación</> : <><Plus className="w-5 h-5 text-sky-600" /> Nueva licitación</>}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Código" hint="Formato NN/YYYY (ej: 05/2026)">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="05/2026"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </Field>
            <Field label="Tipo">
              <div className="flex gap-2">
                {['publica', 'privada'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      tipo === t
                        ? t === 'publica'
                          ? 'bg-sky-100 border-sky-400 text-sky-700'
                          : 'bg-amber-100 border-amber-400 text-amber-700'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t === 'publica' ? 'Pública' : 'Privada'}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <Field label="Fecha de publicación" hint="Formato DD/MM/YYYY">
            <input
              type="text"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              placeholder="25/08/2026"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </Field>
          <Field label="Descripción">
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Licitación Pública N° 05/2026 — Adquisición de ..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              required
            />
          </Field>
          <Field label={isEdit ? 'Reemplazar PDF ( dejar vacío para mantener el actual )' : 'PDF del pliego (opcional)'}>
            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50 w-fit">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>{pdf ? pdf.name : 'Seleccionar PDF'}</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(e) => setPdf(e.target.files?.[0] || null)}
              />
            </label>
            {isEdit && item?.pdfFilename && !pdf && (
              <p className="text-xs text-slate-500 mt-1">
                PDF actual: <span className="font-semibold">{item.pdfFilename}</span>
              </p>
            )}
          </Field>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
        </form>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-50"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : <><Save className="w-4 h-4" /> Guardar</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Confirm modal (soft delete) ─────────────────────────────────────
function ConfirmDeleteModal({ item, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false)
  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm()
    } finally {
      setDeleting(false)
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Eliminar licitación</h3>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            ¿Eliminar la licitación <span className="font-bold">{item?.codigo}</span>?
          </p>
          <p className="text-xs text-slate-500">
            Se marcará como eliminada y no se mostrará en el sitio. La fila queda en la base
            y puede restaurarse desde este mismo panel.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Eliminando...</> : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main admin page ─────────────────────────────────────────────────
export default function LicitacionesAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredToken())
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('todos')
  const [modal, setModal] = useState(null) // null | { type: 'create' } | { type: 'edit', item } | { type: 'delete', item }
  const [status, setStatus] = useState(null) // { type: 'success'|'error', msg }
  const [unauthorized, setUnauthorized] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setUnauthorized(false)
    const res = await listLicitaciones()
    if (res.unauthorized) {
      setUnauthorized(true)
      setIsAuthenticated(false)
      clearStoredToken()
    } else {
      setItems(res.items)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated) load()
  }, [isAuthenticated, load])

  const handleSaved = (saved) => {
    setStatus({ type: 'success', msg: `Licitación ${saved.codigo} guardada.` })
    setModal(null)
    load()
  }

  const handleDelete = async () => {
    try {
      await deleteLicitacion(modal.item.id)
      setStatus({ type: 'success', msg: `Licitación ${modal.item.codigo} eliminada.` })
      setModal(null)
      load()
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
      setModal(null)
    }
  }

  const handleLogout = () => {
    clearStoredToken()
    setIsAuthenticated(false)
    setItems([])
  }

  // Filtrado en cliente (dataset chico, no necesita paginación server-side)
  const filtered = items.filter((it) => {
    if (filterTipo !== 'todos' && it.tipo !== filterTipo) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        it.codigo.toLowerCase().includes(q) ||
        (it.descripcion || '').toLowerCase().includes(q) ||
        (it.fechaPublicacion || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  // ─── Login ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />
  }

  // ─── Admin ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-sky-600" />
          <div>
            <h1 className="text-lg font-bold text-slate-800">Admin Licitaciones</h1>
            <p className="text-xs text-slate-500">Gestión de convocatorias y pliegos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/gobierno-abierto/licitaciones"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-sky-600 text-sm border border-slate-300 rounded-lg hover:border-sky-400 transition-colors"
          >
            <Eye className="w-4 h-4" /> Ver sitio
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-600 text-sm border border-slate-300 rounded-lg hover:border-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
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

      {/* Toolbar */}
      <div className="mx-6 mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-1 items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, descripción o fecha..."
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="todos">Todos</option>
              <option value="publica">Pública</option>
              <option value="privada">Privada</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-sky-600 text-sm border border-slate-300 rounded-lg hover:border-sky-400 transition-colors"
              title="Refrescar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setModal({ type: 'create' })}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Nueva licitación
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="mx-6 my-4 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">
              {items.length === 0 ? 'No hay licitaciones cargadas.' : 'No se encontraron resultados.'}
            </p>
            {items.length === 0 && (
              <button
                onClick={() => setModal({ type: 'create' })}
                className="mt-3 text-sm text-sky-600 hover:text-sky-800 underline"
              >
                Crear la primera
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 w-px">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Descripción</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 w-px">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 w-px">PDF</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600 w-px">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((it) => (
                  <tr key={it.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        it.tipo === 'privada' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {it.tipo === 'privada' ? 'Privada' : 'Pública'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{it.codigo}</div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{it.descripcion}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{it.fechaPublicacion}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {it.pdfFilename ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                          <FileText className="w-3 h-3 text-red-500" />
                          <span className="truncate max-w-[180px]" title={it.pdfFilename}>{it.pdfFilename}</span>
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModal({ type: 'edit', item: it })}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setModal({ type: 'delete', item: it })}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar (soft delete)"
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
      </div>

      {/* Modales */}
      {modal?.type === 'create' && (
        <LicitacionFormModal
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {modal?.type === 'edit' && (
        <LicitacionFormModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {modal?.type === 'delete' && (
        <ConfirmDeleteModal
          item={modal.item}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
// PostgreSQL data layer for Reclamos Ciudadanos
// Replaces Firebase Firestore + Storage with REST API calls

const API = '/api/reclamos'

// ─── Generate unique code ────────────────────────────
export function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'RC-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ─── Guardar reclamo ─────────────────────────────────
export async function guardarReclamo(data) {
  const res = await fetch(`${API}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al guardar reclamo')
  return await res.json()
}

// ─── Subir foto ──────────────────────────────────────
export function subirFoto(file, onProgress, onComplete, onError) {
  const formData = new FormData()
  formData.append('file', file)

  const xhr = new XMLHttpRequest()

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const progress = Math.round((e.loaded / e.total) * 100)
      onProgress(progress)
    }
  }

  xhr.onload = () => {
    if (xhr.status === 200) {
      try {
        const data = JSON.parse(xhr.responseText)
        onComplete(data.url)
      } catch (e) {
        onError(new Error('Error al procesar la respuesta'))
      }
    } else {
      onError(new Error('Error al subir la foto'))
    }
  }

  xhr.onerror = () => onError(new Error('Error de red'))

  xhr.open('POST', `${API}/upload`)
  xhr.send(formData)
}

// ─── Obtener categorías ──────────────────────────────
export async function getCategorias(activas = true) {
  try {
    const res = await fetch(`${API}/categorias?activas=${activas}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('getCategorias error:', e.message)
    return []
  }
}

// ─── Buscar reclamo por código ────────────────────────
export async function buscarReclamo(codigo) {
  try {
    const res = await fetch(`${API}/search?codigo=${encodeURIComponent(codigo)}`)
    const data = await res.json()
    return data || null
  } catch (e) {
    console.warn('buscarReclamo error:', e.message)
    return null
  }
}

// ─── Obtener reclamos (paginado) ─────────────────────
export async function getReclamos(page = 1, limit = 15, filters = {}) {
  try {
    const params = new URLSearchParams()
    params.set('page', page)
    params.set('limit', limit)
    if (filters.estado && filters.estado !== 'todos') params.set('estado', filters.estado)
    if (filters.categoria) params.set('categoria', filters.categoria)
    if (filters.search) params.set('search', filters.search)
    if (filters.sort) params.set('sort', filters.sort)
    if (filters.order) params.set('order', filters.order)

    const res = await fetch(`${API}?${params}`)
    const data = await res.json()
    return {
      entries: data.entries || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || limit,
    }
  } catch (e) {
    console.warn('getReclamos error:', e.message)
    return { entries: [], total: 0, page: 1, limit }
  }
}

// ─── Obtener stats ───────────────────────────────────
export async function getReclamosStats() {
  try {
    const res = await fetch(`${API}/stats`)
    return await res.json()
  } catch (e) {
    console.warn('getReclamosStats error:', e.message)
    return { total: 0, pendientes: 0, en_revision: 0, asignados: 0, en_proceso: 0, resueltos: 0, rechazados: 0 }
  }
}

// ─── Actualizar reclamo ──────────────────────────────
export async function updateReclamo(id, data) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al actualizar')
    return await res.json()
  } catch (e) {
    console.warn('updateReclamo error:', e.message)
    return null
  }
}

// ─── Eliminar reclamo ────────────────────────────────
export async function deleteReclamo(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    return res.ok
  } catch (e) {
    console.warn('deleteReclamo error:', e.message)
    return false
  }
}

// ─── Categorías CRUD (admin) ─────────────────────────
export async function crearCategoria(data) {
  const res = await fetch(`${API}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return await res.json()
}

export async function actualizarCategoria(id, data) {
  const res = await fetch(`${API}/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return await res.json()
}

export async function eliminarCategoria(id) {
  const res = await fetch(`${API}/categorias/${id}`, { method: 'DELETE' })
  return res.ok
}

// ─── Auth ────────────────────────────────────────────
export async function authenticateAdmin(username, password) {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    return data.authenticated === true
  } catch (e) {
    console.warn('authenticateAdmin error:', e.message)
    return false
  }
}

// ─── Admins CRUD ─────────────────────────────────────
export async function getAdmins() {
  try {
    const res = await fetch(`${API}/admins`)
    return await res.json()
  } catch (e) {
    console.warn('getAdmins error:', e.message)
    return []
  }
}

export async function createAdmin(username, password, nombre, email) {
  const res = await fetch(`${API}/admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, nombre, email }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error al crear admin')
  }
  return await res.json()
}

export async function deleteAdmin(username) {
  const res = await fetch(`${API}/admins/${encodeURIComponent(username)}`, { method: 'DELETE' })
  return res.ok
}

// ─── Labels de estado ─────────────────────────────────
export const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  en_revision: 'En Revisión',
  asignado: 'Asignado',
  en_proceso: 'En Proceso',
  resuelto: 'Resuelto',
  rechazado: 'Rechazado',
}

export const ESTADO_COLORS = {
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  en_revision: 'bg-blue-50 text-blue-700 border-blue-200',
  asignado: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  en_proceso: 'bg-orange-50 text-orange-700 border-orange-200',
  resuelto: 'bg-green-50 text-green-700 border-green-200',
  rechazado: 'bg-red-50 text-red-700 border-red-200',
}

// ─── Categorías por defecto ──────────────────────────
export const CATEGORIAS_POR_DEFECTO = [
  { nombre: 'Alumbrado Público', icono: 'Lightbulb', color: '#f59e0b', activa: true, orden: 1 },
  { nombre: 'Bache o Calle', icono: 'TriangleAlert', color: '#ef4444', activa: true, orden: 2 },
  { nombre: 'Residuos y Limpieza', icono: 'Trash2', color: '#10b981', activa: true, orden: 3 },
  { nombre: 'Veredas', icono: 'Footprints', color: '#8b5cf6', activa: true, orden: 4 },
  { nombre: 'Tránsito y Señalización', icono: 'TrafficCone', color: '#3b82f6', activa: true, orden: 5 },
  { nombre: 'Arbolado', icono: 'Trees', color: '#22c55e', activa: true, orden: 6 },
  { nombre: 'Ruidos Molestos', icono: 'VolumeX', color: '#ec4899', activa: true, orden: 7 },
  { nombre: 'Otro', icono: 'AlertCircle', color: '#6b7280', activa: true, orden: 8 },
]

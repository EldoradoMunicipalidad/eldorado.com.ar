// Registro de Vehículos — Data layer
// Endpoints: /api/registro-vehiculos/* (Colectivos + Transporte Especializado)
// Auth: bearer user:pass en sessionStorage (devuelto por /auth/login)

const API = '/api/registro-vehiculos'
const TOKEN_KEY = 'registro_vehiculos_admin_token'

// ─── Token persistente en sessionStorage ──────────────────────────────────────
export function getStoredToken() {
  try { return sessionStorage.getItem(TOKEN_KEY) || null } catch { return null }
}
export function setStoredToken(t) {
  try { if (t) sessionStorage.setItem(TOKEN_KEY, t); else sessionStorage.removeItem(TOKEN_KEY) } catch {}
}
export function clearStoredToken() {
  try { sessionStorage.removeItem(TOKEN_KEY) } catch {}
}

// ─── Auth headers para llamadas admin (Bearer) ───────────────────────
function getAuthHeaders(json = true) {
  const headers = json ? { 'Content-Type': 'application/json' } : {}
  const t = getStoredToken()
  if (t) headers['Authorization'] = `Bearer ${t}`
  return headers
}

// ─── CONFIG (PUBLICO) ──────────────────────────────────────────────
export async function getConfig() {
  try {
    const res = await fetch(`${API}/config`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  } catch (e) {
    console.warn('getConfig error:', e.message)
    return { id: 'default', modulo_pausado: false, permitir_publico: true }
  }
}

// ─── COLECTIVOS (lectura PUBLICA) ──────────────────────────────────
export async function getColectivos() {
  try {
    const res = await fetch(`${API}/colectivos`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  } catch (e) {
    console.warn('getColectivos error:', e.message)
    return []
  }
}

// ADMIN
export async function createColectivo(data) {
  const res = await fetch(`${API}/colectivos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(false) },
    body: JSON.stringify(data),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al registrar colectivo')
  return result
}

// ADMIN
export async function deleteColectivo(id) {
  const res = await fetch(`${API}/colectivos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(false),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al eliminar')
  return result
}

// ─── TRANSPORTE ESPECIALIZADO (lectura PUBLICA) ──────────────────────
export async function getEspecializados() {
  try {
    const res = await fetch(`${API}/especializados`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  } catch (e) {
    console.warn('getEspecializados error:', e.message)
    return []
  }
}

// ADMIN
export async function createEspecializado(data) {
  const res = await fetch(`${API}/especializados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(false) },
    body: JSON.stringify(data),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al registrar vehículo especializado')
  return result
}

// ADMIN
export async function deleteEspecializado(id) {
  const res = await fetch(`${API}/especializados/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(false),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al eliminar')
  return result
}

// ─── AUTH ──────────────────────────────────────────────────────────
// Guarda token en sessionStorage tras login exitoso.
export async function authenticateAdmin(username, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (!res.ok || !data.authenticated) {
    throw new Error(data.error || 'Credenciales inválidas')
  }
  if (data.token) setStoredToken(data.token)
  return data
}

// ─── ADMINS management (requiere admin auth) ───────────────────────
export async function getAdmins() {
  try {
    const res = await fetch(`${API}/admins`, { headers: getAuthHeaders(false) })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  } catch (e) {
    return []
  }
}

export async function createAdmin(data) {
  const res = await fetch(`${API}/admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(false) },
    body: JSON.stringify(data),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al crear admin')
  return result
}

export async function deleteAdmin(username) {
  const res = await fetch(`${API}/admins/${encodeURIComponent(username)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(false),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al eliminar admin')
  return result
}

// Registro de Vehículos — Data layer
// Endpoints: /api/registro-vehiculos/* (Colectivos + Transporte Especializado)
// Auth independiente: admins_registro_vehiculos (Usuario1 / unoUsuario)

const API = '/api/registro-vehiculos'

// ─── CONFIG ────────────────────────────────────────────────────────
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

// ─── COLECTIVOS ────────────────────────────────────────────────────
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

export async function createColectivo(data) {
  const res = await fetch(`${API}/colectivos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al registrar colectivo')
  return result
}

export async function deleteColectivo(id) {
  const res = await fetch(`${API}/colectivos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al eliminar')
  return result
}

// ─── TRANSPORTE ESPECIALIZADO ─────────────────────────────────────
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

export async function createEspecializado(data) {
  const res = await fetch(`${API}/especializados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al registrar vehículo especializado')
  return result
}

export async function deleteEspecializado(id) {
  const res = await fetch(`${API}/especializados/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al eliminar')
  return result
}

// Helper: arma header Authorization para endpoints protegidos.
// El cliente debe haber pasado por authenticateAdmin antes,
// que guarda username + password en localStorage.
function getAuthHeaders() {
  const auth = getStoredAuth()
  if (!auth || !auth.username || !auth.passwordHash) {
    return {}
  }
  return {
    Authorization: `Bearer ${auth.username}:${auth.passwordHash}`,
  }
}

// ─── AUTH ──────────────────────────────────────────────────────────
const AUTH_KEY = 'registroVehiculosAuth'

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Expiración a las 8 horas
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(AUTH_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function setStoredAuth(auth) {
  const data = { ...auth, expiresAt: Date.now() + 8 * 60 * 60 * 1000 }
  localStorage.setItem(AUTH_KEY, JSON.stringify(data))
  return data
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_KEY)
}

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
  // Guardamos también passwordHash para reenviar en Authorization Bearer.
  // El frontend recalcula el hash con la misma función simpleHash del backend.
  return setStoredAuth({
    username: data.username,
    nombre: data.nombre,
    rol: data.rol,
    passwordHash: simpleHashClient(password),
  })
}

// Misma función simpleHash que server/routes/registroVehiculos.cjs
// Se usa solo del lado cliente para generar el header Authorization.
function simpleHashClient(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash.toString(36)
}

// ─── ADMINS management ─────────────────────────────────────────────
export async function getAdmins() {
  try {
    const res = await fetch(`${API}/admins`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  } catch (e) {
    return []
  }
}

export async function createAdmin(data) {
  const res = await fetch(`${API}/admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al crear admin')
  return result
}

export async function deleteAdmin(username) {
  const res = await fetch(`${API}/admins/${username}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'Error al eliminar admin')
  return result
}

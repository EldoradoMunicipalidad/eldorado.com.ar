// Admin Licitaciones — API con Bearer auth contra tabla 'admins' global
//
// Login: usa /api/auth/login (endpoint GLOBAL en server/index.cjs) que devuelve
// { authenticated, username, token: "username:password" } para usar como Bearer.
// Token persistido en sessionStorage bajo 'licitaciones_admin_token'.

const API = '/api/licitaciones'
const AUTH_API = '/api/auth/login'
const TOKEN_KEY = 'licitaciones_admin_token'

// ─── Token persistente ────────────────────────────────────────────────
export function getStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setStoredToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {}
}

export function clearStoredToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {}
}

// ─── Auth helper ──────────────────────────────────────────────────────
// Devuelve header Authorization: Bearer <token> si hay token guardado.
function authHeader() {
  const t = getStoredToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// ─── Login ────────────────────────────────────────────────────────────
// Devuelve { ok: true, username } o { ok: false, error }.
export async function loginAdmin(username, password) {
  try {
    const res = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.authenticated) {
      return { ok: false, error: data.error || 'Credenciales inválidas' }
    }
    if (data.token) setStoredToken(data.token)
    return { ok: true, username: data.username }
  } catch (e) {
    return { ok: false, error: 'No se pudo conectar al servidor' }
  }
}

// ─── Listar (todas, incluso soft-deleted opcionalmente) ──────────────
export async function listLicitaciones({ includeDeleted = false } = {}) {
  const res = await fetch(API, { headers: authHeader() })
  if (res.status === 401) return { items: [], unauthorized: true }
  if (!res.ok) throw new Error('Error al listar licitaciones')
  const data = await res.json()
  return { items: data.items || [] }
}

// ─── Crear (multipart con PDF opcional) ───────────────────────────────
// Devuelve la fila creada. El backend devuelve { error } con status 400/409
// si algo falla.
export async function createLicitacion({ codigo, tipo, fechaPublicacion, descripcion, pdf }) {
  const form = new FormData()
  form.append('codigo', codigo)
  form.append('tipo', tipo)
  form.append('fechaPublicacion', fechaPublicacion)
  form.append('descripcion', descripcion)
  if (pdf) form.append('pdf', pdf)

  const res = await fetch(API, {
    method: 'POST',
    headers: authHeader(), // NO seteamos Content-Type: el browser lo hace con boundary
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

// ─── Editar (multipart con PDF opcional) ──────────────────────────────
export async function updateLicitacion(id, { codigo, tipo, fechaPublicacion, descripcion, pdf }) {
  const form = new FormData()
  if (codigo !== undefined) form.append('codigo', codigo)
  if (tipo !== undefined) form.append('tipo', tipo)
  if (fechaPublicacion !== undefined) form.append('fechaPublicacion', fechaPublicacion)
  if (descripcion !== undefined) form.append('descripcion', descripcion)
  if (pdf) form.append('pdf', pdf)

  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

// ─── Soft delete ──────────────────────────────────────────────────────
export async function deleteLicitacion(id) {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

// ─── Restore (revierte soft delete) ───────────────────────────────────
export async function restoreLicitacion(id) {
  const res = await fetch(`${API}/${id}/restore`, {
    method: 'POST',
    headers: authHeader(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}
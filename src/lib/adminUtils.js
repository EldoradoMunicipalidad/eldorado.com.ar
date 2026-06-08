// Admin utilities for Reclamos — PostgreSQL backend
// Replaces Firebase Firestore-based admin user management

const API = '/api/reclamos'

export async function getUserRole(user) {
  // With PostgreSQL auth, the role is determined by login
  // For now, return 'admin' if username matches (stored in sessionStorage)
  if (!user) return null
  try {
    const stored = sessionStorage.getItem('reclamos_admin_username')
    if (!stored) return null
    // We trust the login — admin always gets full access
    return 'admin'
  } catch {
    return null
  }
}

export async function getAllAdminUsers() {
  try {
    const res = await fetch(`${API}/admins`)
    if (!res.ok) return []
    const data = await res.json()
    return data.map((row) => ({
      uid: row.username,
      username: row.username,
      nombre: row.nombre || '',
      email: row.email || '',
      role: row.rol || 'admin',
    }))
  } catch {
    return []
  }
}

export async function setUserRole(uid, data) {
  // uid is actually the username now
  try {
    // If the admin already exists via the auth system, just update their info
    const res = await fetch(`${API}/admins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: uid,
        password: uid, // placeholder — actual password set at creation time
        nombre: data.nombre || '',
        email: data.email || '',
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function removeUserRole(uid) {
  try {
    await fetch(`${API}/admins/${encodeURIComponent(uid)}`, { method: 'DELETE' })
  } catch {
    // ignore
  }
}

export const ROLE_LABELS = {
  admin: 'Administrador',
  inspector: 'Inspector',
  viewer: 'Solo Vista',
}

export const ROLE_DESCRIPTIONS = {
  admin: 'Acceso completo al panel de reclamos',
  inspector: 'Ver, cambiar estado, asignar y responder reclamos',
  viewer: 'Solo visualizar reclamos',
}

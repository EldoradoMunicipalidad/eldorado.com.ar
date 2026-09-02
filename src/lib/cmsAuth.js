const AUTH_API = '/api/auth/login'
const TOKEN_KEY = 'cms_admin_token'
const USER_KEY = 'cms_admin_username'

export async function loginCmsAdmin(username, password) {
  try {
    const res = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.authenticated || !data.token) {
      return { ok: false, error: data.error || 'Credenciales inválidas' }
    }
    sessionStorage.setItem(TOKEN_KEY, data.token)
    sessionStorage.setItem(USER_KEY, data.username || username)
    return { ok: true, username: data.username || username }
  } catch {
    return { ok: false, error: 'No se pudo conectar al servidor' }
  }
}

export function getCmsToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function getCmsUsername() {
  try {
    return sessionStorage.getItem(USER_KEY) || ''
  } catch {
    return ''
  }
}

export function cmsAuthHeaders() {
  const token = getCmsToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function clearCmsAuth() {
  try {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    sessionStorage.removeItem('contenido_admin_auth')
    sessionStorage.removeItem('contenido_admin_username')
  } catch {
    // sessionStorage puede no estar disponible en algunos contextos embebidos.
  }
}

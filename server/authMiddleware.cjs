// ─── Shared auth middleware for all admin modules ────────────────────────
// Cada módulo (turnero, ambiente, escuela manejo, registro vehículos) tiene
// su propia tabla de admins con el mismo esquema: (username TEXT PRIMARY KEY,
// password_hash TEXT NOT NULL, ...). Esta función verifica credenciales
// en cualquier tabla pasada como parámetro, usando bcrypt y rate limit.
//
// Uso en server/index.cjs y server/routes/*.cjs:
//
//   const { verifyAdmin, rateLimitedLogin } = require('./authMiddleware.cjs')
//   router.post('/auth/login', rateLimitedLogin, async (req, res) => {
//     // ... usa verifyAdmin contra tu tabla
//   })
//   router.post('/areas', requireAdminFor('mi_tabla_admins'), async ...)
//
// NOTA: La verificación usa bcrypt cuando el hash guardado empieza con '$2'
// (estándar bcrypt). Para mantener compatibilidad con hashes existentes de
// djb2 (simpleHash de otras iteraciones) también acepta hashes viejos —
// pero en producción los hashes viejos deben migrarse a bcrypt.

const bcrypt = require('bcrypt')

// ─── Simple hash legacy (djb2) — mismo algoritmo que usaba el código viejo ─
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

// Verifica que un secret (password plano) coincida contra el hash guardado.
// Acepta bcrypt ($2...) y el legacy djb2 (base36 de longitud 5-7).
function verifyHash(plainSecret, hash) {
  if (!hash) return false
  // bcrypt
  if (hash.startsWith('$2')) {
    try {
      return bcrypt.compareSync(plainSecret, hash)
    } catch {
      return false
    }
  }
  // legacy djb2: comparamos directamente
  return simpleHash(plainSecret) === hash
}

// ─── verifyAdmin(pool, tableName, username, secret) ──────────────────────
// Verifica contra una tabla de admins específica. secret es la pass plana.
// Devuelve { ok, rol, ... } o { ok: false }.
async function verifyAdmin(pool, tableName, username, secret) {
  if (!username || !secret) return { ok: false }
  try {
    const { rows } = await pool.query(
      `SELECT username, password_hash, rol FROM ${tableName} WHERE username = $1`,
      [username]
    )
    if (rows.length === 0) return { ok: false }
    const admin = rows[0]
    if (!verifyHash(secret, admin.password_hash)) return { ok: false }
    return { ok: true, username: admin.username, rol: admin.rol || 'admin' }
  } catch (err) {
    console.error('verifyAdmin error:', err.message)
    return { ok: false }
  }
}

// ─── requireAdminFor(pool, tableName) ────────────────────────────────────
// Devuelve un middleware Express que valida Authorization: Bearer user:pass
// contra la tabla indicada. Uso:
//   const requireAdmin = requireAdminFor(pool, 'admins')
//   router.post('/areas', requireAdmin, ...)
function requireAdminFor(pool, tableName) {
  return async function (req, res, next) {
    const auth = req.headers['authorization'] || ''
    const m = auth.match(/^Bearer\s+([^:]+):(.+)$/)
    if (!m) {
      return res.status(401).json({ error: 'No autorizado: credenciales requeridas' })
    }
    const [, username, secret] = m
    const result = await verifyAdmin(pool, tableName, username, secret)
    if (!result.ok) {
      return res.status(401).json({ error: 'No autorizado: credenciales inválidas' })
    }
    req.admin = { username: result.username, rol: result.rol }
    next()
  }
}

// ─── rateLimitedLogin ────────────────────────────────────────────────────
// Wrapper de express-rate-limit preconfigurado (5 intentos cada 15 min).
// Importar rateLimit localmente cada router evita compartir el state entre
// routers (necesario para límites independientes).
const rateLimit = require('express-rate-limit')
function makeLoginLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { authenticated: false, error: 'Demasiados intentos. Esperá 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

module.exports = {
  verifyAdmin,
  requireAdminFor,
  makeLoginLimiter,
  bcrypt,
  simpleHash, // exportado por compatibilidad si algún código lo necesita
}

// Turnero Escuela de Manejo - PostgreSQL data layer
// Independiente de Planeamiento y Ambiente - usa /api/escuela-manejo/*
// Single-area: Autódromo km 4. La función getAreas() devuelve siempre
// una sola área, por eso el frontend puede asumir área fija sin paso de selección.

const API = '/api/escuela-manejo'

// ─── HELPERS ──────────────────────────────────────────
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function generateTimeSlots(startTime, endTime, interval, date, areaId, appointments) {
  const slots = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  const booked = new Set(
    appointments
      .filter((a) => a.area_id === areaId && a.date === date && a.status !== 'cancelled')
      .map((a) => a.time)
  )
  for (let m = startMinutes; m < endMinutes; m += interval) {
    const h = Math.floor(m / 60)
    const min = m % 60
    const time = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    slots.push({ time, available: !booked.has(time) })
  }
  return slots
}

export function getAvailableDates(area, maxDays = 30) {
  if (!area?.active) return []
  const dates = []
  const today = new Date()
  const nowTotal = today.getHours() * 60 + today.getMinutes()
  for (let i = 0; i < maxDays; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dow = date.getDay()
    if (i === 0) {
      const [eh, em] = area.end_time?.split(':').map(Number) || area.endTime?.split(':').map(Number) || [18, 0]
      if (nowTotal >= eh * 60 + em) continue
    }
    if (area.days?.includes(dow)) dates.push(date.toISOString().slice(0, 10))
  }
  return dates
}

export function getTodayAppointmentsCount(dni, appointments) {
  const today = new Date().toISOString().slice(0, 10)
  return appointments.filter((a) => a.dni === dni && a.date === today && a.status !== 'cancelled').length
}

export function getTodayAreaIds(dni, appointments) {
  const today = new Date().toISOString().slice(0, 10)
  return new Set(
    appointments
      .filter((a) => a.dni === dni && a.date === today && a.status !== 'cancelled')
      .map((a) => a.area_id)
  )
}

export function getDayName(dayNumber) {
  return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][dayNumber] || ''
}

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
]

// ─── Edad mínima: 16 años y 6 meses ────────────────────────────────────
export function meetsMinAge(birthDateStr) {
  if (!birthDateStr) return false
  const birth = new Date(birthDateStr)
  if (Number.isNaN(birth.getTime())) return false
  const today = new Date()
  let ageYears = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) ageYears--
  if (ageYears > 16) return true
  if (ageYears < 16) return false
  // 16 años cumplidos: verificar que pasaron al menos 6 meses desde el cumple
  const sixMonthsAfterBirth = new Date(birth)
  sixMonthsAfterBirth.setMonth(sixMonthsAfterBirth.getMonth() + 6)
  return today >= sixMonthsAfterBirth
}

function normalizeArea(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color,
    icon: row.icon,
    active: row.active,
    days: row.days,
    interval: row.interval,
    slotsPerDay: row.slots_per_day,
    startTime: row.start_time,
    endTime: row.end_time,
  }
}

function normalizeAppointment(row) {
  return {
    id: row.id,
    areaId: row.area_id,
    areaName: row.area_name,
    date: row.date,
    time: row.time,
    nombre: row.nombre,
    apellido: row.apellido,
    dni: row.dni,
    telefono: row.telefono,
    email: row.email,
    direccion: row.direccion,
    vehiculoPropio: row.vehiculo_propio,
    cantidadClases: row.cantidad_clases,
    archivoUrl: row.archivo_url,
    status: row.status,
    createdAt: row.created_at ? { toMillis: () => new Date(row.created_at).getTime() } : undefined,
  }
}

function normalizeConfig(row) {
  return {
    maxPerDay: row.max_per_day,
    turneroPaused: row.turnero_paused,
  }
}

// ─── CONFIG ───────────────────────────────────────────
export async function getConfig() {
  try {
    const res = await fetch(`${API}/config`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    return normalizeConfig(data)
  } catch (e) {
    console.warn('getConfig error, returning default:', e.message)
    return { maxPerDay: 1, turneroPaused: true }
  }
}

export async function saveConfig(config) {
  try {
    await fetch(`${API}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_per_day: config.maxPerDay,
        turnero_paused: config.turneroPaused,
      }),
    })
  } catch (e) {
    console.warn('saveConfig error:', e.message)
  }
}

// ─── AREAS ────────────────────────────────────────────
export async function getAreas() {
  try {
    const res = await fetch(`${API}/areas`)
    const data = await res.json()
    return data.map(normalizeArea)
  } catch (e) {
    console.warn('getAreas error:', e.message)
    return []
  }
}

export async function saveArea(area) {
  try {
    await fetch(`${API}/areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: area.id,
        name: area.name,
        description: area.description,
        color: area.color,
        icon: area.icon,
        active: area.active,
        days: area.days,
        interval: area.interval,
        slots_per_day: area.slotsPerDay,
        start_time: area.startTime,
        end_time: area.endTime,
      }),
    })
  } catch (e) {
    console.warn('saveArea error:', e.message)
  }
}

export async function deleteArea(areaId) {
  try {
    await fetch(`${API}/areas/${areaId}`, { method: 'DELETE' })
  } catch (e) {
    console.warn('deleteArea error:', e.message)
  }
}

// ─── APPOINTMENTS ────────────────────────────────────────────────────
export async function getAppointments(page = 1, limit = 200, filters = {}) {
  try {
    const params = new URLSearchParams()
    params.set('page', page)
    params.set('limit', limit)
    if (filters.status) params.set('status', filters.status)
    if (filters.areaId) params.set('area_id', filters.areaId)
    if (filters.date) params.set('date', filters.date)

    const res = await fetch(`${API}/appointments?${params}`)
    const data = await res.json()

    if (data && data.entries && Array.isArray(data.entries)) {
      return {
        appointments: data.entries.map(normalizeAppointment),
        total: data.total,
        page: data.page,
        limit: data.limit,
      }
    }

    if (Array.isArray(data)) {
      return { appointments: data.map(normalizeAppointment), total: data.length, page: 1, limit: data.length }
    }

    return { appointments: [], total: 0, page: 1, limit }
  } catch (e) {
    console.warn('getAppointments error:', e.message)
    return { appointments: [], total: 0, page: 1, limit }
  }
}

// ─── UPLOAD: helper para subir un archivo al backend ──────────────────
// Devuelve { url } o null si falla. Valida tamaño (10MB) y tipo.
export async function uploadArchivo(file) {
  if (!file) return null
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Solo imágenes (JPG, PNG, GIF, WebP) o PDF.')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('El archivo supera el máximo de 10 MB.')
  }
  const fd = new FormData()
  fd.append('archivo', file)
  const res = await fetch(`${API}/upload`, { method: 'POST', body: fd })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Error al subir el archivo')
  }
  const data = await res.json()
  return data.url
}

// ─── CREATE APPOINTMENT ──────────────────────────────────────────────
// Si se pasa `archivoFile`, se sube primero y luego se crea el turno.
// Si falla la subida, no se crea el turno.
export async function createAppointment(data, archivoFile = null) {
  try {
    let archivoUrl = data.archivoUrl || ''
    if (archivoFile) {
      archivoUrl = await uploadArchivo(archivoFile)
    }

    // Enviar como multipart para soportar tanto archivo como JSON
    const fd = new FormData()
    fd.append('areaId', data.areaId)
    fd.append('areaName', data.areaName)
    fd.append('date', data.date)
    fd.append('time', data.time)
    fd.append('nombre', data.nombre)
    fd.append('apellido', data.apellido || '')
    fd.append('dni', data.dni)
    fd.append('telefono', data.telefono)
    fd.append('email', data.email)
    fd.append('direccion', data.direccion || '')
    fd.append('vehiculoPropio', data.vehiculoPropio ? 'true' : 'false')
    fd.append('cantidadClases', String(data.cantidadClases))
    if (archivoFile) {
      fd.append('archivo', archivoFile)
    } else if (archivoUrl) {
      // Subir por separado como fallback
      fd.append('archivoUrl', archivoUrl)
    }

    const res = await fetch(`${API}/appointments`, {
      method: 'POST',
      body: fd,
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || 'Error al guardar el turno')
    return { id: result.id, archivoUrl: result.archivoUrl || archivoUrl }
  } catch (e) {
    console.warn('createAppointment error:', e.message)
    throw e
  }
}

export async function updateAppointmentStatus(apptId, status) {
  try {
    await fetch(`${API}/appointments/${apptId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  } catch (e) {
    console.warn('updateAppointmentStatus error:', e.message)
  }
}

// ─── SUBSCRIPTIONS (polling-based) ────────────────────────────────────
const POLL_INTERVAL = 3000
const subscribers = { areas: new Set(), appointments: new Set() }
let pollTimer = null

function startPolling() {
  if (pollTimer) return
  pollTimer = setInterval(async () => {
    if (subscribers.areas.size > 0) {
      try {
        const res = await fetch(`${API}/areas`)
        const data = await res.json()
        const normalized = data.map(normalizeArea)
        subscribers.areas.forEach((cb) => cb(normalized))
      } catch (_) {}
    }
    if (subscribers.appointments.size > 0) {
      try {
        const res = await fetch(`${API}/appointments?limit=500`)
        const data = await res.json()
        const appts = (data && data.entries) ? data.entries.map(normalizeAppointment) : (Array.isArray(data) ? data.map(normalizeAppointment) : [])
        subscribers.appointments.forEach((cb) => cb(appts))
      } catch (_) {}
    }
  }, POLL_INTERVAL)
}

function stopPollingIfIdle() {
  if (subscribers.areas.size === 0 && subscribers.appointments.size === 0 && pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

export function subscribeAreas(callback) {
  subscribers.areas.add(callback)
  getAreas().then((data) => callback(data))
  startPolling()
  return () => {
    subscribers.areas.delete(callback)
    stopPollingIfIdle()
  }
}

export function subscribeAppointments(callback) {
  subscribers.appointments.add(callback)
  getAppointments(1, 500).then((result) => {
    if (Array.isArray(result)) {
      callback(result)
    } else if (result && result.appointments) {
      callback(result.appointments)
    }
  })
  startPolling()
  return () => {
    subscribers.appointments.delete(callback)
    stopPollingIfIdle()
  }
}

// ─── AUTH ─────────────────────────────────────────────
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
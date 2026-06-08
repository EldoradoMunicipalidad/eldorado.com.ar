// PostgreSQL data layer for Turnero
// Replaces Firebase + localStorage with REST API calls to the Express server
// Same exports as turneroFirebase.js for drop-in replacement

const API = '/api'

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
      const [eh, em] = area.end_time?.split(':').map(Number) || area.endTime?.split(':').map(Number) || [13, 0]
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

// Normalize DB field names → camelCase for components
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
    return { maxPerDay: 3, turneroPaused: true }
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
    const body = {
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
    }
    await fetch(`${API}/areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

    // New paginated format: { entries: [...], total, page, limit }
    if (data && data.entries && Array.isArray(data.entries)) {
      return {
        appointments: data.entries.map(normalizeAppointment),
        total: data.total,
        page: data.page,
        limit: data.limit,
      }
    }

    // Fallback: raw array (old format, should not happen with new backend)
    if (Array.isArray(data)) {
      return { appointments: data.map(normalizeAppointment), total: data.length, page: 1, limit: data.length }
    }

    return { appointments: [], total: 0, page: 1, limit }
  } catch (e) {
    console.warn('getAppointments error:', e.message)
    return { appointments: [], total: 0, page: 1, limit }
  }
}

export async function createAppointment(data) {
  try {
    const res = await fetch(`${API}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        areaId: data.areaId,
        areaName: data.areaName,
        date: data.date,
        time: data.time,
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
      }),
    })
    const result = await res.json()
    return result.id
  } catch (e) {
    console.warn('createAppointment error:', e.message)
    return null
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

// ─── SUBSCRIPTIONS (polling-based, replaces Firestore onSnapshot) ──────
// Components call subscribeAreas(callback) and get back an unsubscribe function
// Polls every 3 seconds for simplicity
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
  // Immediate fetch
  getAreas().then((data) => callback(data))
  startPolling()
  return () => {
    subscribers.areas.delete(callback)
    stopPollingIfIdle()
  }
}

export function subscribeAppointments(callback) {
  subscribers.appointments.add(callback)
  // Immediate fetch — pass the array to callbacks (backward compat)
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

export async function changeAdminPassword(username, currentPassword, newPassword) {
  // For now, password change is handled via DB directly
  // You could add an endpoint for this later
  console.warn('changeAdminPassword not implemented via API yet')
  return false
}

// ─── DEFAULTS (kept for reference) ─────────────────────
export const DEFAULT_AREAS = []

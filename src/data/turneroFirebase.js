import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

// ─── LOCALSTORAGE FALLBACK ──────────────────────────
const LS_KEY = 'turnero_planeamiento'

function lsLoad() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

function lsSave(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch (_) {}
}

function lsInit() {
  const existing = lsLoad()
  if (existing) return existing
  const initial = { areas: DEFAULT_AREAS, appointments: [], config: { maxPerDay: 3 } }
  lsSave(initial)
  return initial
}

// ─── DEFAULTS ────────────────────────────────────────
const DEFAULT_AREAS = [
  { id:'mesa-entradas', name:'Mesa de Entradas', description:'Ingreso y egreso de trámites, consultas generales y recepción de documentación.', color:'bg-sky-500', icon:'inboxIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:10, startTime:'07:00', endTime:'13:00' },
  { id:'catastro', name:'Catastro', description:'Manzaneros catastrales, administración y división territorial.', color:'bg-emerald-500', icon:'gridOnIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:10, startTime:'07:00', endTime:'13:00' },
  { id:'zonificacion', name:'Zonificación', description:'Zonificación urbana, trazado de calles y secciones catastrales.', color:'bg-violet-500', icon:'mapIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
  { id:'planos', name:'Planos y Digitalización', description:'Planos generales digitalizados, redes hídricas y planimetría barrial.', color:'bg-amber-500', icon:'architectureIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
  { id:'expedientes', name:'Expedientes de Construcción', description:'Registro y control de expedientes de obras privadas.', color:'bg-rose-500', icon:'folderSharedIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
  { id:'mensuras', name:'Mensuras y Archivo Técnico', description:'Visado de planos de mensura y organización del archivo técnico.', color:'bg-cyan-500', icon:'straightenIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:8, startTime:'07:00', endTime:'13:00' },
  { id:'autorizaciones-electricas', name:'Autorizaciones Eléctricas', description:'Autorización precaria del servicio de energía eléctrica.', color:'bg-yellow-500', icon:'boltIcon', active:true, days:[1,2,3,4,5], interval:40, slotsPerDay:6, startTime:'07:00', endTime:'13:00' },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ─── FIREBASE ONLINE CHECK ───────────────────────────
let firebaseReady = true

function isPermissionError(err) {
  return err?.code === 'permission-denied' || err?.message?.includes('permission-denied')
}

// ─── CONFIG ──────────────────────────────────────────
const DEFAULT_CONFIG = { maxPerDay: 3, turneroPaused: true }

export async function getConfig() {
  if (!firebaseReady) return { ...DEFAULT_CONFIG, ...lsInit().config }
  try {
    const snap = await getDoc(doc(db, 'config', 'default'))
    if (snap.exists()) return { ...DEFAULT_CONFIG, ...snap.data() }
    // Seed default config
    await setDoc(doc(db, 'config', 'default'), DEFAULT_CONFIG)
    return { ...DEFAULT_CONFIG }
  } catch (e) {
    if (isPermissionError(e)) { firebaseReady = false; console.warn('Firebase unavailable, using localStorage') }
    return { ...DEFAULT_CONFIG, ...lsInit().config }
  }
}

export async function saveConfig(config) {
  if (!firebaseReady) { const d = lsInit(); d.config = config; lsSave(d); return }
  try { await setDoc(doc(db, 'config', 'default'), config, { merge: true }) }
  catch (e) { if (isPermissionError(e)) firebaseReady = false }
}

// ─── AREAS ───────────────────────────────────────────
async function seedFirebaseAreas() {
  for (const area of DEFAULT_AREAS) {
    await setDoc(doc(db, 'areas', area.id), area)
  }
}

export async function getAreas() {
  if (!firebaseReady) return lsInit().areas || [...DEFAULT_AREAS]
  try {
    const snap = await getDocs(collection(db, 'areas'))
    if (snap.empty) { await seedFirebaseAreas(); return [...DEFAULT_AREAS] }
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (e) {
    if (isPermissionError(e)) { firebaseReady = false; console.warn('Firebase unavailable, using localStorage') }
    return lsInit().areas || [...DEFAULT_AREAS]
  }
}

export async function saveArea(area) {
  if (!firebaseReady) { const d = lsInit(); const idx = d.areas.findIndex((a) => a.id === area.id); if (idx >= 0) d.areas[idx] = area; else d.areas.push(area); lsSave(d); return }
  try { await setDoc(doc(db, 'areas', area.id), area, { merge: true }) }
  catch (e) { if (isPermissionError(e)) firebaseReady = false }
}

export async function deleteArea(areaId) {
  if (!firebaseReady) { const d = lsInit(); d.areas = d.areas.filter((a) => a.id !== areaId); lsSave(d); return }
  try { await deleteDoc(doc(db, 'areas', areaId)) }
  catch (e) { if (isPermissionError(e)) firebaseReady = false }
}

export function subscribeAreas(callback) {
  if (!firebaseReady) {
    callback(lsInit().areas || [...DEFAULT_AREAS])
    return () => {}
  }
  const unsub = onSnapshot(collection(db, 'areas'), (snap) => {
    if (snap.empty) { callback([...DEFAULT_AREAS]); return }
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  }, (err) => {
    if (isPermissionError(err)) { firebaseReady = false; callback(lsInit().areas || [...DEFAULT_AREAS]) }
  })
  return unsub
}

// ─── APPOINTMENTS ────────────────────────────────────
export async function getAppointments() {
  if (!firebaseReady) return lsInit().appointments || []
  try {
    const snap = await getDocs(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (e) {
    if (isPermissionError(e)) { firebaseReady = false; console.warn('Firebase unavailable, using localStorage') }
    return lsInit().appointments || []
  }
}

export async function createAppointment(data) {
  const id = generateId()
  if (!firebaseReady) {
    const d = lsInit()
    const appt = { ...data, id, createdAt: new Date().toISOString(), status: 'pending' }
    d.appointments.push(appt)
    lsSave(d)
    return id
  }
  try {
    await setDoc(doc(db, 'appointments', id), { ...data, id, createdAt: serverTimestamp(), status: 'pending' })
    return id
  } catch (e) {
    if (isPermissionError(e)) { firebaseReady = false; return createAppointment(data) } // retry with localStorage
    return null
  }
}

export async function updateAppointmentStatus(apptId, status) {
  if (!firebaseReady) {
    const d = lsInit(); const appt = d.appointments.find((a) => a.id === apptId)
    if (appt) appt.status = status; lsSave(d); return
  }
  try { await setDoc(doc(db, 'appointments', apptId), { status }, { merge: true }) }
  catch (e) { if (isPermissionError(e)) firebaseReady = false }
}

export function subscribeAppointments(callback) {
  if (!firebaseReady) {
    callback(lsInit().appointments || [])
    return () => {}
  }
  const unsub = onSnapshot(
    query(collection(db, 'appointments'), orderBy('createdAt', 'desc')),
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    },
    (err) => {
      if (isPermissionError(err)) { firebaseReady = false; callback(lsInit().appointments || []) }
    }
  )
  return unsub
}

// ─── HELPERS (same interface as before) ──────────────
export function generateTimeSlots(startTime, endTime, interval, date, areaId, appointments) {
  const slots = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  const booked = new Set(appointments.filter((a) => a.areaId === areaId && a.date === date && a.status !== 'cancelled').map((a) => a.time))
  for (let m = startMinutes; m < endMinutes; m += interval) {
    const h = Math.floor(m / 60); const min = m % 60
    const time = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    slots.push({ time, available: !booked.has(time) })
  }
  return slots
}

export function getAvailableDates(area, maxDays = 30) {
  if (!area?.active) return []
  const dates = []; const today = new Date()
  const nowTotal = today.getHours() * 60 + today.getMinutes()
  for (let i = 0; i < maxDays; i++) {
    const date = new Date(today); date.setDate(date.getDate() + i)
    const dow = date.getDay()
    if (i === 0) {
      const [eh, em] = area.endTime.split(':').map(Number)
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
  return new Set(appointments.filter((a) => a.dni === dni && a.date === today && a.status !== 'cancelled').map((a) => a.areaId))
}

export function getDayName(dayNumber) {
  return ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][dayNumber] || ''
}

export const DAYS_OF_WEEK = [
  { value:0, label:'Domingo' }, { value:1, label:'Lunes' }, { value:2, label:'Martes' },
  { value:3, label:'Miércoles' }, { value:4, label:'Jueves' }, { value:5, label:'Viernes' }, { value:6, label:'Sábado' },
]

// ─── AUTH ────────────────────────────────────────────
const DEFAULT_ADMIN_USERNAME = 'admin'
const DEFAULT_ADMIN_PASSWORD = 'admin'

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

function lsGetAdmins() {
  const d = lsLoad()
  return d?.admins || [{ username: DEFAULT_ADMIN_USERNAME, passwordHash: simpleHash(DEFAULT_ADMIN_PASSWORD) }]
}

function lsSaveAdmins(admins) {
  const d = lsInit()
  d.admins = admins
  lsSave(d)
}

export function authenticateAdmin(username, password) {
  const admins = lsGetAdmins()
  const hash = simpleHash(password)
  return admins.some((a) => a.username === username && a.passwordHash === hash)
}

export function changeAdminPassword(username, currentPassword, newPassword) {
  const admins = lsGetAdmins()
  const idx = admins.findIndex((a) => a.username === username && a.passwordHash === simpleHash(currentPassword))
  if (idx === -1) return false
  admins[idx].passwordHash = simpleHash(newPassword)
  lsSaveAdmins(admins)
  return true
}

export { generateId, DEFAULT_AREAS }

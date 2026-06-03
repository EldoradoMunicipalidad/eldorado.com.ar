const STORAGE_KEY = 'turnero_planeamiento'

const DEFAULT_AREAS = [
  {
    id: 'mesa-entradas',
    name: 'Mesa de Entradas',
    description: 'Ingreso y egreso de trámites, consultas generales y recepción de documentación.',
    color: 'bg-sky-500',
    icon: 'inboxIcon',
    active: true,
    days: [1, 2, 3, 4, 5],
    interval: 40,
    slotsPerDay: 10,
    startTime: '07:00',
    endTime: '13:00',
  },
  {
    id: 'catastro',
    name: 'Catastro',
    description: 'Manzaneros catastrales, administración y división territorial.',
    color: 'bg-emerald-500',
    icon: 'gridOnIcon',
    active: true,
    days: [1, 2, 3, 4, 5],
    interval: 40,
    slotsPerDay: 10,
    startTime: '07:00',
    endTime: '13:00',
  },
  {
    id: 'zonificacion',
    name: 'Zonificación',
    description: 'Zonificación urbana, trazado de calles y secciones catastrales.',
    color: 'bg-violet-500',
    icon: 'mapIcon',
    active: true,
    days: [1, 2, 3, 4, 5],
    interval: 40,
    slotsPerDay: 8,
    startTime: '07:00',
    endTime: '13:00',
  },
  {
    id: 'planos',
    name: 'Planos y Digitalización',
    description: 'Planos generales digitalizados, redes hídricas y planimetría barrial.',
    color: 'bg-amber-500',
    icon: 'architectureIcon',
    active: true,
    days: [1, 2, 3, 4, 5],
    interval: 40,
    slotsPerDay: 8,
    startTime: '07:00',
    endTime: '13:00',
  },
  {
    id: 'expedientes',
    name: 'Expedientes de Construcción',
    description: 'Registro y control de expedientes de obras privadas.',
    color: 'bg-rose-500',
    icon: 'folderSharedIcon',
    active: true,
    days: [1, 2, 3, 4, 5],
    interval: 40,
    slotsPerDay: 8,
    startTime: '07:00',
    endTime: '13:00',
  },
  {
    id: 'mensuras',
    name: 'Mensuras y Archivo Técnico',
    description: 'Visado de planos de mensura y organización del archivo técnico.',
    color: 'bg-cyan-500',
    icon: 'straightenIcon',
    active: true,
    days: [1, 2, 3, 4, 5],
    interval: 40,
    slotsPerDay: 8,
    startTime: '07:00',
    endTime: '13:00',
  },
  {
    id: 'autorizaciones-electricas',
    name: 'Autorizaciones Eléctricas',
    description: 'Autorización precaria del servicio de energía eléctrica.',
    color: 'bg-yellow-500',
    icon: 'boltIcon',
    active: true,
    days: [1, 2, 3, 4, 5],
    interval: 40,
    slotsPerDay: 6,
    startTime: '07:00',
    endTime: '13:00',
  },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function getInitialData() {
  return {
    areas: DEFAULT_AREAS,
    appointments: [],
    config: {
      maxPerDay: 3,
    },
  }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Merge with defaults to add any missing fields
      const defaults = getInitialData()
      return {
        ...defaults,
        ...parsed,
        areas: parsed.areas || defaults.areas,
        appointments: parsed.appointments || [],
        config: { ...defaults.config, ...(parsed.config || {}) },
      }
    }
  } catch (e) {
    console.warn('Error loading turnero data:', e)
  }
  return getInitialData()
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Error saving turnero data:', e)
  }
}

export function getNextTurnNumber(areaId, appointments) {
  const today = new Date().toISOString().slice(0, 10)
  const todayAreaAppts = appointments.filter(
    (a) => a.areaId === areaId && a.date === today
  )
  return todayAreaAppts.length + 1
}

export function generateTimeSlots(startTime, endTime, interval, date, areaId, appointments) {
  const slots = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  const bookedForDate = appointments.filter(
    (a) => a.areaId === areaId && a.date === date && a.status !== 'cancelled'
  )
  const bookedTimes = new Set(bookedForDate.map((a) => a.time))

  for (let m = startMinutes; m < endMinutes; m += interval) {
    const h = Math.floor(m / 60)
    const min = m % 60
    const time = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    slots.push({
      time,
      available: !bookedTimes.has(time),
    })
  }
  return slots
}

export function getAvailableDates(area, maxDays = 30) {
  if (!area || !area.active) return []
  const dates = []
  const today = new Date()
  // Start from tomorrow if we're past business hours
  const currentHour = today.getHours()
  const currentMin = today.getMinutes()

  for (let i = 0; i < maxDays; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dayOfWeek = date.getDay() // 0=Sun, 1=Mon...
    // Only check from today+0 if we're before end time
    if (i === 0) {
      const [endH, endM] = area.endTime.split(':').map(Number)
      const endTotal = endH * 60 + endM
      const nowTotal = currentHour * 60 + currentMin
      if (nowTotal >= endTotal) continue // skip today if past end time
    }
    if (area.days.includes(dayOfWeek)) {
      dates.push(date.toISOString().slice(0, 10))
    }
  }
  return dates
}

export function getTodayAppointmentsCount(dni, appointments) {
  const today = new Date().toISOString().slice(0, 10)
  return appointments.filter(
    (a) => a.dni === dni && a.date === today && a.status !== 'cancelled'
  ).length
}

export function getTodayAreaIds(dni, appointments) {
  const today = new Date().toISOString().slice(0, 10)
  return new Set(
    appointments
      .filter((a) => a.dni === dni && a.date === today && a.status !== 'cancelled')
      .map((a) => a.areaId)
  )
}

export function getDayName(dayNumber) {
  const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return names[dayNumber] || ''
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

export { generateId, STORAGE_KEY, DEFAULT_AREAS }

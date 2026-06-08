import { db, storage } from './firebase'
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

// ─── Generar código único ────────────────────────────
export function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'RC-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ─── Guardar reclamo ─────────────────────────────────
export async function guardarReclamo(data) {
  const docRef = await addDoc(collection(db, 'reclamos'), {
    ...data,
    estado: 'pendiente',
    notas_internas: '',
    respuesta_ciudadano: '',
    asignado_a: '',
    created_at: Timestamp.now(),
  })
  return docRef.id
}

// ─── Subir foto ──────────────────────────────────────
export function subirFoto(file, onProgress, onComplete, onError) {
  const storageRef = ref(storage, `reclamos/${Date.now()}_${file.name}`)
  const task = uploadBytesResumable(storageRef, file)

  task.on(
    'state_changed',
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      )
      onProgress(progress)
    },
    (error) => {
      onError(error)
    },
    async () => {
      const url = await getDownloadURL(task.snapshot.ref)
      onComplete(url)
    }
  )
}

// ─── Obtener categorías ──────────────────────────────
export async function getCategorias() {
  const q = query(
    collection(db, 'categorias_reclamos'),
    where('activa', '==', true),
    orderBy('orden', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// ─── Buscar reclamo por código ────────────────────────
export async function buscarReclamo(codigo) {
  const q = query(
    collection(db, 'reclamos'),
    where('codigo', '==', codigo),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...doc.data() }
}

// ─── Labels de estado ─────────────────────────────────
export const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  en_revision: 'En Revisión',
  asignado: 'Asignado',
  en_proceso: 'En Proceso',
  resuelto: 'Resuelto',
  rechazado: 'Rechazado',
}

export const ESTADO_COLORS = {
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  en_revision: 'bg-blue-50 text-blue-700 border-blue-200',
  asignado: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  en_proceso: 'bg-orange-50 text-orange-700 border-orange-200',
  resuelto: 'bg-green-50 text-green-700 border-green-200',
  rechazado: 'bg-red-50 text-red-700 border-red-200',
}

// ─── Categorías por defecto ──────────────────────────
export const CATEGORIAS_POR_DEFECTO = [
  { nombre: 'Alumbrado Público', icono: 'Lightbulb', color: '#f59e0b', activa: true, orden: 1 },
  { nombre: 'Bache o Calle', icono: 'TriangleAlert', color: '#ef4444', activa: true, orden: 2 },
  { nombre: 'Residuos y Limpieza', icono: 'Trash2', color: '#10b981', activa: true, orden: 3 },
  { nombre: 'Veredas', icono: 'Footprints', color: '#8b5cf6', activa: true, orden: 4 },
  { nombre: 'Tránsito y Señalización', icono: 'TrafficCone', color: '#3b82f6', activa: true, orden: 5 },
  { nombre: 'Arbolado', icono: 'Trees', color: '#22c55e', activa: true, orden: 6 },
  { nombre: 'Ruidos Molestos', icono: 'VolumeX', color: '#ec4899', activa: true, orden: 7 },
  { nombre: 'Otro', icono: 'AlertCircle', color: '#6b7280', activa: true, orden: 8 },
]

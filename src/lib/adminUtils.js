import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

const ADMIN_USERS_COLLECTION = 'adminUsersReclamos'

export async function getUserRole(user) {
  if (!user) return null
  try {
    const ref = doc(db, ADMIN_USERS_COLLECTION, user.uid)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      return snap.data().role || 'viewer'
    }
    return null
  } catch {
    return null
  }
}

export async function getAllAdminUsers() {
  const ref = collection(db, ADMIN_USERS_COLLECTION)
  const snap = await getDocs(ref)
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
}

export async function setUserRole(uid, data) {
  await setDoc(doc(db, ADMIN_USERS_COLLECTION, uid), {
    ...data,
    createdAt: new Date().toISOString(),
  })
}

export async function removeUserRole(uid) {
  await deleteDoc(doc(db, ADMIN_USERS_COLLECTION, uid))
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

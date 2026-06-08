import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSy..._LTE',
  authDomain: 'turnero-4fa62.firebaseapp.com',
  projectId: 'turnero-4fa62',
  storageBucket: 'turnero-4fa62.firebasestorage.app',
  messagingSenderId: '980829554580',
  appId: '1:980829554580:web:476c13f22a2fd058f17181',
  measurementId: 'G-00QMQM7213',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

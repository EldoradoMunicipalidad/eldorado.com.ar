import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyD5CM3V2J2lzf78i-L9nTyY5af_PttiG5A',
  authDomain: 'municipalidad-632de.firebaseapp.com',
  projectId: 'municipalidad-632de',
  storageBucket: 'municipalidad-632de.firebasestorage.app',
  messagingSenderId: '136029400684',
  appId: '1:136029400684:web:a26b9977c03d6d420df249',
  measurementId: 'G-94XHQ2D40W',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDlxlSlv1YVuHRSTynwpkO2X9boapy_LTE',
  authDomain: 'turnero-4fa62.firebaseapp.com',
  projectId: 'turnero-4fa62',
  storageBucket: 'turnero-4fa62.firebasestorage.app',
  messagingSenderId: '980829554580',
  appId: '1:980829554580:web:476c13f22a2fd058f17181',
  measurementId: 'G-00QMQM7213',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Enable offline persistence (works even with restricted rules)
db.settings = db.settings || {}

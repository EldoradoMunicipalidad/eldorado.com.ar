// Firebase Admin SDK initialization for token verification.
// Credentials must come from environment variables or Application Default
// Credentials; never commit a service-account private key to the repository.

const { initializeApp, getApps, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'municipalidad-632de'

function initFirebaseAdmin() {
  if (getApps().length > 0) return { getAuth }

  // Preferred: raw service-account JSON or base64-encoded JSON.
  const envRaw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (envRaw) {
    try {
      const serviceAccount = JSON.parse(envRaw)
      initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID })
      console.log('✅ Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT env')
      return { getAuth }
    } catch (_) {}

    try {
      const serviceAccount = JSON.parse(Buffer.from(envRaw, 'base64').toString('utf8'))
      initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID })
      console.log('✅ Firebase Admin initialized from base64 FIREBASE_SERVICE_ACCOUNT env')
      return { getAuth }
    } catch (_) {
      console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT env var is invalid')
    }
  }

  // Alternative: Application Default Credentials supplied by the runtime.
  try {
    initializeApp({ projectId: PROJECT_ID })
    console.warn('⚠️ Firebase Admin initialized with project ID only; configure Application Default Credentials for token verification')
    return { getAuth }
  } catch (err) {
    console.warn('⚠️ Firebase Admin initialization failed:', err.message)
    return { getAuth }
  }
}

const firebaseAdmin = initFirebaseAdmin()
module.exports = firebaseAdmin

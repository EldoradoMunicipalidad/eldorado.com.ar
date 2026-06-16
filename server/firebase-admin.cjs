// Firebase Admin SDK initialization for token verification
// Uses modular API (firebase-admin v12+) with getApps() instead of admin.apps

const { initializeApp, getApps, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

// ─── Hardcoded service account (no env vars needed) ───────────────────
const HARDCODED_SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "municipalidad-632de",
  private_key_id: "33e4e31edd5ee0ac2445a9ab7a025931d986c2bb",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDW9FtvKGWBRdBN\nxQJdHpAsA4k3vhhB81zH+B6qYelJpIFoTstsKVIS96rkvYObr3Uuvl7CdvTQbyG1\nbjAkK3Xum/OJIUIipGa89iCQyW1XCDEE54zNOQbrI+2MJnmi3H5qURkfgNta5tw9\n7qF02dB5KJa8iNKlm1ROYTXEACwpSaddMU1f4onO3I4zxnXVYZWyBIQCbJQUl+c1\nP6JN9wnIHAzb0mLd1pWpRvZyMFMSL6EjXRoxmnV31tyD+tolLpseDi+MU8MIGq0T\nzVe6IJUzPQu60f/h+L5b5sUjGb8F+d2FMZu69IzZm/D7o5BDBGmzyZAfkY35avW2\n7vXLdK3fAgMBAAECggEAFAZAT+lte06ro9lxUCEJ9G+0sR97I9NHlpr3EFxKq6eX\nJPmiJ0aG9M/JrCfTdZ9kxTpkZxOtC49h9OrgGGtMDMxn/yOJnuLxBzPOjAf+FzHi\n9Ys0j+ThT7c36LeoDfnu20Y7lum3Ulwk5eGv4zJsIoobcLjP45Zfkv9CgpD/8pO6\nf3ZBuDmvD5U7gj1i2nLCBsWpEGW15hSwoLZG38ITIrrZvCw4+NyF6OvSCrkHO5ce\nn7knoFv9N61yVJehjBI6vAhSOyLlkkyCqkLHzY0PSDRV51hKJsAgG/AvWklGqM5c\n64R7dQ7F9SM3BMChaGbKz0PE7xIlJ9uaRi+Cp0rksQKBgQD+juvSl8lJIsnWLW8M\n4lX2D5yYlDzWmddBm0TkskBs9FV9WoFbNHISeoKoj9pUDvaq5OJ/y5D8dey2SPz9\ns4hi0G7+1FDctfm056QmFEb5e2QiYd6mdJcSl30yIOOKP9uvXzQj9VOo9NLPJMzs\nIM2bKp2ecqp8E+QDs9tlSOj4hQKBgQDYLAPqlZIyNh2xUjMrO7QrDRNxaEzlMF/9\ng9GH7zwNJy+wPGIKJh4z9Jxco1OmXDyTZsJZl8iqFM5oOpuEgEA1dSkvIaGfX3nw\n7Y4piGUN3qQ9tc/yXc4R17BEU1B7kUqsMwwnP9Lp74EnixMZf5y7uzr2xcgMQsjS\nkoICpbQMEwKBgQCx+z/LKLFl31r70xx4B7BOsK+uxsaazUmB54wN0svU4ij70lHr\ncQno/ZtpO9tNNoElD4+GBtDCk7kD4phw0hwj6tQQfGZlSx7ia6uLrFXLjYh/uaow\n/Ae8ygqRCAnP2cJCJfCQy7DIyxSyHGrjFjRrryoxZL7qrgWYySI2+Pla+QKBgQDD\nShBHrtQidG0isoXzer5rXibAf19odeliF+IFEgWIRGx6pDJVxNXoTgWsUwjQ8+bt\nqxnM4qivrphB5SB19X8MTEnmgFWIqzJ4i8Owlb3lZ8uszEGOTVxLFjXxo+rDlyCE\nrKFAHBKosGxXkvawRG8N0jmUkl0FZpgSU7UMOzKK7QKBgAco/jiYC1boydqiuCc7\nEWIzkbS/gbXFASuWPpAgJyKg9voSLtQrmopEugTUKdJCqUlrYmu/e2Wp5pDSZEZh\nHFIeS+mGiVEjBHl6XmP/fhq0bM6oQqatvfvnp9Lo4sxrBiqADnOKYmd9CdblTyy9\nfdrIQ5sOJ/emKGlDKO5/x81P\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@municipalidad-632de.iam.gserviceaccount.com",
  client_id: "112366174335311625303",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40municipalidad-632de.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
}

function initFirebaseAdmin() {
  if (getApps().length > 0) return { getAuth }

  // 1. Try FIREBASE_SERVICE_ACCOUNT env var (raw JSON or base64)
  const envRaw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (envRaw) {
    try {
      const sa = JSON.parse(envRaw)
      initializeApp({ credential: cert(sa) })
      console.log('✅ Firebase Admin from FIREBASE_SERVICE_ACCOUNT env (raw JSON)')
      return { getAuth }
    } catch (_) {}

    try {
      const sa = JSON.parse(Buffer.from(envRaw, 'base64').toString('utf-8'))
      initializeApp({ credential: cert(sa) })
      console.log('✅ Firebase Admin from FIREBASE_SERVICE_ACCOUNT env (base64)')
      return { getAuth }
    } catch (_) {
      console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT env var is invalid')
    }
  }

  // 2. Try GOOGLE_APPLICATION_CREDENTIALS file
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (saPath) {
    try {
      initializeApp({ credential: cert(saPath) })
      console.log('✅ Firebase Admin from GOOGLE_APPLICATION_CREDENTIALS')
      return { getAuth }
    } catch (err) {
      console.warn('⚠️  GOOGLE_APPLICATION_CREDENTIALS failed:', err.message)
    }
  }

  // 3. Use hardcoded service account (no env vars needed)
  try {
    initializeApp({ credential: cert(HARDCODED_SERVICE_ACCOUNT) })
    console.log('✅ Firebase Admin initialized from hardcoded service account')
    return { getAuth }
  } catch (err) {
    console.warn('⚠️  Hardcoded service account failed:', err.message)
  }

  // 4. Ultimate fallback: projectId only
  try {
    initializeApp({ projectId: 'municipalidad-632de' })
    console.log('✅ Firebase Admin initialized with projectId only')
  } catch (err) {
    console.warn('⚠️  Firebase Admin fallback init failed:', err.message)
  }

  return { getAuth }
}

const firebaseAdmin = initFirebaseAdmin()
module.exports = firebaseAdmin

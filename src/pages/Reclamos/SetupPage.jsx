import React, { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Settings,
  UserPlus,
} from 'lucide-react'
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, query, limit } from 'firebase/firestore'
import { db, auth } from '../../lib/firebase'
import { setUserRole, ROLE_LABELS } from '../../lib/adminUtils'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'

export default function SetupPage() {
  // ─── Auth state ──────────────────────────────────────
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginError, setLoginError] = useState('')

  // ─── Registration form state ─────────────────────────
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  // ─── Setup state ─────────────────────────────────────
  const [hasAdmins, setHasAdmins] = useState(null) // null = checking, true/false
  const [setupDone, setSetupDone] = useState(false)
  const [setupError, setSetupError] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // ─── Check if any admins exist ───────────────────────
  const checkForAdmins = useCallback(async () => {
    try {
      const q = query(collection(db, 'adminUsersReclamos'), limit(1))
      const snap = await getDocs(q)
      setHasAdmins(!snap.empty)
    } catch (err) {
      console.error('Error checking admins:', err)
      setHasAdmins(false)
    }
  }, [])

  // ─── Auth handler ────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true)
      if (firebaseUser) {
        setUser(firebaseUser)
        setLoginError('')
        await checkForAdmins()
      } else {
        setUser(null)
        setAuthLoading(false)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [checkForAdmins])

  const handleLogout = async () => {
    await signOut(auth)
    setHasAdmins(null)
    setSetupDone(false)
    setSetupError('')
  }

  // ─── Register and create admin in one step ──────────
  const handleRegister = async () => {
    setLoginError('')
    setSetupError('')

    // Validate inputs
    if (!email.trim() || !password || !confirmPassword || !nombre.trim()) {
      setLoginError('Completá todos los campos.')
      return
    }
    if (password.length < 6) {
      setLoginError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setLoginError('Las contraseñas no coinciden.')
      return
    }

    setRegLoading(true)
    try {
      // Create Firebase Auth user (this also signs them in)
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      const uid = userCredential.user.uid

      // Assign admin role immediately
      await setUserRole(uid, {
        nombre: nombre.trim(),
        email: email.trim(),
        role: 'admin',
      })

      setSetupDone(true)
      setRegLoading(false)
      showToast('Admin creado correctamente')
    } catch (err) {
      console.error('Error creating admin:', err)
      setRegLoading(false)
      if (err.code === 'auth/email-already-in-use') {
        setLoginError('Este correo ya está registrado.')
      } else if (err.code === 'auth/weak-password') {
        setLoginError('La contraseña es muy débil.')
      } else if (err.code === 'auth/invalid-email') {
        setLoginError('El correo no es válido.')
      } else {
        setSetupError('Error al crear el administrador. Intentá de nuevo.')
      }
    }
  }

  // ─── Loading state ───────────────────────────────────
  if (authLoading) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Configuración"
          highlight="Inicial"
          description="Verificando sesión..."
        />
        <Section>
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        </Section>
      </div>
    )
  }

  // ─── Setup done (success) ────────────────────────────
  if (setupDone) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Configuración"
          highlight="Inicial"
          description="Administrador creado exitosamente."
        />
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Admin creado con éxito
              </h3>
              <p className="text-sm text-slate-500">
                Ya podés acceder al panel de administración de reclamos.
              </p>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  // ─── Already has admins ──────────────────────────────
  if (hasAdmins === true) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Configuración"
          highlight="Inicial"
          description="El sistema ya tiene administradores configurados."
        >
          <div className="flex gap-2 mt-6 flex-wrap justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </SectionLayout>
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Ya está configurado
              </h3>
              <p className="text-sm text-slate-500">
                El sistema de reclamos ya tiene administradores asignados.
                Podés gestionar los usuarios desde el panel de
                administración.
              </p>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  // ─── Registration form (not authenticated) ───────────
  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      <SectionLayout
        title="Configuración"
        highlight="Inicial"
        description="Creá el primer administrador del panel de reclamos ciudadanos."
      />

      <Section>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Configuración Inicial
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Creá el primer administrador del sistema
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="correo@municipio.gob.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {setupError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{setupError}</span>
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={regLoading}
              className="w-full mt-6 px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {regLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Crear Administrador
                </>
              )}
            </button>
          </div>
        </div>
      </Section>
    </div>
  )
}

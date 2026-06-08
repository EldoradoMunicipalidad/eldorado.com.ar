import React, { useState, useEffect, useCallback } from 'react'
import { Shield, Loader2, AlertCircle, CheckCircle2, LogOut, Settings, UserPlus } from 'lucide-react'
import { authenticateAdmin, getAdmins, createAdmin } from '../../lib/reclamos'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'

export default function SetupPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  const [hasAdmins, setHasAdmins] = useState(null)
  const [setupDone, setSetupDone] = useState(false)
  const [setupError, setSetupError] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const checkForAdmins = useCallback(async () => {
    try {
      const admins = await getAdmins()
      setHasAdmins(admins.length > 0)
    } catch {
      setHasAdmins(false)
    }
  }, [])

  useEffect(() => {
    checkForAdmins()
  }, [checkForAdmins])

  const handleRegister = async () => {
    setSetupError('')

    if (!username.trim() || !password || !confirmPassword || !nombre.trim()) {
      setSetupError('Completá todos los campos.')
      return
    }
    if (password.length < 4) {
      setSetupError('La contraseña debe tener al menos 4 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setSetupError('Las contraseñas no coinciden.')
      return
    }

    setRegLoading(true)
    try {
      await createAdmin(username.trim(), password, nombre.trim(), '')
      setSetupDone(true)
      showToast('Admin creado correctamente')
    } catch (err) {
      console.error('Error creating admin:', err)
      setSetupError('Error al crear el administrador. Intentá de nuevo.')
    } finally {
      setRegLoading(false)
    }
  }

  if (hasAdmins === null) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout title="Configuración" highlight="Inicial" description="Verificando..." />
        <Section>
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        </Section>
      </div>
    )
  }

  if (setupDone) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout title="Configuración" highlight="Inicial" description="Administrador creado exitosamente." />
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Admin creado con éxito</h3>
              <p className="text-sm text-slate-500">Ya podés acceder al panel de administración de reclamos.</p>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  if (hasAdmins) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout title="Configuración" highlight="Inicial" description="El sistema ya tiene administradores configurados." />
        <Section>
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Ya está configurado</h3>
              <p className="text-sm text-slate-500 mb-6">
                El sistema de reclamos ya tiene administradores. Podés gestionar los usuarios desde el panel de administración.
              </p>
              <a href="/ciudadano-digital/reclamos/admin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors">
                <Settings className="w-4 h-4" /> Ir al Panel
              </a>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      <SectionLayout title="Configuración" highlight="Inicial" description="Creá el primer administrador del panel de reclamos ciudadanos." />

      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>{toast.message}</div>
      )}

      <Section>
        <div className="max-w-lg mx-auto">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Configuración Inicial</h3>
              <p className="text-sm text-slate-500 mt-1">Creá el primer administrador del sistema</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Admin Reclamos" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="admin" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar contraseña</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="••••••" />
              </div>

              {setupError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{setupError}</span>
                </div>
              )}

              <button onClick={handleRegister} disabled={regLoading}
                className="w-full px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {regLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Crear Administrador
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

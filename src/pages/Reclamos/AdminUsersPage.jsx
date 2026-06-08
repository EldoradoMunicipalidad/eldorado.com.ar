import React, { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Users,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Plus,
  X,
  Mail,
  User,
  UserCog,
  UserPlus,
} from 'lucide-react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../../lib/firebase'
import {
  getUserRole,
  getAllAdminUsers,
  setUserRole,
  removeUserRole,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
} from '../../lib/adminUtils'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'

export default function AdminUsersPage() {
  // ─── Auth state ──────────────────────────────────────
  const [user, setUser] = useState(null)
  const [userRole, setUserRoleState] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // ─── Data state ──────────────────────────────────────
  const [adminUsers, setAdminUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // ─── Modal state ─────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false)
  const [addName, setAddName] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [addRole, setAddRole] = useState('viewer')
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')
  const [addPassword, setAddPassword] = useState('')

  // ─── Delete confirm ──────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ─── Toast ───────────────────────────────────────────
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // ─── Auth handler ────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true)
      if (firebaseUser) {
        setUser(firebaseUser)
        setLoginError('')
        const role = await getUserRole(firebaseUser)
        setUserRoleState(role)
      } else {
        setUser(null)
        setUserRoleState(null)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoginError('')
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    } catch (err) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-login-credentials'
      ) {
        setLoginError('Email o contraseña incorrectos.')
      } else {
        setLoginError('Error al iniciar sesión. Intentá de nuevo.')
      }
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    setAdminUsers([])
    setUserRoleState(null)
  }

  const isAdmin = userRole === 'admin'

  // ─── Fetch admin users ───────────────────────────────
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return
    setLoading(true)
    try {
      const users = await getAllAdminUsers()
      setAdminUsers(users)
    } catch (err) {
      console.error('Error fetching admin users:', err)
      showToast('Error al cargar usuarios', 'error')
    } finally {
      setLoading(false)
    }
  }, [isAdmin, showToast])

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin, fetchUsers])

  // ─── Add user ────────────────────────────────────────
  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!addEmail.trim() || !addName.trim() || !addPassword.trim()) return

    setAddLoading(true)
    setAddError('')

    try {
      // Create Firebase Auth account first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        addEmail.trim().toLowerCase(),
        addPassword
      )
      const uid = userCredential.user.uid

      await setUserRole(uid, {
        nombre: addName.trim(),
        email: addEmail.trim().toLowerCase(),
        role: addRole,
      })
      showToast(`Usuario ${addName.trim()} agregado correctamente`)
      setShowAddModal(false)
      setAddName('')
      setAddEmail('')
      setAddPassword('')
      setAddRole('viewer')
      fetchUsers()
    } catch (err) {
      console.error('Error adding user:', err)
      if (err.code === 'auth/email-already-in-use') {
        setAddError('El email ya está registrado. Usá otro email.')
      } else if (err.code === 'auth/weak-password') {
        setAddError('La contraseña debe tener al menos 6 caracteres.')
      } else {
        setAddError('Error al agregar el usuario. Intentá de nuevo.')
      }
    } finally {
      setAddLoading(false)
    }
  }

  // ─── Delete user ─────────────────────────────────────
  const handleDeleteUser = async () => {
    if (!deleteConfirm) return
    setDeleteLoading(true)
    try {
      await removeUserRole(deleteConfirm.uid)
      showToast(`Usuario ${deleteConfirm.nombre || deleteConfirm.email} eliminado`)
      setDeleteConfirm(null)
      fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      showToast('Error al eliminar el usuario', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  // ─── Loading state ───────────────────────────────────
  if (authLoading) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Gestión de"
          highlight="Usuarios"
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

  // ─── Not authenticated ───────────────────────────────
  if (!user) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Gestión de"
          highlight="Usuarios"
          description="Iniciá sesión para gestionar los usuarios administradores."
        />
        <Section>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Acceso al Panel
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Ingresá con tu email y contraseña
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                      placeholder="correo@municipio.gob.ar"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-4 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-all shadow-sm"
                >
                  <LogOut className="w-4 h-4 rotate-90" />
                  Iniciar sesión
                </button>
              </form>

              <p className="text-xs text-slate-400 text-center mt-4">
                Solo usuarios autorizados pueden acceder a este panel.
              </p>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  // ─── Not authorized ──────────────────────────────────
  if (!userRole) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Sin"
          highlight="Acceso"
          description="No tenés permisos para acceder a este panel."
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
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Acceso Restringido
              </h3>
              <p className="text-sm text-slate-500">
                Tu cuenta <strong>{user.email}</strong> no tiene un rol asignado
                en el panel de reclamos.
              </p>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Sin"
          highlight="Permisos"
          description="Solo los administradores pueden gestionar usuarios."
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
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Permisos Insuficientes
              </h3>
              <p className="text-sm text-slate-500">
                Necesitás ser administrador para gestionar usuarios del sistema.
              </p>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  // ─── Main panel ──────────────────────────────────────
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

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Eliminar Usuario
                </h3>
                <p className="text-sm text-slate-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              ¿Estás seguro de que querés eliminar a{' '}
              <strong>{deleteConfirm.nombre || deleteConfirm.email}</strong>?
              Perderá todo acceso al panel de reclamos.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add user modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-8 px-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
            <div className="bg-sky-500 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-bold text-lg">Agregar Usuario</h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setAddError('')
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="Nombre del usuario"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="correo@municipio.gob.ar"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    className="w-full pl-4 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="•••••••• (mín. 6 caracteres)"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rol
                </label>
                <div className="relative">
                  <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {ROLE_DESCRIPTIONS[addRole]}
                </p>
              </div>

              {addError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{addError}</span>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setAddError('')
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Agregando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Agregar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <SectionLayout
        title="Gestión de"
        highlight="Usuarios"
        description="Administrá los usuarios con acceso al panel de reclamos ciudadanos."
      >
        {/* Admin bar */}
        <div className="bg-sky-500 text-white p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {user.displayName || user.email}
              </p>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {ROLE_LABELS[userRole] || userRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-lg">
              {adminUsers.length} usuarios
            </span>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/15 hover:bg-white/25 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/15 hover:bg-white/25 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
      </SectionLayout>

      {/* Main content */}
      <Section>
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          ) : adminUsers.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">
                No hay usuarios
              </h3>
              <p className="text-sm text-slate-400">
                Agregá el primer usuario administrador usando el botón
                "Agregar".
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Creado
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {adminUsers.map((adminUser) => {
                      const isCurrentUser = adminUser.uid === user.uid
                      return (
                        <tr
                          key={adminUser.uid}
                          className={`hover:bg-slate-50/50 transition-colors ${
                            isCurrentUser ? 'bg-sky-50/30' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-sky-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800">
                                  {adminUser.nombre || '—'}
                                  {isCurrentUser && (
                                    <span className="ml-1.5 text-xs text-sky-500 font-medium">
                                      (vos)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500">
                            {adminUser.email || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                adminUser.role === 'admin'
                                  ? 'bg-sky-100 text-sky-700'
                                  : adminUser.role === 'inspector'
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {ROLE_LABELS[adminUser.role] || adminUser.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {adminUser.createdAt
                              ? new Date(
                                  adminUser.createdAt
                                ).toLocaleDateString('es-AR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })
                              : '—'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setDeleteConfirm(adminUser)}
                              disabled={isCurrentUser}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isCurrentUser
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                              }`}
                              title={
                                isCurrentUser
                                  ? 'No podés eliminarte a vos mismo'
                                  : 'Eliminar usuario'
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  )
}

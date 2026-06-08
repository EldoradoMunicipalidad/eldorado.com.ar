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
import { authenticateAdmin, getAdmins, createAdmin, deleteAdmin } from '../../lib/reclamos'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'

export default function AdminUsersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('reclamos_admin_auth') === 'true'
  )
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [adminUsers, setAdminUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAddModal, setShowAddModal] = useState(false)
  const [addName, setAddName] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [addRole, setAddRole] = useState('admin')
  const [addUsername, setAddUsername] = useState('')
  const [addPassword, setAddPassword] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')

  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [toast, setToast] = useState(null)
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    if (!loginUser.trim() || !loginPass.trim()) {
      setLoginError('Completá usuario y contraseña')
      return
    }
    setAuthLoading(true)
    const ok = await authenticateAdmin(loginUser.trim(), loginPass)
    setAuthLoading(false)
    if (ok) {
      sessionStorage.setItem('reclamos_admin_auth', 'true')
      sessionStorage.setItem('reclamos_admin_username', loginUser.trim())
      setIsAuthenticated(true)
    } else {
      setLoginError('Usuario o contraseña incorrectos')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('reclamos_admin_auth')
    sessionStorage.removeItem('reclamos_admin_username')
    setIsAuthenticated(false)
    setLoginUser('')
    setLoginPass('')
  }

  const loadAdmins = useCallback(async () => {
    try {
      const data = await getAdmins()
      setAdminUsers(data || [])
    } catch {
      setAdminUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    loadAdmins()
  }, [isAuthenticated, loadAdmins])

  const openAdd = () => {
    setAddUsername('')
    setAddPassword('')
    setAddName('')
    setAddEmail('')
    setAddRole('admin')
    setAddError('')
    setShowAddModal(true)
  }

  const handleAdd = async () => {
    if (!addUsername.trim() || !addPassword.trim()) {
      setAddError('Usuario y contraseña son obligatorios')
      return
    }
    if (addPassword.length < 4) {
      setAddError('La contraseña debe tener al menos 4 caracteres')
      return
    }
    setAddLoading(true)
    setAddError('')
    try {
      await createAdmin(addUsername.trim(), addPassword, addName.trim(), addEmail.trim())
      showToast('Admin creado correctamente')
      setShowAddModal(false)
      loadAdmins()
    } catch (err) {
      setAddError(err.message || 'Error al crear admin')
    } finally {
      setAddLoading(false)
    }
  }

  const handleDelete = async (username) => {
    setDeleteLoading(true)
    try {
      await deleteAdmin(username)
      showToast('Admin eliminado')
      setDeleteConfirm(null)
      loadAdmins()
    } catch {
      showToast('Error al eliminar admin', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <SectionLayout title="Usuarios" highlight="Administradores" description="Gestión de usuarios del panel de reclamos." />
        <Section>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Acceso al Panel</h3>
                <p className="text-sm text-slate-500 mt-1">Ingresá con tu cuenta municipal</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                  <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" placeholder="admin" autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                  <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" placeholder="••••••" />
                </div>
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}
                <button type="submit" disabled={authLoading}
                  className="w-full px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-60">
                  {authLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Iniciar Sesión'}
                </button>
              </form>
            </div>
          </div>
        </Section>
      </>
    )
  }

  if (loading) {
    return <SectionLayout title="Usuarios" highlight="Administradores" description="Cargando..." />
  }

  return (
    <>
      <SectionLayout title="Usuarios" highlight="Administradores" description="Administrá los usuarios del panel de reclamos.">
        <div className="flex gap-2 mt-6">
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </SectionLayout>

      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>{toast.message}</div>
      )}

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Usuarios Administradores</h3>
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition-colors">
              <UserPlus className="w-4 h-4" /> Agregar Usuario
            </button>
          </div>

          {adminUsers.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {adminUsers.map((admin) => (
                <div key={admin.username} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center shrink-0">
                      <UserCog className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800">{admin.nombre || admin.username}</h4>
                      <p className="text-xs text-slate-400">
                        @{admin.username}
                        {admin.email && <span> · {admin.email}</span>}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {admin.rol || 'admin'}
                    </span>
                    <button
                      onClick={() => setDeleteConfirm(admin.username)}
                      disabled={admin.username === 'admin'}
                      className={`p-2 rounded-lg transition-colors ${
                        admin.username === 'admin' ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title={admin.username === 'admin' ? 'No se puede eliminar' : 'Eliminar'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {deleteConfirm && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                <h3 className="font-bold text-slate-800 mb-2">¿Eliminar usuario?</h3>
                <p className="text-sm text-slate-500 mb-4">Se eliminará <strong>{deleteConfirm}</strong>.</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setDeleteConfirm(null)} disabled={deleteLoading}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold">Cancelar</button>
                  <button onClick={() => handleDelete(deleteConfirm)} disabled={deleteLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                    {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">Nuevo Usuario</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Usuario *</label>
                      <input type="text" value={addUsername} onChange={(e) => setAddUsername(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                        placeholder="usuario" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña *</label>
                      <input type="password" value={addPassword} onChange={(e) => setAddPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                        placeholder="••••••" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                    <input type="text" value={addName} onChange={(e) => setAddName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="Nombre completo" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="correo@ejemplo.com" />
                  </div>
                  {addError && <p className="text-sm text-red-500">{addError}</p>}
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm">Cancelar</button>
                  <button onClick={handleAdd} disabled={addLoading}
                    className="px-5 py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 flex items-center gap-2">
                    {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Crear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

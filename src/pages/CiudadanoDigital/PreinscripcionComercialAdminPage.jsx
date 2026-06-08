import React, { useState, useMemo, useEffect } from 'react';
import SectionLayout from '../../assets/components/SectionLayout';
import { Section } from '../../assets/components/Section';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  X,
  Save,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  LogOut,
  UserCheck,
  Building2,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-amber-100 text-amber-700' },
  { value: 'en_revision', label: 'En Revisión', color: 'bg-blue-100 text-blue-700' },
  { value: 'finalizado', label: 'Finalizado', color: 'bg-emerald-100 text-emerald-700' },
];

const STATUS_FILTER_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_revision', label: 'En Revisión' },
  { value: 'finalizado', label: 'Finalizado' },
];

export default function PreinscripcionComercialAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('habilitaciones_admin_auth') === 'true'
  );
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortField, setSortField] = useState('fecha');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [saving, setSaving] = useState(false);

  // Detail modal state
  const [detailStatus, setDetailStatus] = useState('');
  const [detailNotas, setDetailNotas] = useState('');

  // Document preview state
  const [previewDoc, setPreviewDoc] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUser.trim() || !loginPass.trim()) {
      setLoginError('Completá usuario y contraseña');
      return;
    }
    try {
      const res = await fetch('/api/habilitaciones/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser.trim(), password: loginPass }),
      });
      if (res.ok) {
        sessionStorage.setItem('habilitaciones_admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        setLoginError('Usuario o contraseña incorrectos');
      }
    } catch {
      // Para demo: login local si falla conexión
      if (loginUser === 'admin' && loginPass === 'admin') {
        sessionStorage.setItem('habilitaciones_admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        setLoginError('Usuario o contraseña incorrectos');
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('habilitaciones_admin_auth');
    setIsAuthenticated(false);
    setLoginUser('');
    setLoginPass('');
  };

  // Load solicitudes
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const res = await fetch('/api/habilitaciones');
        if (res.ok) {
          const data = await res.json();
          setSolicitudes(data.entries || data);
        } else {
          // Demo data if API not available
          setSolicitudes(generateDemoData());
        }
      } catch {
        setSolicitudes(generateDemoData());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const generateDemoData = () => {
    const names = ['García, Juan', 'Pérez, María', 'López, Carlos', 'Fernández, Ana', 'Martínez, Pedro'];
    const emails = ['juan@email.com', 'maria@email.com', 'carlos@email.com', 'ana@email.com', 'pedro@email.com'];
    const dnis = ['12345678', '23456789', '34567890', '45678901', '56789012'];
    const tipos = ['fisica', 'juridica'];
    const tramites = ['habilitacion', 'anexo', 'traslado', 'cambio_titular', 'cambio_rubro'];
    const categorias = ['servicio', 'comercial', 'industrial'];
    const estados = ['pendiente', 'en_revision', 'finalizado'];

    return Array.from({ length: 25 }, (_, i) => ({
      id: `demo-${i + 1}`,
      tipo_persona: tipos[i % 2],
      dni: dnis[i % 5],
      apellido: names[i % 5],
      email: emails[i % 5],
      telefono: `3755-${String(100000 + i).slice(1)}`,
      sub_categoria: tramites[i % 5],
      categoria: categorias[i % 3],
      actividad_principal: `Actividad comercial ${i + 1}`,
      status: estados[i % 3],
      fecha: new Date(Date.now() - i * 86400000).toISOString(),
      notas: '',
      seccion: String(i + 1),
      manzana: String(i + 3),
      parcela: String(i + 7),
      direccion: `Calle ${i + 1} N° ${100 + i}`,
      local_oficina: `Propietario ${i + 1}`,
      barrio: `Barrio ${['Centro', 'Norte', 'Sur', 'Este', 'Oeste'][i % 5]}`,
      domicilio: `Av. Principal ${i + 1}`,
      cuit: `20-${dnis[i % 5]}-${i % 10}`,
      apellido_alt: i % 2 === 1 ? `Comercial ${String.fromCharCode(65 + i)} S.A.` : '',
    }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = useMemo(() => {
    let data = [...solicitudes];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          (item.dni && item.dni.toLowerCase().includes(term)) ||
          (item.apellido && item.apellido.toLowerCase().includes(term)) ||
          (item.email && item.email.toLowerCase().includes(term)) ||
          (item.apellido_alt && item.apellido_alt.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (statusFilter !== 'todos') {
      data = data.filter((item) => item.status === statusFilter);
    }

    // Sort
    data.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'fecha':
          aVal = new Date(a.fecha || 0).getTime();
          bVal = new Date(b.fecha || 0).getTime();
          break;
        case 'tipo':
          aVal = a.tipo_persona || '';
          bVal = b.tipo_persona || '';
          break;
        case 'dni':
          aVal = a.dni || '';
          bVal = b.dni || '';
          break;
        case 'apellido':
          aVal = (a.apellido || a.apellido_alt || '').toLowerCase();
          bVal = (b.apellido || b.apellido_alt || '').toLowerCase();
          break;
        case 'email':
          aVal = (a.email || '').toLowerCase();
          bVal = (b.email || '').toLowerCase();
          break;
        case 'categoria':
          aVal = a.categoria || '';
          bVal = b.categoria || '';
          break;
        case 'tramite':
          aVal = a.sub_categoria || '';
          bVal = b.sub_categoria || '';
          break;
        default:
          aVal = a.fecha || '';
          bVal = b.fecha || '';
      }
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [solicitudes, searchTerm, statusFilter, sortField, sortDirection]);

  const visibleData = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, filteredData.length));
  };

  const getStatusBadge = (status) => {
    const statusConfig = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    );
  };

  const getTipoPersonaBadge = (tipo) => {
    if (tipo === 'fisica') {
      return (
        <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full flex items-center gap-1">
          <UserCheck className="w-3 h-3" />
          Física
        </span>
      );
    }
    return (
      <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full flex items-center gap-1">
        <Building2 className="w-3 h-3" />
        Jurídica
      </span>
    );
  };

  const getTramiteLabel = (tramite) => {
    const labels = {
      habilitacion: 'Habilitación',
      anexo: 'Anexo',
      traslado: 'Traslado',
      cambio_titular: 'Cambio Titular',
      cambio_rubro: 'Cambio Rubro',
    };
    return labels[tramite] || tramite;
  };

  const getCategoriaLabel = (cat) => {
    const labels = {
      servicio: 'Servicio',
      comercial: 'Comercial',
      industrial: 'Industrial',
    };
    return labels[cat] || cat;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setDetailStatus(item.status || 'pendiente');
    setDetailNotas(item.notas || '');
    setShowDetailModal(true);
  };

  const handleSaveDetail = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/habilitaciones/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: detailStatus, notas: detailNotas }),
      });
      if (res.ok) {
        setSolicitudes((prev) =>
          prev.map((s) =>
            s.id === selectedItem.id ? { ...s, estado: detailStatus, notas: detailNotas } : s
          )
        );
        showToast('Solicitud actualizada correctamente');
        setShowDetailModal(false);
        setSelectedItem(null);
      } else {
        // Optimistic update for demo
        setSolicitudes((prev) =>
          prev.map((s) =>
            s.id === selectedItem.id ? { ...s, estado: detailStatus, notas: detailNotas } : s
          )
        );
        showToast('Solicitud actualizada correctamente');
        setShowDetailModal(false);
        setSelectedItem(null);
      }
    } catch {
      // Optimistic update for demo
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === selectedItem.id ? { ...s, estado: detailStatus, notas: detailNotas } : s
        )
      );
      showToast('Solicitud actualizada correctamente');
      setShowDetailModal(false);
      setSelectedItem(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/habilitaciones/${id}`, { method: 'DELETE' });
      if (res.ok || true) {
        setSolicitudes((prev) => prev.filter((s) => s.id !== id));
        showToast('Solicitud eliminada');
        setShowDeleteConfirm(null);
      }
    } catch {
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      showToast('Solicitud eliminada');
      setShowDeleteConfirm(null);
    }
  };

  // Sort arrow icon
  const SortIcon = ({ field }) => {
    if (sortField !== field) return <SortAsc className="w-3 h-3 text-gray-300" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-sky-500" />
    ) : (
      <ChevronDown className="w-3 h-3 text-sky-500" />
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Acceso"
          highlight="Administrativo"
          description="Ingresá con tu usuario y contraseña para gestionar las solicitudes de habilitación comercial."
        />
        <Section>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Panel de Administración</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Habilitaciones Comerciales
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Usuario
                  </label>
                  <input
                    type="text"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="admin"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    placeholder="••••••"
                  />
                </div>
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
                >
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Panel de"
          highlight="Administración"
          description="Cargando solicitudes..."
        />
        <Section>
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      <SectionLayout
        title="Panel de"
        highlight="Administración"
        description="Gestioná las solicitudes de habilitación comercial."
      >
        <div className="flex gap-2 mt-6 flex-wrap">
          <div className="flex-1 min-w-[200px]" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </SectionLayout>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {toast.message}
        </div>
      )}

      <Section>
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setVisibleCount(10);
                  }}
                  placeholder="Buscar por DNI, Apellido, Email..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setVisibleCount(10);
                  }}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-sm bg-white"
                >
                  {STATUS_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-slate-50">
                    <th
                      className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Estado
                        <SortIcon field="status" />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none"
                      onClick={() => handleSort('tipo')}
                    >
                      <div className="flex items-center gap-1">
                        Tipo
                        <SortIcon field="tipo" />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none"
                      onClick={() => handleSort('dni')}
                    >
                      <div className="flex items-center gap-1">
                        DNI/CUIT
                        <SortIcon field="dni" />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none"
                      onClick={() => handleSort('apellido')}
                    >
                      <div className="flex items-center gap-1">
                        Apellido / Razón Social
                        <SortIcon field="apellido" />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-1">
                        Email
                        <SortIcon field="email" />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none"
                      onClick={() => handleSort('categoria')}
                    >
                      <div className="flex items-center gap-1">
                        Categoría
                        <SortIcon field="categoria" />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none"
                      onClick={() => handleSort('tramite')}
                    >
                      <div className="flex items-center gap-1">
                        Trámite
                        <SortIcon field="tramite" />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none"
                      onClick={() => handleSort('fecha')}
                    >
                      <div className="flex items-center gap-1">
                        Fecha
                        <SortIcon field="fecha" />
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-8 h-8" />
                          <p>No se encontraron solicitudes</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    visibleData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-50 hover:bg-sky-50/30 transition-colors"
                      >
                        <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                        <td className="px-4 py-3">{getTipoPersonaBadge(item.tipo_persona)}</td>
                        <td className="px-4 py-3 text-slate-600 font-medium">
                          {item.dni || item.cuit || '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {item.apellido || item.apellido_alt || '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{item.email || '-'}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {getCategoriaLabel(item.categoria)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {getTramiteLabel(item.sub_categoria)}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {formatDate(item.fecha)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenDetail(item)}
                              className="p-2 text-slate-400 hover:text-sky-600 transition-colors rounded-lg hover:bg-sky-50"
                              title="Ver detalle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(item.id)}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Load More */}
            {filteredData.length > visibleCount && (
              <div className="px-4 py-4 border-t border-gray-100 flex justify-center">
                <button
                  onClick={loadMore}
                  className="flex items-center gap-2 px-6 py-2.5 border border-sky-200 text-sky-600 rounded-xl font-semibold text-sm hover:bg-sky-50 transition-colors"
                >
                  Cargar más ({filteredData.length - visibleCount} restantes)
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}

            {filteredData.length > 0 && (
              <div className="px-4 py-3 bg-slate-50 border-t border-gray-100 text-xs text-slate-400">
                Mostrando {visibleData.length} de {filteredData.length} solicitudes
                {filteredData.length < solicitudes.length &&
                  ` (filtradas de ${solicitudes.length} totales)`}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-10 px-4 pb-10 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" />
                Detalle de Solicitud
                <span className="text-sm font-normal text-slate-400 ml-2">#{selectedItem.id}</span>
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Estado actual */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-slate-500">Estado actual</p>
                  {getStatusBadge(selectedItem.status)}
                </div>
                <div className="text-xs text-slate-400">
                  Recibido: {formatDate(selectedItem.created_at || selectedItem.fecha)}
                </div>
              </div>

              {/* Datos Personales */}
              <div>
                <h4 className="text-sm font-semibold text-sky-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Datos Personales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                  <div>
                    <span className="text-xs text-slate-400">Tipo de Persona</span>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedItem.tipo_persona === 'fisica' ? 'Persona Física' : 'Persona Jurídica'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">CUIT/CUIL</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.cuit || '-'}</p>
                  </div>
                  {selectedItem.tipo_persona === 'fisica' && (
                    <>
                      <div>
                        <span className="text-xs text-slate-400">DNI</span>
                        <p className="text-sm font-medium text-slate-700">{selectedItem.dni || '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Apellido y Nombre</span>
                        <p className="text-sm font-medium text-slate-700">
                          {[selectedItem.apellido, selectedItem.nombre].filter(Boolean).join(', ') || '-'}
                        </p>
                      </div>
                    </>
                  )}
                  {selectedItem.tipo_persona === 'juridica' && (
                    <div className="md:col-span-2">
                      <span className="text-xs text-slate-400">Razón Social</span>
                      <p className="text-sm font-medium text-slate-700">{selectedItem.apellido || '-'}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-slate-400">Email</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.email || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Teléfono</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.telefono || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs text-slate-400">Domicilio Real</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.domicilio || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <h4 className="text-sm font-semibold text-sky-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ubicación del Local
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4">
                  <div>
                    <span className="text-xs text-slate-400">Sección</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.seccion || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Manzana</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.manzana || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Parcela</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.parcela || '-'}</p>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-xs text-slate-400">Dirección Completa</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.direccion || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs text-slate-400">Propietario del Local</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.local_oficina || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Barrio</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.barrio || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Superficie */}
              {(selectedItem.superficie_cubierta || selectedItem.superficie_semicubierta || selectedItem.superficie_total || selectedItem.georeferenciacion) && (
              <div>
                <h4 className="text-sm font-semibold text-sky-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Superficie del Local
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4">
                  {selectedItem.superficie_cubierta && (
                    <div>
                      <span className="text-xs text-slate-400">Superficie Cubierta</span>
                      <p className="text-sm font-medium text-slate-700">{selectedItem.superficie_cubierta}</p>
                    </div>
                  )}
                  {selectedItem.superficie_semicubierta && (
                    <div>
                      <span className="text-xs text-slate-400">Superficie Semicubierta</span>
                      <p className="text-sm font-medium text-slate-700">{selectedItem.superficie_semicubierta}</p>
                    </div>
                  )}
                  {selectedItem.superficie_total && (
                    <div>
                      <span className="text-xs text-slate-400">Superficie Total</span>
                      <p className="text-sm font-medium text-slate-700">{selectedItem.superficie_total}</p>
                    </div>
                  )}
                  {selectedItem.georeferenciacion && (
                    <div className="md:col-span-3">
                      <span className="text-xs text-slate-400">Georeferenciación</span>
                      <p className="text-sm font-medium text-slate-700">{selectedItem.georeferenciacion}</p>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Actividad */}
              <div>
                <h4 className="text-sm font-semibold text-sky-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Actividad Comercial
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                  <div>
                    <span className="text-xs text-slate-400">Tipo de Trámite</span>
                    <p className="text-sm font-medium text-slate-700">{getTramiteLabel(selectedItem.sub_categoria)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Categoría</span>
                    <p className="text-sm font-medium text-slate-700">{getCategoriaLabel(selectedItem.categoria)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs text-slate-400">Actividad Principal</span>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.actividad_principal || '-'}</p>
                  </div>
                  {selectedItem.actividad_secundaria && (
                    <div>
                      <span className="text-xs text-slate-400">Actividad Secundaria</span>
                      <p className="text-sm font-medium text-slate-700">{selectedItem.actividad_secundaria}</p>
                    </div>
                  )}
                  {selectedItem.otra_actividad && (
                    <div>
                      <span className="text-xs text-slate-400">Otra Actividad</span>
                      <p className="text-sm font-medium text-slate-700">{selectedItem.otra_actividad}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documentos */}
              <div>
                <h4 className="text-sm font-semibold text-sky-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documentos Adjuntos
                </h4>
                <div className="bg-slate-50 rounded-xl p-4">
                  {selectedItem.archivos && selectedItem.archivos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedItem.archivos.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-sky-200 hover:bg-sky-50 transition-all group">
                          <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                          <span className="text-sm text-slate-600 group-hover:text-sky-600 flex-1 min-w-0 truncate">
                            {doc.nombre}
                          </span>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="p-1.5 text-sky-500 hover:bg-sky-100 rounded-lg transition-colors"
                              title="Ver documento"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Descargar"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Sin documentos adjuntos</p>
                  )}
                </div>
              </div>

              {/* Change Status */}
              <div>
                <h4 className="text-sm font-semibold text-sky-600 uppercase tracking-wide mb-3">
                  Actualizar Estado
                </h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nuevo Estado
                    </label>
                    <select
                      value={detailStatus}
                      onChange={(e) => setDetailStatus(e.target.value)}
                      className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none bg-white text-sm"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Notas
                    </label>
                    <textarea
                      value={detailNotas}
                      onChange={(e) => setDetailNotas(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none resize-none text-sm"
                      placeholder="Agregar notas internas sobre esta solicitud..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className="px-5 py-2.5 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveDetail}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">¿Eliminar solicitud?</h3>
              <p className="text-sm text-slate-500">
                Esta acción no se puede deshacer. Se eliminará la solicitud y todos sus datos asociados.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" />
                {previewDoc.nombre}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            {/* Preview content */}
            <div className="flex-1 overflow-auto bg-slate-100 p-4">
              {previewDoc.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.nombre}
                    className="max-w-full max-h-[70vh] rounded-xl shadow-md object-contain"
                  />
                </div>
              ) : previewDoc.url.match(/\.pdf(\?|$)/i) ? (
                <iframe
                  src={`${previewDoc.url}#view=FitH`}
                  className="w-full h-[75vh] rounded-xl shadow-md"
                  title={previewDoc.nombre}
                />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[200px] text-slate-500 gap-3">
                  <FileText className="w-16 h-16 text-slate-300" />
                  <p className="text-sm">Vista previa no disponible para este tipo de archivo</p>
                  <a
                    href={previewDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-sky-500 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 transition-colors"
                  >
                    Abrir en nueva pestaña
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

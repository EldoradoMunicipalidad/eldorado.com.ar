import React, { useState, useMemo } from 'react';
import SectionLayout from '../../assets/components/SectionLayout';
import { EMPRESAS, RUTAS, TODOS_LOS_HORARIOS, TERMINAL_INFO } from '../../data/busEldoradoData';
import { Bus, Phone, MapPin, Clock, Globe, ChevronDown, ExternalLink, Info, Ticket, Star } from 'lucide-react';

// Componente:Selector de ruta
const RutaSelector = ({ rutas, rutaActiva, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {rutas.map((ruta) => (
        <button
          key={ruta.id}
          onClick={() => onSelect(ruta.id)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            rutaActiva === ruta.id
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600'
          }`}
        >
          {ruta.origen} → {ruta.destino}
        </button>
      ))}
    </div>
  );
};

// Componente:Tarjeta de empresa
const EmpresaCard = ({ empresa }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: empresa.color }}
        >
          {empresa.nombre.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">{empresa.nombre}</h3>
          <p className="text-xs text-slate-500">{empresa.id}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <Phone className="size-3" />
          <a href={`tel:${empresa.telefono}`} className="hover:text-sky-600">
            {empresa.telefono}
          </a>
        </div>
        {empresa.web && (
          <div className="flex items-center gap-1">
            <Globe className="size-3" />
            <a href={empresa.web} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600">
              Web oficial
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente:Fila de horario
const HorarioRow = ({ horario }) => {
  const empresa = EMPRESAS.find((e) => e.id === horario.empresaId);
  return (
    <tr className="border-b border-slate-100 hover:bg-sky-50/30 transition-colors">
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <div
            className="size-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: empresa?.color || '#666' }}
          >
            {empresa?.nombre.charAt(0) || '?'}
          </div>
          <span className="text-sm font-medium text-slate-700">{horario.empresa}</span>
        </div>
      </td>
      <td className="py-3 px-3 text-center">
        <span className="text-sm font-semibold text-sky-600">{horario.partida}</span>
      </td>
      <td className="py-3 px-3 text-center hidden md:table-cell">
        <span className="text-sm text-slate-500">{horario.llegada}</span>
      </td>
      <td className="py-3 px-3 text-center hidden lg:table-cell">
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{horario.servicio}</span>
      </td>
      <td className="py-3 px-3 text-center hidden lg:table-cell">
        <span className="text-xs text-slate-500">{horario.duracion}</span>
      </td>
      <td className="py-3 px-3 text-center">
        <span className="text-sm font-bold text-green-600">{horario.precioDesde}</span>
      </td>
      <td className="py-3 px-3 hidden xl:table-cell">
        <span className="text-xs text-slate-500">{horario.observaciones}</span>
      </td>
    </tr>
  );
};

// Componente:Tabla de horarios
const HorariosTable = ({ horarios }) => {
  if (!horarios || horarios.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <Clock className="size-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No hay horarios disponibles para esta ruta.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Empresa</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Partida</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Llegada</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Servicio</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Duración</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario, index) => (
              <HorarioRow key={index} horario={horario} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          ⚠️ Los horarios y precios son referenciales y pueden variar. Verificá directamente con la empresa o en Plataforma10.com.ar
        </p>
      </div>
    </div>
  );
};

// Componente:Info de la Terminal
const TerminalInfo = () => {
  return (
    <section id="terminal" className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 md:p-8 border border-sky-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Bus className="text-sky-500" />
        Terminal de Ómnibus de Eldorado
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <MapPin className="size-5 text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-700 text-sm">Dirección</p>
              <p className="text-slate-600 text-sm">{TERMINAL_INFO.direccion}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="size-5 text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-700 text-sm">Teléfono</p>
              <a href={`tel:${TERMINAL_INFO.telefono}`} className="text-sky-600 text-sm hover:underline">
                {TERMINAL_INFO.telefono}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="size-5 text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-700 text-sm">Horarios de atención</p>
              <p className="text-slate-600 text-sm">{TERMINAL_INFO.horariosAtencion}</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          <p className="font-semibold text-slate-700 text-sm mb-2">Servicios disponibles</p>
          <div className="grid grid-cols-2 gap-2">
            {TERMINAL_INFO.servicios.map((servicio, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <div className="size-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                {servicio}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-sky-100">
        <a
          href={TERMINAL_INFO.ubicacionMapa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sky-600 text-sm font-medium hover:underline"
        >
          <MapPin className="size-4" />
          Ver en Google Maps
          <ExternalLink className="size-3" />
        </a>
      </div>
    </section>
  );
};

// Componente:Alerta informativa
const AlertaInformativa = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
    <Info className="size-5 text-amber-500 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-amber-800">
      <p className="font-semibold mb-1">Información importante</p>
      <p>
        Los horarios y precios mostrados son referenciales y corresponden a la información disponible en{' '}
        <a href="https://www.plataforma10.com.ar" target="_blank" rel="noopener noreferrer" className="font-medium underline hover:text-amber-900">
          Plataforma10.com.ar
        </a>
        . Se recomienda confirmar disponibilidad y tarifas directamente con cada empresa o en la plataforma mencionada antes de planificar tu viaje.
      </p>
    </div>
  </div>
);

// Componente:Tarjeta de ruta
const RutaCard = ({ ruta }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className="size-12 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
      <Bus className="size-6 text-sky-500" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-slate-800 text-sm">{ruta.origen} → {ruta.destino}</h3>
      <p className="text-xs text-slate-500">{ruta.duracionPromedio} • ~{ruta.distanciaAprox}</p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-xs text-slate-500">~{ruta.serviciosPorDia} servicios/día</p>
    </div>
  </div>
);

// ============ PAGINA PRINCIPAL ============
export const BusEldoradoPage = () => {
  const [rutaActiva, setRutaActiva] = useState('eldorado-bsas');
  const [mostrarEmpresas, setMostrarEmpresas] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState('partida');

  // Obtener horarios de la ruta activa
  const horariosActivos = useMemo(() => {
    const horarios = TODOS_LOS_HORARIOS[rutaActiva] || [];
    return [...horarios].sort((a, b) => {
      if (ordenarPor === 'partida') {
        return a.partida.localeCompare(b.partida);
      }
      if (ordenarPor === 'precio') {
        const aPrice = parseInt(a.precioDesde.replace(/[^\d]/g, ''));
        const bPrice = parseInt(b.precioDesde.replace(/[^\d]/g, ''));
        return aPrice - bPrice;
      }
      if (ordenarPor === 'duracion') {
        const aDur = parseInt(a.duracion.match(/\d+/)?.[0] || '0');
        const bDur = parseInt(b.duracion.match(/\d+/)?.[0] || '0');
        return aDur - bDur;
      }
      return 0;
    });
  }, [rutaActiva, ordenarPor]);

  const rutaActual = RUTAS.find((r) => {
    const rutaKey = r.id.replace('eldorado-', 'eldorado-');
    return rutaKey === rutaActiva;
  });

  return (
    <>
      <SectionLayout
        title="Horarios de"
        highlight="Colectivos"
        description="Consultá los horarios y empresas de colectivos que operan desde la Terminal de Ómnibus de Eldorado hacia los principales destinos del país. Información actualizada para facilitar tu viaje."
      />

      {/* Selector de ruta */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">
            Seleccioná tu ruta
          </h2>
          <RutaSelector rutas={RUTAS} rutaActiva={rutaActiva} onSelect={setRutaActiva} />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <AlertaInformativa />

        {/* Resumen de la ruta */}
        {rutaActual && (
          <div className="bg-slate-50 rounded-xl p-4 mb-6 flex flex-wrap gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Bus className="size-4 text-sky-500" />
              <span><strong>{horariosActivos.length}</strong> servicios disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-sky-500" />
              <span>Duración promedio: <strong>{rutaActual.duracionPromedio}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-sky-500" />
              <span>Distancia: <strong>{rutaActual.distanciaAprox}</strong></span>
            </div>
          </div>
        )}

        {/* Filtro de ordenamiento */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <span className="text-sm font-medium text-slate-600">Ordenar por:</span>
          <div className="flex gap-2">
            {[
              { value: 'partida', label: 'Horario de partida' },
              { value: 'precio', label: 'Menor precio' },
              { value: 'duracion', label: 'Menor duración' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setOrdenarPor(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  ordenarPor === opt.value
                    ? 'bg-sky-500 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <a
            href="https://www.plataforma10.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-xs font-medium text-sky-600 hover:underline"
          >
            <ExternalLink className="size-3" />
            Comprar en Plataforma10
          </a>
        </div>

        {/* Tabla de horarios */}
        <HorariosTable horarios={horariosActivos} />

        {/* Todas las rutas */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Rutas disponibles desde Eldorado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RUTAS.map((ruta) => (
              <button
                key={ruta.id}
                onClick={() => setRutaActiva(ruta.id)}
                className={`text-left transition-all ${
                  rutaActiva === ruta.id ? 'ring-2 ring-sky-400 rounded-xl' : ''
                } rounded-xl`}
              >
                <RutaCard ruta={ruta} />
              </button>
            ))}
          </div>
        </section>

        {/* Empresas */}
        <section className="mt-12">
          <button
            onClick={() => setMostrarEmpresas(!mostrarEmpresas)}
            className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4 w-full justify-between"
          >
            <span>Empresas que operan en la Terminal</span>
            <ChevronDown className={`size-5 transition-transform ${mostrarEmpresas ? 'rotate-180' : ''}`} />
          </button>
          {mostrarEmpresas && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {EMPRESAS.map((empresa) => (
                <EmpresaCard key={empresa.id} empresa={empresa} />
              ))}
            </div>
          )}
        </section>

        {/* Info Terminal */}
        <section className="mt-12">
          <TerminalInfo />
        </section>

        {/* Nota final */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Los precios shown are in ARS (Pesos Argentinos) y están sujetos a cambios sin previo aviso.
            Última actualización: junio 2025.
          </p>
        </div>
      </div>
    </>
  );
};

export default BusEldoradoPage;

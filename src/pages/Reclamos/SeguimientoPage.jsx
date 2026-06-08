import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Clock, Loader2, AlertCircle, CircleCheck, FileImage, Mail, Copy, Check } from 'lucide-react'
import { buscarReclamo, ESTADO_LABELS, ESTADO_COLORS } from '../../lib/reclamos'

const ELDORADO = [-26.3983, -54.6167]

function formatearFecha(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function MapaReclamo({ lat, lng }) {
  const [MapComponents, setMapComponents] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([L, ReactLeaflet]) => {
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
      L.Marker.prototype.options.icon = DefaultIcon

      setMapComponents({
        MapContainer: ReactLeaflet.MapContainer,
        TileLayer: ReactLeaflet.TileLayer,
        Marker: ReactLeaflet.Marker,
        Popup: ReactLeaflet.Popup,
      })
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <div
        className="bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm"
        style={{ height: '220px' }}
      >
        Cargando mapa...
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents
  const center = lat && lng ? [parseFloat(lat), parseFloat(lng)] : ELDORADO

  return (
    <div className="rounded-lg overflow-hidden border border-slate-200" style={{ height: '220px' }}>
      <MapContainer
        center={center}
        zoom={lat && lng ? 16 : 14}
        className="h-full w-full"
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat && lng && (
          <Marker position={[parseFloat(lat), parseFloat(lng)]}>
            <Popup>Ubicación del reclamo</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default function SeguimientoPage() {
  const [codigo, setCodigo] = useState('')
  const [reclamo, setReclamo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [buscado, setBuscado] = useState(false)

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const code = codigo.trim().toUpperCase()
    if (!code) return

    setLoading(true)
    setError(null)
    setReclamo(null)
    setBuscado(false)

    try {
      const data = await buscarReclamo(code)
      if (data) {
        setReclamo(data)
      } else {
        setError('No se encontró ningún reclamo con ese código.')
      }
    } catch (err) {
      setError('Ocurrió un error al buscar el reclamo. Intentalo de nuevo más tarde.')
      console.error(err)
    } finally {
      setLoading(false)
      setBuscado(true)
    }
  }, [codigo])

  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
      <main className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12 md:mb-20">
          <div>
            <h1 className="text-3xl md:text-5xl font-light text-sky-500 leading-tight">
              Seguimiento <br />
              <span className="text-4xl md:text-6xl text-sky-500 font-semibold">de Reclamos</span>
            </h1>
          </div>
          <div>
            <p className="text-lg md:text-slate-600 pl-6">
              Ingresá el código de tu reclamo para conocer su estado, ubicación y toda la información actualizada sobre su gestión.
            </p>
          </div>
        </div>
      </main>

      <div className="max-w-3xl mx-auto px-6 pb-16 -mt-8">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ingresá el código del reclamo (ej: RC-A7B3K9)"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !codigo.trim()}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</>
              ) : (
                <><Search className="w-4 h-4" /> Buscar</>
              )}
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
            <span className="ml-3 text-slate-500 text-sm">Buscando reclamo...</span>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col items-center text-center py-6">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Reclamo no encontrado</h3>
              <p className="text-sm text-slate-500 max-w-md">{error}</p>
              <p className="text-xs text-slate-400 mt-3">
                Verificá que el código ingresado sea correcto. El formato es{' '}
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">RC-XXXXXX</span>
              </p>
            </div>
          </div>
        )}

        {reclamo && !loading && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                      {reclamo.codigo}
                    </span>
                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${ESTADO_COLORS[reclamo.estado] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {ESTADO_LABELS[reclamo.estado] || reclamo.estado}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-tight">
                    {reclamo.titulo || 'Sin título'}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {reclamo.categoria && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Categoría</p>
                      <p className="text-sm font-medium text-slate-700">{reclamo.categoria}</p>
                    </div>
                  </div>
                )}
                {reclamo.created_at && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Fecha de presentación</p>
                      <p className="text-sm font-medium text-slate-700">{formatearFecha(reclamo.created_at)}</p>
                    </div>
                  </div>
                )}
              </div>

              {reclamo.descripcion && (
                <div className="border-t border-slate-100 pt-5">
                  <p className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-medium">Descripción</p>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{reclamo.descripcion}</p>
                </div>
              )}
            </div>

            {(reclamo.lat || reclamo.lng) && (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-sky-500" />
                  <h3 className="text-base font-semibold text-slate-800">Ubicación</h3>
                </div>
                <MapaReclamo lat={reclamo.lat} lng={reclamo.lng} />
                {reclamo.direccion && (
                  <p className="text-sm text-slate-500 mt-3">{reclamo.direccion}</p>
                )}
              </div>
            )}

            {reclamo.fotos && reclamo.fotos.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <FileImage className="w-5 h-5 text-sky-500" />
                  <h3 className="text-base font-semibold text-slate-800">Fotos ({reclamo.fotos.length})</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {reclamo.fotos.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-slate-200"
                    >
                      <img
                        src={url}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {reclamo.respuesta_ciudadano && (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Respuesta municipal</h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{reclamo.respuesta_ciudadano}</p>
                    {reclamo.respuesta_fecha && (
                      <p className="text-xs text-slate-400 mt-2">{formatearFecha(reclamo.respuesta_fecha)}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {reclamo.estado === 'resuelto' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
                <CircleCheck className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-green-800 mb-1">Reclamo resuelto</h3>
                  <p className="text-sm text-green-700">
                    Este reclamo fue marcado como resuelto por el municipio. Si necesitás más información podés comunicarte con la dependencia correspondiente.
                  </p>
                </div>
              </div>
            )}

            {reclamo.estado === 'rechazado' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800 mb-1">Reclamo rechazado</h3>
                  <p className="text-sm text-red-700">
                    {reclamo.notas_internas || 'El reclamo fue rechazado. Para más información comunicate con el municipio.'}
                  </p>
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <Link
                to="/ciudadano-digital"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
              >
                ← Volver a Ciudadano Digital
              </Link>
            </div>
          </div>
        )}

        {!buscado && !loading && !reclamo && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col items-center text-center py-8">
              <Search className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-base font-semibold text-slate-700 mb-2">Buscar un reclamo</h3>
              <p className="text-sm text-slate-400 max-w-md">
                Ingresá el código alfanumérico que recibiste al presentar tu reclamo para consultar su estado y toda la información asociada.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

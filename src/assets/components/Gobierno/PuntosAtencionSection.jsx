import React from 'react'
import Icon from '../../Icons/Icon'

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  return value ? [value] : []
}

export const PuntosAtencionSection = ({
  puntos = [],
  title = 'Sucursales y puntos de atención',
  emptyMessage = 'No hay puntos de atención disponibles en este momento.',
}) => {
  if (!puntos.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-4 text-slate-600 leading-7">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {puntos.map((punto, index) => {
          const telefonos = toArray(punto.telefono)
          const horarios = toArray(punto.horario)

          return (
            <article
              key={`${punto.nombre || 'punto'}-${index}`}
              className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 md:p-6 space-y-4"
            >
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 leading-7">
                {punto.nombre || 'Punto de atención'}
              </h3>

              {punto.direccion && (
                <div className="flex items-start gap-3">
                  <Icon name="locationOnIcon" className="text-sky-600 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Dirección</p>
                    <p className="text-slate-700 leading-7">{punto.direccion}</p>
                  </div>
                </div>
              )}

              {telefonos.length > 0 && (
                <div className="flex items-start gap-3">
                  <Icon name="phoneIcon" className="text-sky-600 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Teléfono</p>
                    <div className="space-y-1">
                      {telefonos.map((telefono) => (
                        <a
                          key={telefono}
                          href={`tel:${telefono.replace(/\s|-/g, '')}`}
                          className="block text-sky-700 hover:underline underline-offset-4"
                        >
                          {telefono}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {horarios.length > 0 && (
                <div className="flex items-start gap-3">
                  <Icon name="scheduleIcon" className="text-sky-600 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Horario de atención</p>
                    <ul className="space-y-1 text-slate-700 leading-7">
                      {horarios.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {punto.mapaUrl && (
                <a
                  href={punto.mapaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-600"
                >
                  <Icon name="mapIcon" className="text-sky-600" />
                  Ver ubicación
                </a>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default PuntosAtencionSection
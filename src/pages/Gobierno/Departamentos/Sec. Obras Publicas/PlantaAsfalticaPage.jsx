import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_OBRAS_PUBLICAS } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'

const PLANTA_ASFALTICA_CONTENIDO = {
  parrafos: [
    'Se encuentra ubicada dentro del Parque Industrial Néstor C. Kirchner, sobre la Ruta Nacional N° 12 a la altura del km 1540. La misma fue adquirida por el municipio en el año 2015 con recursos propios mediante licitación pública, la misma cuenta con una capacidad producción de 20 tn/h de asfalto.',
    'La planta asfáltica se ha instalado para mejorar la calidad de vida de ciudadanos de Eldorado.',
  ],
  obras: [
    'Av. J. Schewlm en el Barrio de Pinares',
    'Calle Asunción',
    'Av. Córdoba',
    'Av. Andrejovicz',
    'Pro. Ziegler',
  ],
}

const PlantaAsfalticaPage = () => {
  const asfalticaSection = SECRETARIA_OBRAS_PUBLICAS[0]
  const asfalticaCard = asfalticaSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-obras-publicas/planta-asfaltica'
  )

  return (
    <>
      <SectionLayout
        title="Planta"
        highlight="Asfáltica"
        description={asfalticaCard?.description || 'Infraestructura estratégica para el desarrollo vial de la ciudad.'}
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <article className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-6">
            <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700">
              Información general
            </div>

            {PLANTA_ASFALTICA_CONTENIDO.parrafos.map((parrafo) => (
              <p key={parrafo} className="text-slate-700 leading-8 text-base md:text-lg">
                {parrafo}
              </p>
            ))}
          </article>

          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-widest text-white/85">Capacidad</p>
              <p className="mt-2 text-3xl font-semibold leading-none">20 tn/h</p>
              <p className="mt-2 text-sm text-white/90">de producción de asfalto</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-widest text-slate-500">Ubicación</p>
              <p className="mt-3 text-slate-800 leading-7">
                Parque Industrial Néstor C. Kirchner, Ruta Nacional N° 12, km 1540.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-widest text-slate-500">Adquisición</p>
              <p className="mt-3 text-slate-800 leading-7">
                Adquirida con recursos propios mediante licitación pública en el año 2015.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-12 rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">Obras abastecidas</h2>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {PLANTA_ASFALTICA_CONTENIDO.obras.length} frentes de obra
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {PLANTA_ASFALTICA_CONTENIDO.obras.map((obra) => (
                <span
                  key={obra}
                  className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-2 text-sm md:text-base text-sky-800"
                >
                  {obra}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

export default PlantaAsfalticaPage
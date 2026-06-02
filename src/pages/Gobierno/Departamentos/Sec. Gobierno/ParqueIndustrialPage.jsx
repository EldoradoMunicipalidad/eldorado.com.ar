import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'

const PARQUE_INDUSTRIAL_CONTENIDO = {
  objetivo: [
    'Crear un Parque Industrial en el Municipio Eldorado, que potencie la generación de productos con valor agregado, optimizando el uso de los recursos disponibles, infraestructura y servicios comunes, promoviendo la concentración de industrias de manera ordenada y la generación de nuevos puestos de trabajo calificados; mediante actividades que favorezcan el desarrollo económico, no generen un impacto negativo en el medio ambiente y mejoren la calidad de vida de los habitantes de la Micro Región.',
    'La Municipalidad de Eldorado adquirió un predio de 50 hectáreas destinado a la instalación del Parque Industrial. Actualmente se han realizado inversiones con la construcción de las calles internas, cordón cuneta e iluminación.',
  ],
  informacion: [
    'Desde el Consejo de Administración del Parque Industrial Presidente Néstor C. Kirchner de la ciudad de Eldorado se pone a disposición los formularios para iniciar un registro de Radicación para la utilización de un lote dentro del predio.',
    'Los interesados pueden descargar estos documentos, rellenarlos con la información solicitada y luego presentarlo, por duplicado, en Mesa de Entrada de la Municipalidad de Eldorado.',
    'Además, estos formularios van acompañados de solicitud para la asignación de un lote dentro del parque, que también se puede descargar al pie de esta nota.',
    'Cabe recordar que con el trabajo de los últimos meses, y la conformación del nuevo Consejo de Administración, se han regularizado registros y estudios que permitirán al Parque Industrial de Eldorado acceder a recursos nacionales y provinciales que ayuden generar un espacio de desarrollo y trabajo para nuestra comunidad, fomentando el crecimiento económico de una ciudad productiva.',
  ],
  formularios: [
    {
      label: 'NOTA SOLICITUD PARQUE INDUSTRIAL DEL ALTO PARANÁ NÉSTOR CARLOS KIRCHNER.',
      url: 'https://docs.google.com/document/d/1EAgR5nUfR2mN5WjY19_imHfJMrGlleSH/edit?rtpof=true&sd=true',
    },
    {
      label: 'FORMULARIO REGISTRO DE INTERESADO DE RADICACIÓN (ONLINE).',
      url: 'https://docs.google.com/document/d/1LUJaq7z7xy1gH274Ha6MyGZ5_fZSmItX/edit?rtpof=true&sd=true&tab=t.0',
    },
    {
      label: 'FORMULARIO TÉCNICO PARQUE INDUSTRIAL DEL ALTO PARANÁ NÉSTOR CARLOS KIRCHNER.',
      url: 'https://docs.google.com/document/d/1LUJaq7z7xy1gH274Ha6MyGZ5_fZSmItX/edit?rtpof=true&sd=true',
    },
  ],
}

const ParqueIndustrialPage = () => {
  const parqueSection = SECRETARIA_GOBIERNO[0]
  const parqueCard = parqueSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/parque-industrial'
  )

  return (
    <>
      <SectionLayout
        title="Parque"
        highlight="Industrial"
        description={
          parqueCard?.description ||
          'Espacio estratégico para consolidar inversiones productivas, empleo local e infraestructura industrial en Eldorado.'
        }
      />

      <Section>
        <div className="mb-6 overflow-hidden bg-white">
          <img
            src="/parque_industrial_banner.avif"
            alt="Banner informativo del Parque Industrial de Eldorado"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <article className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-sky-600">Objetivo</h2>

            {PARQUE_INDUSTRIAL_CONTENIDO.objetivo.map((parrafo) => (
              <p key={parrafo} className="text-slate-700 leading-8 text-base md:text-lg">
                {parrafo}
              </p>
            ))}
          </article>

          <aside className="lg:col-span-6 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <img
              src="/parque_industrial.avif"
              alt="Vista aérea del sector destinado al Parque Industrial en Eldorado"
              className="h-full min-h-[320px] w-full object-cover"
              loading="lazy"
            />
          </aside>

          <article className="lg:col-span-12 rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-6">
            {PARQUE_INDUSTRIAL_CONTENIDO.informacion.map((parrafo) => (
              <p key={parrafo} className="text-slate-700 leading-8 text-base md:text-[1.08rem]">
                {parrafo}
              </p>
            ))}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
              <p className="text-sm uppercase tracking-widest text-slate-500 mb-4">Formularios disponibles</p>
              <ul className="space-y-3">
                {PARQUE_INDUSTRIAL_CONTENIDO.formularios.map((item) => (
                  <li key={item.label} className="leading-7">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-sky-700"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </Section>
    </>
  )
}

export default ParqueIndustrialPage
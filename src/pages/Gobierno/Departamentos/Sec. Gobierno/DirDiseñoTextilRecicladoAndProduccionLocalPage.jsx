import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirDiseñoTextilRecicladoAndProduccionLocalPage = () => {
  const disenoSection = SECRETARIA_GOBIERNO[0]
  const disenoCard = disenoSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/diseno-textil-reciclado-y-produccion-local'
  )

  return (
    <>
      <SectionLayout
        title="Dir. de Diseño Textil"
        highlight="Reciclado y Producción Local"
        description="Dependiente de la Secretaría de Gobierno, el Departamento se configura como un espacio estratégico orientado a la promoción de prácticas sostenibles mediante acciones formativas y productivas. Su labor impulsa la creación de artículos de calidad que aportan al desarrollo económico y a la integración social. Esta iniciativa articula políticas públicas con una visión comprometida con el desarrollo territorial, la economía circular y el diseño con impacto social."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {disenoCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={disenoCard.mision} />
            </div>
          )}

          {disenoCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={disenoCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirDiseñoTextilRecicladoAndProduccionLocalPage
import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_OBRAS_PUBLICAS } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'
import SectionCardGrid from '../../../../../assets/components/SectionCardGrid'


const DirObrasPublicasPage = () => {
  const obrasSection = SECRETARIA_OBRAS_PUBLICAS[0]
  const obrasCard = obrasSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-obras-publicas/obras-publicas'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Obras Públicas"
        description="Gestionamos y supervisamos la planificación, ejecución y mantenimiento de proyectos de infraestructura, con el objetivo de mejorar la calidad de vida de la comunidad. Nos enfocamos en obras duraderas, sostenibles y de impacto positivo para el desarrollo urbano y social."
      />

      {obrasCard?.subcards?.length > 0 && (
                <SectionCardGrid
                    id="servicios-obras-publicas"
                    bgColor="bg-white"
                    categoryTitle="Departamentos"
                    cards={obrasCard.subcards}
                />
            )}

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {obrasCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={obrasCard.mision} />
            </div>
          )}

          {obrasCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={obrasCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirObrasPublicasPage
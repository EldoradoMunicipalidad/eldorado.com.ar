import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'
import SectionCardGrid from '../../../../assets/components/SectionCardGrid'

const PoloAcademicoPage = () => {
  const poloSection = SECRETARIA_GOBIERNO[0]
  const poloCard = poloSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/polo-academico'
  )

  return (
    <>
      <SectionLayout
        title="Polo"
        highlight="Académico"
        description="Gestionamos el talento humano con enfoque en el desarrollo profesional, el bienestar laboral y la eficiencia organizacional. Nuestro objetivo es fortalecer un equipo comprometido con los valores y metas institucionales."
      />

      {poloCard?.subcards?.length > 0 && (
        <SectionCardGrid
          id="servicios-polo-academico"
          bgColor="bg-white"
          categoryTitle="Áreas de atención"
          cards={poloCard.subcards}
        />
      )}

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {poloCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={poloCard.mision} />
            </div>
          )}

          {poloCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={poloCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default PoloAcademicoPage
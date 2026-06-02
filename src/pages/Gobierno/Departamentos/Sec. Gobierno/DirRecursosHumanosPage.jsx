import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'
import SectionCardGrid from '../../../../assets/components/SectionCardGrid'

const DirRecursosHumanosPage = () => {
  const recursosSection = SECRETARIA_GOBIERNO[0]
  const recursosCard = recursosSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/recursos-humanos'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Recursos Humanos"
        description="Gestionamos el talento humano con enfoque en el desarrollo profesional, el bienestar laboral y la eficiencia organizacional. Nuestro objetivo es fortalecer un equipo comprometido con los valores y metas institucionales."
      />

      {recursosCard?.subcards?.length > 0 && (
        <SectionCardGrid
          id="servicios-recursos-humanos"
          bgColor="bg-white"
          categoryTitle="Áreas de atención"
          cards={recursosCard.subcards}
        />
      )}

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {recursosCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={recursosCard.mision} />
            </div>
          )}

          {recursosCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={recursosCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirRecursosHumanosPage
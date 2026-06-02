import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_AMBIENTE } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'
import SectionCardGrid from '../../../../assets/components/SectionCardGrid'


const DirAmbientePage = () => {
  const ambienteSection = SECRETARIA_AMBIENTE[0]
  const ambienteCard = ambienteSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-de-ambiente/ambiente'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Ambiente"
        description="Nos encargamos de gestionar y proteger el medio ambiente, promoviendo prácticas sostenibles y la conservación de los recursos naturales. A través de programas de concientización y proyectos ecológicos, buscamos mejorar la calidad ambiental y garantizar un entorno saludable para todos."
      />

      {ambienteCard?.subcards?.length > 0 && (
        <SectionCardGrid
          id="servicios-ambiente"
          bgColor="bg-white"
          categoryTitle="Links de Interés"
          cards={ambienteCard.subcards}
        />
      )}

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {ambienteCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={ambienteCard.mision} />
            </div>
          )}

          {ambienteCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={ambienteCard.funciones} />
            </div>
          )}
        </div>
      </Section>

      
    </>
  )
}

export default DirAmbientePage
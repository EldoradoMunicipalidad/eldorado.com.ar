import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const RelacionesComunidad = () => {
  const relacionesSection = SECRETARIA_ACCION_SOCIAL[0]
  const relacionesCard = relacionesSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/relaciones-comunidad'
  )

  return (
    <>
      <SectionLayout
        title="Relaciones con la"
        highlight="Comunidad"
        description="Fortalecemos el vínculo entre vecinos e institución, promoviendo espacios de diálogo, participación y trabajo conjunto para responder a las necesidades de la comunidad."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {relacionesCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={relacionesCard.mision} />
            </div>
          )}

          {relacionesCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={relacionesCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default RelacionesComunidad
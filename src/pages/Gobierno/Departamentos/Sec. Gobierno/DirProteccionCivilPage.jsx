import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirProteccionCivilPage = () => {
  const proteccionSection = SECRETARIA_GOBIERNO[0]
  const proteccionCard = proteccionSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/proteccion-civil'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Protección Civil"
        description="Trabajamos para prevenir, responder y mitigar riesgos en situaciones de emergencia, priorizando la seguridad y el bienestar de la comunidad. Nuestro compromiso es estar siempre preparados para proteger vidas y fortalecer la resiliencia colectiva."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {proteccionCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={proteccionCard.mision} />
            </div>
          )}

          {proteccionCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={proteccionCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirProteccionCivilPage
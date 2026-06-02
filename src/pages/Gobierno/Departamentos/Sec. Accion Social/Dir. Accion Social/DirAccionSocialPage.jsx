import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'
import SectionCardGrid from '../../../../../assets/components/SectionCardGrid'

const DirAccionSocialPage = () => {
  const accionSection = SECRETARIA_ACCION_SOCIAL[0]
  const accionCard = accionSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/accion-social'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Acción Social"
        description="Nos enfocamos en mejorar la calidad de vida de las personas más vulnerables, proporcionando apoyo y recursos para fomentar la inclusión social. A través de programas y servicios comunitarios, trabajamos para fortalecer el bienestar social y promover la igualdad de oportunidades para todos."
      />

      {accionCard?.subcards?.length > 0 && (
                <SectionCardGrid
                    id="servicios-accion-social"
                    bgColor="bg-white"
                    categoryTitle="Áreas de atención"
                    cards={accionCard.subcards}
                />
            )}

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {accionCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={accionCard.mision} />
            </div>
          )}

          {accionCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={accionCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirAccionSocialPage
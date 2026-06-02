import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirAdultosMayores = () => {
  const adultosSection = SECRETARIA_ACCION_SOCIAL[0]
  const adultosCard = adultosSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/adultos-mayores'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Adultos Mayores"
        description="Nos comprometemos a promover el bienestar, la inclusión y la calidad de vida de los adultos mayores, brindando apoyo y programas que fomenten su autonomía, participación y disfrute pleno de su etapa de vida. Trabajamos para garantizar su dignidad y respeto en todos los ámbitos de la sociedad."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {adultosCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={adultosCard.mision} />
            </div>
          )}

          {adultosCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={adultosCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirAdultosMayores
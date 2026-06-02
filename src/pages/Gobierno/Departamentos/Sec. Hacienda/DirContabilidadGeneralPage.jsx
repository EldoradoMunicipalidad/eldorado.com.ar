import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_HACIENDA } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirContabilidadGeneralPage = () => {
  const contabilidadSection = SECRETARIA_HACIENDA[0]
  const contabilidadCard = contabilidadSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-hacienda/contabilidad-general'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Contabilidad General"
        description="Nos encargamos de la administración y control de las finanzas institucionales, garantizando la transparencia y precisión en la gestión de los recursos. Nuestro objetivo es proporcionar información contable clara y confiable para la toma de decisiones y el cumplimiento de las normativas vigentes."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {contabilidadCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={contabilidadCard.mision} />
            </div>
          )}

          {contabilidadCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={contabilidadCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirContabilidadGeneralPage
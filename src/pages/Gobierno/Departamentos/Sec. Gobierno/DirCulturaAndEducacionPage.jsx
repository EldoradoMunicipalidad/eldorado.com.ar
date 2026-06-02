import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirCulturaAndEducacionPage = () => {
  const culturaSection = SECRETARIA_GOBIERNO[0]
  const culturaCard = culturaSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/cultura-y-educacion'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Cultura y Educación"
        description="Promovemos el desarrollo cultural y educativo de nuestra comunidad, impulsando iniciativas que preservan nuestras tradiciones, fomentan la creatividad y garantizan el acceso a oportunidades de aprendizaje para todos."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {culturaCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={culturaCard.mision} />
            </div>
          )}

          {culturaCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={culturaCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirCulturaAndEducacionPage
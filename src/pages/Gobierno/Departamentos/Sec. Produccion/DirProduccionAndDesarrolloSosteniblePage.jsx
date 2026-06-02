import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_PRODUCCION } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirProduccionAndDesarrolloSosteniblePage = () => {
  const produccionSection = SECRETARIA_PRODUCCION[0]
  const produccionCard = produccionSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-de-produccion/produccion-y-desarrollo-sostenible'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Producción y Desarrollo Sostenible"
        description="Trabajamos para promover un modelo de desarrollo económico que sea innovador, inclusivo y respetuoso con el medio ambiente."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {produccionCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={produccionCard.mision} />
            </div>
          )}

          {produccionCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={produccionCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirProduccionAndDesarrolloSosteniblePage
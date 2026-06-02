import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_OBRAS_PUBLICAS } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'

const DtoPodaAndArboladoPage = () => {
  const mantenimientoSection = SECRETARIA_OBRAS_PUBLICAS[0]
  const mantenimientoCard = mantenimientoSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios'
  )
  const podaCard = mantenimientoCard?.subcards?.find(
    (subcard) => subcard.to === '/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-poda-y-arbolado'
  )

  return (
    <>
      <SectionLayout
        title="Departamento de"
        highlight="Poda y Arbolado Urbano"
        description={podaCard?.description}
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {podaCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={podaCard.mision} />
            </div>
          )}

          {podaCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={podaCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DtoPodaAndArboladoPage
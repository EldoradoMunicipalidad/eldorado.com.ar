import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_PRODUCCION } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirIntegracionProductivaPage = () => {
  const integracionSection = SECRETARIA_PRODUCCION[0]
  const integracionCard = integracionSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-produccion/integracion-productiva'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Integración Productiva"
        description="Fomentamos la colaboración entre sectores productivos, promoviendo la cooperación y el desarrollo de redes empresariales. Nuestro objetivo es fortalecer la competitividad regional mediante la integración de cadenas productivas, impulsando la innovación y la creación de valor a través de alianzas estratégicas."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {integracionCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={integracionCard.mision} />
            </div>
          )}

          {integracionCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={integracionCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirIntegracionProductivaPage
import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirRegularizacionDominialTierras = () => {
  const regularizacionSection = SECRETARIA_ACCION_SOCIAL[0]
  const regularizacionCard = regularizacionSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/regularizacion-dominial-tierras'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de Regularización"
        highlight="Dominial de Tierras"
        description="Facilitamos el acceso legal y seguro a la propiedad de la tierra, acompañando a las familias en procesos de regularización dominial y fortaleciendo su seguridad jurídica."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {regularizacionCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={regularizacionCard.mision} />
            </div>
          )}

          {regularizacionCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={regularizacionCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirRegularizacionDominialTierras
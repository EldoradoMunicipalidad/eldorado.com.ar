import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_HACIENDA } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirRentasGeneralesPage = () => {
  const rentasSection = SECRETARIA_HACIENDA[0]
  const rentasCard = rentasSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-hacienda/rentas-generales'
  )

  return (
    <>
    <SectionLayout
        title="Dirección de"
        highlight="Rentas Generales"
        description="Gestionamos los recursos financieros de manera eficiente, asegurando el cumplimiento de las obligaciones fiscales y promoviendo una cultura de pago responsable. Nuestro objetivo es contribuir al desarrollo sostenible mediante una administración transparente y justa de los ingresos públicos."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {rentasCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={rentasCard.mision} />
            </div>
          )}

          {rentasCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={rentasCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirRentasGeneralesPage
import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirJuventudPage = () => {
  const juventudSection = SECRETARIA_GOBIERNO[0]
  const juventudCard = juventudSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/juventud'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Juventud"
        description="Impulsamos el talento y las ideas de las nuevas generaciones, creando espacios de participación, desarrollo y formación. Nuestro objetivo es empoderar a la juventud para que sean protagonistas del cambio y el futuro de nuestra comunidad."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {juventudCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={juventudCard.mision} />
            </div>
          )}

          {juventudCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={juventudCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirJuventudPage
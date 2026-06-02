import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirComunicacionAndImagenInstitucionalPage = () => {
  const comunicacionSection = SECRETARIA_GOBIERNO[0]
  const comunicacionCard = comunicacionSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/comunicacion-e-imagen-institucional'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de Comunicación e"
        highlight="Imagen Institucional"
        description="Construimos puentes entre la institución y la comunidad, promoviendo una comunicación clara, efectiva y cercana. Trabajamos para fortalecer la identidad institucional y difundir información relevante que impulse la transparencia y la confianza ciudadana."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {comunicacionCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={comunicacionCard.mision} />
            </div>
          )}

          {comunicacionCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={comunicacionCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirComunicacionAndImagenInstitucionalPage
import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'


const DirDeportesAndRecreacionPage = () => {
  const deportesSection = SECRETARIA_GOBIERNO[0]
  const deportesCard = deportesSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/deportes-y-recreacion'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Deportes y Recreación"
        description="Fomentamos la actividad física y el deporte como pilares del bienestar y la integración social. Trabajamos para brindar espacios, programas y oportunidades que impulsen un estilo de vida saludable y el desarrollo de talentos deportivos."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {deportesCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={deportesCard.mision} />
            </div>
          )}

          {deportesCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={deportesCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirDeportesAndRecreacionPage
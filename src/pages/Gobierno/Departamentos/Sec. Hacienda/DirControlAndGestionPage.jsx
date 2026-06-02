import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_HACIENDA } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirControlAndGestionPage = () => {
  const controlSection = SECRETARIA_HACIENDA[0]
  const controlCard = controlSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-hacienda/control-y-gestion'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Control y Gestión"
        description="Nos dedicamos a asegurar la eficiencia y efectividad de los procesos internos, implementando mecanismos de control y supervisión que optimizan el uso de los recursos. Nuestro compromiso es mejorar continuamente la gestión institucional para alcanzar los objetivos y garantizar la transparencia."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {controlCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={controlCard.mision} />
            </div>
          )}

          {controlCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={controlCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirControlAndGestionPage
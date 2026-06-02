import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirNiñezAndAdolescencia = () => {
  const ninezSection = SECRETARIA_ACCION_SOCIAL[0]
  const ninezCard = ninezSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/ninez-y-adolescencia'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Niñez y Adolescencia"
        description="Nos dedicamos a velar por los derechos y el bienestar de niños, niñas y adolescentes, promoviendo su desarrollo integral a través de programas educativos, recreativos y de apoyo. Trabajamos para garantizar un entorno seguro, saludable y lleno de oportunidades para las nuevas generaciones."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {ninezCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={ninezCard.mision} />
            </div>
          )}

          {ninezCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={ninezCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirNiñezAndAdolescencia
import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import TributosDashboard from '../../assets/components/GobiernoAbierto/TributosDashboard'

const TributosPage = () => {
  return (
    <>
      <SectionLayout
        title="Consolidado de"
        highlight="Tributos"
        description="Accede a la información consolidada de tributos municipales, incluyendo datos detallados sobre impuestos, tasas y contribuciones. Esta sección proporciona una visión clara y actualizada de las obligaciones tributarias para ciudadanos y empresas, facilitando el cumplimiento y promoviendo la transparencia en la gestión fiscal del municipio."
      />

      <Section>
        <TributosDashboard />
      </Section>
    </>
  )
}

export default TributosPage
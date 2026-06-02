import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import LicitacionesList from '../../assets/components/GobiernoAbierto/LicitacionesList'


const LicitacionesPage = () => {
  return (
    <>
        <SectionLayout
        title="Licitaciones"
        highlight="Municipales"
        description="Bienvenido a la sección de Licitaciones Municipales. Aquí encontrarás toda la información sobre los procesos abiertos para contratar obras, servicios o adquisiciones impulsados por el municipio. Nuestro objetivo es fomentar la participación transparente, abierta y en igualdad de condiciones, asegurando así que las propuestas seleccionadas representen el mejor valor para nuestra comunidad. Te invitamos a consultar las convocatorias vigentes y formar parte del desarrollo local."
      />


      <Section>
        <LicitacionesList />
      </Section>
    </>
  )
}

export default LicitacionesPage
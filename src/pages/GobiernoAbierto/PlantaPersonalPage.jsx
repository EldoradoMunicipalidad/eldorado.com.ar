import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import PlantaPersonalGrid from '../../assets/components/GobiernoAbierto/PlantaPersonalGrid'
import { PLANTA_PERSONAL_DATA } from '../../data/GobiernoAbierto/plantaPersonalData'

const PlantaPersonalPage = () => {
  return (
    <>
      <SectionLayout 
        title="Planta de"
        highlight="Personal"
        description="Planta de personal por área, identificado en cantidades y por categorias"
      />

      <Section>
        <PlantaPersonalGrid data={PLANTA_PERSONAL_DATA} />
      </Section>
    </>
  )
}

export default PlantaPersonalPage
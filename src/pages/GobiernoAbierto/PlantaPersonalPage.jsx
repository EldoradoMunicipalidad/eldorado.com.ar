import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import PlantaPersonalGrid from '../../assets/components/GobiernoAbierto/PlantaPersonalGrid'
import { PLANTA_PERSONAL_DATA } from '../../data/GobiernoAbierto/plantaPersonalData'
import { DEFAULT_GOBIERNO_ABIERTO_SUBPAGES } from '../../data/GobiernoAbierto/cmsDefaults'
import { useCmsContent } from '../../lib/useCmsContent'

const PlantaPersonalPage = () => {
  const content = useCmsContent('gobierno-abierto-planta-personal', DEFAULT_GOBIERNO_ABIERTO_SUBPAGES.plantaPersonal)
  return (
    <>
      <SectionLayout 
        title="Planta de"
        highlight="Personal"
        description="Planta de personal por área, identificado en cantidades y por categorias"
      />

      <Section>
        <PlantaPersonalGrid data={content.data || PLANTA_PERSONAL_DATA} />
      </Section>
    </>
  )
}

export default PlantaPersonalPage

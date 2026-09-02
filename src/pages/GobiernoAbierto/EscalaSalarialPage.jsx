import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import EscalaSalarialGrid from '../../assets/components/GobiernoAbierto/EscalaSalarialGrid'
import { ESCALA_SALARIAL_DATA } from '../../data/GobiernoAbierto/escalaSalarialData'
import { DEFAULT_GOBIERNO_ABIERTO_SUBPAGES } from '../../data/GobiernoAbierto/cmsDefaults'
import { useCmsContent } from '../../lib/useCmsContent'

const EscalaSalarialPage = () => {
    const content = useCmsContent('gobierno-abierto-escala-salarial', DEFAULT_GOBIERNO_ABIERTO_SUBPAGES.escalaSalarial)
  return (
    <>
        <SectionLayout 
            title="Escala"
            highlight="Salarial"
            description="Escala salarial vigente del municipio ( Enero 2025 )"
        />

        <Section>
          <EscalaSalarialGrid data={content.data || ESCALA_SALARIAL_DATA} />
        </Section>
    </>
  )
}

export default EscalaSalarialPage

import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import EscalaSalarialGrid from '../../assets/components/GobiernoAbierto/EscalaSalarialGrid'
import { ESCALA_SALARIAL_DATA } from '../../data/GobiernoAbierto/escalaSalarialData'

const EscalaSalarialPage = () => {
  return (
    <>
        <SectionLayout 
            title="Escala"
            highlight="Salarial"
            description="Escala salarial vigente del municipio ( Enero 2025 )"
        />

        <Section>
          <EscalaSalarialGrid data={ESCALA_SALARIAL_DATA} />
        </Section>
    </>
  )
}

export default EscalaSalarialPage
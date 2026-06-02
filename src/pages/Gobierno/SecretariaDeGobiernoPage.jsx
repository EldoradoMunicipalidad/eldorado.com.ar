import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import { SECRETARIA_GOBIERNO } from '../../data/Gobierno/secretariasCards'
import SectionCardGrid from '../../assets/components/SectionCardGrid';

export const SecretariaDeGobiernoPage = () => {
  return (
    <>
      <SectionLayout
        title="Secretaría de"
        highlight="Gobierno"
        description="Comprometidos con el bienestar y desarrollo de nuestra comunidad, la Secretaría de Gobierno trabaja para garantizar una gestión eficiente, transparente y cercana a los ciudadanos, promoviendo políticas públicas que impulsan el progreso y fortalecen los valores democráticos."
      />

      {SECRETARIA_GOBIERNO.map((section, index) => (
        <SectionCardGrid
        key={index}
        id={section.id}
        bgColor="bg-white"
        categoryTitle={section.categoryTitle}
        cards={section.cards}
      />
      ))}

    </>
  )
}

export default SecretariaDeGobiernoPage
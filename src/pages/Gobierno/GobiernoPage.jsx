import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import SectionCardGrid from '../../assets/components/SectionCardGrid'
import {
  GOBIERNO_INTENDENCIA_DATA,
  GOBIERNO_SECRETARIAS_DATA,
} from '../../data/Gobierno/gobiernoData'

export const GobiernoPage = () => {
  return (
    <>
      <SectionLayout
        title="Gobierno"
        highlight="Municipal"
        description="Conocé el funcionamiento del gobierno municipal: intendencia, gabinete y las secretarías que gestionan la ciudad."
      />

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p className="text-[#4d4d4d] text-base leading-relaxed">
          Estructura política y administrativa del municipio. Cada secretaría agrupa las
          direcciones y departamentos que ejecutan políticas públicas en sus áreas.
        </p>
      </div>

      {GOBIERNO_INTENDENCIA_DATA.map((section, index) => (
        <SectionCardGrid
          key={`int-${index}`}
          id={section.id}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          icon={section.icon}
          cards={section.cards}
        />
      ))}

      {GOBIERNO_SECRETARIAS_DATA.map((section, index) => (
        <SectionCardGrid
          key={`sec-${index}`}
          id={section.id}
          bgColor="bg-slate-50"
          categoryTitle={section.categoryTitle}
          icon={section.icon}
          cards={section.cards}
        />
      ))}
    </>
  )
}

export default GobiernoPage
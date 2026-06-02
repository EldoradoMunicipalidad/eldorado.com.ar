import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import { intendenciaData, secretariasData } from '../../data/Gobierno/intendenciaData';
import SectionCardGrid from '../../assets/components/SectionCardGrid';


export const IntendenciaPage = () => {
  return (
    <>
      <SectionLayout
        title="Intendencia"
        highlight=""
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia perspiciatis quam, molestias repellendus aut dolor!"
      />

    <SectionCardGrid
      id="equipo"
      bgColor="bg-white"
      titleIcon="account_balance"
      categoryTitle="Equipo"
      cards={intendenciaData}
    />

    {secretariasData.map((section, index) => (
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

export default IntendenciaPage;

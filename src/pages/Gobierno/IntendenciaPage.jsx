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
        description="El Departamento Ejecutivo Municipal está encabezado por el Intendente, quien coordina las distintas secretarías y direcciones para garantizar el funcionamiento y desarrollo de la ciudad de Eldorado."
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

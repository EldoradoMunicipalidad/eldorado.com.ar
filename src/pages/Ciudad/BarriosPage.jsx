import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import SectionCardGrid from '../../assets/components/SectionCardGrid'
import { barriosSectionData, BARRIOS_DATA } from '../../data/barriosSectionData';
import MapExplorer from '../../assets/components/Ciudad/MapExplorer';

export const BarriosPage = () => {
  return (
    <div>
      <SectionLayout
        title="Barrios"
        highlight=""
        description="Conocé los barrios que conforman nuestra ciudad, sus ubicaciones, servicios y espacios verdes. Eldorado está dividida en diversos barrios y chacras, cada uno con su identidad y características particulares."
      />
      
      {barriosSectionData.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards} />
      ))}

      <MapExplorer
        items={BARRIOS_DATA}
        mainTitle="Barrios de Eldorado"
        onItemSelect={(item) => console.log("Seleccionado:", item.name)}
      />

    </div>
  )
}

export default BarriosPage;

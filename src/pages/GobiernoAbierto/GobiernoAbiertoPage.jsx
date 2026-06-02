import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import OrdenanzaSection from '../../assets/components/GobiernoAbierto/OrdenanzaSection';
import { GOBIERNO_ABIERTO_DATA, FINANZAS_PUBLICAS_DATA, OBRAS_PUBLICAS_DATA, RECURSOS_HUMANOS_DATA, TRIBUTOS_DATA } from '../../data/GobiernoAbierto/gobiernoAbiertoData';

export const GobiernoAbiertoPage = () => {
  return (
    <>

      <SectionLayout
        title="Gobierno"
        highlight="Abierto"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
      />

      {GOBIERNO_ABIERTO_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

      <OrdenanzaSection
        titulo="Ordenanza 048/2024"
        descripcion="Adhesión del Municipio a las Leyes Provinciales VII N° 52 (Antes Ley 4166) y VII N° 85 del Régimen Federal de Responsabilidad Fiscal y Buenas Prácticas de Gobierno."
        listaItems={[
          {
            etiqueta: 'Ordenanza N° 048/2.018',
            href: 'https://drive.google.com/file/d/1zPU90z1iW3DqXNEYlcWUDSTr0tLutc8D/preview',
            textoEnlace: 'Ver documento'
          },
          {
            etiqueta: 'Boletín Oficial de Misiones',
            href: 'https://drive.google.com/file/d/1pHXlH04KTRIJzvdK9deVEx7SOzvtDufL/preview',
            textoEnlace: 'Ver documento'
          }
        ]}
      />


      

      {FINANZAS_PUBLICAS_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

      {TRIBUTOS_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

      {OBRAS_PUBLICAS_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

      {RECURSOS_HUMANOS_DATA.map((section, index) => (
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

export default GobiernoAbiertoPage;

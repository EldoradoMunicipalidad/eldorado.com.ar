import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import {
  CIUDADANO_DIGITAL_DATA,
  CIUDADANO_DIGITAL_HACIENDA_DATA,
  CIUDADANO_DIGITAL_AUTOMOTOR_DATA,
  CIUDADANO_DIGITAL_POLO_ACADEMICO_DATA,
  CIUDADANO_DIGITAL_INSTITUCIONES_DATA
} from '../../data/CiudadanoDigital/ciudadanoDigitalData';


export const CiudadanoDigitalPage = () => {
  return (
    <>

      <SectionLayout
        title="Ciudadano"
        highlight="Digital"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."
      />

      {CIUDADANO_DIGITAL_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          icon={section.icon}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

      {CIUDADANO_DIGITAL_HACIENDA_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          icon={section.icon}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

      {CIUDADANO_DIGITAL_AUTOMOTOR_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          icon={section.icon}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

      {CIUDADANO_DIGITAL_POLO_ACADEMICO_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          icon={section.icon}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

      {CIUDADANO_DIGITAL_INSTITUCIONES_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          icon={section.icon}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

    </>
  )
};

export default CiudadanoDigitalPage;

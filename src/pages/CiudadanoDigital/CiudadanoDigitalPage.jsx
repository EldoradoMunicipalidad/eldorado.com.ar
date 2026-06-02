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
        description="Accedé a todos los servicios municipales desde un solo lugar. Trámites, consultas, gestiones y más, disponibles de forma rápida y segura."
      />

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p className="text-[#4d4d4d] text-base leading-relaxed">
          Gestioná tus trámites municipales sin moverte de casa. Seleccioná el servicio que necesitás y accedé con un clic.
        </p>
      </div>

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
          bgColor="bg-[#fafafa]"
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
          bgColor="bg-[#fafafa]"
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

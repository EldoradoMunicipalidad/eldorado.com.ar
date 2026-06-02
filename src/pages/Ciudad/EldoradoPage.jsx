import React from 'react'
import { eldoradoSections } from '../../data/eldoradoSectionsData';
import EldoradoSectionLayout from '../../assets/components/Ciudad/EldoradoSectionLayout'

export const EldoradoPage = () => {
  return (
    <div className="scroll-smooth">
      {eldoradoSections.map((section, index) => (
        <EldoradoSectionLayout
          key={section.id}
          section={{
            ...section, // Mantenemos todos los datos originales
            bg: index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }} />
      ))}
    </div>
  );
};

export default EldoradoPage;
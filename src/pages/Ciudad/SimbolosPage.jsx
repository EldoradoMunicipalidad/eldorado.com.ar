import React from 'react'
import { escudoAndInsigniasData } from '../../data/escudoAndInsigniasData';
import EldoradoSectionLayout from '../../assets/components/Ciudad/EldoradoSectionLayout';

export const SimbolosPage = () => {
  return (
    <div className="scroll-smooth">
      {escudoAndInsigniasData.map((section, index) => (
        <EldoradoSectionLayout
          key={section.id}
          section={{
            ...section, // Mantenemos todos los datos originales
            bg: index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }} />
      ))}
    </div>
  )
}

export default SimbolosPage;

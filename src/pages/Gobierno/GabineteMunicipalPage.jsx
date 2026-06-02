import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import {
  SECRETARIA_GOBIERNO,
  SECRETARIA_PRODUCCION,
  SECRETARIA_AMBIENTE,
  SECRETARIA_HACIENDA,
  SECRETARIA_OBRAS_PUBLICAS,
  SECRETARIA_ACCION_SOCIAL
} from '../../data/Gobierno/gabineteMunicipalData';

export const GabineteMunicipalPage = () => {
  const seccionesGabinete = [
    ...SECRETARIA_GOBIERNO,
    ...SECRETARIA_PRODUCCION,
    ...SECRETARIA_AMBIENTE,
    ...SECRETARIA_HACIENDA,
    ...SECRETARIA_OBRAS_PUBLICAS,
    ...SECRETARIA_ACCION_SOCIAL
  ];

  const mapIntegranteToCard = (integrante) => {
    const descriptionLines = [integrante.cargo, integrante.telefono, integrante.email].filter(Boolean);

    return {
      title: integrante.nombre,
      description: (
        <span className="whitespace-pre-line text-sm">
          {descriptionLines.join('\n')}
        </span>
      ),
      icon: integrante.icon || 'person'
    };
  };

  return (
    <>
      <SectionLayout
        title="Gabinete"
        highlight="Municipal"
        description=""
      />

      {seccionesGabinete.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          bgColor="bg-white"
          categoryTitle={section.titulo || 'Integrantes'}
          cards={section.integrantes.map(mapIntegranteToCard)}
        />
      ))}
    </>
  )
}

export default GabineteMunicipalPage; 
import React, { useEffect, useState } from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import { getPageContent } from '../../lib/pages'
import { DEFAULT_GABINETE_MUNICIPAL_CONTENT } from '../../data/GobiernoAbierto/cmsDefaults'

export const GabineteMunicipalPage = () => {
  const [content, setContent] = useState(DEFAULT_GABINETE_MUNICIPAL_CONTENT)

  useEffect(() => {
    getPageContent('gabinete-municipal').then((response) => {
      if (response.content) {
        setContent({
          ...DEFAULT_GABINETE_MUNICIPAL_CONTENT,
          ...response.content,
          header: { ...DEFAULT_GABINETE_MUNICIPAL_CONTENT.header, ...(response.content.header || {}) },
        })
      }
    })
  }, [])

  const seccionesGabinete = content.sections || []

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
        title={content.header?.title}
        highlight={content.header?.highlight}
        description={content.header?.description}
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

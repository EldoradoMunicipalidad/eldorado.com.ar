import React, { useEffect, useState } from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import OrdenanzaSection from '../../assets/components/GobiernoAbierto/OrdenanzaSection';
import { getPageContent } from '../../lib/pages'
import { DEFAULT_GOBIERNO_ABIERTO_CONTENT } from '../../data/GobiernoAbierto/cmsDefaults'

export const GobiernoAbiertoPage = () => {
  const [content, setContent] = useState(DEFAULT_GOBIERNO_ABIERTO_CONTENT)

  useEffect(() => {
    getPageContent('gobierno-abierto').then((response) => {
      if (response.content) {
        setContent({
          ...DEFAULT_GOBIERNO_ABIERTO_CONTENT,
          ...response.content,
          header: { ...DEFAULT_GOBIERNO_ABIERTO_CONTENT.header, ...(response.content.header || {}) },
          ordinance: { ...DEFAULT_GOBIERNO_ABIERTO_CONTENT.ordinance, ...(response.content.ordinance || {}) },
        })
      }
    })
  }, [])

  return (
    <>

      <SectionLayout
        title={content.header?.title}
        highlight={content.header?.highlight}
        description={content.header?.description}
      />

      <div className="max-w-7xl mx-auto px-4 mb-8">
        <p className="text-gray-600 text-lg leading-relaxed">
          {content.intro}
        </p>
      </div>

      {(content.sections || []).map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          bgColor="bg-white"
          categoryTitle={section.categoryTitle}
          cards={section.cards}
        />
      ))}

      <section id={content.ordinance?.id || 'ordenanza-048'} className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <OrdenanzaSection
            titulo={content.ordinance?.titulo}
            descripcion={content.ordinance?.descripcion}
            listaItems={content.ordinance?.documentos || []}
          />
        </div>
      </section>
    </>
  )
}

export default GobiernoAbiertoPage;

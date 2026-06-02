import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import {
  SECRETARIA_OBRAS_PUBLICAS,
} from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import Accordion from '../../../../assets/components/Accordion'
import SectionCardGrid from '../../../../assets/components/SectionCardGrid'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirPlaneamientoPage = () => {
  const planeamientoSection = SECRETARIA_OBRAS_PUBLICAS[0]
  const planeamientoCard = planeamientoSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-obras-publicas/planeamiento'
  )
  const accordionItems = planeamientoSection?.accordionItems ?? []

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Planeamiento"
        description="Nos encargamos de la planificación estratégica y el desarrollo urbano, trabajando para diseñar un futuro ordenado y sostenible. A través de proyectos visionarios y una gestión integral, buscamos mejorar la infraestructura y los servicios de la comunidad, promoviendo el crecimiento organizado y armónico."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {planeamientoCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={planeamientoCard.mision} />
            </div>
          )}

          {planeamientoCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={planeamientoCard.funciones} />
            </div>
          )}
        </div>
      </Section>

      {accordionItems.length > 0 && (
        <Section>
          <div className="space-y-4">
            {accordionItems.map((accordionItem, index) => (
              <Accordion
                key={accordionItem.title}
                title={accordionItem.title}
                icon={accordionItem.icon}
                contentClassName="p-0"
                defaultOpen={index === 0}
              >
                <SectionCardGrid
                  categoryTitle={null}
                  cards={accordionItem.cards}
                  bgColor="bg-white"
                />
              </Accordion>
            ))}
          </div>
        </Section>
      )}

      
    </>
  )
}

export default DirPlaneamientoPage
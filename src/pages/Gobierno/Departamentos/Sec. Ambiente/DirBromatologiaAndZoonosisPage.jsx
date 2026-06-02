import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_AMBIENTE } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'
import Accordion from '../../../../assets/components/Accordion'

const DirBromatologiaAndZoonosisPage = () => {
  const bromatologiaSection = SECRETARIA_AMBIENTE[0]
  const bromatologiaCard = bromatologiaSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-de-ambiente/bromatologia-y-zoonosis'
  )
  const accordionGroupsSource = bromatologiaCard?.accordionGroups ?? bromatologiaSection?.accordionGroups ?? []
  const accordionGroups = accordionGroupsSource
    .filter(Boolean)
    .map((group) => ({
      ...group,
      items: Array.isArray(group.items) ? group.items : [],
    }))
    .filter((group) => group.items.length > 0)

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Bromatología, Veterinaria y Zoonosis"
        description="Nos dedicamos a la protección de la salud pública y animal, supervisando la calidad de los alimentos, controlando enfermedades zoonóticas y promoviendo el bienestar animal. Trabajamos para garantizar la seguridad alimentaria y prevenir riesgos para la salud humana y animal."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {bromatologiaCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={bromatologiaCard.mision} />
            </div>
          )}

          {bromatologiaCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={bromatologiaCard.funciones} />
            </div>
          )}
        </div>
      </Section>

      {accordionGroups.length > 0 && (
        <Section>
          <div className="space-y-10">
            {accordionGroups.map((accordionGroup, groupIndex) => (
              <Accordion
                key={`${accordionGroup.title}-${groupIndex}`}
                title={accordionGroup.title}
                icon={accordionGroup.icon || 'article_shortcut'}
                defaultOpen={groupIndex === 0}
                contentClassName="p-6 space-y-5 bg-slate-50/40"
              >
                {accordionGroup.description && (
                  <p className="text-sm text-slate-500">
                    {accordionGroup.description}
                  </p>
                )}

                <div className="space-y-4">
                  {accordionGroup.items?.map((accordionItem, accordionIndex) => (
                    <Accordion
                      key={`${accordionGroup.title}-${accordionItem.title}-${accordionIndex}`}
                      title={accordionItem.title}
                      icon={accordionItem.icon}
                      contentClassName="p-6 space-y-5"
                      className="bg-white"
                    >
                      {accordionItem.descripcion?.map((parrafo, index) => (
                        <p key={`descripcion-${groupIndex}-${accordionIndex}-${index}`} className="text-slate-600 leading-relaxed">
                          {parrafo}
                        </p>
                      ))}

                      {accordionItem.requisitos?.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Requisitos</h3>
                          <ul className="space-y-2">
                            {accordionItem.requisitos.map((requisito, index) => (
                              <li key={`requisito-${groupIndex}-${accordionIndex}-${index}`} className="flex items-start gap-3 text-slate-600">
                                <span className="text-sky-500 font-bold mt-1">•</span>
                                <span>{requisito}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {accordionItem.observaciones?.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Observaciones</h3>
                          <ul className="space-y-2">
                            {accordionItem.observaciones.map((observacion, index) => (
                              <li key={`observacion-${groupIndex}-${accordionIndex}-${index}`} className="flex items-start gap-3 text-slate-600">
                                <span className="text-amber-500 font-bold mt-1">•</span>
                                <span>{observacion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {accordionItem.to && (
                        <div>
                          <a
                            href={accordionItem.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors"
                          >
                            <span>{accordionItem.ctaLabel || 'Ver mas informacion'}</span>
                            <span className="material-symbols-outlined text-base leading-none">open_in_new</span>
                          </a>
                        </div>
                      )}
                    </Accordion>
                  ))}
                </div>
              </Accordion>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

export default DirBromatologiaAndZoonosisPage
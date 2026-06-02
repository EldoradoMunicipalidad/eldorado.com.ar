import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_AMBIENTE } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'
import Accordion from '../../../../assets/components/Accordion'


const ProgramasPage = () => {
  const programasSection = SECRETARIA_AMBIENTE[0]
  const programasCard = programasSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-de-ambiente/programas'
  )
  const accordionItems = (programasCard?.accordionGroups ?? programasSection?.accordionGroups ?? []).filter(Boolean)

  return (
    <>
      <SectionLayout
        title="Ambiente -"
        highlight="Programas"
        description=""
      />

      {accordionItems.length > 0 && (
        <Section>
          <div className="space-y-4">
            {accordionItems.map((item, itemIndex) => (
              <Accordion
                key={`${item.title}-${itemIndex}`}
                title={item.title}
                icon={item.icon || 'article_shortcut'}
                contentClassName="p-6 space-y-5"
                className="bg-white"
              >
                      {item.descripcion?.map((parrafo, index) => (
                        <p key={`descripcion-${itemIndex}-${index}`} className="text-slate-600 leading-relaxed">
                          {parrafo}
                        </p>
                      ))}

                      {item.destacado && (
                        <p className="text-slate-900 font-semibold leading-relaxed">
                          {item.destacado}
                        </p>
                      )}

                      {item.actividades?.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Actividades</h3>
                          <ul className="space-y-3">
                            {item.actividades.map((actividad, index) => (
                              <li key={`actividad-${itemIndex}-${index}`} className="text-slate-700">
                                <div className="flex items-start gap-3">
                                  <span className="text-slate-700 font-bold mt-1">•</span>
                                  <span>{actividad.titulo || actividad}</span>
                                </div>
                                {actividad?.items?.length > 0 && (
                                  <ul className="mt-2 ml-7 space-y-1 text-slate-600">
                                    {actividad.items.map((subitem, subIndex) => (
                                      <li key={`actividad-subitem-${itemIndex}-${index}-${subIndex}`} className="flex items-start gap-3">
                                        <span className="text-slate-500 mt-1">◦</span>
                                        <span>{subitem}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.cierre && (
                        <p className="text-slate-700 leading-relaxed">
                          {item.cierre}
                        </p>
                      )}

                      {item.categorias?.length > 0 && (
                        <div className="space-y-8">
                          {item.categorias.map((categoria, categoriaIndex) => (
                            <div key={`categoria-${itemIndex}-${categoriaIndex}`} className="space-y-3">
                              {categoria.titulo && (
                                <h3 className="text-3xl font-light tracking-tight text-sky-600">{categoria.titulo}</h3>
                              )}

                              {categoria.subtitulo && (
                                <h4 className="text-sm font-bold text-sky-600 uppercase tracking-wide">{categoria.subtitulo}</h4>
                              )}

                              {categoria.descripcion && (
                                <p className="text-slate-700 leading-relaxed">{categoria.descripcion}</p>
                              )}

                              {categoria.texto && (
                                <p className="text-slate-700 leading-relaxed">{categoria.texto}</p>
                              )}

                              {categoria.destacado && (
                                <p className="text-sky-700 font-semibold leading-relaxed">{categoria.destacado}</p>
                              )}

                              {categoria.items?.length > 0 && (
                                <ul className="space-y-3">
                                  {categoria.items.map((catItem, catItemIndex) => {
                                    const label = typeof catItem === 'string' ? catItem : catItem?.label
                                    const detail = typeof catItem === 'object' ? catItem?.texto : null
                                    const subitems = typeof catItem === 'object' ? catItem?.items : null

                                    if (!label) return null

                                    return (
                                      <li key={`categoria-item-${itemIndex}-${categoriaIndex}-${catItemIndex}`} className="text-slate-700">
                                        <div className="flex items-start gap-3">
                                          <span className="text-slate-700 font-bold mt-1">•</span>
                                          <span>
                                            {detail ? (
                                              <>
                                                <strong className="text-sky-600">{label}:</strong> {detail}
                                              </>
                                            ) : (
                                              label
                                            )}
                                          </span>
                                        </div>

                                        {subitems?.length > 0 && (
                                          <ul className="mt-2 ml-7 space-y-1 text-slate-600">
                                            {subitems.map((subitem, subIndex) => (
                                              <li key={`categoria-subitem-${itemIndex}-${categoriaIndex}-${catItemIndex}-${subIndex}`} className="flex items-start gap-3">
                                                <span className="text-slate-500 mt-1">◦</span>
                                                <span>{subitem}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </li>
                                    )
                                  })}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.requisitos?.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Requisitos</h3>
                          <ul className="space-y-2">
                            {item.requisitos.map((requisito, index) => (
                              <li key={`requisito-${itemIndex}-${index}`} className="flex items-start gap-3 text-slate-600">
                                <span className="text-sky-500 font-bold mt-1">•</span>
                                <span>{requisito}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.observaciones?.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Observaciones</h3>
                          <ul className="space-y-2">
                            {item.observaciones.map((observacion, index) => {
                              const label = typeof observacion === 'string' ? observacion : observacion?.label
                              const link = typeof observacion === 'object' ? observacion?.to : null

                              if (!label) return null

                              return (
                                <li key={`observacion-${itemIndex}-${index}`} className="flex items-start gap-3 text-slate-600">
                                  <span className="text-amber-500 font-bold mt-1">•</span>
                                  {link ? (
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 underline underline-offset-4">
                                      {label}
                                    </a>
                                  ) : (
                                    <span>{label}</span>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}

                      {item.adjuntos?.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Adjuntos</h3>
                          <ul className="space-y-2">
                            {item.adjuntos.map((adjunto, index) => {
                              const label = typeof adjunto === 'string' ? adjunto : adjunto?.label
                              const link = typeof adjunto === 'object' ? adjunto?.to : null

                              if (!label) return null

                              return (
                                <li key={`adjunto-${itemIndex}-${index}`} className="flex items-start gap-3 text-slate-600">
                                  <span className="text-sky-500 font-bold mt-1">•</span>
                                  {link ? (
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 underline underline-offset-4">
                                      {label}
                                    </a>
                                  ) : (
                                    <span className="text-sky-600 font-semibold">{label}</span>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}

                      {item.to && (
                        <div>
                          <a
                            href={item.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors"
                          >
                            <span>{item.ctaLabel || 'Ver mas informacion'}</span>
                            <span className="material-symbols-outlined text-base leading-none">open_in_new</span>
                          </a>
                        </div>
                      )}
              </Accordion>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

export default ProgramasPage
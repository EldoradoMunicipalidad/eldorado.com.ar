import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import Accordion from '../../assets/components/Accordion'
import { ORGANIGRAMA_SECCIONES } from '../../data/GobiernoAbierto/organigramaData'
import Icon from '../../assets/Icons/Icon'

const OrganigramaPage = () => {
  return (
    <>
        <SectionLayout 
            title="Organigrama"
            highlight="Municipal"
            description="Estructura organizativa del municipio"
        />

        <section className="mt-10 max-w-5xl mx-auto px-4 pb-16">
          <div className="space-y-4">
            {ORGANIGRAMA_SECCIONES.map((secretaria) => (
              <Accordion
                key={secretaria.id}
                title={secretaria.title}
                icon={secretaria.icon || 'account_tree'}
                openIcon={secretaria.icon || 'account_tree'}
              >
                {secretaria.items.length > 0 ? (
                  <ul className="p-4 sm:p-5 grid gap-3 bg-slate-50/60">
                    {secretaria.items.map((item) => (
                      <li
                        key={`${item.title}-${item.actionLabel}`}
                        className="group flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" aria-hidden="true" />
                          <span className="text-slate-700 text-sm sm:text-base font-semibold leading-snug">
                            {item.title}
                          </span>
                        </div>

                        {item.file ? (
                          <a
                            href={item.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-700 text-sm font-semibold transition-colors hover:border-sky-300 hover:bg-sky-100 hover:text-sky-800"
                          >
                            {item.actionLabel}
                            <Icon name="arrowOutwardIcon" />
                          </a>
                        ) : (
                          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-500 text-sm font-semibold">
                            {item.actionLabel}
                            <span className="text-xs font-normal text-slate-400">(sin archivo)</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-5 text-slate-500 text-sm sm:text-base">
                    Esta secretaria todavia no tiene items cargados.
                  </div>
                )}
              </Accordion>
            ))}
          </div>
        </section>
    </>
  )
}

export default OrganigramaPage
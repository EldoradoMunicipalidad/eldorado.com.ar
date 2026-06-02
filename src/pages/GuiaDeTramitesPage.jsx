import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionLayout from '../assets/components/SectionLayout'
import { isExternal } from '../assets/hooks/isExternal'
import Icon from '../assets/Icons/Icon'
import { GUIAS_POR_CATEGORIA } from '../data/guiaDeTramitesData'

const GuiaDeTramitesPage = () => {
  const [categoriaAbierta, setCategoriaAbierta] = useState(null)

  const toggleCategoria = (id) => {
    setCategoriaAbierta(categoriaAbierta === id ? null : id)
  }

  return (
    <>
      <SectionLayout
        title="Guía de"
        highlight="Trámites"
        description="Encontrá toda la información necesaria para realizar tus trámites municipales. Seleccioná la categoría y accedé al detalle de cada gestión."
      />

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <p className="text-slate-500 text-base mb-10 leading-relaxed">
          Todos los trámites organizados por categoría. Hacé clic en cada categoría para ver los trámites disponibles.
        </p>

        <div className="space-y-3">
          {GUIAS_POR_CATEGORIA.map((categoria) => {
            const abierta = categoriaAbierta === categoria.id
            return (
              <div
                key={categoria.id}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm"
              >
                {/* Header */}
                <button
                  onClick={() => toggleCategoria(categoria.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                      <Icon name={categoria.icon} className="text-sky-600 text-lg" />
                    </div>
                    <span className="font-semibold text-slate-800 text-base">
                      {categoria.categoryTitle}
                    </span>
                    <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                      {categoria.items.length}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${abierta ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Content */}
                {abierta && (
                  <div className="border-t border-slate-100 divide-y divide-slate-50">
                    {categoria.items.map((item, idx) => (
                      <div key={idx} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <span className="text-sm text-slate-700 leading-relaxed">{item.titulo}</span>
                        {item.enlace ? (
                          isExternal(item.enlace) ? (
                            <a
                              href={item.enlace}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                            >
                              <span>Ir al trámite</span>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <Link
                              to={item.enlace}
                              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                            >
                              <span>Ir al trámite</span>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          )
                        ) : (
                          <span className="text-xs text-slate-300">Próximamente</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default GuiaDeTramitesPage

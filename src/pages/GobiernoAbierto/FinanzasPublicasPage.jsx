import React from 'react'
import Accordion from '../../assets/components/Accordion'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import { FINANZAS_PUBLICAS_DATA } from '../../data/GobiernoAbierto/gobiernoAbiertoData'
import BalancetesView from '../../assets/components/GobiernoAbierto/BalancetesView'
import ResumenConsolidadoView from '../../assets/components/GobiernoAbierto/ResumenConsolidadoView'
import Icon from '../../assets/Icons/Icon'
import { DEFAULT_GOBIERNO_ABIERTO_SUBPAGES } from '../../data/GobiernoAbierto/cmsDefaults'
import { useCmsContent } from '../../lib/useCmsContent'
import { BALANCETES_DATA } from '../../data/GobiernoAbierto/balancetesData'
import { RESUMEN_CONSOLIDADO } from '../../data/GobiernoAbierto/resumenConsolidadoData'

const FinanzasPublicasPage = () => {
    const content = useCmsContent('gobierno-abierto-finanzas', DEFAULT_GOBIERNO_ABIERTO_SUBPAGES.finanzas)
    const balancetes = useCmsContent('gobierno-abierto-balancetes', DEFAULT_GOBIERNO_ABIERTO_SUBPAGES.balancetes)
    const resumen = useCmsContent('gobierno-abierto-resumen-consolidado', DEFAULT_GOBIERNO_ABIERTO_SUBPAGES.resumenConsolidado)
    const categorias = content.categories || FINANZAS_PUBLICAS_DATA[0]?.cards || []
    const categoriasDetalle = content.detalles || {}

    return (
        <>
            <SectionLayout
                title={content.header?.title}
                highlight={content.header?.highlight}
                description={content.header?.description}
            />

            <Section>
                <div className="space-y-4">
                    {categorias.map((categoria, index) => {
                        const detalle = categoriasDetalle[categoria.title]

                        return (
                        <Accordion
                            key={`${categoria.title}-${index}`}
                            title={categoria.title}
                            icon={categoria.icon || 'article_shortcut'}
                            defaultOpen={false}
                            contentClassName="p-6 space-y-4 bg-slate-50/40"
                        >
                            <p className="text-slate-600 leading-relaxed">
                                {categoria.description}
                            </p>

                            {categoria.title === 'Balancetes trimestrales' ? (
                                <BalancetesView data={balancetes.data || BALANCETES_DATA} />
                                ) : categoria.title === 'Resumen Consolidado de Finanzas Públicas' ? (
                                    <ResumenConsolidadoView data={resumen.data || RESUMEN_CONSOLIDADO} />
                                ) : detalle?.documentos?.length > 0 ? (
                                <div className="space-y-4">
                                    {detalle.documentos.map((documento, documentoIndex) => (
                                        <div
                                            key={`${categoria.title}-documento-${documentoIndex}`}
                                            className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"
                                        >
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    {documento.titulo}
                                                </h3>

                                                {documento.subtitulo && (
                                                    <p className="text-slate-600 leading-relaxed">
                                                        {documento.subtitulo}
                                                    </p>
                                                )}
                                            </div>

                                            {documento.enlace ? (
                                                <div>
                                                    <a
                                                        href={documento.enlace}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors"
                                                    >
                                                        <span>Ver documento</span>
                                                        <Icon name="arrowOutwardIcon" className="" />
                                                        </a>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500">
                                                    Enlace pendiente de carga.
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    Espacio preparado para incorporar la documentación e información correspondiente a esta categoría.
                                </p>
                            )}
                        </Accordion>
                        )
                    })}
                </div>
            </Section>
        </>
    )
}

export default FinanzasPublicasPage

import React from 'react'
import Accordion from '../../assets/components/Accordion'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import { FINANZAS_PUBLICAS_DATA } from '../../data/GobiernoAbierto/gobiernoAbiertoData'
import BalancetesView from '../../assets/components/GobiernoAbierto/BalancetesView'
import ResumenConsolidadoView from '../../assets/components/GobiernoAbierto/ResumenConsolidadoView'
import Icon from '../../assets/Icons/Icon'

const FinanzasPublicasPage = () => {
    const categorias = FINANZAS_PUBLICAS_DATA[0]?.cards ?? []
    const categoriasDetalle = {
        'Ordenanza Presupuestaria': {
            documentos: [
                {
                    titulo: 'Presupuesto 2026 ( Ord. 249/2026 - Dec. 259/2025 )',
                    subtitulo: 'Estimacion de recursos y planificacion de los gastos previstos para el ejercicio 2026',
                    enlace: 'https://drive.google.com/file/d/1vDMiKL42Od6AKXbprUzVkhgoNNepgN5P/view'
                }
            ]
        },
        'Ordenanza General Fiscal': {
            documentos: [
                {
                    titulo: 'ORDENANZA N° 218/2.025 - ANEXO I - ORDENANZA GENERAL FISCAL EJERCICIO 2.026 PARTE TRIBUTARIA',
                    enlace: 'https://drive.google.com/file/d/19klWWMDYFE1fOY2TlO2If2OzERg8kVV-/view'
                },
                {
                    titulo: 'ORDENANZA N° 218/2.025 - ANEXO II - ORDENANZA GENERAL FISCAL EJERCICIO 2.026 PARTE TRIBUTARIA',
                    enlace: 'https://drive.google.com/file/d/1-fgpCPz017LTgr6PcN32D8LsVhdJrHl7/view'
                },
                {
                    titulo: 'ORDENANZA N° 218/2.025 - ANEXO III - ORDENANZA GENERAL FISCAL EJERCICIO 2.026 PARTE TRIBUTARIA',
                    enlace: 'https://drive.google.com/file/d/1GanbPAULcBe1o8-VDEjoaCZh32EqOg2S/view'
                }
            ]
        },
        'Inventario de Bienes': {
            documentos: [
                {
                    titulo: 'Alta 3° Trimestre, Impresión Inventario (2024)',
                    enlace: 'https://drive.google.com/file/d/1wVInZ3YaK2RwHUBFdwr87nKXBs1dm-NK/view'
                },
                {
                    titulo: 'Baja 3° Trimestre, Impresión Inventario (2024)',
                    enlace: 'https://drive.google.com/file/d/1wVInZ3YaK2RwHUBFdwr87nKXBs1dm-NK/view'
                },
                {
                    titulo: 'Alta 4° Trimestre, Impresión Inventario (2024)',
                    enlace: 'https://drive.google.com/file/d/1-wUq9mp2A2-EQSS0oWKfL1DVZf3x5Hx-/preview'
                },
                {
                    titulo: 'Baja 4° Trimestre, Impresión Inventario (2024)',
                    enlace: 'https://drive.google.com/file/d/1salQ1o_NLUiT8W8AMGEqiSu5j48N4I2O/preview'
                }
            ]
        }
    }

    return (
        <>
            <SectionLayout
                title="Informacion de"
                highlight="Finanzas Publicas"
                description="Accede a la información detallada sobre las finanzas públicas de la Municipalidad de Eldorado, incluyendo ordenanzas presupuestarias, inventarios de bienes y balancetes trimestrales."
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
                                <BalancetesView />
                                ) : categoria.title === 'Resumen Consolidado de Finanzas Públicas' ? (
                                    <ResumenConsolidadoView />
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
import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_AMBIENTE } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'
import Icon from '../../../../assets/Icons/Icon'


const ObservatorioAmbientalPage = () => {
    const observatorioSection = SECRETARIA_AMBIENTE[0]
    const observatorioCard = observatorioSection?.cards.find(
        (card) => card.to === '/gobierno/secretaria-de-ambiente/observatorio-ambiental'
    )

    return (
        <>
            <SectionLayout
                title="Observatorio"
                highlight="Ambiental"
                description="Se implementa en la ciudad de Eldorado el Observatorio Ambiental consistente en una base de datos respecto a la gestión que se lleva adelante desde el área de ambiente."
            />

            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {observatorioCard?.mision && (
                        <div className="lg:col-span-12">
                            <Mision texto={observatorioCard.mision} />
                        </div>
                    )}

                    {observatorioCard?.funciones?.length > 0 && (
                        <div className="lg:col-span-12">
                            <FuncionesPrincipales items={observatorioCard.funciones} />
                        </div>
                    )}

                    {observatorioCard?.subcards?.length > 0 && (
                        <div className="lg:col-span-12 flex flex-wrap gap-4">
                            {observatorioCard.subcards.map((subcard, index) => (
                                <a
                                    key={index}
                                    href={subcard.to}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors"
                                >
                                    <Icon name={subcard.icon} className="text-base leading-none" />
                                    <span>{subcard.title}</span>
                                    <Icon name="arrowOutwardIcon" className="text-base leading-none" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </Section>
        </>
    )
}

export default ObservatorioAmbientalPage
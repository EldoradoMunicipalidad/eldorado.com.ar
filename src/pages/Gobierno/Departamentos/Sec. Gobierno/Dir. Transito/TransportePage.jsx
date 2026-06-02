import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { JuzgadoAccordion } from '../../../../../assets/components/Gobierno/JuzgadoAccordion'
import { SECRETARIA_GOBIERNO } from '../../../../../data/Gobierno/secretariasCards'

const TransportePage = () => {
    const gobiernoSection = SECRETARIA_GOBIERNO[0]
    const transitoCard = gobiernoSection?.cards.find(
        (card) => card.to === '/gobierno/secretaria-gobierno/transito-y-transporte'
    )
    const transporteCard = transitoCard?.subcards?.find(
        (subcard) => subcard.to === '/gobierno/secretaria-gobierno/transito-y-transporte/transporte'
    )

    return (
        <>
            <SectionLayout
                title="Área de"
                highlight="Transporte"
                description="Información y trámites vinculados al área de transporte municipal."
            />

            {transporteCard?.innerCards?.length > 0 && (
                <section id="tramites-transporte" className="bg-slate-50/50 py-10">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="space-y-4">
                            {transporteCard.innerCards.map((card, index) => (
                                <JuzgadoAccordion
                                    key={index}
                                    titulo={card.title}
                                    icon={card.icon}
                                    parrafo1={card.parrafo1 || card.description}
                                    parrafo2={card.parrafo2}
                                    parrafo3={card.parrafo3}
                                    Lista1={card.Lista1}
                                    Lista2={card.Lista2}
                                    Lista3={card.Lista3}
                                    whatsapp={card.whatsapp}
                                    email={card.email}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>

    )
}


export default TransportePage
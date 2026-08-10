import React from 'react'
import SectionLayout from '../../../../../../assets/components/SectionLayout'
import { JuzgadoAccordion } from '../../../../../../assets/components/Gobierno/JuzgadoAccordion'
import { SECRETARIA_GOBIERNO } from '../../../../../../data/Gobierno/secretariasCards'

const RegistroVehiculosPage = () => {
    const gobiernoSection = SECRETARIA_GOBIERNO[0]
    const transitoCard = gobiernoSection?.cards.find(
        (card) => card.to === '/gobierno/secretaria-gobierno/transito-y-transporte'
    )
    const registroCard = transitoCard?.subcards?.find(
        (subcard) => subcard.to === '/gobierno/secretaria-gobierno/transito-y-transporte/registro-vehiculos'
    )

    return (
        <>
            <SectionLayout
                title="Registro de"
                highlight="Vehículos"
                description="Inscripción oficial de colectivos y vehículos de transporte especializado que prestan servicio en la ciudad de Eldorado. Gestión realizada por la Dirección de Tránsito y Transporte."
            />

            {registroCard?.innerCards?.length > 0 && (
                <section id="tramites-registro-vehiculos" className="bg-slate-50/50 py-10">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="space-y-4">
                            {registroCard.innerCards.map((card, index) => (
                                <JuzgadoAccordion
                                    key={index}
                                    titulo={card.title}
                                    icon={card.icon}
                                    parrafo1={card.description}
                                    to={card.to}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default RegistroVehiculosPage

import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_OBRAS_PUBLICAS } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'

const DtoEjecucionObrasPage = () => {
    const obrasSection = SECRETARIA_OBRAS_PUBLICAS[0]
    const obrasCard = obrasSection?.cards.find(
        (card) => card.to === '/gobierno/secretaria-obras-publicas/obras-publicas'
    )

    const ejecucionObrasCard = obrasCard?.subcards?.find(
        (subcard) => subcard.to === '/gobierno/secretaria-obras-publicas/obras-publicas/dto-ejecucion-obras'
    )

    return (
        <>
            <SectionLayout
                title="Departamento de"
                highlight="Ejecucion de Obras"
                description={
                    ejecucionObrasCard?.description ||
                    'Desarrolla obras de infraestructura vial y urbana para mejorar la transitabilidad y los espacios públicos de la ciudad.'
                }
            />

            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {ejecucionObrasCard?.mision && (
                        <div className="lg:col-span-12">
                            <Mision texto={ejecucionObrasCard.mision} />
                        </div>
                    )}

                    {ejecucionObrasCard?.funciones?.length > 0 && (
                        <div className="lg:col-span-12">
                            <FuncionesPrincipales items={ejecucionObrasCard.funciones} />
                        </div>
                    )}
                </div>
            </Section>
        </>
    )
}

export default DtoEjecucionObrasPage
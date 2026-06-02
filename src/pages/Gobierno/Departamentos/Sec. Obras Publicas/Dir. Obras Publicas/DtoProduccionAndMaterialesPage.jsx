import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_OBRAS_PUBLICAS } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'

const DtoProduccionAndMaterialesPage = () => {
    const obrasSection = SECRETARIA_OBRAS_PUBLICAS[0]
    const obrasCard = obrasSection?.cards.find(
        (card) => card.to === '/gobierno/secretaria-obras-publicas/obras-publicas'
    )

    const produccionMaterialesCard = obrasCard?.subcards?.find(
        (subcard) => subcard.to === '/gobierno/secretaria-obras-publicas/obras-publicas/dto-produccion-y-materiales'
    )

    return (
        <>
            <SectionLayout
                title="Departamento de"
                highlight="Producción y Materiales"
                description={
                    produccionMaterialesCard?.description ||
                    'Elabora y provee materiales para sostener la ejecución y el mantenimiento de obras públicas municipales.'
                }
            />

            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {produccionMaterialesCard?.mision && (
                        <div className="lg:col-span-12">
                            <Mision texto={produccionMaterialesCard.mision} />
                        </div>
                    )}

                    {produccionMaterialesCard?.funciones?.length > 0 && (
                        <div className="lg:col-span-12">
                            <FuncionesPrincipales items={produccionMaterialesCard.funciones} />
                        </div>
                    )}
                </div>
            </Section>
        </>
    )
}

export default DtoProduccionAndMaterialesPage
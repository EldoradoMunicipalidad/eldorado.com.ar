import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import SectionCardGrid from '../../../../../assets/components/SectionCardGrid'
import { SECRETARIA_GOBIERNO } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'

export const DirTransitoAndTransportePage = () => {
    const transitoSection = SECRETARIA_GOBIERNO[0]
    const transitoCard = transitoSection?.cards.find(
        (card) => card.to === '/gobierno/secretaria-gobierno/transito-y-transporte'
    )

    return (
        <>
            <SectionLayout
                title="Dirección de"
                highlight="Transito y Transporte"
                description="Fomentamos la seguridad vial y la movilidad sostenible a través de una gestión eficiente del tránsito y el transporte. Nuestro compromiso es mejorar la circulación, promover el respeto por las normas viales y brindar soluciones que beneficien a todos los ciudadanos."
            />

            {transitoCard?.subcards?.length > 0 && (
                <SectionCardGrid
                    id="servicios-transito-y-transporte"
                    bgColor="bg-white"
                    categoryTitle="Áreas de atención"
                    cards={transitoCard.subcards}
                />
            )}

            <Section>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {transitoCard.mision && (
                        <div className="lg:col-span-12">
                          <Mision texto={transitoCard.mision} />
                        </div>
                      )}
            
                      {transitoCard.funciones?.length > 0 && (
                        <div className="lg:col-span-12">
                          <FuncionesPrincipales items={transitoCard.funciones} />
                        </div>
                      )}
                    </div>
                  </Section>

        </>
    )
}

export default DirTransitoAndTransportePage

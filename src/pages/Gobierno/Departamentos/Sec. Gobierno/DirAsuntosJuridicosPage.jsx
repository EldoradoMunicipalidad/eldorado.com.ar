import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirAsuntosJuridicosPage = () => {
  const asuntosJuridicosSection = SECRETARIA_GOBIERNO[0]
  const asuntosJuridicosCard = asuntosJuridicosSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/asuntos-juridicos'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Asuntos Jurídicos"
        description="Velamos por la legalidad y transparencia en todas las acciones institucionales, brindando asesoramiento jurídico y garantizando el cumplimiento de las normativas vigentes para proteger los derechos e intereses de la comunidad."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {asuntosJuridicosCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={asuntosJuridicosCard.mision} />
            </div>
          )}

          {asuntosJuridicosCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={asuntosJuridicosCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirAsuntosJuridicosPage
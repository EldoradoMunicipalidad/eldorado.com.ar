import React from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_GOBIERNO } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'

const DirDesarrolloAndIntegracionRegionalPage = () => {
  const desarrolloSection = SECRETARIA_GOBIERNO[0]
  const desarrolloCard = desarrolloSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-gobierno/desarrollo-e-integracion-regional'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de Desarrollo e "
        highlight="Integración Regional"
        description="Nos enfocamos en promover la cooperación y el crecimiento económico sostenible a nivel local y regional. A través de proyectos colaborativos y la implementación de políticas públicas innovadoras, trabajamos para mejorar la infraestructura, impulsar el desarrollo social y fomentar la integración de diversas regiones. Nos comprometemos a crear un futuro próspero y equitativo, fortaleciendo las relaciones entre los sectores público, privado y comunitario."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {desarrolloCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={desarrolloCard.mision} />
            </div>
          )}

          {desarrolloCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={desarrolloCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirDesarrolloAndIntegracionRegionalPage
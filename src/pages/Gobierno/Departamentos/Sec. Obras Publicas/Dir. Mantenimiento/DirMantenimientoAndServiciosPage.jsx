import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_OBRAS_PUBLICAS } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'
import SectionCardGrid from '../../../../../assets/components/SectionCardGrid'


const DirMantenimientoAndServiciosPage = () => {
  const mantenimientoSection = SECRETARIA_OBRAS_PUBLICAS[0]
  const mantenimientoCard = mantenimientoSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios'
  )

  return (
    <>
      <SectionLayout
        title="Dirección de"
        highlight="Mantenimiento y Servicios"
        description="Nos encargamos de la recolección de residuos y la limpieza de los espacios públicos, contribuyendo al bienestar y la higiene de la comunidad. Trabajamos para mantener la ciudad limpia, segura y ordenada, gestionando eficientemente los servicios esenciales."
      />

      {mantenimientoCard?.subcards?.length > 0 && (
        <SectionCardGrid
          id="servicios-mantenimiento-y-servicios"
          bgColor="bg-white"
          categoryTitle="Áreas de atención"
          cards={mantenimientoCard.subcards}
        />
      )}

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {mantenimientoCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={mantenimientoCard.mision} />
            </div>
          )}

          {mantenimientoCard?.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={mantenimientoCard.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default DirMantenimientoAndServiciosPage
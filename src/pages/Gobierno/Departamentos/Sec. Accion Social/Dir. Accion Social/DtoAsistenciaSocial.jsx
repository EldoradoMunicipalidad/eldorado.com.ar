import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'

const DtoAsistenciaSocial = () => {
  const accionSocialSection = SECRETARIA_ACCION_SOCIAL[0]
  const accionSocialCard = accionSocialSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/accion-social'
  )

  const asistenciaSocialCard = accionSocialCard?.subcards?.find(
    (subcard) => subcard.to === '/gobierno/secretaria-accion-social/accion-social/dto-asistencia-social'
  )

  const funcionesNormalizadas =
    asistenciaSocialCard?.funciones?.map((item) => ({
      ...item,
      descripcion: item.descripcion || item.description,
    })) || []

  return (
    <>
      <SectionLayout
        title="Departamento de"
        highlight="Asistencia Social"
        description={
          asistenciaSocialCard?.description ||
          'Brinda apoyo y acompañamiento a personas y familias en situación de vulnerabilidad social, promoviendo inclusión y bienestar comunitario.'
        }
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {asistenciaSocialCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={asistenciaSocialCard.mision} />
            </div>
          )}

          {funcionesNormalizadas.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={funcionesNormalizadas} />
            </div>
          )}
        </div>
      </Section>

    </>
  )
}

export default DtoAsistenciaSocial
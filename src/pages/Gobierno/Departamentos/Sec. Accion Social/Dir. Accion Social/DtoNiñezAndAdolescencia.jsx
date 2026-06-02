import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'

const DtoNiñezAndAdolescencia = () => {
  const accionSocialSection = SECRETARIA_ACCION_SOCIAL[0]
  const accionSocialCard = accionSocialSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/accion-social'
  )

  const ninezAdolescenciaCard = accionSocialCard?.subcards?.find(
    (subcard) => subcard.to === '/gobierno/secretaria-accion-social/accion-social/dto-ninez-y-adolescencia'
  )

  const funcionesNormalizadas =
    ninezAdolescenciaCard?.funciones?.map((item) => ({
      ...item,
      descripcion: item.descripcion || item.description,
    })) || []

  return (
    <>
      <SectionLayout
        title="Departamento de"
        highlight="Niñez, Adolescencia y Familia"
        description={
          ninezAdolescenciaCard?.description ||
          'Área orientada a la protección y promoción de derechos de niñas, niños, adolescentes y sus familias.'
        }
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {ninezAdolescenciaCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={ninezAdolescenciaCard.mision} />
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

export default DtoNiñezAndAdolescencia
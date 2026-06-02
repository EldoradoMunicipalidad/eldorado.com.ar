import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'
import { PuntosAtencionSection } from '../../../../../assets/components/Gobierno/PuntosAtencionSection'

const GUARDERIAS_PUNTOS_ATENCION = [
  {
    nombre: 'Guardería San Cayetano',
    direccion: 'Calle Zettelman y Gobernador Juan Manuel Irrazabal, s/n km 4.',
    telefono: '3751-15 333879',
    horario: 'Lunes a viernes de 7:00 a 11:30 hs',
    mapaUrl: 'https://maps.app.goo.gl/W91Vannw7qCEkVEL8'
  },
  {
    nombre: 'Guardería Manitas Traviesas',
    direccion: 'Km 18, Calle Azucena s/n, al lado del CIC del Barrio Oleaginosa.',
    telefono: '3751-15617821',
    horario: 'Lunes a viernes de 06:30 a 12:30 hs',
    mapaUrl: 'https://maps.app.goo.gl/776TMsippHy1vCUF8'
  }
]

const Guarderias = () => {
  const accionSocialSection = SECRETARIA_ACCION_SOCIAL[0]
  const accionSocialCard = accionSocialSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/accion-social'
  )

  const guarderiasCard = accionSocialCard?.subcards?.find(
    (subcard) => subcard.to === '/gobierno/secretaria-accion-social/accion-social/guarderias'
  )

  const funcionesNormalizadas =
    guarderiasCard?.funciones?.map((item) => ({
      ...item,
      descripcion: item.descripcion || item.description,
    })) || []

  return (
    <>
      <SectionLayout
        title=""
        highlight="Guarderías"
        description={
          guarderiasCard?.description ||
          'Servicio de cuidado, contención y acompañamiento educativo para niñas y niños en sus primeras etapas de desarrollo.'
        }
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {guarderiasCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={guarderiasCard.mision} />
            </div>
          )}

          {funcionesNormalizadas.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={funcionesNormalizadas} />
            </div>
          )}

          <div className="lg:col-span-12">
            <PuntosAtencionSection
              title="Puntos de atención de Guarderías"
              puntos={GUARDERIAS_PUNTOS_ATENCION}
            />
          </div>
        </div>
      </Section>
    </>
  )
}

export default Guarderias
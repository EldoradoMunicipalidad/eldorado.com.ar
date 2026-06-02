import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'
import { PuntosAtencionSection } from '../../../../../assets/components/Gobierno/PuntosAtencionSection'

const CIC_PUNTOS_ATENCION = [
  {
    nombre: 'CIC Km 7 Barrio Koch',
    direccion: 'Calle Tierra del Fuego s/n - CP: 3380 - Eldorado, Provincia de Misiones.',
    telefono: '3751 - 426471',
    horario: 'Lunes a viernes de 06:00 a 18:00',
    mapaUrl: 'https://maps.app.goo.gl/JAdMZNBGg9zySNp59',
  },
  {
    nombre: 'CIC Km 18',
    direccion: 'Barrio Oleaginosa Km 18 - CP: 3380 - Eldorado, Provincia de Misiones.',
    telefono: '3751 - 591862',
    horario: 'Lunes a viernes las 24hs',
    mapaUrl: 'https://maps.app.goo.gl/7AAPSpRjZMvUeZB8A',
  },
  {
    nombre: 'CIC Pinares',
    direccion: 'Av. 9 de Julio km 1 - CP: 3380 - Eldorado, Provincia de Misiones.',
    telefono: '3751 - 430707',
    horario: 'Lunes a viernes de 08:00 a 18:00',
    mapaUrl: 'https://maps.app.goo.gl/b6bUJzyGJrH8A81U6',
  },
]

const CIC = () => {
  const accionSocialSection = SECRETARIA_ACCION_SOCIAL[0]
  const accionSocialCard = accionSocialSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/accion-social'
  )

  const cicCard = accionSocialCard?.subcards?.find(
    (subcard) => subcard.to === '/gobierno/secretaria-accion-social/accion-social/cic'
  )

  const funcionesNormalizadas =
    cicCard?.funciones?.map((item) => ({
      ...item,
      descripcion: item.descripcion || item.description,
    })) || []

  return (
    <>
      <SectionLayout
        title="Centro"
        highlight="Integrador Comunitario"
        description={
          cicCard?.description ||
          'Espacio de integración social y comunitaria para fortalecer vínculos, inclusión y acceso a programas territoriales.'
        }
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {cicCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={cicCard.mision} />
            </div>
          )}

          {funcionesNormalizadas.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={funcionesNormalizadas} />
            </div>
          )}

          <div className="lg:col-span-12">
            <PuntosAtencionSection
              title="Puntos de atención CIC"
              puntos={CIC_PUNTOS_ATENCION}
            />
          </div>
        </div>
      </Section>
    </>
  )
}

export default CIC
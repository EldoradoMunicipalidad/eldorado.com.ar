import React from 'react'
import SectionLayout from '../../../../../assets/components/SectionLayout'
import { SECRETARIA_ACCION_SOCIAL } from '../../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../../assets/components/Section'
import { Mision } from '../../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../../assets/components/Gobierno/FuncionesPrincipales'
import { PuntosAtencionSection } from '../../../../../assets/components/Gobierno/PuntosAtencionSection'

const CENTRO_DE_DIA_PUNTOS_ATENCION = [
  {
    nombre: 'Centro de Día',
    direccion: 'Av. San Martín y Bella Vista',
    telefono: '3751 - 431900',
    horario: '07:00 hs a 18:00 hs',
    mapaUrl: "https://maps.app.goo.gl/B4GZHumPXyFGCsk27"
  },
]

const CentroDeDia = () => {
  const accionSocialSection = SECRETARIA_ACCION_SOCIAL[0]
  const accionSocialCard = accionSocialSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-accion-social/accion-social'
  )

  const centroDeDiaCard = accionSocialCard?.subcards?.find(
    (subcard) => subcard.to === '/gobierno/secretaria-accion-social/accion-social/centro-de-dia'
  )

  const funcionesNormalizadas =
    centroDeDiaCard?.funciones?.map((item) => ({
      ...item,
      descripcion: item.descripcion || item.description,
    })) || []

  return (
    <>
      <SectionLayout
        title="Centro de"
        highlight="Día"
        description={
          centroDeDiaCard?.description ||
          'Espacio destinado al bienestar físico, emocional y social, fortaleciendo la participación y el vínculo comunitario.'
        }
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {centroDeDiaCard?.mision && (
            <div className="lg:col-span-12">
              <Mision texto={centroDeDiaCard.mision} />
            </div>
          )}

          {funcionesNormalizadas.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={funcionesNormalizadas} />
            </div>
          )}

          <div className="lg:col-span-12">
            <PuntosAtencionSection
              title="Punto de atención"
              puntos={CENTRO_DE_DIA_PUNTOS_ATENCION}
            />
          </div>
        </div>
      </Section>
    </>
  )
}

export default CentroDeDia
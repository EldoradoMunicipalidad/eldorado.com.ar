import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import { SECRETARIA_ACCION_SOCIAL } from '../../data/Gobierno/secretariasCards';
import { ACCION_SOCIAL_DATA } from '../../data/Gobierno/secretariasData';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import { Section } from '../../assets/components/Section';
import { Titulo } from '../../assets/components/Titulo';
import { Mision } from '../../assets/components/Gobierno/Mision';
import { FuncionesPrincipales } from '../../assets/components/Gobierno/FuncionesPrincipales';

export const SecretariaDeAccionSocialPage = () => {
  return (
    <>
      <SectionLayout
        title="Secretaría de"
        highlight="Acción Social"
        description="Trabajamos para promover el bienestar y la inclusión social de todos los miembros de la comunidad, implementando programas y servicios que apoyan a los sectores más vulnerables. Nuestro compromiso es garantizar igualdad de oportunidades, brindando asistencia y promoviendo el desarrollo social y humano."
      />

      {SECRETARIA_ACCION_SOCIAL.map((section, index) => (
        <SectionCardGrid
        key={index}
        id={section.id}
        bgColor="bg-white"
        categoryTitle={section.categoryTitle}
        cards={section.cards}
      />
      ))}

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <Mision
              texto={ACCION_SOCIAL_DATA.mision}
            />
          </div>

          {ACCION_SOCIAL_DATA.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={ACCION_SOCIAL_DATA.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default SecretariaDeAccionSocialPage
import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import { SECRETARIA_OBRAS_PUBLICAS } from '../../data/Gobierno/secretariasCards';
import { OBRAS_PUBLICAS_DATA } from '../../data/Gobierno/secretariasData';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import { Section } from '../../assets/components/Section';
import { Mision } from '../../assets/components/Gobierno/Mision';
import { FuncionesPrincipales } from '../../assets/components/Gobierno/FuncionesPrincipales';

export const SecretariaDeObrasPublicasPage = () => {
  return (
    <>
      <SectionLayout
        title="Secretaría de"
        highlight="Obras Públicas"
        description="Somos responsables del diseño, ejecución y mantenimiento de infraestructuras que mejoran la calidad de vida de la comunidad. Trabajamos para garantizar el desarrollo urbano sostenible, asegurando obras públicas seguras, funcionales y accesibles para todos."
      />

      {SECRETARIA_OBRAS_PUBLICAS.map((section, index) => (
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
              texto={OBRAS_PUBLICAS_DATA.mision}
            />
          </div>

          {OBRAS_PUBLICAS_DATA.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={OBRAS_PUBLICAS_DATA.funciones} />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export default SecretariaDeObrasPublicasPage

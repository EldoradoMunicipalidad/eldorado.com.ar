import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { SECRETARIA_PRODUCCION } from '../../data/Gobierno/secretariasCards';
import { PRODUCCION_DATA } from '../../data/Gobierno/secretariasData';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import { Section } from '../../assets/components/Section';
import { Mision } from '../../assets/components/Gobierno/Mision';
import { FuncionesPrincipales } from '../../assets/components/Gobierno/FuncionesPrincipales';

export const SecretariaDeProduccionPage = () => {
  return (
    <>
      <SectionLayout
        title="Secretaría de"
        highlight="Producción"
        description="Impulsamos el desarrollo económico y productivo de la región, apoyando a las industrias, emprendedores y comercios. Fomentamos la innovación, la competitividad y la creación de empleo, buscando fortalecer el crecimiento económico sostenible y la diversificación de la producción local."
      />


      {SECRETARIA_PRODUCCION.map((section, index) => (
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
              texto={PRODUCCION_DATA.mision}
            />
          </div>

          {PRODUCCION_DATA.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={PRODUCCION_DATA.funciones} />
            </div>
          )}
        </div>
      </Section>


    </>
  )
}


export default SecretariaDeProduccionPage
import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import { SECRETARIA_HACIENDA } from '../../data/Gobierno/secretariasCards';
import { Section } from '../../assets/components/Section';
import { Titulo } from '../../assets/components/Titulo';
import { Mision } from '../../assets/components/Gobierno/Mision';
import { FuncionesPrincipales } from '../../assets/components/Gobierno/FuncionesPrincipales';
import { HACIENDA_DATA } from '../../data/Gobierno/secretariasData';


export const SecretariaDeHaciendaPage = () => {


  return (
    <>
      <SectionLayout
        title="Secretaría de"
        highlight="Hacienda"
        description="Nos encargamos de la gestión financiera y fiscal de la institución, garantizando el uso eficiente de los recursos públicos. Trabajamos para asegurar una administración transparente, responsable y orientada al desarrollo económico y social de nuestra comunidad."
      />

      {SECRETARIA_HACIENDA.map((section, index) => (
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
              texto={HACIENDA_DATA.mision}
            />
          </div>

          {HACIENDA_DATA.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={HACIENDA_DATA.funciones} />
            </div>
          )}
        </div>
      </Section>

    </>
  )
}

export default SecretariaDeHaciendaPage
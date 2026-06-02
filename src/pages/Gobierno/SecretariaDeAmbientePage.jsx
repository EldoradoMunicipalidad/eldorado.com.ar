import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import { SECRETARIA_AMBIENTE } from '../../data/Gobierno/secretariasCards';
import { AMBIENTE_DATA } from '../../data/Gobierno/secretariasData';
import SectionCardGrid from '../../assets/components/SectionCardGrid';
import { Section } from '../../assets/components/Section';
import { Mision } from '../../assets/components/Gobierno/Mision';
import { FuncionesPrincipales } from '../../assets/components/Gobierno/FuncionesPrincipales';
import { DocumentSection } from '../../assets/components/Gobierno/DocumentSection';

export const SecretariaDeAmbientePage = () => {
  // Documentos reales - Normativas de Ambiente
  const documentosFicticios = [
    { titulo: "Ley Yolanda", to: "https://drive.google.com/file/d/1hLIKlI1Rlq2EqZRAjg90bJ2nHpw2WoRj/preview" },
    { titulo: "Ley XVI N° 113 Declaración Del 2013 Al 2023 De La Década De Conservación Y Preservación Del Suelo Y Las Cuencas Hídricas", to: "https://drive.google.com/file/d/145ldQcCqXW-shIy2_PdNjbP1zLeoLy6y/preview" },
    { titulo: "Ley XVI N° 53 Bosques Protectores - Antes Ley 3426", to: "https://drive.google.com/file/d/1uNu7nWqTly5G0ENV9r4SUg7rYN23fYGn/preview" },
    { titulo: "Ley XVI N° 35 Impacto Ambiental - Antes Ley 3079", to: "https://drive.google.com/file/d/1pwu0hyQJp1R5vUHoH7mWAUd4pXndiyzi/preview" },
    { titulo: "Ley XVI N° 29 Sistemas De Áreas Naturales Protegidas", to: "https://drive.google.com/file/d/19xBkkDZx3SwCeZib9zPsO9CAqNrZoXyA/preview" },
    { titulo: "Ley XVI N° 7 Ley De Bosques", to: "https://drive.google.com/file/d/1iSD5_7v1YBb9G5wmlrMdr4Z5DzVvyf3X/preview" },
    { titulo: "Ley XVI N° 1", to: "https://drive.google.com/file/d/1MCQLw3uDBo2v38xebjroO7Xcb1gLn_jO/preview" },
    { titulo: "Ley VI N° 137 (Antes Ley 4477) - Compromiso Escolar Con El Ambiente", to: "https://drive.google.com/file/d/1Wed6NiZoEcFrynSAtOMmg1y_pMwbx6Hx/preview" },
    { titulo: "Ley N° 26331 Presupuestos Minimos De Protección Ambiental De Los Bosques Nativos", to: "https://drive.google.com/file/d/1DX6N6jyXS7nF34CpPCo2EXkgfI8oo6QV/preview" },
    { titulo: "Ley N° 25688 Régimen De Gestión Ambiental De Aguas", to: "https://drive.google.com/file/d/1W7vlFf_G4thPUWZwuLcFo3cZ1DsiiTLm/preview" },
    { titulo: "Ley General Del Ambiente 25675", to: "https://drive.google.com/file/d/12PbT0eQNJheIPcgagFVNc45MxQ0K4X2F/preview" },
    { titulo: "Ley Educación Ambiental XVI N° 80 - Provincial", to: "https://drive.google.com/file/d/1AxT-POjW2vF1G_X1g57BXaMdXBsvsoLF/preview" },
    { titulo: "Ley De Educación Nacional 26206", to: "https://drive.google.com/file/d/1gbx1wNVcI2ZcGVDltidqP-55EVBL512S/preview" },
    { titulo: "Ley De Educación Ambiental - Nacional", to: "https://drive.google.com/file/d/1ybWQgbke0jQJqgJim8JfNPymUGNIB8Z3/preview" },
    { titulo: "Ley De Conservación De La Fauna Silvestre Ley XVI - N° 11", to: "https://drive.google.com/file/d/1FmT03tqzNgG2M6WcYD3WD_tHRMGXvjIY/preview" },
    { titulo: "Constitución Nacional Argentina", to: "https://drive.google.com/file/d/1QhSoicIzBi4iF6jTKLOatyFdmqhN8pkX/preview" },
    { titulo: "Código Ambiental Eldorado", to: "https://drive.google.com/file/d/1BrEeusvy34TP1Go6ImOSSBOF7mkAaFdV/preview" },
    { titulo: "Carta Orgánica", to: "https://drive.google.com/file/d/1MMRgEOxx4y_br3CTPULBorMKTApqiJOZ/preview" },
    { titulo: "Carnet Vendedores Ambulantes", to: "https://drive.google.com/file/d/1gKXZUNKMKC-ZHYtoK2c6QQqAL7ReVVDr/preview" },
    { titulo: "Servicio Carribres Food Trucks", to: "https://drive.google.com/file/d/1tQtZTkAsTnjvWE7oufNEPrwrwVborX94/preview" },
    { titulo: "Manipulación De Alimentos", to: "https://drive.google.com/file/d/1L3W4f51NFVpuOQ6ylbwbko-Ju_viAfzE/preview" }
  ]; 
    
  return (
    <>
      <SectionLayout
        title="Secretaría de"
        highlight="Ambiente"
        description="Promovemos el desarrollo sostenible, el cuidado del entorno y el compromiso con el medio ambiente en nuestra ciudad. A través de normativas, programas y participación ciudadana, trabajamos para preservar nuestros recursos naturales y garantizar una mejor calidad de vida para las generaciones presentes y futuras."
      />

      {SECRETARIA_AMBIENTE.map((section, index) => (
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
              texto={AMBIENTE_DATA.mision}
            />
          </div>

          {AMBIENTE_DATA.funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={AMBIENTE_DATA.funciones} />
            </div>
          )}
        </div>
      </Section>

      <DocumentSection id={"normativas"} documentos={documentosFicticios} />


    </>
  )
}

export default SecretariaDeAmbientePage

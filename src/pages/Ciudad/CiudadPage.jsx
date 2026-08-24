import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import SectionCardGrid from '../../assets/components/SectionCardGrid'
import { CIUDAD_DATA } from '../../data/Ciudad/ciudadData'

export const CiudadPage = () => {
  return (
    <>
      <SectionLayout
        title="La"
        highlight="Ciudad"
        description="Conocé todo sobre Eldorado: su historia, barrios, símbolos, servicios y la oferta de transporte público."
      />

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p className="text-[#4d4d4d] text-base leading-relaxed">
          Explorá la ciudad a través de sus íconos, recorridos y servicios. Cada tarjeta
          te lleva a una sección con información detallada y enlaces útiles.
        </p>
      </div>

      {CIUDAD_DATA.map((section, index) => (
        <SectionCardGrid
          key={index}
          id={section.id}
          bgColor={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
          categoryTitle={section.categoryTitle}
          icon={section.icon}
          cards={section.cards}
        />
      ))}
    </>
  )
}

export default CiudadPage
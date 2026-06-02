import React from 'react'
import SectionLayout from '../assets/components/SectionLayout'
import SectionCardGrid from '../assets/components/SectionCardGrid'
import { EMPLEADO_MUNICIPAL } from '../data/Gobierno/secretariasCards'

const EmpleadoMunicipalPage = () => {
  return (
    <>
    <SectionLayout 
      title="Empleado"
      highlight="Municipal"
      description="Espacio destinado a los empleados municipales. Aquí encontrarás una variedad de herramientas, recursos y guías diseñadas para facilitar la realización de consultas y gestionar eficazmente las tareas relacionadas con tu labor diaria."
    />

    {EMPLEADO_MUNICIPAL.map((section, index) => (
      <SectionCardGrid
        key={index}
        id={section.id}
        bgColor="bg-white"
        categoryTitle={section.categoryTitle}
        cards={section.cards}
      />
    ))}

    </>
    )
}

export default EmpleadoMunicipalPage
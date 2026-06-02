import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout';
import { Accordion } from '../../assets/components/Ciudad/TelefonosUtiles/Accordion';
import telefonosUtilesData from '../../data/telefonosUtilesData';

export const TelefonosUtilesPage = () => {
  return (
    <>
      <SectionLayout
        title="Telefonos Utiles"
        highlight=""
        description=""
      />

      {/* Inyección de Datos en los Acordeones */}
      <div className="flex flex-col gap-4 px-6 md:px-12 py-8">
        {telefonosUtilesData.map((category, index) => (
          <Accordion
            id={category.id}
            key={index}
            title={category.category}
            icon={category.icon}
            contacts={category.contacts}
          />
        ))}
      </div>
    </>

  )
}

export default TelefonosUtilesPage;

import React from 'react';
import { Card } from './Card';

export function CardsGridContainer({ data = [] }) {
  const count = data.length;

  // CASO 1: 2 Items - Flexbox para centrar y controlar el ancho exacto
  if (count === 2) {
    return (
      <div className="flex flex-col md:flex-row justify-center gap-6 w-full">
        {data.map((item) => (
          <div key={item.id} className="w-full md:w-[40%]">
            <Card {...item} />
          </div>
        ))}
      </div>
    );
  }

  // CASO 2: 3 o 4 Items - Usamos Grid de 4 columnas
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
      {data.map((item, index) => {
        // Lógica para 3 items: el primero ocupa 2 columnas
        const isFirstOfThree = count === 3 && index === 0;
        
        return (
          <div 
            key={item.id} 
            className={`${isFirstOfThree ? 'md:col-span-2' : 'md:col-span-1'}`}
          >
            <Card {...item} />
          </div>
        );
      })}
    </div>
  );
}
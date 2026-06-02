import React from 'react';
import Icon from '../../Icons/Icon';

const OrdenanzaSection = ({ titulo, descripcion, listaItems = [] }) => {
  return (
    <section className="px-10 py-8 md:px-16 md:py-12 bg-slate-100 border-y border-slate-300">
      <div className="max-w-7xl">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="assignmentIcon" className='text-sky-500' />
          <h2 className="text-3xl text-sky-500 font-medium">{titulo}</h2>
        </div>

        <p className="text-slate-600 text-xl mb-3">{descripcion}</p>

        <ul className="space-y-1">
          {listaItems.map((item, index) => (
            <li key={index}>
              <span className="text-sky-600 font-bold">{item.etiqueta}:</span>{' '}
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline hover:text-blue-900"
              >
                {item.textoEnlace}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default OrdenanzaSection;
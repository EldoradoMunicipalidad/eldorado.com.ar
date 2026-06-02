import React from 'react';

export const NoticiaCard = ({ noticia }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all duration-300">
      {/* Imagen con altura reducida */}
      <div className="h-44 w-full">
        <img
          src={noticia.imagen}
          alt={noticia.titulo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Cuerpo de la Card con padding optimizado */}
      <div className="p-4 flex flex-col grow">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
          {noticia.categoria}
        </span>

        {/* Título un poco más pequeño (text-lg) */}
        <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 leading-tight">
          {noticia.titulo}
        </h3>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
          <p className="text-xs text-gray-400 font-medium">
            {noticia.fecha}
          </p>

          <a
            href={noticia.link}
            className="inline-flex items-center bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-600 transition-colors gap-1.5"
          >
            Seguir Leyendo
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
};
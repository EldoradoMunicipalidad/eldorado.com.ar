import React from 'react';

export function Card({ icon, title, subtitle, bgImage, href }) {
  const content = (
    <div className={`relative rounded-2xl p-8 flex flex-col justify-end min-h-52 overflow-hidden shadow-xl transition-all duration-500 group ${!bgImage ? 'bg-[#0B1120]' : ''}`}>
      
      {/* CAPA DE FONDO */}
      {bgImage ? (
        <>
          <img 
            src={bgImage} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent z-10" />
        </>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-[#0EA5E9]/20 to-transparent z-0" />
      )}

      {/* CONTENIDO */}
      <div className="relative z-20">
        {/* Icono flotante superior */}
        <div className="absolute -top-48 left-0 bg-white/10 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 mb-6">
          <span className="material-icons-round text-2xl text-[#0EA5E9]">
            {icon}
          </span>
        </div>
        
        {/* Títulos y Subtítulos */}
        <div className="space-y-3">
          <h3 className="text-1xl lg:text-2xl font-bold text-white leading-tight tracking-tight">
            {title}
          </h3>
          <p className="text-slate-300 text-sm lg:text-base leading-relaxed font-light line-clamp-3">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block cursor-pointer">
        {content}
      </a>
    );
  }

  return content;
}

export default Card;
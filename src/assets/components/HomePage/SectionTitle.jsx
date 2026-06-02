import React from 'react';

export const SectionTitle = ({ title, tag, centered = true }) => {
    return (
        <div className={`mb-10 flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'}`}>
            {tag && (
                <span className="inline-block px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-4">
                    {tag}
                </span>
            )}

            {/* El truco está en el inline-block del contenedor del título */}
            <div className="relative inline-block">
                <h2 className="text-3xl font-bold text-slate-800 leading-tight px-4">
                    {title}
                </h2>

                {/* La línea ahora siempre mide lo mismo que el h2 anterior */}
                <div className="absolute left-0 right-0 h-0.75 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
        </div>
    );
};
import React from 'react';
import SectionCard from './SectionCard';
import Icon from '../Icons/Icon';

const SectionCardGrid = ({ categoryTitle, cards = [], id,  bgColor, icon }) => {
    const safeCards = Array.isArray(cards) ? cards : [];

    // Determinar el número de columnas según la cantidad de items y el tamaño de pantalla
    const getGridCols = () => {
        const itemCount = safeCards.length;
        
        if (itemCount === 4 || itemCount === 8) {
            // Móvil: 1 col, Tablet: 2 cols, Desktop: 4 cols
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        } else if (itemCount === 6 || itemCount === 3 || itemCount === 5) {
            // Móvil: 1 col, Tablet: 2 cols, Desktop: 3 cols
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        }else if (itemCount === 2) {
            // Móvil: 1 col, Tablet: 2 cols, Desktop: 2 cols
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2';
        }
        // Por defecto: Móvil: 1 col, Tablet: 2 cols, Desktop: 4 cols
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    };

    return (
        <section id={id} className={`px-10 py-8 md:px-16 md:py-12 ${bgColor || ''}`}>

            {categoryTitle && (
                <div className='flex gap-2 items-center'>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:bg-sky-500 transition-colors duration-300">
                        <Icon name={icon ? icon : 'departamentos'} className="text-sky-600" />
                    </div>

                    {/* Título de la Categoría más pequeño */}
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                            {categoryTitle}
                        </h2>
                    </div>
                </div>
            )}

            {/* Contenedor grid con columnas dinámicas */}
            <div className={`grid ${getGridCols()} gap-6`}>
                {safeCards.map((card, index) => (
                    <div key={index}>
                        <SectionCard {...card} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SectionCardGrid;
import React from 'react';
import SectionCard from './SectionCard';
import Icon from '../Icons/Icon';

const SectionCardGrid = ({ categoryTitle, cards = [], id, bgColor, icon }) => {
    const safeCards = Array.isArray(cards) ? cards : [];

    const getGridCols = () => {
        const itemCount = safeCards.length;
        if (itemCount === 4 || itemCount === 8) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        if (itemCount === 6 || itemCount === 3 || itemCount === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        if (itemCount === 2) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2';
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    };

    return (
        <section id={id} className={`px-6 py-10 md:px-10 md:py-14 ${bgColor || ''}`}>
            <div className="max-w-7xl mx-auto">
                {categoryTitle && (
                    <div className="flex items-center gap-3 mb-8">
                        {icon && (
                            <div className="w-9 h-9 rounded-lg bg-[#533afd]/10 flex items-center justify-center">
                                <Icon name={icon} className="text-[#533afd] text-lg" />
                            </div>
                        )}
                        <h2 className="text-xl md:text-2xl font-semibold text-[#171717] tracking-tight">
                            {categoryTitle}
                        </h2>
                    </div>
                )}

                <div className={`grid ${getGridCols()} gap-4 md:gap-5`}>
                    {safeCards.map((card, index) => (
                        <div key={index}>
                            <SectionCard {...card} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SectionCardGrid;

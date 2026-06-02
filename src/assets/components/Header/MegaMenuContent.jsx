import React from 'react'
import { SubItemCard } from './SubItemCard';

export const MegaMenuContent = ({ activeItem, onLinkClick }) => {
    if (!activeItem) return null;

    const isContactType = activeItem.label === "Contacto" || activeItem.label === "Teléfonos";

    return (
        <div className={`w-2/3 p-4 md:p-6 lg:p-10 bg-white min-h-100 content-start grid gap-4 md:gap-6
      ${isContactType ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2"}`}
        >
            {activeItem.subItems?.map((sub, idx) => (
                <SubItemCard
                    key={idx}
                    title={sub.title}
                    keywords={sub.keywords}
                    basePath={activeItem.to}
                    to={sub.to}
                    onClick={onLinkClick}
                />
            ))}
        </div>
    );
};

export default MegaMenuContent;

import React from 'react'
import { Link } from 'react-router-dom'

export const SidebarItem = ({ item, isActive, onHover, onLinkClick }) => {
    // Definimos la función de validación interna o la podés importar de un utils.js
    const isExternal = (url) => {
        if (typeof url !== 'string' || !url.startsWith('http')) return false;
        try {
            // Compara si el dominio de la URL es distinto al dominio donde corre la app
            return new URL(url).hostname !== window.location.hostname;
        } catch (e) {
            return false;
        }
    };

    const baseClasses = `flex items-center w-full px-6 py-4 text-left text-sm font-medium transition-all border-b border-gray-100 last:border-none ${isActive
            ? 'text-slate-800 bg-white shadow-sm'
            : 'text-slate-600 hover:bg-white hover:text-sky-600'
        }`;

    const external = isExternal(item.to);

    // 1. Enlace Externo (ej: Consejo Deliberante o Google Maps)
    if (external) {
        return (
            <a
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => onHover(item)}
                className={baseClasses}
                onClick={onLinkClick}
            >
                {item.label}
            </a>
        );
    }

    // 2. Enlace Interno (Navegación SPA)
    if (item.to) {
        return (
            <Link
                to={item.to}
                onMouseEnter={() => onHover(item)}
                className={baseClasses}
                onClick={onLinkClick}
            >
                {item.label}
            </Link>
        );
    }

    // 3. Botón de acción (sin link)
    return (
        <button
            type="button"
            onMouseEnter={() => onHover(item)}
            className={baseClasses}
            onClick={onLinkClick}
        >
            {item.label}
        </button>
    );
};

export default SidebarItem;
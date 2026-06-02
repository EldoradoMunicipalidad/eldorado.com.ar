import React from 'react'
import { Link } from 'react-router-dom'
import { isExternal } from '../../hooks/isExternal'

export const SubItemCard = ({ title, to, basePath, keywords = [], onClick }) => {

  const buildUrl = (targetTo) => {
    if (!targetTo || targetTo === "") return null;
    // Prioridad absoluta: si es externo o ruta absoluta, se devuelve tal cual
    if (targetTo.startsWith('http') || targetTo.startsWith('/')) return targetTo;
    // Si es fragmento, se une a la base
    return `${basePath}${targetTo.startsWith('#') ? '' : '#'}${targetTo}`;
  };

  const SmartLink = ({ url, children, className }) => {
    // 1. Verificamos si es externo PRIMERO
    const external = isExternal(url);

    // 2. Definimos si debe ser un link funcional
    // Es funcional si: es externo O (existe y no es igual a la base pelada)
    const hasUrl = url && (external || (url !== "" && url !== basePath));

    const dynamicClasses = `${className} ${hasUrl
        ? "cursor-pointer pointer-events-auto"
        : "cursor-text pointer-events-none hover:text-inherit"
      }`;

    // Si no tiene URL válida, renderizamos el span (texto plano)
    if (!hasUrl) {
      return <span className={dynamicClasses}>{children}</span>;
    }

    // Si es externo, renderizamos etiqueta <a>
    if (external) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={dynamicClasses}
        >
          {children}
        </a>
      );
    }

    // Si es interno, usamos Link de react-router
    return (
      <Link to={url} onClick={onClick} className={dynamicClasses}>
        {children}
      </Link>
    );
  };

  // ... (resto del mapeo de validKeywords y el return principal se mantienen igual)

  const validKeywords = Array.isArray(keywords)
    ? keywords.filter(k => (typeof k === 'object' ? k?.label : k))
    : [];

  const mainUrl = buildUrl(to);
  const hasMainUrl = mainUrl && (isExternal(mainUrl) || (mainUrl !== "" && mainUrl !== basePath));

  return (
    <div className={`flex flex-col p-2 group/card border-l-4 border-transparent transition-all duration-300 ${hasMainUrl ? 'hover:border-[#00AEEF]' : ''}`}>
      <h4 className={`font-semibold text-xs md:text-sm lg:text-[15px] mb-1 transition-colors ${hasMainUrl
          ? "text-[#4A4A4A] group-hover/card:text-[#00AEEF]"
          : "text-[#4A4A4A]"
        }`}>
        <SmartLink url={mainUrl} className="block">
          {title}
        </SmartLink>
      </h4>

      <div className="flex flex-wrap items-center text-sm">
        {validKeywords.map((item, index) => {
          const label = typeof item === 'object' ? item.label : item;
          const rawTo = typeof item === 'object' ? item.to : "";
          const url = buildUrl(rawTo);

          return (
            <React.Fragment key={index}>
              <SmartLink
                url={url}
                className={`text-[10px] md:text-[11px] lg:text-[12px] leading-snug transition-colors ${url && (isExternal(url) || (url !== "" && url !== basePath))
                    ? "text-gray-500 hover:text-[#009EE3]"
                    : "text-gray-400"
                  }`}
              >
                {label}
              </SmartLink>
              {index < validKeywords.length - 1 && <span className="mx-1 text-gray-300">•</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
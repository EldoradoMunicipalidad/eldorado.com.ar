import React from 'react';
import { Link } from 'react-router-dom';

const EldoradoSectionLayout = ({ section }) => {
  const { id, title, subtitle, text, images, reverse, buttonText, buttonTo, type, bg = "bg-white" } = section;

  // --- 1. SEGURIDAD: Sanitizamos las imágenes para evitar errores si es null ---
  const safeImages = images || [];

  // --- 2. DETECCIÓN: ¿Hay algo visual (imagen o mapa) para mostrar? ---
  const hasVisuals = safeImages.length > 0 || !!section.mapIframe;
  const isExternalLink = /^https?:\/\//i.test(buttonTo || '');

  const renderActionLink = (className) => {
    if (!buttonText || !buttonTo) return null;

    if (isExternalLink) {
      return (
        <a
          href={buttonTo}
          target="_blank"
          rel="noreferrer"
          className={className}
        >
          {buttonText}
        </a>
      );
    }

    return (
      <Link to={buttonTo} className={className}>
        {buttonText}
      </Link>
    );
  };

  // --- HELPER: RENDERIZADO DE TEXTO INTELIGENTE ---
  const renderParagraph = (contentItem, index) => {
    // CASO 1: LISTAS -> Grid de 2 columnas
    if (Array.isArray(contentItem)) {
      return (
        <ul key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 list-disc pl-6 mb-6 marker:text-[#009EE3] clear-both break-inside-avoid">
          {contentItem.map((li, i) => (
            <li key={i} className="pl-2 text-slate-700">{li}</li>
          ))}
        </ul>
      );
    }
    // CASO 2: SUBTÍTULOS
    if (typeof contentItem === 'string' && contentItem === "SIMBOLISMO") {
      return (
        <h3 key={index} className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b-2 border-[#009EE3] inline-block pb-1 uppercase tracking-wider clear-both break-inside-avoid">
          {contentItem}
        </h3>
      );
    }
    // CASO 3: CRÉDITOS / AUTOR
    if (typeof contentItem === 'string' && contentItem.startsWith("Letra y música")) {
      return (
        <p key={index} className="mt-8 text-xs text-slate-500 italic font-medium text-left border-t border-slate-200 pt-4 clear-both break-inside-avoid">
          {contentItem}
        </p>
      );
    }
    // CASO 4: PÁRRAFO NORMAL
    return (
      <p key={index} className="mb-6 last:mb-0 text-base text-slate-700 leading-relaxed font-light whitespace-pre-line text-justify break-inside-avoid">
        {contentItem}
      </p>
    );
  };

  // ==========================================
  //  DISEÑO TIPO 1: "MAGAZINE" (Bandera e Himno)
  // ==========================================
  if (type === "magazine") {
    const isHimno = id === "himno";

    return (
      <section
        id={id}
        className={`w-full min-h-screen relative flex flex-col px-6 md:px-12 py-20 ${bg}`}
      >
        {/* Encabezado */}
        <div className="w-full mb-8 border-l-8 border-[#009EE3] pl-2">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 uppercase tracking-tight">{title}</h2>
          {subtitle && <p className="text-xl text-slate-500 font-medium mt-2">{subtitle}</p>}
        </div>

        <div className="w-full">
          {/* IMAGEN FLOTANTE - Solo se renderiza si existen visuales */}
          {hasVisuals && (
            <div className="float-none md:float-left w-full md:w-[35%] md:mr-10 mb-8 md:mb-4 relative z-10">
              <div className="w-full shadow-2xl rounded-[30px] overflow-hidden border-[6px] border-white bg-white">
                {section.mapIframe ? (
                  <iframe src={section.mapIframe} className="w-full aspect-square" style={{ border: 0 }} loading="lazy" title="Map" />
                ) : (
                  // Usamos safeImages[0] que es seguro
                  <img
                    src={safeImages[0]}
                    alt={title}
                    className="w-full h-auto object-cover aspect-video"
                  />
                )}
              </div>
              <div className="text-xs text-slate-400 text-center mt-3 font-medium tracking-wide uppercase">
                {subtitle || ""}
              </div>
            </div>
          )}

          {/* TEXTO QUE FLUYE */}
          <div className={`text-slate-700 ${isHimno ? 'md:columns-2 gap-12' : ''}`}>
            {Array.isArray(text) ? text.map(renderParagraph) : <p className="whitespace-pre-line text-lg font-light leading-relaxed">{text}</p>}

            {buttonText && (
              <div className="mt-10 inline-block w-full text-center md:text-left clear-both">
                {renderActionLink("inline-flex bg-[#009EE3] hover:bg-blue-600 text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1")}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  //  DISEÑO TIPO 2: GRID (Expo Eldorado)
  // ==========================================
  if (type === "grid") {
    return (
      <section id={id} className={`w-full min-h-screen flex flex-col items-center justify-center py-20 px-6 ${bg}`}>
        <div className="text-center mb-12 max-w-3xl">
          <h2 className="text-4xl font-extrabold text-[#009EE3] mb-3 uppercase">{title}</h2>
          <p className="text-2xl text-slate-500 font-medium">{subtitle}</p>
        </div>

        {/* Solo mostramos el grid si hay imágenes en el array seguro */}
        {safeImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mb-12">
            {safeImages.map((img, index) => (
              <img key={index} src={img} alt={`${title} ${index}`} className="w-full h-80 object-cover rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300" />
            ))}
          </div>
        )}

        <div className="text-slate-600 leading-relaxed max-w-5xl text-lg w-full">
          {Array.isArray(text) ? text.map(renderParagraph) : text}
        </div>

        {buttonText && (
          renderActionLink("mt-8 inline-flex bg-[#009EE3] hover:bg-blue-600 text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg")
        )}
      </section>
    );
  }

  // ==========================================
  //  DISEÑO TIPO 3: ESTÁNDAR (Dos Columnas - Intro)
  // ==========================================
  return (
    <section
      id={id}
      className={`w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-20 px-6 lg:px-16 py-20 ${bg} ${reverse ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="flex-1 max-w-xl space-y-6">
        <div className='w-full mb-8 border-l-8 border-[#009EE3] pl-2'>
          <h2 className="text-4xl font-extrabold text-slate-800 leading-tight uppercase">{title}</h2>
          {subtitle && <p className="text-lg text-slate-500 font-medium">{subtitle}</p>}
        </div>
        <div className="text-lg text-slate-600 leading-relaxed font-light">
          {Array.isArray(text) ? text.map(renderParagraph) : <p className="whitespace-pre-line">{text}</p>}
        </div>

        {buttonText && (
          <div className="pt-4">
            {renderActionLink("inline-flex bg-[#009EE3] hover:bg-blue-600 text-white px-10 py-3 rounded-3xl font-bold text-lg transition-all shadow-md")}
          </div>
        )}
      </div>

      {/* COLUMNA DERECHA: IMÁGENES */}
      {/* Solo se renderiza si hay visuales. Si no, el texto queda centrado (gracias al justify-center del padre) */}
      {hasVisuals && (
        <div className={`flex gap-4 h-auto ${safeImages.length > 1 ? 'w-[58%]' : 'w-full md:w-[45%] justify-center'}`}>
          {section.mapIframe ? (
            <div className="w-full aspect-video rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
              <iframe src={section.mapIframe} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Ubicación" />
            </div>
          ) : (
            safeImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={title}
                className={`object-cover rounded-[40px] shadow-2xl h-auto border-4 border-white ${safeImages.length > 1 ? 'w-1/2' : 'w-full'}`}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default EldoradoSectionLayout;
import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Store, Utensils, Briefcase } from 'lucide-react';

// 20 fotos, divididas en 3 secciones
const FOTOS = {
  gastronomia: [
    "/Ciudad/Eldorado/expo/DSC00245.jpg",
    "/Ciudad/Eldorado/expo/DSC00247.jpg",
    "/Ciudad/Eldorado/expo/DSC00248.jpg",
    "/Ciudad/Eldorado/expo/DSC00249.jpg",
  ],
  stands: [
    "/Ciudad/Eldorado/expo/DSC00250.jpg",
    "/Ciudad/Eldorado/expo/DSC00251.jpg",
    "/Ciudad/Eldorado/expo/DSC00253.jpg",
    "/Ciudad/Eldorado/expo/DSC00254.jpg",
  ],
  emprendimientos: [
    "/Ciudad/Eldorado/expo/DSC00256.jpg",
    "/Ciudad/Eldorado/expo/DSC00258.jpg",
    "/Ciudad/Eldorado/expo/DSC00259.jpg",
    "/Ciudad/Eldorado/expo/DSC00262.jpg",
  ],
};

const secciones = [
  {
    id: 'gastronomia',
    icon: Utensils,
    title: 'Gastronomía Regional',
    desc: 'Un sector gastronómico con food trucks y propuestas de la cocina regional y mundial. Desde sabores auténticos de la tierra colorada hasta influencias internacionales, la Expo ofrece una experiencia culinaria para todos los gustos.',
    fotos: FOTOS.gastronomia,
    imageLeft: true,
  },
  {
    id: 'stands',
    icon: Store,
    title: 'Stands Comerciales',
    desc: 'Empresas y comercios de todo el país muestran sus productos y servicios en un espacio abierto a orillas del río Paraná. Una vidriera única para descubrir marcas, innovaciones y ofertas en un solo lugar.',
    fotos: FOTOS.stands,
    imageLeft: false,
  },
  {
    id: 'emprendimientos',
    icon: Briefcase,
    title: 'Emprendimientos',
    desc: 'Espacio dedicado a emprendedores locales y provinciales. Productos artesanales, únicos y con identidad regional se dan cita en la Expo, destacando el talento y la creatividad de la comunidad.',
    fotos: FOTOS.emprendimientos,
    imageLeft: true,
  },
];

// Mini carrusel por sección
const MiniCarousel = ({ fotos, titulo }) => {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? fotos.length - 1 : c - 1));
  }, [fotos.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === fotos.length - 1 ? 0 : c + 1));
  }, [fotos.length]);

  useEffect(() => {
    const interval = setInterval(next, 3500);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md group">
      {/* Imagen principal */}
      <div className="relative" style={{ height: '280px' }}>
        <img
          src={fotos[current]}
          alt={`${titulo} ${current + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Indicadores */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {fotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-5' : 'bg-white/50 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Controles */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Mini thumbnails abajo */}
      <div className="flex gap-1 p-2 bg-slate-50">
        {fotos.map((src, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`flex-1 rounded overflow-hidden border-2 transition-all ${
              i === current ? 'border-[#009EE3] shadow' : 'border-transparent'
            }`}
            style={{ height: '52px' }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// Lightbox global
const Lightbox = ({ fotos, initialIndex, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent((c) => (c === 0 ? fotos.length - 1 : c - 1));
      if (e.key === 'ArrowRight') setCurrent((c) => (c === fotos.length - 1 ? 0 : c + 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [fotos.length, onClose]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        <span className="text-white/70 text-sm font-medium">{current + 1} / {fotos.length}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-2">
          <X className="w-7 h-7" />
        </button>
      </div>
      <div className="relative max-w-5xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <img src={fotos[current]} alt="" className="max-h-[80vh] mx-auto object-contain rounded-2xl" />
        <button onClick={() => setCurrent((c) => (c === 0 ? fotos.length - 1 : c - 1))}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button onClick={() => setCurrent((c) => (c === fotos.length - 1 ? 0 : c + 1))}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all">
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export const ExpoEldoradoPage = () => {
  const [lightbox, setLightbox] = useState(null);

  // Recolectar todas las fotos para lightbox
  const allFotos = Object.values(FOTOS).flat();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero con logo */}
      <div className="w-full bg-gradient-to-br from-[#009EE3] to-[#007bb5] pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <img
            src="/expo-logo.png"
            alt="Logo Expo Eldorado"
            className="mx-auto h-32 md:h-40 w-auto object-contain drop-shadow-lg mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase leading-tight tracking-tight">
            Expo Eldorado
          </h1>
          <p className="text-white/80 text-lg mt-3 font-medium">
            La exposición a cielo abierto más grande de la provincia
          </p>
        </div>
      </div>

      {/* Descripción general */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-[#009EE3]/20" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#009EE3]">Sobre la Expo</span>
          <div className="h-px flex-1 bg-[#009EE3]/20" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#009EE3] mb-4">¿Qué es la Expo Eldorado?</h2>
        <p className="text-slate-600 leading-relaxed text-base md:text-lg font-light">
          La Expo Eldorado es la exposición a cielo abierto más grande de la provincia de Misiones. Se realiza en el corazón
          de la ciudad, a orillas del majestuoso río Paraná, y reúne cada año a cientos de comercios, emprendedores y
          empresas de todo el país en un evento que combina exposición comercial, gastronomía, arte y entretenimiento.
          Es el punto de encuentro anual más importante de la región, donde visitantes y expositores comparten una
          experiencia única en un entorno privilegiado.
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-sky-50 rounded-2xl p-5 flex items-start gap-3">
            <Calendar className="text-[#009EE3] w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 text-sm">Evento Anual</p>
              <p className="text-slate-500 text-xs mt-0.5">Realizada históricamente en el mes de julio</p>
            </div>
          </div>
          <div className="bg-sky-50 rounded-2xl p-5 flex items-start gap-3">
            <MapPin className="text-[#009EE3] w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 text-sm">Río Paraná</p>
              <p className="text-slate-500 text-xs mt-0.5">Costanera y zona costera de Eldorado</p>
            </div>
          </div>
          <div className="bg-sky-50 rounded-2xl p-5 flex items-start gap-3">
            <Users className="text-[#009EE3] w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 text-sm">Miles de Visitantes</p>
              <p className="text-slate-500 text-xs mt-0.5">Punto de encuentro regional chaqueño</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secciones por tema */}
      <div className="bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-14 space-y-16">
          {secciones.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.id} className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Carrusel */}
                <div className={`w-full md:w-1/2 ${sec.imageLeft ? '' : 'md:order-2'}`}
                  onClick={() => setLightbox({ fotos: sec.fotos, initial: 0 })}>
                  <div className="cursor-pointer">
                    <MiniCarousel fotos={sec.fotos} titulo={sec.title} />
                  </div>
                </div>

                {/* Texto */}
                <div className={`w-full md:w-1/2 ${sec.imageLeft ? '' : 'md:order-1'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#009EE3]/10 flex items-center justify-center">
                      <Icon className="text-[#009EE3] w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#009EE3]">
                      Sector
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3 leading-tight">
                    {sec.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base">{sec.desc}</p>
                  <button
                    onClick={() => setLightbox({ fotos: sec.fotos, initial: 0 })}
                    className="mt-5 inline-flex items-center gap-2 text-[#009EE3] font-bold text-sm hover:underline"
                  >
                    Ver fotos de este sector →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Galería general */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-extrabold text-[#009EE3] uppercase mb-2">
            Galería de Fotos
          </h3>
          <p className="text-slate-500 text-sm">
            Fotos de la Expo Eldorado — hacé clic para ver en grande
          </p>
        </div>

        {/* Grid de todas las fotos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allFotos.map((src, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => setLightbox({ fotos: allFotos, initial: index })}
            >
              <img
                src={src}
                alt={`Expo Eldorado ${index + 1}`}
                className="w-full object-cover transition-all duration-500 group-hover:scale-110"
                style={{ height: '160px' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Volver */}
        <div className="text-center mt-10">
          <a
            href="/ciudad/eldorado"
            className="inline-flex bg-white border-2 border-[#009EE3] text-[#009EE3] hover:bg-sky-50 px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg"
          >
            Volver a Eldorado
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          fotos={lightbox.fotos}
          initialIndex={lightbox.initial}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

export default ExpoEldoradoPage;

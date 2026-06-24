import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Calendar, MapPin, Users, Store, Utensils, Briefcase } from 'lucide-react';

const EXPO_FOTOS = [
  "/Ciudad/Eldorado/expo/DSC00245.jpg",
  "/Ciudad/Eldorado/expo/DSC00247.jpg",
  "/Ciudad/Eldorado/expo/DSC00248.jpg",
  "/Ciudad/Eldorado/expo/DSC00249.jpg",
  "/Ciudad/Eldorado/expo/DSC00250.jpg",
  "/Ciudad/Eldorado/expo/DSC00251.jpg",
  "/Ciudad/Eldorado/expo/DSC00253.jpg",
  "/Ciudad/Eldorado/expo/DSC00254.jpg",
  "/Ciudad/Eldorado/expo/DSC00256.jpg",
  "/Ciudad/Eldorado/expo/DSC00258.jpg",
  "/Ciudad/Eldorado/expo/DSC00259.jpg",
  "/Ciudad/Eldorado/expo/DSC00262.jpg",
  "/Ciudad/Eldorado/expo/DSC00263.jpg",
  "/Ciudad/Eldorado/expo/DSC00264.jpg",
  "/Ciudad/Eldorado/expo/DSC00266.jpg",
  "/Ciudad/Eldorado/expo/DSC00268.jpg",
  "/Ciudad/Eldorado/expo/DSC00270.jpg",
  "/Ciudad/Eldorado/expo/DSC00272.jpg",
  "/Ciudad/Eldorado/expo/DSC00279.jpg",
];

const eventos = [
  {
    icon: Store,
    title: "Stands Comerciales",
    desc: "Empresas y comercios de todo el país mostrando sus productos y servicios.",
  },
  {
    icon: Utensils,
    title: "Gastronomía Regional",
    desc: "Sector gastronómico con food trucks y opciones de la cocina regional y mundial.",
  },
  {
    icon: Briefcase,
    title: "Emprendimientos",
    desc: "Espacio dedicado a emprendedores locales y provinciales con productos artesanales y únicos.",
  },
];

export const ExpoEldoradoPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev === 0 ? EXPO_FOTOS.length - 1 : prev - 1));
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev === EXPO_FOTOS.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? EXPO_FOTOS.length - 1 : prev - 1));
  const nextImage = () => setCurrentIndex((prev) => (prev === EXPO_FOTOS.length - 1 ? 0 : prev + 1));

  return (
    <div className="bg-white min-h-screen">
      {/* Logo + Header */}
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

      {/* Qué es la Expo */}
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

        {/* Info general */}
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

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-slate-200" />
      </div>

      {/* Eventos / Sectores */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#009EE3] mb-8 text-center">
          Lo que vas a encontrar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {eventos.map((ev) => {
            const Icon = ev.icon;
            return (
              <div key={ev.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-[#009EE3]/10 flex items-center justify-center mb-4">
                  <Icon className="text-[#009EE3] w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{ev.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{ev.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-slate-200" />
      </div>

      {/* Galería */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-extrabold text-[#009EE3] uppercase mb-2">
            Galería de Fotos
          </h3>
          <p className="text-slate-500 text-sm">
            {EXPO_FOTOS.length} fotografías de la Expo Eldorado
          </p>
        </div>

        {/* Grid 4 columnas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {EXPO_FOTOS.map((src, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => openLightbox(index)}
            >
              <img
                src={src}
                alt={`Expo Eldorado ${index + 1}`}
                className="w-full object-cover transition-all duration-500 group-hover:scale-110"
                style={{ height: '180px' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                <ZoomIn className="text-white w-6 h-6 drop-shadow-lg" />
              </div>
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

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
            <span className="text-white/70 text-sm font-medium">
              {currentIndex + 1} / {EXPO_FOTOS.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-2"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <div
            className="relative max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={EXPO_FOTOS[currentIndex]}
              alt={`Expo Eldorado ${currentIndex + 1}`}
              className="max-h-[80vh] mx-auto object-contain rounded-2xl"
            />
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpoEldoradoPage;

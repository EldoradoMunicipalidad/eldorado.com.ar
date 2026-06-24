import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

// 50 fotos de la EXPO Eldorado
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
  "/Ciudad/Eldorado/expo/DSC00285.jpg",
  "/Ciudad/Eldorado/expo/DSC00287.jpg",
  "/Ciudad/Eldorado/expo/DSC00290.jpg",
  "/Ciudad/Eldorado/expo/DSC00294.jpg",
  "/Ciudad/Eldorado/expo/DSC00300.jpg",
  "/Ciudad/Eldorado/expo/DSC00303.jpg",
  "/Ciudad/Eldorado/expo/DSC00305.jpg",
  "/Ciudad/Eldorado/expo/DSC00309.jpg",
  "/Ciudad/Eldorado/expo/DSC00314.jpg",
  "/Ciudad/Eldorado/expo/DSC00315.jpg",
  "/Ciudad/Eldorado/expo/DSC00322.jpg",
  "/Ciudad/Eldorado/expo/DSC00323.jpg",
  "/Ciudad/Eldorado/expo/DSC00325.jpg",
  "/Ciudad/Eldorado/expo/DSC00337.jpg",
  "/Ciudad/Eldorado/expo/DSC00345.jpg",
  "/Ciudad/Eldorado/expo/DSC00347.jpg",
  "/Ciudad/Eldorado/expo/DSC00348.jpg",
  "/Ciudad/Eldorado/expo/DSC00350.jpg",
  "/Ciudad/Eldorado/expo/DSC00358.jpg",
  "/Ciudad/Eldorado/expo/DSC00361.jpg",
  "/Ciudad/Eldorado/expo/DSC00364.jpg",
  "/Ciudad/Eldorado/expo/DSC00371.jpg",
  "/Ciudad/Eldorado/expo/DSC00376.jpg",
  "/Ciudad/Eldorado/expo/DSC00396.jpg",
  "/Ciudad/Eldorado/expo/DSC00409.jpg",
  "/Ciudad/Eldorado/expo/DSC00411.jpg",
  "/Ciudad/Eldorado/expo/DSC00412.jpg",
  "/Ciudad/Eldorado/expo/DSC00415.jpg",
  "/Ciudad/Eldorado/expo/DSC00417.jpg",
  "/Ciudad/Eldorado/expo/DSC00418.jpg",
  "/Ciudad/Eldorado/expo/DSC00420.jpg",
];

export const ExpoEldoradoGallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

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
    <>
      {/* GALERÍA */}
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="text-3xl font-extrabold text-[#009EE3] uppercase mb-2">
            Galería de Fotos
          </h3>
          <p className="text-slate-500 text-sm">
            {EXPO_FOTOS.length} fotografías de la EXPO Eldorado
          </p>
        </div>

        {/* Grid masonry-like */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {EXPO_FOTOS.map((src, index) => (
            <div
              key={index}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => openLightbox(index)}
            >
              <img
                src={src}
                alt={`EXPO Eldorado ${index + 1}`}
                className="w-full object-cover transition-all duration-500 group-hover:scale-110"
                style={{ height: '220px' }}
                loading="lazy"
                onLoad={() => setLoadedImages((prev) => ({ ...prev, [index]: true }))}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <ZoomIn className="text-white w-7 h-7 drop-shadow-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Botón Ver más */}
        <div className="text-center mt-10">
          <a
            href="https://expo.eldorado.gob.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex bg-[#009EE3] hover:bg-blue-600 text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Conocé más en expo.eldorado.gob.ar
          </a>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Controles superiores */}
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

          {/* Imagen principal */}
          <div
            className="relative max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={EXPO_FOTOS[currentIndex]}
              alt={`EXPO Eldorado ${currentIndex + 1}`}
              className="max-h-[80vh] mx-auto object-contain rounded-2xl"
              style={{ maxHeight: '80vh' }}
            />

            {/* Navegación */}
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
    </>
  );
};

export default ExpoEldoradoGallery;

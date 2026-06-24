import React from 'react';
import ExpoEldoradoGallery from '../../assets/components/Ciudad/ExpoEldoradoGallery';

export const ExpoEldoradoPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-br from-[#009EE3] to-[#007bb5] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border-l-4 border-white pl-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase leading-tight">
              Expo Eldorado
            </h1>
            <p className="text-white/80 text-lg mt-2 font-medium">
              La exposición a cielo abierto más grande de la provincia
            </p>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            La exposición a cielo abierto más grande de la provincia se destaca por su excelente
            organización y su ubicación privilegiada a orillas del río Paraná. Reúne comercios de
            todo el país, ofreciendo una experiencia única y diversa para visitantes y expositores.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="https://expo.eldorado.gob.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-[#009EE3] hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Visitá expo.eldorado.gob.ar
            </a>
            <a
              href="/ciudad/eldorado"
              className="inline-flex bg-white border-2 border-[#009EE3] text-[#009EE3] hover:bg-sky-50 px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg"
            >
              Volver a Eldorado
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-slate-200" />
      </div>

      {/* Galería */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ExpoEldoradoGallery />
      </div>
    </div>
  );
};

export default ExpoEldoradoPage;

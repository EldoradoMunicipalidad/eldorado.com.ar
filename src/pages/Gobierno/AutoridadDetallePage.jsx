import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { intendenciaData } from '../../data/Gobierno/intendenciaData';

export const AutoridadDetallePage = () => {
  const { id } = useParams();

  const autoridad = intendenciaData.find(
    (item) => item.variant === 'profile' && item.id === id
  );

  if (!autoridad) {
    return (
      <section className="px-6 md:px-12 py-16 bg-white min-h-screen">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            Autoridad no encontrada
          </h1>
          <p className="text-slate-600 mb-8">
            No pudimos encontrar la información solicitada.
          </p>
          <Link
            to="/gobierno/intendencia"
            className="inline-flex bg-[#009EE3] hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all"
          >
            Volver a Intendencia
          </Link>
        </div>
      </section>
    );
  }

  const descripcion = autoridad.fullDescription || autoridad.role;

  return (
    <section className="px-6 md:px-12 py-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="float-none lg:float-left w-full lg:w-[38%] lg:mr-10 mb-8 lg:mb-4">
          <img
            src={autoridad.imageSrc}
            alt={autoridad.name}
            className="w-full max-w-md mx-auto lg:mx-0 rounded-3xl shadow-xl object-cover"
          />
        </div>

        <div className="text-slate-700">
          <p className="text-sky-600 font-bold mb-2">{autoridad.role}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
            {autoridad.name}
          </h1>
          <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line text-justify">
            {descripcion}
          </p>

          <Link
            to="/gobierno/intendencia#equipo"
            className="inline-flex mt-8 bg-[#009EE3] hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all clear-both"
          >
            Volver al equipo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AutoridadDetallePage;

import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../assets/Icons/Icon'

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Número 404 */}
        <div className="relative inline-block select-none">
          <span className="text-[140px] md:text-[180px] font-extrabold leading-none text-slate-100">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center shadow-inner">
              <Icon name="warningIcon" className="text-sky-500 text-5xl" />
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Página no encontrada
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed">
            La dirección que buscás no existe o fue movida.<br />
            Verificá la URL o volvé al inicio.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md shadow-sky-200"
          >
            <Icon name="chevronLeftIcon" className="text-base" />
            Volver al inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Página anterior
          </button>
        </div>

      </div>
    </div>
  )
}

export default NotFound

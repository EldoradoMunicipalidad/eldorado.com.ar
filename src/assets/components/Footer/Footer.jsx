import React from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '../../Icons/RedesSociales/InstagramIcon';
import { FacebookIcon } from '../../Icons/RedesSociales/FacebookIcon';
import { XIcon } from '../../Icons/RedesSociales/XIcon';
import { YoutubeIcon } from '../../Icons/RedesSociales/YoutubeIcon';
import { ThreadsIcon } from '../../Icons/RedesSociales/ThreadsIcon';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 text-slate-600 pt-14 pb-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Columna 1: Logo + Dirección */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/logo_muni.png"
                alt="Municipalidad de Eldorado"
                className="h-16 w-auto object-contain"
              />
              <img
                src="/logo_Eldorad_Avancemos.png"
                alt="Eldorado Avancemos Juntos"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="text-sm text-slate-500 font-medium space-y-1">
              <p>Simón J. Bolívar N° 73, Eldorado, Misiones.</p>
              <p>(+54) 03751 - 421787</p>
            </div>
            <a
              href="/empleado-municipal"
              className="group flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-gray-500 font-bold text-sm">Empleado Municipal</span>
            </a>
          </div>

          {/* Columna 2: Secretarías */}
          <div>
            <h4 className="text-gray-500 font-bold text-lg mb-4">Secretarías</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/gobierno/secretaria-gobierno" className="text-slate-500 hover:text-blue-600 transition-colors">Gobierno</Link></li>
              <li><Link to="/gobierno/secretaria-hacienda" className="text-slate-500 hover:text-blue-600 transition-colors">Hacienda</Link></li>
              <li><Link to="/gobierno/secretaria-de-obras-y-servicios-publicos" className="text-slate-500 hover:text-blue-600 transition-colors">Obras y Servicios Públicos</Link></li>
              <li><Link to="/gobierno/secretaria-de-ambiente" className="text-slate-500 hover:text-blue-600 transition-colors">Ambiente</Link></li>
              <li><Link to="/gobierno/secretaria-de-produccion" className="text-slate-500 hover:text-blue-600 transition-colors">Producción</Link></li>
              <li><Link to="/gobierno/secretaria-accion-social" className="text-slate-500 hover:text-blue-600 transition-colors">Acción Social</Link></li>
            </ul>
          </div>

          {/* Columna 3: Explorar */}
          <div>
            <h4 className="text-gray-500 font-bold text-lg mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/gobierno-abierto" className="text-slate-500 hover:text-blue-600 transition-colors">Gobierno abierto</Link></li>
              <li><a href="https://www.municipalidad.com/eldo/home/menu" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">Portal tributario</a></li>
              <li><a href="https://reclamos-ciudadanos.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">Reclamos</a></li>
              <li><Link to="/gobierno-abierto/boletin-oficial" className="text-slate-500 hover:text-blue-600 transition-colors">Boletín oficial</Link></li>
            </ul>
          </div>

          {/* Columna 4: Seguinos */}
          <div>
            <h4 className="text-gray-500 font-bold text-lg mb-4">Seguinos</h4>
            <div className="flex flex-wrap gap-4 text-gray-500">
              <InstagramIcon to='https://www.instagram.com/munieldorado/' />
              <FacebookIcon to='https://www.facebook.com/profile.php?id=61550302085992' />
              <XIcon to='https://x.com/munieldorado' />
              <YoutubeIcon to='https://www.youtube.com/@munieldoradook' />
              <ThreadsIcon to='https://www.threads.net/@munieldorado' />
            </div>
          </div>

        </div>

        {/* Línea Divisoria y Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
          <p>Copyright 2025 © Municipalidad de la ciudad de Eldorado. Dpto Desarrollo Tecnológico Robótica e Innovación. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import InstagramIcon from '../../Icons/RedesSociales/InstagramIcon';
import { FacebookIcon } from '../../Icons/RedesSociales/FacebookIcon';
import { XIcon } from '../../Icons/RedesSociales/XIcon';
import { YoutubeIcon } from '../../Icons/RedesSociales/YoutubeIcon';
import { ThreadsIcon } from '../../Icons/RedesSociales/ThreadsIcon';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 text-slate-600 pt-14 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-between">

          {/* Columna 1: */}
          <div className='flex flex-col items-start gap-4'>
            <div className="flex justify-center">
              <a
                href="/empleado-municipal"
                className="group flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all w-48"
              >
                <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-gray-500 font-bold text-sm">Empleado Municipal</span>
              </a>
            </div>
            <div className="flex flex-col items-start">
              <h4 className="text-gray-500 font-bold text-lg mb-6">Seguinos</h4>
              <div className="flex gap-6 text-gray-500">
                <InstagramIcon to='https://www.instagram.com/munieldorado/' />
                <FacebookIcon to='https://www.facebook.com/profile.php?id=61550302085992' />
                <XIcon to='https://x.com/munieldorado' />
                <YoutubeIcon to='https://www.youtube.com/@munieldoradook' />
                <ThreadsIcon to='https://www.threads.net/@munieldorado' />
              </div>
            </div>
          </div>

          {/* Columna 2: */}
          <div className="flex flex-col gap-6 items-end">
            <div className="flex items-end gap-6">
              <img
                src="/logo_muni.png"
                alt="Municipalidad de Eldorado"
                className="h-22 w-auto object-contain"
              />
              <img
                src="/logo_Eldorad_Avancemos.png"
                alt="Eldorado Avancemos Juntos"
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className='flex items-start'>
              <div className="flex flex-col items-end text-sm space-y-1 text-slate-500 font-medium">
                <p>Simón J. Bolívar N° 73, Eldorado, Misiones.</p>
                <p>(+54) 03751 - 421787</p>
              </div>
            </div>
          </div>

        </div>

        {/* Línea Divisoria y Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
          <p>© 2025 Municipalidad de Eldorado | Dpto. de Desarrollo Tecnológico</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '../../Icons/RedesSociales/InstagramIcon';
import { FacebookIcon } from '../../Icons/RedesSociales/FacebookIcon';
import { XIcon } from '../../Icons/RedesSociales/XIcon';
import { YoutubeIcon } from '../../Icons/RedesSociales/YoutubeIcon';
import { ThreadsIcon } from '../../Icons/RedesSociales/ThreadsIcon';
import { useCmsContent } from '../../../lib/useCmsContent';
import { DEFAULT_SITE_SETTINGS, SITE_SETTINGS_PAGE_ID } from '../../../data/siteSettings';

export const Footer = () => {
  const settings = useCmsContent(SITE_SETTINGS_PAGE_ID, DEFAULT_SITE_SETTINGS);
  const municipality = { ...DEFAULT_SITE_SETTINGS.municipality, ...(settings.municipality || {}) };
  const social = { ...DEFAULT_SITE_SETTINGS.social, ...(settings.social || {}) };
  const footerLinks = settings.footerLinks || DEFAULT_SITE_SETTINGS.footerLinks;

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
                alt={municipality.name}
                className="h-16 w-auto object-contain"
              />
              <img
                src="/logo_Eldorad_Avancemos.png"
                alt="Eldorado Avancemos Juntos"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="text-sm text-slate-500 font-medium space-y-1">
              {municipality.address && <p>{municipality.address}</p>}
              {municipality.phone && <p><a href={`tel:${municipality.phone.replace(/[^\d+]/g, '')}`} className="hover:text-blue-600">{municipality.phone}</a></p>}
              {municipality.email && <p><a href={`mailto:${municipality.email}`} className="hover:text-blue-600 break-all">{municipality.email}</a></p>}
              {municipality.hours && <p>{municipality.hours}</p>}
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
              {footerLinks.filter((item) => item.label && item.href).map((item) => (
                <li key={item.id || `${item.label}-${item.href}`}>
                  {item.href.startsWith('/') && !item.href.startsWith('//')
                    ? <Link to={item.href} className="text-slate-500 hover:text-blue-600 transition-colors">{item.label}</Link>
                    : <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">{item.label}</a>}
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Seguinos */}
          <div>
            <h4 className="text-gray-500 font-bold text-lg mb-4">Seguinos</h4>
            <div className="flex flex-wrap gap-4 text-gray-500">
              {social.instagram && <InstagramIcon to={social.instagram} />}
              {social.facebook && <FacebookIcon to={social.facebook} />}
              {social.x && <XIcon to={social.x} />}
              {social.youtube && <YoutubeIcon to={social.youtube} />}
              {social.threads && <ThreadsIcon to={social.threads} />}
            </div>
          </div>

        </div>

        {/* Línea Divisoria y Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
          <p>Copyright {new Date().getFullYear()} © {settings.copyright || DEFAULT_SITE_SETTINGS.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react'
import { EmblaCarousel } from '../assets/components/HomePage/EmblaCarousel'
import { InformacionAdicionalSection } from '../assets/components/HomePage/InformacionAdicional/InformacionAdicionalSection'
import TramitesAndServiciosSection from '../assets/components/HomePage/TramitesAndServicios/TramitesAndServiciosSection'
import { AppSection } from '../assets/components/HomePage/AppSection.jsx/AppSection'
import { NoticiasSection } from '../assets/components/HomePage/Noticias/NoticiasSection'
import { getHomeContent } from '../lib/homeContent'
import * as Icons from '../assets/Icons/TramitesAndServicios/AllIcons'

// ─── Default content ─────────────────────────────────────────────────
const DEFAULT_CONTENT = {
  carousel: [{ id: 1, img: '/slider-2.jpg', title: '', subtitle: '' }],
  guiaTramites: {
    title: 'Guía de Trámites',
    subtitle: 'Consulta todos los pasos para realizar tus trámites municipales',
    buttonText: 'Ir a la guía',
    buttonHref: '/guia-de-tramites',
    enabled: true,
  },
  tramites: [
    { id: 1, icon: 'TributarioIcon', title: 'Portal Tributario', subtitle: 'Consultá y aboná tus tasas municipales en línea', to: 'https://www.municipalidad.com/eldo/home/menu' },
    { id: 2, icon: 'ComercialIcon', title: 'Preinscripción Comercial', subtitle: 'Iniciá la habilitación comercial de tu emprendimiento', to: '/ciudadano-digital/preinscripcion-comercial' },
    { id: 3, icon: 'LicenciasIcon', title: 'Licencias de Conducir', subtitle: 'Solicitá turnos e información para tu licencia', to: '/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias' },
    { id: 4, icon: 'EstacionamientoIcon', title: 'Estacionamiento Medido', subtitle: 'Gestioná tu estacionamiento y consultá zonas habilitadas', to: 'https://sem.eldorado.gob.ar/#/fines' },
    { id: 5, icon: 'LicitacionesIcon', title: 'Licitaciones', subtitle: 'Accedé a convocatorias y pliegos municipales vigentes', to: '/gobierno-abierto/licitaciones' },
    { id: 6, icon: 'TurnosPlaneamientoIcon', title: 'Turnos Planeamiento', subtitle: 'Reservá tu turno para trámites de obras y planeamiento', to: '/gobierno/secretaria-obras-publicas/planeamiento/turnero' },
    { id: 7, icon: 'EscuelaManejoIcon', title: 'Escuela de Manejo', subtitle: 'Inscribite y preparate para obtener tu licencia', to: 'https://floralwhite-alpaca-355258.builder-preview.com/escuela-de-manejo' },
    { id: 8, icon: 'ParqueIndustrialIcon', title: 'Parque Industrial', subtitle: 'Conocé oportunidades, servicios e información del predio', to: '/gobierno/secretaria-gobierno/parque-industrial' },
    { id: 9, icon: 'ReclamosIcon', title: 'Reclamos', subtitle: 'Registrá incidencias y seguí el estado de tu solicitud', to: '/ciudadano-digital/reclamos' },
    { id: 10, icon: 'ArboladoIcon', title: 'Arbolado Urbano', subtitle: 'Solicitá intervenciones y gestiones vinculadas al arbolado', to: 'https://docs.google.com/forms/d/e/1FAIpQLSdVyYicbRfgh3iY9vi7R4ZqZsuivRg0q24Ok0M6urSYz6MhNA/viewform' },
    { id: 11, icon: 'JuzgadoIcon', title: 'Juzgado de Faltas', subtitle: 'Consultá trámites, actas y gestiones del juzgado', to: '/gobierno/juzgado-de-faltas' },
    { id: 12, icon: 'BoletinIcon', title: 'Boletín Oficial', subtitle: 'Accedé a publicaciones y normativa municipal actualizada', to: '/gobierno-abierto/boletin-oficial' },
  ],
  infoAdicional: {
    cards: [
      { id: 1, icon: 'location_city', bgImage: '/card-ciudad.jpg', title: 'Ciudad', subtitle: 'Conocé todo sobre nuestra ciudad: historia, turismo, barrios, escudo e insignias.', href: '/ciudad' },
      { id: 2, icon: 'account_balance', bgImage: '/card-gobierno.jpg', title: 'Gobierno', subtitle: 'Enterate sobre el adentro, secretarías, departamentos y el staff gubernamental.', href: '/gobierno' },
      { id: 3, icon: 'touch_app', bgImage: '/card-ciudadano_digital.jpg', title: 'Ciudadano Digital', subtitle: 'Accedé a trámites online, licencias, tasas, reclamos y preinscripción comercial.', href: '/ciudadano-digital' },
      { id: 4, icon: 'visibility', bgImage: '/card-gobierno_abierto.jpg', title: 'Gobierno Abierto', subtitle: 'Consultá licitaciones, boletín oficial, finanzas públicas, escala salarial y más.', href: '/gobierno-abierto' },
    ],
    stats: [],
  },
  appSection: {
    enabled: true,
    title: 'MI MUNI MI CUENTA',
    subtitle: 'Accedé a trámites, pagos, noticias y servicios municipales desde tu celular. Rápido, seguro y siempre a mano.',
    features: [
      { icon: 'smartphone', label: 'Trámites online' },
      { icon: 'payments', label: 'Pagos digitales' },
      { icon: 'notifications', label: 'Alertas y noticias' },
      { icon: 'verified', label: 'Seguro y confiable' },
    ],
    videoId: 'wcDWGr0ygSg',
  },
}

export const HomePage = () => {
  const [homeData, setHomeData] = useState(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHomeContent()
      .then((res) => {
        const merged = { ...DEFAULT_CONTENT, ...res.content }
        setHomeData(merged)
      })
      .catch(() => {
        // Use defaults on error
      })
      .finally(() => setLoading(false))
  }, [])

  const { carousel, guiaTramites, tramites, infoAdicional, appSection } = homeData

  // Prepare tramites items with resolved icon components
  const tramitesItems = (tramites || []).map((t) => ({
    ...t,
    Icon: Icons[t.icon] || Icons.TributarioIcon,
  }))

  // Prepare infoAdicional cards (static icons, not from AllIcons)
  const infoCards = (infoAdicional?.cards || DEFAULT_CONTENT.infoAdicional.cards).map((c) => ({
    ...c,
  }))

  return (
    <div>
      {/* Carrusel dinámico */}
      <EmblaCarousel slides={carousel} />

      {/* Guía de Trámites — dynamic */}
      {guiaTramites?.enabled !== false && (
        <div className="w-full sm:w-[94%] max-w-325 sm:mx-auto px-0 sm:px-0 py-4 bg-white">
          <div className="relative overflow-hidden rounded-none sm:rounded-[2.5rem] shadow-lg group">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-sky-600 to-emerald-500 transition-all duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-white font-bold text-lg md:text-xl">{guiaTramites.title}</h3>
                  <p className="text-white/80 text-sm md:text-base mt-0.5">{guiaTramites.subtitle}</p>
                </div>
              </div>
              <a
                href={guiaTramites.buttonHref}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-600 font-bold rounded-xl hover:bg-white/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm md:text-base shrink-0"
              >
                <span>{guiaTramites.buttonText}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Trámites y Servicios dinámicos */}
      <TramitesAndServiciosSection dynamicItems={tramitesItems} />

      {/* Info Adicional dinámica */}
      <InformacionAdicionalSection
        tag="Información de Interés"
        title="Servicios, trámites y recursos útiles para los ciudadanos de Eldorado"
        cardsData={infoCards}
        statsData={infoAdicional?.stats || []}
      />

      {/* App Section dinámica */}
      {appSection?.enabled !== false && (
        <AppSection
          title={appSection?.title}
          subtitle={appSection?.subtitle}
          features={appSection?.features}
          videoId={appSection?.videoId}
        />
      )}

      {/* Noticias (ya es dinámico vía Directus) */}
      <NoticiasSection />
    </div>
  )
}

export default HomePage;

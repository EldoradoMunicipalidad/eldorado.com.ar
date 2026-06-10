import React from 'react'
import { EmblaCarousel } from '../assets/components/HomePage/EmblaCarousel'
import { InformacionAdicionalSection } from '../assets/components/HomePage/InformacionAdicional/InformacionAdicionalSection'
import TramitesAndServiciosSection from '../assets/components/HomePage/TramitesAndServicios/TramitesAndServiciosSection'
import { AppSection } from '../assets/components/HomePage/AppSection.jsx/AppSection'
import { NoticiasSection } from '../assets/components/HomePage/Noticias/NoticiasSection'
import { Footer } from '../assets/components/Footer/Footer'

export const HomePage = () => {
  const misCards = [
    {
      id: 1,
      icon: "location_city",
      bgImage: "/card-ciudad.jpg",
      title: "Ciudad",
      subtitle: "Conocé todo sobre nuestra ciudad: historia, turismo, barrios, escudo e insignias.",
      href: "/ciudad"
    },
    {
      id: 2,
      icon: "account_balance",
      bgImage: "/card-gobierno.jpg",
      title: "Gobierno",
      subtitle: "Enterate sobre el intendente, secretarías, departamentos y el staff gubernamental.",
      href: "/gobierno"
    },
    {
      id: 3,
      icon: "touch_app",
      bgImage: "/card-ciudadano_digital.jpg",
      title: "Ciudadano Digital",
      subtitle: "Accedé a trámites online, licencias, tasas, reclamos y preinscripción comercial.",
      href: "/ciudadano-digital"
    },
    {
      id: 4,
      icon: "visibility",
      bgImage: "/card-gobierno_abierto.jpg",
      title: "Gobierno Abierto",
      subtitle: "Consultá licitaciones, boletín oficial, finanzas públicas, escala salarial y más.",
      href: "/gobierno-abierto"
    }
  ];


  const noticias = [
    {
      id: 1,
      categoria: "Obras e Infraestructura Urbana",
      titulo: "Proyectan mejoras y eventos en el skatepark de Eldorado",
      fecha: "06 de febrero, 2026",
      imagen: "/noticias1.avif",
      link: "/noticias/skatepark-mejoras"
    },
    {
      id: 2,
      categoria: "Deportes",
      titulo: "Verano Cerca Tuyo: finalizó la primera semana con éxito",
      fecha: "06 de febrero, 2026",
      imagen: "/noticias2.avif",
      link: "/noticias/verano-cerca"
    },
    {
      id: 3,
      categoria: "Departamento de Promoción de Salud",
      titulo: "Recomendaciones para prevenir golpes de calor",
      fecha: "06 de febrero, 2026",
      imagen: "/noticias3.avif",
      link: "/noticias/prevencion-calor"
    }
  ];
  
  return (
    <div>
      <EmblaCarousel />
      
      {/* Guía de trámites — mismo ancho que el carrusel */}
      <div className="w-full sm:w-[94%] max-w-325 sm:mx-auto px-0 sm:px-0 py-4 bg-white">
        <div className="relative overflow-hidden rounded-none sm:rounded-[2.5rem] shadow-lg group">
          {/* Fondo con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-sky-600 to-emerald-500 transition-all duration-500 group-hover:scale-105" />
          
          {/* Patrón de puntos decorativo */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
            {/* Icono y texto */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-white font-bold text-lg md:text-xl">Guía de Trámites</h3>
                <p className="text-white/80 text-sm md:text-base mt-0.5">Consulta todos los pasos para realizar tus trámites municipales</p>
              </div>
            </div>
            
            {/* Botón */}
            <a 
              href="/guia-de-tramites"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-600 font-bold rounded-xl hover:bg-white/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm md:text-base shrink-0"
            >
              <span>Ir a la guía</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <TramitesAndServiciosSection />
      
      <InformacionAdicionalSection
        tag="Lorem ipsum dolor"
        title="Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, totam?"
        cardsData={misCards} />

      <AppSection />

      <NoticiasSection noticias={noticias} />
    </div>

  )
}

export default HomePage;

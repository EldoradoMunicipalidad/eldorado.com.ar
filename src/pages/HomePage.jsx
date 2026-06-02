import React from 'react'
import { EmblaCarousel } from '../assets/components/HomePage/EmblaCarousel'
import { InformacionAdicionalSection } from '../assets/components/HomePage/InformacionAdicional/InformacionAdicionalSection'
import TramitesAndServiciosSection from '../assets/components/HomePage/TramitesAndServicios/TramitesAndServiciosSection'
import { AppSection } from '../assets/components/HomePage/AppSection.jsx/AppSection'
import { NoticiasSection } from '../assets/components/HomePage/Noticias/NoticiasSection'
import { Footer } from '../assets/components/Footer/Footer'

export const HomePage = () => {
  const misEstadisticas = [
    { count: "12,000+", label: "Trámites anuales" },
    { count: "89%", label: "Satisfacción" },
    { count: "1,200+", label: "Servicios activos" },
    { count: "125+", label: "Puntos de atención" }
  ];

  const misCards = [
    {
      id: 1,
      icon: "directions_car",
      bgImage: "/eldorado-municipalidad.jpg",
      title: "Licencia de Conducir",
      subtitle: "Inicia el trámite para obtener o renovar tu licencia. Consulta requisitos, costos y solicita tu turno online en pocos pasos."
    },
    {
      id: 2,
      icon: "receipt_long",
      bgImage: "/pagos-online.avif",
      title: "Tasas Municipales",
      subtitle: "Accede a la consulta de deuda, descarga de boletas y pagos electrónicos."
    },
    {
      id: 3,
      icon: "campaign",
      title: "Reclamos y Sugerencias",
      subtitle: "Tu opinión nos ayuda a crecer. Envía reportes sobre servicios públicos."
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
      
      {/* Guía de trámites */}
      <div className="flex justify-center py-6 bg-white">
        <a 
          href="https://guiadetramites.eldorado.gob.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#009EE3] text-white font-semibold rounded-xl hover:bg-[#007bb5] transition-all shadow-md hover:shadow-lg text-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Guía de Trámites
        </a>
      </div>

      <TramitesAndServiciosSection />
      
      <InformacionAdicionalSection
        tag="Lorem ipsum dolor"
        title="Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, totam?"
        cardsData={misCards}
        statsData={misEstadisticas} />

      <AppSection />

      {/* Sección Monumento a la Mujer Eldoradense */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-3">Concurso Monumento a la Mujer Eldoradense</h3>
            <p className="text-gray-300 mb-6 text-lg">
              Buscamos inmortalizar a través del arte la fuerza, la lucha y la identidad de las mujeres que forjaron nuestra historia en la región de Eldorado.
            </p>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSeWAvP1HaTi4ElG1w4urgJGx6JPE2JFn_J6vb6j-BWVMd53IQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#009EE3] text-white font-bold rounded-lg hover:bg-[#007bb5] transition-colors shadow-lg"
            >
              INSCRIBIRME AHORA
            </a>
          </div>
        </div>
      </section>

      <NoticiasSection noticias={noticias} />
    </div>

  )
}

export default HomePage;

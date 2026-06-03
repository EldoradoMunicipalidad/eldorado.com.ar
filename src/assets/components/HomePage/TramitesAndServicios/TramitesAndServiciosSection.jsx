import React from 'react'
import { ServiciosGridContainer } from './ServiciosGridContainer';
import * as Icons from '../../../Icons/TramitesAndServicios/AllIcons';
import { SectionTitle } from '../SectionTitle';

export const TramitesAndServiciosSection = () => {
  const itemsData = [
    {
      id: 1,
      Icon: Icons.TributarioIcon,
      title: "Portal Tributario",
      subtitle: "Consultá y aboná tus tasas municipales en línea",
      to: "https://www.municipalidad.com/eldo/home/menu"
    },
    {
      id: 2,
      Icon: Icons.ComercialIcon,
      title: "Preinscripción Comercial",
      subtitle: "Iniciá la habilitación comercial de tu emprendimiento",
      to: "https://sistema-de-gestion-comercial.vercel.app/formulario"
    },
    {
      id: 3,
      Icon: Icons.LicenciasIcon,
      title: "Licencias de Conducir",
      subtitle: "Solicitá turnos e información para tu licencia",
      to: "/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias"
    },
    {
      id: 4,
      Icon: Icons.EstacionamientoIcon,
      title: "Estacionamiento Medido",
      subtitle: "Gestioná tu estacionamiento y consultá zonas habilitadas",
      to: "https://sem.eldorado.gob.ar/#/fines"
    },
    {
      id: 5,
      Icon: Icons.LicitacionesIcon,
      title: "Licitaciones",
      subtitle: "Accedé a convocatorias y pliegos municipales vigentes",
      to: "/gobierno-abierto/licitaciones"
    },
    {
      id: 6,
      Icon: Icons.TurnosPlaneamientoIcon,
      title: "Turnos Planeamiento",
      subtitle: "Reservá tu turno para trámites de obras y planeamiento",
      to: "/gobierno/secretaria-obras-publicas/planeamiento/turnero"
    },
    {
      id: 7,
      Icon: Icons.EscuelaManejoIcon,
      title: "Escuela de Manejo",
      subtitle: "Inscribite y preparate para obtener tu licencia",
      to: "https://floralwhite-alpaca-355258.builder-preview.com/escuela-de-manejo"
    },
    {
      id: 8,
      Icon: Icons.ParqueIndustrialIcon,
      title: "Parque Industrial",
      subtitle: "Conocé oportunidades, servicios e información del predio",
      to: "/gobierno/secretaria-gobierno/parque-industrial"
    },
    {
      id: 9,
      Icon: Icons.ReclamosIcon,
      title: "Reclamos",
      subtitle: "Registrá incidencias y seguí el estado de tu solicitud",
      to: "https://reclamos-ciudadanos.vercel.app/"
    },
    {
      id: 10,
      Icon: Icons.ArboladoIcon,
      title: "Arbolado Urbano",
      subtitle: "Solicitá intervenciones y gestiones vinculadas al arbolado",
      to: "https://docs.google.com/forms/d/e/1FAIpQLSdVyYicbRfgh3iY9vi7R4ZqZsuivRg0q24Ok0M6urSYz6MhNA/viewform"
    },
    {
      id: 11,
      Icon: Icons.JuzgadoIcon,
      title: "Juzgado de Faltas",
      subtitle: "Consultá trámites, actas y gestiones del juzgado",
      to: "/gobierno/juzgado-de-faltas"
    },
    {
      id: 12,
      Icon: Icons.BoletinIcon,
      title: "Boletín Oficial",
      subtitle: "Accedé a publicaciones y normativa municipal actualizada",
      to: "/gobierno-abierto/boletin-oficial"
    }
  ];

  return (
    <section id='tramites-servicios' className="bg-gray-50 py-10 flex justify-center">
      <div className="w-[95%] max-w-350">

        <SectionTitle 
          title="Trámites y Servicios Digitales"
          centered={true}
        />
        
        {/* Grid para renderizar los cards de Tramites y Servicios */}
        <ServiciosGridContainer data={itemsData} />

      </div>
    </section>
  )
}

export default TramitesAndServiciosSection;

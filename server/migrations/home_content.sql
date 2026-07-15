-- Home Content CMS
-- Uses the existing page_content table keyed as 'home'
-- Run against Neon PostgreSQL

INSERT INTO page_content (page_id, content, updated_at)
VALUES (
  'home',
  '{
    "carousel": [
      {
        "id": 1,
        "img": "/slider-2.jpg",
        "title": "",
        "subtitle": ""
      }
    ],
    "guiaTramites": {
      "title": "Guía de Trámites",
      "subtitle": "Consulta todos los pasos para realizar tus trámites municipales",
      "buttonText": "Ir a la guía",
      "buttonHref": "/guia-de-tramites",
      "enabled": true
    },
    "tramites": [
      {
        "id": 1,
        "icon": "TributarioIcon",
        "title": "Portal Tributario",
        "subtitle": "Consultá y aboná tus tasas municipales en línea",
        "to": "https://www.municipalidad.com/eldo/home/menu"
      },
      {
        "id": 2,
        "icon": "ComercialIcon",
        "title": "Preinscripción Comercial",
        "subtitle": "Iniciá la habilitación comercial de tu emprendimiento",
        "to": "/ciudadano-digital/preinscripcion-comercial"
      },
      {
        "id": 3,
        "icon": "LicenciasIcon",
        "title": "Licencias de Conducir",
        "subtitle": "Solicitá turnos e información para tu licencia",
        "to": "/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias"
      },
      {
        "id": 4,
        "icon": "EstacionamientoIcon",
        "title": "Estacionamiento Medido",
        "subtitle": "Gestioná tu estacionamiento y consultá zonas habilitadas",
        "to": "https://sem.eldorado.gob.ar/#/fines"
      },
      {
        "id": 5,
        "icon": "LicitacionesIcon",
        "title": "Licitaciones",
        "subtitle": "Accedé a convocatorias y pliegos municipales vigentes",
        "to": "/gobierno-abierto/licitaciones"
      },
      {
        "id": 6,
        "icon": "TurnosPlaneamientoIcon",
        "title": "Turnos Planeamiento",
        "subtitle": "Reservá tu turno para trámites de obras y planeamiento",
        "to": "/gobierno/secretaria-obras-publicas/planeamiento/turnero"
      },
      {
        "id": 7,
        "icon": "EscuelaManejoIcon",
        "title": "Escuela de Manejo",
        "subtitle": "Inscribite y preparate para obtener tu licencia",
        "to": "https://floralwhite-alpaca-355258.builder-preview.com/escuela-de-manejo"
      },
      {
        "id": 8,
        "icon": "ParqueIndustrialIcon",
        "title": "Parque Industrial",
        "subtitle": "Conocé oportunidades, servicios e información del predio",
        "to": "/gobierno/secretaria-gobierno/parque-industrial"
      },
      {
        "id": 9,
        "icon": "ReclamosIcon",
        "title": "Reclamos",
        "subtitle": "Registrá incidencias y seguí el estado de tu solicitud",
        "to": "/ciudadano-digital/reclamos"
      },
      {
        "id": 10,
        "icon": "ArboladoIcon",
        "title": "Arbolado Urbano",
        "subtitle": "Solicitá intervenciones y gestiones vinculadas al arbolado",
        "to": "https://docs.google.com/forms/d/e/1FAIpQLSdVyYicbRfgh3iY9vi7R4ZqZsuivRg0q24Ok0M6urSYz6MhNA/viewform"
      },
      {
        "id": 11,
        "icon": "JuzgadoIcon",
        "title": "Juzgado de Faltas",
        "subtitle": "Consultá trámites, actas y gestiones del juzgado",
        "to": "/gobierno/juzgado-de-faltas"
      },
      {
        "id": 12,
        "icon": "BoletinIcon",
        "title": "Boletín Oficial",
        "subtitle": "Accedé a publicaciones y normativa municipal actualizada",
        "to": "/gobierno-abierto/boletin-oficial"
      }
    ],
    "infoAdicional": {
      "cards": [
        {
          "id": 1,
          "icon": "location_city",
          "bgImage": "/card-ciudad.jpg",
          "title": "Ciudad",
          "subtitle": "Conocé todo sobre nuestra ciudad: historia, turismo, barrios, escudo e insignias.",
          "href": "/ciudad"
        },
        {
          "id": 2,
          "icon": "account_balance",
          "bgImage": "/card-gobierno.jpg",
          "title": "Gobierno",
          "subtitle": "Enterate sobre el intendente, secretarías, departamentos y el staff gubernamental.",
          "href": "/gobierno"
        },
        {
          "id": 3,
          "icon": "touch_app",
          "bgImage": "/card-ciudadano_digital.jpg",
          "title": "Ciudadano Digital",
          "subtitle": "Accedé a trámites online, licencias, tasas, reclamos y preinscripción comercial.",
          "href": "/ciudadano-digital"
        },
        {
          "id": 4,
          "icon": "visibility",
          "bgImage": "/card-gobierno_abierto.jpg",
          "title": "Gobierno Abierto",
          "subtitle": "Consultá licitaciones, boletín oficial, finanzas públicas, escala salarial y más.",
          "href": "/gobierno-abierto"
        }
      ],
      "stats": []
    },
    "appSection": {
      "enabled": true,
      "title": "MI MUNI MI CUENTA",
      "subtitle": "Accedé a trámites, pagos, noticias y servicios municipales desde tu celular. Rápido, seguro y siempre a mano.",
      "features": [
        { "icon": "smartphone", "label": "Trámites online" },
        { "icon": "payments", "label": "Pagos digitales" },
        { "icon": "notifications", "label": "Alertas y noticias" },
        { "icon": "verified", "label": "Seguro y confiable" }
      ],
      "videoId": "wcDWGr0ygSg"
    }
  }'::jsonb,
  NOW()
)
ON CONFLICT (page_id) DO NOTHING;

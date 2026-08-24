// Data layer para /gobierno (página índice)
// Cards que enlazan a las secretarías y áreas principales bajo /gobierno/*
export const GOBIERNO_INTENDENCIA_DATA = [
  {
    categoryTitle: 'Intendencia y Gabinete',
    id: 'intendencia',
    icon: 'accountBalanceIcon',
    cards: [
      {
        title: 'Intendencia',
        description: 'La Intendencia Municipal: atribuciones, gestión y equipo de gobierno.',
        icon: 'accountBalanceIcon',
        to: '/gobierno/intendencia',
      },
      {
        title: 'Gabinete Municipal',
        description: 'Conocé a las autoridades que integran el gabinete del Intendente.',
        icon: 'groupsIcon',
        to: '/gobierno/intendencia/gabinete-municipal',
      },
      {
        title: 'Juzgado de Faltas',
        description: 'Trámites, actas y gestiones del Juzgado de Faltas municipal.',
        icon: 'gavelIcon',
        to: '/gobierno/juzgado-de-faltas',
      },
    ],
  },
];

export const GOBIERNO_SECRETARIAS_DATA = [
  {
    categoryTitle: 'Secretarías',
    id: 'secretarias',
    icon: 'domainIcon',
    cards: [
      {
        title: 'Sec. de Gobierno',
        description: 'Tránsito, cultura, juventud, deportes y todas las direcciones de la Secretaría de Gobierno.',
        icon: 'domainIcon',
        to: '/gobierno/secretaria-gobierno',
      },
      {
        title: 'Sec. de Hacienda',
        description: 'Contabilidad, control de gestión y rentas generales.',
        icon: 'accountBalanceWallet',
        to: '/gobierno/secretaria-hacienda',
      },
      {
        title: 'Sec. de Obras y Servicios Públicos',
        description: 'Planeamiento, mantenimiento, obras públicas y plantas municipales.',
        icon: 'engineeringIcon',
        to: '/gobierno/secretaria-de-obras-y-servicios-publicos',
      },
      {
        title: 'Sec. de Ambiente',
        description: 'Ambiente, bromatología, zoonosis y observatorio ambiental.',
        icon: 'forestIcon',
        to: '/gobierno/secretaria-de-ambiente',
      },
      {
        title: 'Sec. de Acción Social',
        description: 'Adultos mayores, niñez, adolescencia, regularización dominial y relaciones con la comunidad.',
        icon: 'accionSocialIcon',
        to: '/gobierno/secretaria-accion-social',
      },
      {
        title: 'Sec. de Producción',
        description: 'Integración productiva y producción y desarrollo sostenible.',
        icon: 'agricultureIcon',
        to: '/gobierno/secretaria-de-produccion',
      },
    ],
  },
];
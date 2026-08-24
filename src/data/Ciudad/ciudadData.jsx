// Data layer para /ciudad (página índice)
// Cards que enlazan a las sub-páginas existentes bajo /ciudad/*
export const CIUDAD_DATA = [
  {
    categoryTitle: 'Conocé la Ciudad',
    id: 'conoce-la-ciudad',
    icon: 'cityIcon',
    cards: [
      {
        title: 'Expo Eldorado',
        description: 'Exposición anual de la ciudad: industria, producción y cultura.',
        icon: 'attractionsIcon',
        to: '/ciudad/expo-eldorado',
      },
      {
        title: 'Eldorado',
        description: 'Información general sobre nuestra ciudad: historia, ubicación y características.',
        icon: 'museumIcon',
        to: '/ciudad/eldorado',
      },
      {
        title: 'Escudo e Insignias',
        description: 'Los símbolos oficiales de la ciudad y su significado.',
        icon: 'badgeIcon',
        to: '/ciudad/escudo-e-insignias',
      },
      {
        title: 'Barrios',
        description: 'Conocé los barrios que componen la ciudad de Eldorado.',
        icon: 'locationOnIcon',
        to: '/ciudad/barrios',
      },
      {
        title: 'Carta Orgánica',
        description: 'La constitución municipal: estructura, atribuciones y funcionamiento del gobierno.',
        icon: 'menuBookIcon',
        to: '/ciudad/carta-organica',
      },
    ],
  },
  {
    categoryTitle: 'Servicios al Ciudadano',
    id: 'servicios-ciudadano',
    icon: 'supportAgentIcon',
    cards: [
      {
        title: 'Contacto',
        description: 'Teléfonos, direcciones y formularios para comunicarte con el municipio.',
        icon: 'phoneIcon',
        to: '/ciudad/contacto',
      },
      {
        title: 'Teléfonos Útiles',
        description: 'Listado completo de teléfonos útiles de la ciudad.',
        icon: 'phoneIcon',
        to: '/ciudad/telefonos-utiles',
      },
      {
        title: 'Bus Eldorado',
        description: 'Recorridos, horarios y paradas del transporte público urbano.',
        icon: 'directionsBusIcon',
        to: '/ciudad/bus-eldorado',
      },
    ],
  },
];
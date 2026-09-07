export const SITE_SETTINGS_PAGE_ID = 'site-settings'
export const AGENDA_PAGE_ID = 'agenda-municipal'

export const DEFAULT_SITE_SETTINGS = {
  municipality: {
    name: 'Municipalidad de la ciudad de Eldorado',
    address: 'Simón J. Bolívar N° 73, Eldorado, Misiones.',
    phone: '(+54) 03751 - 421787',
    email: 'gobierno@eldorado.gob.ar',
    hours: 'Lunes a viernes de 7:00 a 12:00',
    mapUrl: 'https://maps.google.com/?q=Municipalidad+de+Eldorado+Misiones',
  },
  social: {
    instagram: 'https://www.instagram.com/munieldorado/',
    facebook: 'https://www.facebook.com/profile.php?id=61550302085992',
    x: 'https://x.com/munieldorado',
    youtube: 'https://www.youtube.com/@munieldoradook',
    threads: 'https://www.threads.net/@munieldorado',
  },
  footerLinks: [
    { id: 'gobierno-abierto', label: 'Gobierno abierto', href: '/gobierno-abierto' },
    { id: 'portal-tributario', label: 'Portal tributario', href: 'https://www.municipalidad.com/eldo/home/menu' },
    { id: 'reclamos', label: 'Reclamos', href: '/ciudadano-digital/reclamos' },
    { id: 'boletin-oficial', label: 'Boletín oficial', href: '/gobierno-abierto/boletin-oficial' },
  ],
  copyright: 'Municipalidad de la ciudad de Eldorado. Dpto Desarrollo Tecnológico Robótica e Innovación. Todos los derechos reservados.',
}

export const DEFAULT_AGENDA = {
  enabled: true,
  title: 'Agenda Municipal',
  subtitle: 'Próximas actividades, operativos y eventos de la Municipalidad de Eldorado.',
  showPastEvents: false,
  items: [],
}

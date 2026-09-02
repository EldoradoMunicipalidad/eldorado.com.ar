import {
  GOBIERNO_ABIERTO_DATA,
  FINANZAS_PUBLICAS_DATA,
  TRIBUTOS_DATA,
  OBRAS_PUBLICAS_DATA,
  RECURSOS_HUMANOS_DATA,
} from './gobiernoAbiertoData'
import { BOLETINES_OFICIALES } from './boletinosData'
import { BALANCETES_DATA } from './balancetesData'
import { TRIBUTOS_RECAUDACION_DATA, TRIBUTOS_TOTALES } from './tributosData'
import { RESUMEN_CONSOLIDADO } from './resumenConsolidadoData'
import { ORGANIGRAMA_SECCIONES } from './organigramaData'
import { PLANTA_PERSONAL_DATA } from './plantaPersonalData'
import { ESCALA_SALARIAL_DATA } from './escalaSalarialData'
import { AUDIENCIAS_2025, AUDIENCIAS_2026 } from './audienciasData'
import {
  SECRETARIA_GOBIERNO,
  SECRETARIA_PRODUCCION,
  SECRETARIA_AMBIENTE,
  SECRETARIA_HACIENDA,
  SECRETARIA_OBRAS_PUBLICAS,
  SECRETARIA_ACCION_SOCIAL,
} from '../Gobierno/gabineteMunicipalData'

export const DEFAULT_GOBIERNO_ABIERTO_CONTENT = {
  header: {
    title: 'Gobierno',
    highlight: 'Abierto',
    description: 'Transparencia, participación ciudadana y acceso a la información pública. Conocé en detalle la gestión municipal, las finanzas, las contrataciones y la estructura del municipio.',
  },
  intro: 'El Gobierno Abierto es un compromiso con la transparencia y la rendición de cuentas. Acá encontrás toda la información pública de la Municipalidad de Eldorado: normas, presupuestos, contrataciones, tributos y la estructura organizativa del municipio.',
  sections: [
    ...GOBIERNO_ABIERTO_DATA,
    ...FINANZAS_PUBLICAS_DATA,
    ...TRIBUTOS_DATA,
    ...OBRAS_PUBLICAS_DATA,
    ...RECURSOS_HUMANOS_DATA,
  ],
  ordinance: {
    id: 'ordenanza-048',
    titulo: 'Ordenanza 048/2024',
    descripcion: 'Adhesión del Municipio a las Leyes Provinciales VII N° 52 (Antes Ley 4166) y VII N° 85 del Régimen Federal de Responsabilidad Fiscal y Buenas Prácticas de Gobierno.',
    documentos: [
      { etiqueta: 'Ordenanza N° 048/2.018', href: 'https://drive.google.com/file/d/1zPU90z1iW3DqXNEYlcWUDSTr0tLutc8D/preview', textoEnlace: 'Ver documento' },
      { etiqueta: 'Boletín Oficial de Misiones', href: 'https://drive.google.com/file/d/1pHXlH04KTRIJzvdK9deVEx7SOzvtDufL/preview', textoEnlace: 'Ver documento' },
    ],
  },
  subpages: {},
}

export const GOBIERNO_ABIERTO_SUBPAGE_IDS = {
  boletines: 'gobierno-abierto-boletines',
  finanzas: 'gobierno-abierto-finanzas',
  balancetes: 'gobierno-abierto-balancetes',
  tributos: 'gobierno-abierto-tributos',
  resumenConsolidado: 'gobierno-abierto-resumen-consolidado',
  organigrama: 'gobierno-abierto-organigrama',
  plantaPersonal: 'gobierno-abierto-planta-personal',
  escalaSalarial: 'gobierno-abierto-escala-salarial',
  audiencias: 'gobierno-abierto-audiencias',
}

const FINANZAS_DETALLES = {
  'Ordenanza Presupuestaria': {
    documentos: [{ titulo: 'Presupuesto 2026 ( Ord. 249/2026 - Dec. 259/2025 )', subtitulo: 'Estimacion de recursos y planificacion de los gastos previstos para el ejercicio 2026', enlace: 'https://drive.google.com/file/d/1vDMiKL42Od6AKXbprUzVkhgoNNepgN5P/view' }],
  },
  'Ordenanza General Fiscal': {
    documentos: [
      { titulo: 'ORDENANZA N° 218/2.025 - ANEXO I - ORDENANZA GENERAL FISCAL EJERCICIO 2.026 PARTE TRIBUTARIA', enlace: 'https://drive.google.com/file/d/19klWWMDYFE1fOY2TlO2If2OzERg8kVV-/view' },
      { titulo: 'ORDENANZA N° 218/2.025 - ANEXO II - ORDENANZA GENERAL FISCAL EJERCICIO 2.026 PARTE TRIBUTARIA', enlace: 'https://drive.google.com/file/d/1-fgpCPz017LTgr6PcN32D8LsVhdJrHl7/view' },
      { titulo: 'ORDENANZA N° 218/2.025 - ANEXO III - ORDENANZA GENERAL FISCAL EJERCICIO 2.026 PARTE TRIBUTARIA', enlace: 'https://drive.google.com/file/d/1GanbPAULcBe1o8-VDEjoaCZh32EqOg2S/view' },
    ],
  },
  'Inventario de Bienes': {
    documentos: [
      { titulo: 'Alta 3° Trimestre, Impresión Inventario (2024)', enlace: 'https://drive.google.com/file/d/1wVInZ3YaK2RwHUBFdwr87nKXBs1dm-NK/view' },
      { titulo: 'Baja 3° Trimestre, Impresión Inventario (2024)', enlace: 'https://drive.google.com/file/d/1wVInZ3YaK2RwHUBFdwr87nKXBs1dm-NK/view' },
      { titulo: 'Alta 4° Trimestre, Impresión Inventario (2024)', enlace: 'https://drive.google.com/file/d/1-wUq9mp2A2-EQSS0oWKfL1DVZf3x5Hx-/preview' },
      { titulo: 'Baja 4° Trimestre, Impresión Inventario (2024)', enlace: 'https://drive.google.com/file/d/1salQ1o_NLUiT8W8AMGEqiSu5j48N4I2O/preview' },
    ],
  },
}

export const DEFAULT_GOBIERNO_ABIERTO_SUBPAGES = {
  boletines: { header: { title: 'Sistema de', highlight: 'Boletines Oficiales', description: 'Accede a los boletines oficiales de la Municipalidad de Eldorado' }, items: BOLETINES_OFICIALES },
  finanzas: { header: { title: 'Informacion de', highlight: 'Finanzas Publicas', description: 'Accede a la información detallada sobre las finanzas públicas de la Municipalidad de Eldorado, incluyendo ordenanzas presupuestarias, inventarios de bienes y balancetes trimestrales.' }, categories: FINANZAS_PUBLICAS_DATA[0]?.cards || [], detalles: FINANZAS_DETALLES },
  balancetes: { header: { title: 'Balancetes', highlight: 'Trimestrales', description: 'Ejecución presupuestaria, Deuda Pública, Coparticipación, Resultado del Ejercicio' }, data: BALANCETES_DATA },
  tributos: { header: { title: 'Consolidado de', highlight: 'Tributos', description: 'Accede a la información consolidada de tributos municipales, incluyendo datos detallados sobre impuestos, tasas y contribuciones. Esta sección proporciona una visión clara y actualizada de las obligaciones tributarias para ciudadanos y empresas, facilitando el cumplimiento y promoviendo la transparencia en la gestión fiscal del municipio.' }, rows: TRIBUTOS_RECAUDACION_DATA, totals: TRIBUTOS_TOTALES },
  resumenConsolidado: { data: RESUMEN_CONSOLIDADO },
  organigrama: { header: { title: 'Organigrama', highlight: 'Municipal', description: 'Estructura organizativa del municipio' }, sections: ORGANIGRAMA_SECCIONES },
  plantaPersonal: { header: { title: 'Planta de', highlight: 'Personal', description: 'Planta de personal por área, identificado en cantidades y por categorias' }, data: PLANTA_PERSONAL_DATA },
  escalaSalarial: { header: { title: 'Escala', highlight: 'Salarial', description: 'Escala salarial vigente del municipio ( Enero 2025 )' }, data: ESCALA_SALARIAL_DATA },
  audiencias: { header: { title: 'Registro Único', highlight: 'de Audiencias', description: 'Audiencias de gestión de interés público — Registro actualizado de reuniones mantenidas por las autoridades municipales con ciudadanos e instituciones.' }, years: { 2025: AUDIENCIAS_2025, 2026: AUDIENCIAS_2026 } },
}

const gabineteSections = [
  ...SECRETARIA_GOBIERNO,
  ...SECRETARIA_PRODUCCION,
  ...SECRETARIA_AMBIENTE,
  ...SECRETARIA_HACIENDA,
  ...SECRETARIA_OBRAS_PUBLICAS,
  ...SECRETARIA_ACCION_SOCIAL,
]

export const DEFAULT_GABINETE_MUNICIPAL_CONTENT = {
  header: {
    title: 'Gabinete',
    highlight: 'Municipal',
    description: '',
  },
  sections: gabineteSections,
}

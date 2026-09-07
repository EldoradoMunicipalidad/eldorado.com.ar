// Base de conocimiento para URU — asistente virtual de la Municipalidad de Eldorado
// URU SOLO debe usar información del sitio web oficial: eldorado.gob.ar
// NO debe inventar, completar ni asumir datos que no estén en el sitio.

// Estos módulos son las fuentes que renderizan las páginas públicas. Se mantienen
// en un índice local para que URU pueda recuperar información concreta de cualquier
// sección sin depender de que el modelo conozca el código fuente.
import * as barrios from './barriosSectionData';
import * as buses from './busEldoradoData';
import * as contacto from './contactoSectionData';
import * as ciudad from './Ciudad/ciudadData';
import * as ciudadanoDigital from './CiudadanoDigital/ciudadanoDigitalData';
import * as eldorado from './eldoradoSectionsData';
import * as escudo from './escudoAndInsigniasData';
import * as gobierno from './Gobierno/gobiernoData';
import * as gabinete from './Gobierno/gabineteMunicipalData';
import * as intendencia from './Gobierno/intendenciaData';
import * as secretarias from './Gobierno/secretariasData';
import * as secretariasCards from './Gobierno/secretariasCards';
import * as gobiernoAbierto from './GobiernoAbierto/gobiernoAbiertoData';
import * as audiencias from './GobiernoAbierto/audienciasData';
import * as balancetes from './GobiernoAbierto/balancetesData';
import * as boletin from './GobiernoAbierto/boletinosData';
import * as escalaSalarial from './GobiernoAbierto/escalaSalarialData';
import * as licitaciones from './GobiernoAbierto/licitacionesData';
import * as organigrama from './GobiernoAbierto/organigramaData';
import * as plantaPersonal from './GobiernoAbierto/plantaPersonalData';
import * as resumen from './GobiernoAbierto/resumenConsolidadoData';
import * as tributos from './GobiernoAbierto/tributosData';
import * as guia from './guiaDeTramitesData';
import * as navigation from './navigationData';
import * as telefonos from './telefonosUtilesData';
import * as preinscripcion from './preinscripcionFieldsConfig';

export const uruKnowledge = `
SITIO WEB OFICIAL: eldorado.gob.ar

AUTORIDADES MUNICIPALES PUBLICADAS EN EL SITIO:
- El intendente de la Ciudad de Eldorado es el Dr. Rodrigo Durán: /gobierno/intendencia/autoridad/intendente
- La viceintendenta de la Ciudad de Eldorado es la Dra. Lorena Cardozo: /gobierno/intendencia/autoridad/viceintendente
- La información del gabinete municipal está en: /gobierno/intendencia/gabinete-municipal

SECCIONES DEL SITIO (usar estas rutas para orientar al usuario):
- / : Inicio — noticias, servicios destacados
- /ciudad/eldorado : Información de la ciudad
- /ciudad/expo-eldorado : Expo Eldorado
- /ciudad/bus-eldorado : Horarios de colectivos
- /ciudad/telefonos-utiles : Teléfonos útiles
- /ciudad/barrios : Barrios y mapas
- /gobierno/intendencia : Autoridades municipales
- /gobierno/secretaria-gobierno : Secretaría de Gobierno
- /gobierno/secretaria-hacienda : Secretaría de Hacienda
- /gobierno/secretaria-accion-social : Secretaría de Acción Social
- /gobierno/secretaria-de-obras-y-servicios-publicos : Obras y Servicios Públicos
- /gobierno/secretaria-de-ambiente : Secretaría de Ambiente
- /gobierno/secretaria-de-produccion : Secretaría de Producción
- /gobierno-abierto/balancetes-trimestrales : Balances financieros
- /gobierno-abierto/tributos : Tributos municipales
- /gobierno-abierto/licitaciones : Licitaciones públicas
- /gobierno-abierto/organigrama : Estructura municipal
- /gobierno-abierto/planta-personal : Planta de personal
- /gobierno-abierto/escala-salarial : Escala salarial
- /gobierno-abierto/boletin-oficial : Boletín oficial
- /gobierno-abierto/registro-audiencias : Registro de audiencias
- /ciudadano-digital/reclamos : Reclamos ciudadanos
- /ciudadano-digital/preinscripcion-comercial : Habilitación comercial
- /ciudadano-digital/reclamos/seguimiento : Seguimiento de reclamos

CATÁLOGO COMPLETO DE RUTAS PÚBLICAS:
- Estos enlaces son rutas válidas del sitio y sirven para orientar al ciudadano. El catálogo no contiene por sí solo requisitos ni horarios.
- /
- /ciudad
- /ciudad/barrios
- /ciudad/bus-eldorado
- /ciudad/carta-organica
- /ciudad/contacto
- /ciudad/eldorado
- /ciudad/escudo-e-insignias
- /ciudad/expo-eldorado
- /ciudad/simbolos
- /ciudad/telefonos-utiles
- /ciudadano-digital
- /ciudadano-digital/preinscripcion-comercial
- /ciudadano-digital/reclamos
- /ciudadano-digital/reclamos/seguimiento
- /empleado-municipal
- /gobierno
- /gobierno-abierto
- /gobierno-abierto/balancetes-trimestrales
- /gobierno-abierto/boletin-oficial
- /gobierno-abierto/escala-salarial
- /gobierno-abierto/finanzas-publicas
- /gobierno-abierto/licitaciones
- /gobierno-abierto/organigrama
- /gobierno-abierto/planta-personal
- /gobierno-abierto/registro-audiencias
- /gobierno-abierto/tributos
- /gobierno/intendencia
- /gobierno/intendencia/gabinete-municipal
- /gobierno/juzgado-de-faltas
- /gobierno/secretaria-accion-social
- /gobierno/secretaria-accion-social/accion-social
- /gobierno/secretaria-accion-social/accion-social/centro-de-dia
- /gobierno/secretaria-accion-social/accion-social/cic
- /gobierno/secretaria-accion-social/accion-social/dto-asistencia-social
- /gobierno/secretaria-accion-social/accion-social/dto-ninez-y-adolescencia
- /gobierno/secretaria-accion-social/accion-social/guarderias
- /gobierno/secretaria-accion-social/adultos-mayores
- /gobierno/secretaria-accion-social/ninez-y-adolescencia
- /gobierno/secretaria-accion-social/regularizacion-dominial-tierras
- /gobierno/secretaria-accion-social/relaciones-comunidad
- /gobierno/secretaria-de-ambiente
- /gobierno/secretaria-de-ambiente/ambiente
- /gobierno/secretaria-de-ambiente/bromatologia-y-zoonosis
- /gobierno/secretaria-de-ambiente/observatorio-ambiental
- /gobierno/secretaria-de-ambiente/programas
- /gobierno/secretaria-de-obras-y-servicios-publicos
- /gobierno/secretaria-de-obras-y-servicios-publicos/mantenimiento-y-servicios
- /gobierno/secretaria-de-obras-y-servicios-publicos/mantenimiento-y-servicios/dto-limpieza-y-servicios
- /gobierno/secretaria-de-obras-y-servicios-publicos/mantenimiento-y-servicios/dto-parquizacion-y-espacios-verdes
- /gobierno/secretaria-de-obras-y-servicios-publicos/mantenimiento-y-servicios/dto-poda-y-arbolado
- /gobierno/secretaria-de-obras-y-servicios-publicos/obras-publicas
- /gobierno/secretaria-de-obras-y-servicios-publicos/obras-publicas/dto-ejecucion-obras
- /gobierno/secretaria-de-obras-y-servicios-publicos/obras-publicas/dto-produccion-y-materiales
- /gobierno/secretaria-de-obras-y-servicios-publicos/planeamiento
- /gobierno/secretaria-de-obras-y-servicios-publicos/planeamiento/turnero
- /gobierno/secretaria-de-obras-y-servicios-publicos/planta-asfaltica
- /gobierno/secretaria-de-obras-y-servicios-publicos/planta-hormigon
- /gobierno/secretaria-de-produccion
- /gobierno/secretaria-de-produccion/integracion-productiva
- /gobierno/secretaria-de-produccion/produccion-y-desarrollo-sostenible
- /gobierno/secretaria-gobierno
- /gobierno/secretaria-gobierno/asuntos-juridicos
- /gobierno/secretaria-gobierno/comunicacion-e-imagen-institucional
- /gobierno/secretaria-gobierno/cultura-y-educacion
- /gobierno/secretaria-gobierno/deportes-y-recreacion
- /gobierno/secretaria-gobierno/desarrollo-e-integracion-regional
- /gobierno/secretaria-gobierno/diseno-textil-reciclado-y-produccion-local
- /gobierno/secretaria-gobierno/juventud
- /gobierno/secretaria-gobierno/parque-industrial
- /gobierno/secretaria-gobierno/polo-academico
- /gobierno/secretaria-gobierno/proteccion-civil
- /gobierno/secretaria-gobierno/recursos-humanos
- /gobierno/secretaria-gobierno/transito-y-transporte
- /gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias
- /gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias/escuela-manejo
- /gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias/escuela-manejo/turnero
- /gobierno/secretaria-gobierno/transito-y-transporte/registro-vehiculos
- /gobierno/secretaria-gobierno/transito-y-transporte/registro-vehiculos/colectivo
- /gobierno/secretaria-gobierno/transito-y-transporte/registro-vehiculos/transporte-especializado
- /gobierno/secretaria-gobierno/transito-y-transporte/transporte
- /gobierno/secretaria-hacienda
- /gobierno/secretaria-hacienda/contabilidad-general
- /gobierno/secretaria-hacienda/control-y-gestion
- /gobierno/secretaria-hacienda/rentas-generales
- /gobierno/secretaria-obras-publicas
- /gobierno/secretaria-obras-publicas/mantenimiento-y-servicios
- /gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-limpieza-y-servicios
- /gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-parquizacion-y-espacios-verdes
- /gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-poda-y-arbolado
- /gobierno/secretaria-obras-publicas/obras-publicas
- /gobierno/secretaria-obras-publicas/obras-publicas/dto-ejecucion-obras
- /gobierno/secretaria-obras-publicas/obras-publicas/dto-produccion-y-materiales
- /gobierno/secretaria-obras-publicas/planeamiento
- /gobierno/secretaria-obras-publicas/planeamiento/turnero
- /gobierno/secretaria-obras-publicas/planta-asfaltica
- /gobierno/secretaria-obras-publicas/planta-hormigon
- /guia-de-tramites

INFORMACIÓN ESTÁTICA PUBLICADA EN EL SITIO:
- La página de Eldorado describe a la ciudad sobre la Ruta Nacional 12, con una distancia aproximada de 200 km a Posadas y 100 km a Puerto Iguazú: /ciudad/eldorado
- La actividad económica incluye explotación forestal, industrialización de productos primarios, agricultura y comercio local: /ciudad/eldorado
- Atractivos mencionados por el sitio: Parque Schwelm, vivero municipal, Plazoleta de las Naciones, campings y saltos de la zona: /ciudad/eldorado

GUÍA DE TRÁMITES PUBLICADA:
- Automotor: consulta de patente IPA, baja y alta de automotor: /guia-de-tramites
- Licencias de conducir: charla, CENAT, obtención, renovación y ampliación de categorías: /guia-de-tramites
- Transporte: habilitación, baja, renovación, cambio de unidad y transferencia de licencia de taxi: /guia-de-tramites
- Zoonosis: esterilización de animales y denuncia por mordedura: /guia-de-tramites
- Habilitaciones y Bromatología: carnet de manipulador de alimentos, cursos, renovación e informes de habilitación comercial: /guia-de-tramites
- Ambiente: denuncias relacionadas con ambiente: /guia-de-tramites
- Obras Particulares: conexión de energía, certificados de obra y presentación de documentación técnica: /guia-de-tramites
- Polo Académico: becas, albergues, residencias, fotocopias, orientación vocacional y tarjetas universitarias: /guia-de-tramites
- Juzgado de Faltas: pago voluntario, descargo, libre de multas, turnos y restitución de licencia o vehículo: /gobierno/juzgado-de-faltas
- Proveedores: solicitud de inscripción al Registro de Proveedores: /guia-de-tramites

CONTACTOS MUNICIPALES PUBLICADOS:
- Secretaría de Gobierno: 03751 - 426470. Mesa de Entrada: 03751 - 421787 / 421153.
- Juzgado de Faltas: 03751 - 420521. Secretaría de Acción Social: 03751 - 427484.
- Secretaría de Obras Públicas: 03751 - 430101. Dirección de Tránsito Km 11: 03751 - 424276.
- Saneamiento Ambiental: 03751 - 432121. Centro de Zoonosis: 03751 - 430926.
- Oficina de Empleo: 03751 - 421600. Concejo Deliberante: 03751 - 424340.
- Verificá teléfonos, direcciones y horarios en /ciudad/contacto y /ciudad/telefonos-utiles antes de presentarlos como vigentes.

FUENTES DINÁMICAS:
- El contenido editable de páginas y del inicio se consulta desde el servidor municipal.
- Las licitaciones vigentes se consultan desde /api/licitaciones y se muestran en /gobierno-abierto/licitaciones.

TRÁMITES PRINCIPALES:
- Turnero de Planeamiento: /gobierno/secretaria-de-obras-y-servicios-publicos/planeamiento/turnero
- Preinscripción Comercial: /ciudadano-digital/preinscripcion-comercial
- Reclamos: /ciudadano-digital/reclamos
- Bolsa de Empleo: Linked desde el sitio

NOTICIAS: prensa.eldorado.gob.ar

URU NO DEBE inventar teléfonos, direcciones, horarios ni datos de contacto. Solo debe indicar las rutas del sitio donde el usuario puede encontrar esa información.
`;

const SITE_DATASETS = [
  ['Ciudad y barrios', ciudad, barrios, eldorado, escudo],
  ['Contacto y teléfonos', contacto, telefonos],
  ['Transporte y colectivos', buses],
  ['Gobierno e intendencia', gobierno, intendencia, gabinete, secretarias, secretariasCards],
  ['Gobierno Abierto', gobiernoAbierto, audiencias, balancetes, boletin, escalaSalarial, licitaciones, organigrama, plantaPersonal, resumen, tributos],
  ['Ciudadano Digital y trámites', ciudadanoDigital, guia, preinscripcion],
  ['Navegación pública', navigation],
];

const OMITTED_DATA_KEYS = /^(image|imageSrc|icon|icono|logo|svg|base64|password|token|secret|privateKey|credential)$/i;

function flattenSiteData(value, path = [], output = []) {
  if (value === null || value === undefined || typeof value === 'function') return output;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const text = String(value).trim();
    if (text) output.push(`${path.join(' › ')}: ${text}`);
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenSiteData(item, [...path, `elemento ${index + 1}`], output));
    return output;
  }
  Object.entries(value).forEach(([key, child]) => {
    if (OMITTED_DATA_KEYS.test(key)) return;
    flattenSiteData(child, [...path, key], output);
  });
  return output;
}

function buildSiteDocuments() {
  const documents = [];
  SITE_DATASETS.forEach(([group, ...modules]) => {
    const lines = [];
    modules.forEach(module => {
      Object.entries(module).forEach(([exportName, value]) => {
        flattenSiteData(value, [exportName], lines);
      });
    });
    const text = lines.join('\n');
    // Fragmentar evita que una tabla grande (audiencias, colectivos, etc.)
    // desplace del contexto los datos relevantes de otra sección.
    for (let start = 0; start < text.length; start += 6000) {
      documents.push({
        group,
        content: text.slice(start, start + 6000),
      });
    }
  });
  return documents;
}

const SITE_DOCUMENTS = buildSiteDocuments();
const QUERY_STOP_WORDS = new Set([
  'para', 'como', 'cómo', 'donde', 'dónde', 'queda', 'hay', 'que', 'qué', 'del', 'los',
  'las', 'una', 'uno', 'por', 'con', 'sobre', 'este', 'esta', 'ese', 'esa', 'puedo',
  'quiero', 'necesito', 'saber', 'decime', 'decir', 'hola', 'sitio', 'municipalidad',
]);

function normalizeQuery(value) {
  return String(value || '')
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function queryTokens(value) {
  return normalizeQuery(value)
    .split(/[^a-z0-9]+/)
    .filter(token => token.length >= 3 && !QUERY_STOP_WORDS.has(token));
}

function scoreDocument(document, tokens, normalizedPage) {
  const haystack = normalizeQuery(`${document.group} ${document.content}`);
  let score = 0;
  tokens.forEach(token => {
    const occurrences = haystack.split(token).length - 1;
    score += Math.min(occurrences, 5) * (token.length >= 6 ? 3 : 1);
  });
  if (normalizedPage && haystack.includes(normalizedPage.replace(/^\//, ''))) score += 8;
  return score;
}

// Devuelve el resumen estable más los fragmentos de datos del sitio relevantes
// para la pregunta. El límite permite respetar la ventana de contexto del modelo.
export function getUruContext(question, page = '') {
  const tokens = queryTokens(question);
  const normalizedPage = normalizeQuery(page);
  const ranked = SITE_DOCUMENTS
    .map((document, index) => ({ document, index, score: scoreDocument(document, tokens, normalizedPage) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    // El resumen estable ocupa parte del límite del backend; tres fragmentos
    // de 6.000 caracteres dejan margen para que no se corte el contexto.
    .slice(0, 3)
    .filter(item => item.score > 0 || tokens.length === 0);

  const retrieved = ranked.map(({ document }) =>
    `FUENTE PÚBLICA: ${document.group}\n${document.content}`
  ).join('\n\n');
  return [uruKnowledge, retrieved && `DATOS ESTRUCTURADOS DEL SITIO (recuperados por relevancia):\n${retrieved}`]
    .filter(Boolean)
    .join('\n\n');
}

export const uruKnowledgeDocumentCount = SITE_DOCUMENTS.length;

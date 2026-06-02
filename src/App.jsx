import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './assets/components/Header/Navbar'
import {
  HomePage,
  NotFound,
  EldoradoPage,
  SimbolosPage,
  BarriosPage,
  CartaOrganicaPage,
  ContactoPage,
  TelefonosUtilesPage,
  IntendenciaPage,
  SecretariaDeAccionSocialPage,
  SecretariaDeAmbientePage,
  SecretariaDeGobiernoPage,
  SecretariaDeHaciendaPage,
  SecretariaDeObrasPublicasPage,
  SecretariaDeProduccionPage,
  JuzgadoDeFaltasPage,
  AutoridadDetallePage,
  CiudadanoDigitalPage,
  GobiernoAbiertoPage,
  GabineteMunicipalPage,
  DirAsuntosJuridicosPage,
  DirComunicacionAndImagenInstitucionalPage,
  DirCulturaAndEducacionPage,
  DirDeportesAndRecreacionPage,
  DirDesarrolloAndIntegracionRegionalPage,
  DirDiseñoTextilRecicladoAndProduccionLocalPage,
  DirJuventudPage,
  DirProteccionCivilPage,
  DirRecursosHumanosPage,
  DirTransitoAndTransportePage,
  ParqueIndustrialPage,
  PoloAcademicoPage,
  DirContabilidadGeneralPage,
  DirControlAndGestionPage,
  DirRentasGeneralesPage,
  DirAccionSocialPage,
  DirAdultosMayoresPage,
  DirNiñezAndAdolescenciaPage,
  DirRegularizacionDominialTierrasPage,
  RelacionesComunidadPage,
  DirMantenimientoAndServiciosPage,
  DirObrasPublicasPage,
  DirPlaneamientoPage,
  PlantaAsfalticaPage,
  PlantaHormigonPage,
  DirAmbientePage,
  DirBromatologiaAndZoonosisPage,
  ProgramasPage,
  ObservatorioAmbientalPage,
  DirIntegracionProductivaPage,
  DirProduccionAndDesarrolloSosteniblePage,
  CentroEmisionLicenciasPage,
  TransportePage,
  DtoAsistenciaSocial,
  CentroDeDia,
  CIC,
  DtoNiñezAndAdolescencia,
  Guarderias,
  DtoProduccionAndMaterialesPage, 
  DtoEjecucionObrasPage,
  DtoLimpiezaAndServiciosPage,
  DtoParquizacionAndEspaciosVerdesPage,
  DtoPodaAndArboladoPage,
  BoletinOficialPage,
  FinanzasPublicasPage,
  TributosPage,
  LicitacionesPage,
  OrganigramaPage,
  PlantaPersonalPage,
  EscalaSalarialPage,
  EmpleadoMunicipalPage

} from './pages/Index.jsx';
import { allNavigationLinks } from './data/navigationData' // Importamos la unión de links
import Breadcrumbs from './assets/components/Header/Breadcrumbs'
import ScrollToHash from '../src/assets/components/ScrollToHash'
import { Footer } from './assets/components/Footer/Footer'

function App() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Contenedor para empujar el footer */}
      <Navbar />
      <Breadcrumbs allLinks={allNavigationLinks} />
      <ScrollToHash />

      <main className="grow"> {/* Este main ocupa el espacio disponible */}
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* SECCIÓN CIUDAD */}
          <Route path="/ciudad/eldorado" element={<EldoradoPage />} />
      <Route path="/ciudad/escudo-e-insignias" element={<SimbolosPage />} />
          <Route path="/ciudad/simbolos" element={<SimbolosPage />} />
          <Route path="/ciudad/barrios" element={<BarriosPage />} />
          <Route path="/ciudad/carta-organica" element={<CartaOrganicaPage />} />
          <Route path="/ciudad/contacto" element={<ContactoPage />} />
          <Route path="/ciudad/telefonos-utiles" element={<TelefonosUtilesPage />} />

          {/* SECCIÓN GOBIERNO */}
          <Route path="/gobierno/intendencia" element={<IntendenciaPage />} />
          <Route path="/gobierno/secretaria-accion-social" element={<SecretariaDeAccionSocialPage />} />
          <Route path="/gobierno/secretaria-de-ambiente" element={<SecretariaDeAmbientePage />} />
          <Route path="/gobierno/secretaria-gobierno" element={<SecretariaDeGobiernoPage />} />
          <Route path="/gobierno/secretaria-hacienda" element={<SecretariaDeHaciendaPage />} />
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos" element={<SecretariaDeObrasPublicasPage />} />
          <Route path="/gobierno/secretaria-obras-publicas" element={<SecretariaDeObrasPublicasPage />} />
          <Route path="/gobierno/secretaria-de-produccion" element={<SecretariaDeProduccionPage />} />
          <Route path="/gobierno/juzgado-de-faltas" element={<JuzgadoDeFaltasPage />} />
          <Route path="/gobierno/intendencia/autoridad/:id" element={<AutoridadDetallePage />} />
          <Route path="/gobierno/intendencia/gabinete-municipal" element={<GabineteMunicipalPage />} />

          {/** SECCION GOBIERNO / DEPARTAMENTOS */}
          {/**SEC. GOBIERNO */}
          <Route path="/gobierno/secretaria-gobierno/asuntos-juridicos" element={<DirAsuntosJuridicosPage />} />
          <Route path="/gobierno/secretaria-gobierno/comunicacion-e-imagen-institucional" element={<DirComunicacionAndImagenInstitucionalPage />} />
          <Route path="/gobierno/secretaria-gobierno/cultura-y-educacion" element={<DirCulturaAndEducacionPage />} />
          <Route path="/gobierno/secretaria-gobierno/deportes-y-recreacion" element={<DirDeportesAndRecreacionPage />} />
          <Route path="/gobierno/secretaria-gobierno/desarrollo-e-integracion-regional" element={<DirDesarrolloAndIntegracionRegionalPage />} />
          <Route path="/gobierno/secretaria-gobierno/diseno-textil-reciclado-y-produccion-local" element={<DirDiseñoTextilRecicladoAndProduccionLocalPage />} />
          <Route path="/gobierno/secretaria-gobierno/juventud" element={<DirJuventudPage />} />
          <Route path="/gobierno/secretaria-gobierno/proteccion-civil" element={<DirProteccionCivilPage />} />
          <Route path="/gobierno/secretaria-gobierno/recursos-humanos" element={<DirRecursosHumanosPage />} />
          <Route path="/gobierno/secretaria-gobierno/transito-y-transporte" element={<DirTransitoAndTransportePage />} />
          <Route path="/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias" element={<CentroEmisionLicenciasPage />} />
          <Route path="/gobierno/secretaria-gobierno/transito-y-transporte/transporte" element={<TransportePage />} />
          
          <Route path="/gobierno/secretaria-gobierno/parque-industrial" element={<ParqueIndustrialPage />} />
          <Route path="/gobierno/secretaria-gobierno/polo-academico" element={<PoloAcademicoPage />} />

          {/**SEC. HACIENDA */}
          <Route path="/gobierno/secretaria-hacienda/contabilidad-general" element={<DirContabilidadGeneralPage />} />
          <Route path="/gobierno/secretaria-hacienda/control-y-gestion" element={<DirControlAndGestionPage />} />
          <Route path="/gobierno/secretaria-hacienda/rentas-generales" element={<DirRentasGeneralesPage />} />

          {/**SEC. ACCION SOCIAL */}
          <Route path="/gobierno/secretaria-accion-social/accion-social" element={<DirAccionSocialPage />} />
          <Route path="/gobierno/secretaria-accion-social/adultos-mayores" element={<DirAdultosMayoresPage />} />
          <Route path="/gobierno/secretaria-accion-social/ninez-y-adolescencia" element={<DirNiñezAndAdolescenciaPage />} />
          <Route path="/gobierno/secretaria-accion-social/regularizacion-dominial-tierras" element={<DirRegularizacionDominialTierrasPage />} />
          <Route path="/gobierno/secretaria-accion-social/relaciones-comunidad" element={<RelacionesComunidadPage />} />

          <Route path="/gobierno/secretaria-accion-social/accion-social/dto-asistencia-social" element={<DtoAsistenciaSocial />} />
          <Route path="/gobierno/secretaria-accion-social/accion-social/centro-de-dia" element={<CentroDeDia />} />
          <Route path="/gobierno/secretaria-accion-social/accion-social/cic" element={<CIC />} />
          <Route path="/gobierno/secretaria-accion-social/accion-social/dto-ninez-y-adolescencia" element={<DtoNiñezAndAdolescencia />} />
          <Route path="/gobierno/secretaria-accion-social/accion-social/guarderias" element={<Guarderias />} />

          {/**SEC. OBRAS PUBLICAS */}
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/mantenimiento-y-servicios" element={<DirMantenimientoAndServiciosPage />} />
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/obras-publicas" element={<DirObrasPublicasPage />} />
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/planeamiento" element={<DirPlaneamientoPage />} />
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/planta-asfaltica" element={<PlantaAsfalticaPage />} />
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/planta-hormigon" element={<PlantaHormigonPage />} />
          
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/obras-publicas/dto-ejecucion-obras" element={<DtoEjecucionObrasPage />} />
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/obras-publicas/dto-produccion-y-materiales" element={<DtoProduccionAndMaterialesPage />} />
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/mantenimiento-y-servicios/dto-limpieza-y-servicios" element={<DtoLimpiezaAndServiciosPage />} />
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/mantenimiento-y-servicios/dto-parquizacion-y-espacios-verdes" element={<DtoParquizacionAndEspaciosVerdesPage />} />
          <Route path="/gobierno/secretaria-de-obras-y-servicios-publicos/mantenimiento-y-servicios/dto-poda-y-arbolado" element={<DtoPodaAndArboladoPage />} />

          <Route path="/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios" element={<DirMantenimientoAndServiciosPage />} />
          <Route path="/gobierno/secretaria-obras-publicas/obras-publicas" element={<DirObrasPublicasPage />} />
          <Route path="/gobierno/secretaria-obras-publicas/planeamiento" element={<DirPlaneamientoPage />} />
          <Route path="/gobierno/secretaria-obras-publicas/planta-asfaltica" element={<PlantaAsfalticaPage />} />
          <Route path="/gobierno/secretaria-obras-publicas/planta-hormigon" element={<PlantaHormigonPage />} />
          
          <Route path="/gobierno/secretaria-obras-publicas/obras-publicas/dto-ejecucion-obras" element={<DtoEjecucionObrasPage />} />
          <Route path="/gobierno/secretaria-obras-publicas/obras-publicas/dto-produccion-y-materiales" element={<DtoProduccionAndMaterialesPage />} />
          <Route path="/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-limpieza-y-servicios" element={<DtoLimpiezaAndServiciosPage />} />
          <Route path="/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-parquizacion-y-espacios-verdes" element={<DtoParquizacionAndEspaciosVerdesPage />} />
          <Route path="/gobierno/secretaria-obras-publicas/mantenimiento-y-servicios/dto-poda-y-arbolado" element={<DtoPodaAndArboladoPage />} />

          {/**SEC. AMBIENTE */}
          <Route path="/gobierno/secretaria-de-ambiente/ambiente" element={<DirAmbientePage />} />
          <Route path="/gobierno/secretaria-de-ambiente/bromatologia-y-zoonosis" element={<DirBromatologiaAndZoonosisPage />} />
          <Route path="/gobierno/secretaria-de-ambiente/programas" element={<ProgramasPage />} />
          <Route path="/gobierno/secretaria-de-ambiente/observatorio-ambiental" element={<ObservatorioAmbientalPage />} />


          {/**SEC. PRODUCCION */}
          <Route path="/gobierno/secretaria-de-produccion/integracion-productiva" element={<DirIntegracionProductivaPage />} />
          <Route path="/gobierno/secretaria-de-produccion/produccion-y-desarrollo-sostenible" element={<DirProduccionAndDesarrolloSosteniblePage />} />

          {/* SECCIÓN CIUDADANO DIGITAL */}
          <Route path="/ciudadano-digital" element={<CiudadanoDigitalPage />} />

          {/* SECCIÓN GOBIERNO ABIERTO */}
          <Route path="/gobierno-abierto" element={<GobiernoAbiertoPage />} />
          <Route path="/gobierno-abierto/boletin-oficial" element={<BoletinOficialPage />} />
          <Route path="/gobierno-abierto/finanzas-publicas" element={<FinanzasPublicasPage />} />
          <Route path="/gobierno-abierto/tributos" element={<TributosPage />} />
          <Route path="/gobierno-abierto/licitaciones" element={<LicitacionesPage />} />
          <Route path="/gobierno-abierto/organigrama" element={<OrganigramaPage />} />
          <Route path='/gobierno-abierto/planta-personal' element={<PlantaPersonalPage />} />
          <Route path='/gobierno-abierto/escala-salarial' element={<EscalaSalarialPage />} />
          
          <Route path='/empleado-municipal' element={<EmpleadoMunicipalPage />} />


          {/* Ruta para manejar errores 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer /> {/* Footer integrado al final */}
    </div>
  )
}

export default App

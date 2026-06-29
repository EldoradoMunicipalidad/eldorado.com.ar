// Configuración de campos del formulario de Preinscripción Comercial
// Guardada en localStorage bajo la key 'preinscripcion_fields_config'

export const DEFAULT_FIELDS_CONFIG = {
  // ─── PASO 1: Datos Personales ───
  tipo_persona: {
    step: 1,
    label: "Tipo de Persona",
    type: "select",
    required: true,
    visible: true,
    options: [
      { value: "", label: "Seleccionar..." },
      { value: "fisica", label: "Persona Física" },
      { value: "juridica", label: "Persona Jurídica" },
    ],
    placeholder: null,
    showIf: null, // condicion para mostrar (null = siempre)
  },
  dni: {
    step: 1,
    label: "DNI",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Ej: 12345678",
    showIf: { field: "tipo_persona", value: "fisica" }, // solo para persona física
  },
  cuit_cuil: {
    step: 1,
    label: "CUIT / CUIL",
    type: "text",
    required: true,
    visible: true,
    options: null,
    placeholder: "Ej: 20-12345678-5",
    showIf: null,
  },
  apellido_nombre: {
    step: 1,
    label: "Apellido y Nombre",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Apellido, Nombre",
    showIf: { field: "tipo_persona", value: "fisica" },
  },
  razon_social: {
    step: 1,
    label: "Razón Social",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Nombre de la empresa S.A.",
    showIf: { field: "tipo_persona", value: "juridica" },
  },
  domicilio_real: {
    step: 1,
    label: "Domicilio Real",
    type: "text",
    required: true,
    visible: true,
    options: null,
    placeholder: "Calle y número",
    showIf: null,
  },
  email: {
    step: 1,
    label: "Email",
    type: "email",
    required: true,
    visible: true,
    options: null,
    placeholder: "correo@ejemplo.com",
    showIf: null,
  },
  telefono: {
    step: 1,
    label: "Teléfono",
    type: "tel",
    required: true,
    visible: true,
    options: null,
    placeholder: "Ej: 3755-123456",
    showIf: null,
  },
  // Archivos paso 1
  dni_file: {
    step: 1,
    label: "DNI (file upload)",
    type: "file",
    required: false,
    visible: false, // hidden by default
    options: null,
    showIf: { field: "tipo_persona", value: "fisica" },
  },
  estatuto_file: {
    step: 1,
    label: "Estatuto (file upload)",
    type: "file",
    required: false,
    visible: false,
    options: null,
    showIf: { field: "tipo_persona", value: "juridica" },
  },
  acta_designacion_file: {
    step: 1,
    label: "Acta de Designación (file upload)",
    type: "file",
    required: false,
    visible: false,
    options: null,
    showIf: { field: "tipo_persona", value: "juridica" },
  },

  // ─── PASO 2: Ubicación del Local ───
  seccion: {
    step: 2,
    label: "Sección",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Ej: A",
    showIf: null,
  },
  manzana: {
    step: 2,
    label: "Manzana",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Ej: 12",
    showIf: null,
  },
  parcela: {
    step: 2,
    label: "Parcela",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Ej: 3",
    showIf: null,
  },
  direccion_completa: {
    step: 2,
    label: "Dirección Completa",
    type: "text",
    required: true,
    visible: true,
    options: null,
    placeholder: "Calle y número",
    showIf: null,
  },
  propietario_local: {
    step: 2,
    label: "Propietario del Local",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Nombre del propietario",
    showIf: null,
  },
  barrio: {
    step: 2,
    label: "Barrio",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Nombre del barrio",
    showIf: null,
  },
  documento_propiedad_file: {
    step: 2,
    label: "Documento de Propiedad (file upload)",
    type: "file",
    required: false,
    visible: false,
    options: null,
    showIf: null,
  },
  superficie_cubierta: {
    step: 2,
    label: "Superficie Cubierta (m²)",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Ej: 120",
    showIf: null,
  },
  superficie_semicubierta: {
    step: 2,
    label: "Superficie Semicubierta (m²)",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Ej: 30",
    showIf: null,
  },
  superficie_total: {
    step: 2,
    label: "Superficie Total (m²)",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Ej: 150",
    showIf: null,
  },
  georeferenciacion: {
    step: 2,
    label: "Georreferenciación",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Coordenadas",
    showIf: null,
  },

  // ─── PASO 3: Actividad Comercial ───
  tipo_tramite: {
    step: 3,
    label: "Tipo de Trámite",
    type: "select",
    required: true,
    visible: true,
    options: [
      { value: "", label: "Seleccionar..." },
      { value: "habilitacion", label: "Habilitación" },
      { value: "anexo", label: "Anexo" },
      { value: "traslado", label: "Traslado" },
      { value: "cambio_titular", label: "Cambio de Titular" },
      { value: "cambio_rubro", label: "Cambio de Rubro" },
    ],
    placeholder: null,
    showIf: null,
  },
  categoria: {
    step: 3,
    label: "Categoría",
    type: "select",
    required: true,
    visible: true,
    options: [
      { value: "", label: "Seleccionar..." },
      { value: "servicio", label: "Servicio" },
      { value: "comercial", label: "Comercial" },
      { value: "industrial", label: "Industrial" },
    ],
    placeholder: null,
    showIf: null,
  },
  actividad_principal: {
    step: 3,
    label: "Actividad Principal",
    type: "text",
    required: true,
    visible: true,
    options: null,
    placeholder: "Descripción de la actividad",
    showIf: null,
  },
  actividad_secundaria: {
    step: 3,
    label: "Actividad Secundaria",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Otra actividad (opcional)",
    showIf: null,
  },
  otra_actividad: {
    step: 3,
    label: "Otra Actividad",
    type: "text",
    required: false,
    visible: true,
    options: null,
    placeholder: "Otra actividad (opcional)",
    showIf: null,
  },
  constancia_arca_file: {
    step: 3,
    label: "Constancia ARCA/ATM (file upload)",
    type: "file",
    required: false,
    visible: false,
    options: null,
    showIf: null,
  },
};

// Cargar configuración guardada o usar default
export function loadFieldsConfig() {
  try {
    const saved = localStorage.getItem("preinscripcion_fields_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge con defaults para campos nuevos
      return { ...DEFAULT_FIELDS_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn("Error loading fields config:", e);
  }
  return { ...DEFAULT_FIELDS_CONFIG };
}

// Guardar configuración
export function saveFieldsConfig(config) {
  try {
    localStorage.setItem("preinscripcion_fields_config", JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Error saving fields config:", e);
    return false;
  }
}

// Obtener solo campos visibles de un paso
export function getVisibleFieldsForStep(step, config, formData = {}) {
  return Object.entries(config)
    .filter(([key, field]) => {
      if (field.step !== step) return false;
      if (!field.visible) return false;
      // Evaluar showIf
      if (field.showIf) {
        const { field: condField, value } = field.showIf;
        if (formData[condField] !== value) return false;
      }
      return true;
    })
    .map(([key, field]) => ({ key, ...field }));
}

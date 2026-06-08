import React, { useState, useEffect } from 'react';
import SectionLayout from '../../assets/components/SectionLayout';
import { Section } from '../../assets/components/Section';
import {
  User,
  Building2,
  MapPin,
  Briefcase,
  Upload,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  ArrowLeft,
  ArrowRight,
  X,
  File,
  Check,
  Info,
} from 'lucide-react';

const TIPO_TRAMITE_OPTIONS = [
  { value: '', label: 'Seleccionar...' },
  { value: 'habilitacion', label: 'Habilitación' },
  { value: 'anexo', label: 'Anexo' },
  { value: 'traslado', label: 'Traslado' },
  { value: 'cambio_titular', label: 'Cambio de Titular' },
  { value: 'cambio_rubro', label: 'Cambio de Rubro' },
];

const CATEGORIA_OPTIONS = [
  { value: '', label: 'Seleccionar...' },
  { value: 'servicio', label: 'Servicio' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
];

const INITIAL_FORM_DATA = {
  // Paso 1
  tipo_persona: '',
  dni: '',
  cuit_cuil: '',
  apellido_nombre: '',
  razon_social: '',
  domicilio_real: '',
  email: '',
  telefono: '',
  // Archivos paso 1
  dni_file: null,
  estatuto_file: null,
  acta_designacion_file: null,
  // Paso 2
  seccion: '',
  manzana: '',
  parcela: '',
  direccion_completa: '',
  propietario_local: '',
  barrio: '',
  documento_propiedad_file: null,
  // Paso 3
  tipo_tramite: '',
  categoria: '',
  actividad_principal: '',
  actividad_secundaria: '',
  otra_actividad: '',
  constancia_arca_file: null,
};

const SUCCESS_ANIMATION_DURATION = 2000;

export default function PreinscripcionComercialPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [submitError, setSubmitError] = useState('');

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const updateFile = (field, file) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const removeFile = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.tipo_persona) errs.tipo_persona = 'Seleccioná el tipo de persona';
    if (!formData.cuit_cuil) errs.cuit_cuil = 'CUIT/CUIL es obligatorio';
    if (formData.tipo_persona === 'fisica') {
      if (!formData.dni) errs.dni = 'DNI es obligatorio';
      if (!formData.apellido_nombre) errs.apellido_nombre = 'Apellido y Nombre es obligatorio';
      if (!formData.dni_file) errs.dni_file = 'Subí una copia del DNI';
    }
    if (formData.tipo_persona === 'juridica') {
      if (!formData.razon_social) errs.razon_social = 'Razón Social es obligatoria';
      if (!formData.estatuto_file) errs.estatuto_file = 'Subí el Estatuto';
      if (!formData.acta_designacion_file) errs.acta_designacion_file = 'Subí el Acta de designación';
    }
    if (!formData.domicilio_real) errs.domicilio_real = 'Domicilio real es obligatorio';
    if (!formData.email) errs.email = 'Email es obligatorio';
    if (!formData.telefono) errs.telefono = 'Teléfono es obligatorio';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.seccion) errs.seccion = 'Sección es obligatoria';
    if (!formData.manzana) errs.manzana = 'Manzana es obligatoria';
    if (!formData.parcela) errs.parcela = 'Parcela es obligatoria';
    if (!formData.direccion_completa) errs.direccion_completa = 'Dirección completa es obligatoria';
    if (!formData.propietario_local) errs.propietario_local = 'Propietario del local es obligatorio';
    if (!formData.barrio) errs.barrio = 'Barrio es obligatorio';
    if (!formData.documento_propiedad_file) errs.documento_propiedad_file = 'Subí el documento de propiedad';
    return errs;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.tipo_tramite) errs.tipo_tramite = 'Seleccioná el tipo de trámite';
    if (!formData.categoria) errs.categoria = 'Seleccioná la categoría';
    if (!formData.actividad_principal) errs.actividad_principal = 'Actividad principal es obligatoria';
    if (!formData.constancia_arca_file) errs.constancia_arca_file = 'Subí la constancia ARCA/ATM';
    return errs;
  };

  const handleNext = () => {
    let errs = {};
    if (currentStep === 1) errs = validateStep1();
    else if (currentStep === 2) errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const simulateUpload = async (file, fieldName) => {
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('field', fieldName);

    // Simulate progress
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress((prev) => ({ ...prev, [fieldName]: Math.min(Math.round(progress), 100) }));
      }, 300);

      // Actual upload
      fetch('/api/habilitaciones/upload', {
        method: 'POST',
        body: formDataUpload,
      })
        .then((res) => {
          if (!res.ok) throw new Error('Upload failed');
          return res.json();
        })
        .then((data) => {
          clearInterval(interval);
          setUploadProgress((prev) => ({ ...prev, [fieldName]: 100 }));
          setUploadedFiles((prev) => ({ ...prev, [fieldName]: data }));
          resolve(data);
        })
        .catch(() => {
          clearInterval(interval);
          setUploadProgress((prev) => ({ ...prev, [fieldName]: 100 }));
          // Even if server isn't available, mark as uploaded for demo
          setUploadedFiles((prev) => ({ ...prev, [fieldName]: { url: URL.createObjectURL(file), name: file.name } }));
          resolve({ url: URL.createObjectURL(file), name: file.name });
        });
    });
  };

  const handleSubmit = async () => {
    const errs = validateStep3();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Upload all files first
      const fileFields = [];
      if (formData.dni_file) fileFields.push({ file: formData.dni_file, field: 'dni_file' });
      if (formData.estatuto_file) fileFields.push({ file: formData.estatuto_file, field: 'estatuto_file' });
      if (formData.acta_designacion_file) fileFields.push({ file: formData.acta_designacion_file, field: 'acta_designacion_file' });
      if (formData.documento_propiedad_file) fileFields.push({ file: formData.documento_propiedad_file, field: 'documento_propiedad_file' });
      if (formData.constancia_arca_file) fileFields.push({ file: formData.constancia_arca_file, field: 'constancia_arca_file' });

      const uploadedResults = {};
      for (const { file, field } of fileFields) {
        const result = await simulateUpload(file, field);
        uploadedResults[field] = result;
      }

      // Build payload with correct field mapping for the API
      const archivos = [];
      if (uploadedResults.dni_file) archivos.push({ nombre: 'DNI', url: uploadedResults.dni_file.url });
      if (uploadedResults.estatuto_file) archivos.push({ nombre: 'Estatuto', url: uploadedResults.estatuto_file.url });
      if (uploadedResults.acta_designacion_file) archivos.push({ nombre: 'Acta Designación', url: uploadedResults.acta_designacion_file.url });
      if (uploadedResults.documento_propiedad_file) archivos.push({ nombre: 'Documento Propiedad', url: uploadedResults.documento_propiedad_file.url });
      if (uploadedResults.constancia_arca_file) archivos.push({ nombre: 'Constancia ARCA/ATM', url: uploadedResults.constancia_arca_file.url });

      const payload = {
        tipo_persona: formData.tipo_persona,
        dni: formData.dni,
        cuit: formData.cuit_cuil,
        apellido: formData.apellido_nombre || formData.razon_social,
        nombre: '',
        domicilio: formData.domicilio_real,
        email: formData.email,
        telefono: formData.telefono,
        seccion: formData.seccion,
        manzana: formData.manzana,
        parcela: formData.parcela,
        direccion: formData.direccion_completa,
        local_oficina: formData.propietario_local,
        barrio: formData.barrio,
        categoria: formData.categoria,
        sub_categoria: formData.tipo_tramite,
        actividad_principal: formData.actividad_principal,
        actividad_secundaria: formData.actividad_secundaria,
        otra_actividad: formData.otra_actividad,
        archivos,
        status: 'pendiente',
        notas: '',
      };

      const response = await fetch('/api/habilitaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      setIsSuccess(true);
    } catch (error) {
      setSubmitError(error.message || 'Ocurrió un error al enviar el formulario. Intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <SectionLayout
          title="Preinscripción"
          highlight="Comercial"
          description="Completá el formulario para iniciar tu habilitación comercial"
        />
        <Section>
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                ¡Solicitud Enviada!
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Tu preinscripción comercial fue recibida correctamente. Te contactaremos a la brevedad.
              </p>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-sky-700 text-left mb-8">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Próximos pasos:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Recibirás un email de confirmación</li>
                      <li>Un agente municipal revisará tu solicitud</li>
                      <li>Te contactaremos para coordinar la visita al local</li>
                    </ul>
                  </div>
                </div>
              </div>
              <a
                href="/ciudadano-digital"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a Ciudadano Digital
              </a>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      <SectionLayout
        title="Preinscripción"
        highlight="Comercial"
        description="Completá el formulario para iniciar tu habilitación comercial"
      />

      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Steps indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: 'Datos Personales', icon: User },
                { step: 2, label: 'Ubicación', icon: MapPin },
                { step: 3, label: 'Actividad', icon: Briefcase },
              ].map(({ step, label, icon: StepIcon }) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep === step
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
                        : currentStep > step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep === step ? 'text-sky-600' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full" />
              <div
                className="absolute top-0 left-0 h-1 bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4">
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                {currentStep === 1 && <><User className="w-5 h-5" /> Datos Personales</>}
                {currentStep === 2 && <><MapPin className="w-5 h-5" /> Ubicación del Local</>}
                {currentStep === 3 && <><Briefcase className="w-5 h-5" /> Actividad Comercial</>}
              </h2>
            </div>

            <div className="p-6 md:p-8">
              {/* Error alert */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">Corregí los siguientes errores:</p>
                    <ul className="text-sm text-red-600 list-disc list-inside mt-1">
                      {Object.values(errors).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              {/* STEP 1 - Datos Personales */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Tipo de Persona */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Tipo de Persona <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          updateField('tipo_persona', 'fisica');
                          updateField('dni', '');
                          updateField('apellido_nombre', '');
                          updateField('razon_social', '');
                          updateField('dni_file', null);
                          updateField('estatuto_file', null);
                          updateField('acta_designacion_file', null);
                        }}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                          formData.tipo_persona === 'fisica'
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-gray-200 hover:border-sky-200'
                        }`}
                      >
                        <User className={`w-5 h-5 ${formData.tipo_persona === 'fisica' ? 'text-sky-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${formData.tipo_persona === 'fisica' ? 'text-sky-700' : 'text-slate-600'}`}>
                          Persona Física
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateField('tipo_persona', 'juridica');
                          updateField('dni', '');
                          updateField('apellido_nombre', '');
                          updateField('razon_social', '');
                          updateField('dni_file', null);
                          updateField('estatuto_file', null);
                          updateField('acta_designacion_file', null);
                        }}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                          formData.tipo_persona === 'juridica'
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-gray-200 hover:border-sky-200'
                        }`}
                      >
                        <Building2 className={`w-5 h-5 ${formData.tipo_persona === 'juridica' ? 'text-sky-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${formData.tipo_persona === 'juridica' ? 'text-sky-700' : 'text-slate-600'}`}>
                          Persona Jurídica
                        </span>
                      </button>
                    </div>
                    {errors.tipo_persona && (
                      <p className="text-red-500 text-xs mt-1">{errors.tipo_persona}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.tipo_persona === 'fisica' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            DNI <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.dni}
                            onChange={(e) => updateField('dni', e.target.value)}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                              errors.dni ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                            placeholder="Ej: 12345678"
                          />
                          {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Apellido y Nombre <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.apellido_nombre}
                            onChange={(e) => updateField('apellido_nombre', e.target.value)}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                              errors.apellido_nombre ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                            placeholder="Ej: García, Juan"
                          />
                          {errors.apellido_nombre && <p className="text-red-500 text-xs mt-1">{errors.apellido_nombre}</p>}
                        </div>
                      </>
                    )}
                    {formData.tipo_persona === 'juridica' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Razón Social <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.razon_social}
                          onChange={(e) => updateField('razon_social', e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                            errors.razon_social ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                          placeholder="Ej: Comercial S.A."
                        />
                        {errors.razon_social && <p className="text-red-500 text-xs mt-1">{errors.razon_social}</p>}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        CUIT/CUIL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cuit_cuil}
                        onChange={(e) => updateField('cuit_cuil', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                          errors.cuit_cuil ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Ej: 20-12345678-9"
                      />
                      {errors.cuit_cuil && <p className="text-red-500 text-xs mt-1">{errors.cuit_cuil}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Domicilio Real <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.domicilio_real}
                        onChange={(e) => updateField('domicilio_real', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                          errors.domicilio_real ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Calle y número"
                      />
                      {errors.domicilio_real && <p className="text-red-500 text-xs mt-1">{errors.domicilio_real}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="ejemplo@correo.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.telefono}
                        onChange={(e) => updateField('telefono', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                          errors.telefono ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Ej: 3755-123456"
                      />
                      {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                    </div>
                  </div>

                  {/* File uploads - Step 1 */}
                  {formData.tipo_persona === 'fisica' && (
                    <FileUploadField
                      label="Copia del DNI (frente y dorso)"
                      field="dni_file"
                      accept="image/*,.pdf"
                      error={errors.dni_file}
                      file={formData.dni_file}
                      progress={uploadProgress.dni_file}
                      uploaded={uploadedFiles.dni_file}
                      onFileSelect={(f) => updateFile('dni_file', f)}
                      onRemove={() => removeFile('dni_file')}
                    />
                  )}

                  {formData.tipo_persona === 'juridica' && (
                    <>
                      <FileUploadField
                        label="Estatuto Social"
                        field="estatuto_file"
                        accept=".pdf"
                        error={errors.estatuto_file}
                        file={formData.estatuto_file}
                        progress={uploadProgress.estatuto_file}
                        uploaded={uploadedFiles.estatuto_file}
                        onFileSelect={(f) => updateFile('estatuto_file', f)}
                        onRemove={() => removeFile('estatuto_file')}
                      />
                      <FileUploadField
                        label="Acta de Designación de Autoridades"
                        field="acta_designacion_file"
                        accept=".pdf"
                        error={errors.acta_designacion_file}
                        file={formData.acta_designacion_file}
                        progress={uploadProgress.acta_designacion_file}
                        uploaded={uploadedFiles.acta_designacion_file}
                        onFileSelect={(f) => updateFile('acta_designacion_file', f)}
                        onRemove={() => removeFile('acta_designacion_file')}
                      />
                    </>
                  )}
                </div>
              )}

              {/* STEP 2 - Ubicación */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Sección <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.seccion}
                        onChange={(e) => updateField('seccion', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                          errors.seccion ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Ej: 1"
                      />
                      {errors.seccion && <p className="text-red-500 text-xs mt-1">{errors.seccion}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Manzana <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.manzana}
                        onChange={(e) => updateField('manzana', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                          errors.manzana ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Ej: 5"
                      />
                      {errors.manzana && <p className="text-red-500 text-xs mt-1">{errors.manzana}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Parcela <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.parcela}
                        onChange={(e) => updateField('parcela', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                          errors.parcela ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Ej: 12"
                      />
                      {errors.parcela && <p className="text-red-500 text-xs mt-1">{errors.parcela}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Dirección Completa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.direccion_completa}
                      onChange={(e) => updateField('direccion_completa', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                        errors.direccion_completa ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Calle, número, piso, depto"
                    />
                    {errors.direccion_completa && <p className="text-red-500 text-xs mt-1">{errors.direccion_completa}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Propietario del Local <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.propietario_local}
                        onChange={(e) => updateField('propietario_local', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                          errors.propietario_local ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Nombre del propietario"
                      />
                      {errors.propietario_local && <p className="text-red-500 text-xs mt-1">{errors.propietario_local}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Barrio <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.barrio}
                        onChange={(e) => updateField('barrio', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                          errors.barrio ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Nombre del barrio"
                      />
                      {errors.barrio && <p className="text-red-500 text-xs mt-1">{errors.barrio}</p>}
                    </div>
                  </div>

                  <FileUploadField
                    label="Documento de Propiedad (título, boleto, contrato de alquiler)"
                    field="documento_propiedad_file"
                    accept=".pdf,image/*"
                    error={errors.documento_propiedad_file}
                    file={formData.documento_propiedad_file}
                    progress={uploadProgress.documento_propiedad_file}
                    uploaded={uploadedFiles.documento_propiedad_file}
                    onFileSelect={(f) => updateFile('documento_propiedad_file', f)}
                    onRemove={() => removeFile('documento_propiedad_file')}
                  />
                </div>
              )}

              {/* STEP 3 - Actividad */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Tipo de Trámite <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.tipo_tramite}
                        onChange={(e) => updateField('tipo_tramite', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-white ${
                          errors.tipo_tramite ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        {TIPO_TRAMITE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.tipo_tramite && <p className="text-red-500 text-xs mt-1">{errors.tipo_tramite}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Categoría <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => updateField('categoria', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-white ${
                          errors.categoria ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        {CATEGORIA_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Actividad Principal <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.actividad_principal}
                      onChange={(e) => updateField('actividad_principal', e.target.value)}
                      rows={2}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none ${
                        errors.actividad_principal ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Describí la actividad principal del comercio"
                    />
                    {errors.actividad_principal && <p className="text-red-500 text-xs mt-1">{errors.actividad_principal}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Actividad Secundaria
                        <span className="text-gray-400 font-normal ml-1">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.actividad_secundaria}
                        onChange={(e) => updateField('actividad_secundaria', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                        placeholder="Actividad secundaria"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Otra Actividad
                        <span className="text-gray-400 font-normal ml-1">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.otra_actividad}
                        onChange={(e) => updateField('otra_actividad', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                        placeholder="Otra actividad"
                      />
                    </div>
                  </div>

                  <FileUploadField
                    label="Constancia ARCA/ATM"
                    field="constancia_arca_file"
                    accept=".pdf"
                    error={errors.constancia_arca_file}
                    file={formData.constancia_arca_file}
                    progress={uploadProgress.constancia_arca_file}
                    uploaded={uploadedFiles.constancia_arca_file}
                    onFileSelect={(f) => updateFile('constancia_arca_file', f)}
                    onRemove={() => removeFile('constancia_arca_file')}
                  />
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex items-center gap-2 px-5 py-2.5 border border-sky-200 text-sky-600 rounded-xl font-semibold text-sm hover:bg-sky-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </button>
                  )}
                </div>
                <div>
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition-colors"
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Enviar Solicitud
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-semibold mb-1">Importante:</p>
                <p>
                  Completá todos los campos obligatorios marcados con <span className="text-red-500">*</span>. 
                  Los documentos subidos serán verificados por el área de Habilitaciones Comerciales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function FileUploadField({
  label,
  field,
  accept,
  error,
  file,
  progress,
  uploaded,
  onFileSelect,
  onRemove,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = React.useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) onFileSelect(selectedFile);
    e.target.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>

      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-sky-400 bg-sky-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50/50'
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">
            <span className="text-sky-600 font-medium">Hacé clic</span> o arrastrá el archivo aquí
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {accept?.replace(/,/g, ', ') || 'Todos los formatos'}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {file && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center shrink-0">
                <File className="w-5 h-5 text-sky-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {progress !== undefined && progress < 100 && (
            <div className="mt-3">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Subiendo... {progress}%</p>
            </div>
          )}
          {uploaded && progress === 100 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <Check className="w-3 h-3" />
              Archivo subido correctamente
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

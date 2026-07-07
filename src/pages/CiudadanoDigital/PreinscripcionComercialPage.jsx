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
import { loadFieldsConfig, getVisibleFieldsForStep } from '../../data/preinscripcionFieldsConfig';

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
  dni_frente_file: null,
  dni_dorso_file: null,
  estatuto_file: null,
  acta_designacion_file: null,
  // Paso 2
  seccion: '',
  manzana: '',
  parcela: '',
  direccion_completa: '',
  propietario_local: '',
  barrio: '',
  documento_propiedad_file: [],
  // Superficie (Paso 2)
  superficie_cubierta: '',
  superficie_semicubierta: '',
  superficie_total: '',
  georeferenciacion: '',
  // Paso 3
  tipo_tramite: '',
  categoria: '',
  actividad_principal: '',
  actividad_secundaria: '',
  otra_actividad: '',
  constancia_arca_file: [],
};

export default function PreinscripcionComercialPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [fieldsConfig, setFieldsConfig] = useState(null);

  // Load config on mount
  useEffect(() => {
    const config = loadFieldsConfig();
    setFieldsConfig(config);
  }, []);

  const getFieldConfig = (fieldKey) => {
    return fieldsConfig ? fieldsConfig[fieldKey] : null;
  };

  const renderTextField = (fieldKey, className = '') => {
    const config = getFieldConfig(fieldKey);
    if (!config || config.type === 'file') return null;
    const label = config.label || fieldKey;
    const placeholder = config.placeholder || '';
    const required = config.required;
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={config.type || 'text'}
          value={formData[fieldKey]}
          onChange={(e) => updateField(fieldKey, e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
            errors[fieldKey] ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          placeholder={placeholder}
        />
        {errors[fieldKey] && <p className="text-red-500 text-xs mt-1">{errors[fieldKey]}</p>}
      </div>
    );
  };

  const renderSelectField = (fieldKey, className = '') => {
    const config = getFieldConfig(fieldKey);
    if (!config || !config.options) return null;
    const label = config.label || fieldKey;
    const required = config.required;
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={formData[fieldKey]}
          onChange={(e) => updateField(fieldKey, e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-white ${
            errors[fieldKey] ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
        >
          {config.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors[fieldKey] && <p className="text-red-500 text-xs mt-1">{errors[fieldKey]}</p>}
      </div>
    );
  };

  const renderTextareaField = (fieldKey, rows = 2, className = '') => {
    const config = getFieldConfig(fieldKey);
    if (!config) return null;
    const label = config.label || fieldKey;
    const placeholder = config.placeholder || '';
    const required = config.required;
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          value={formData[fieldKey]}
          onChange={(e) => updateField(fieldKey, e.target.value)}
          rows={rows}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none ${
            errors[fieldKey] ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          placeholder={placeholder}
        />
        {errors[fieldKey] && <p className="text-red-500 text-xs mt-1">{errors[fieldKey]}</p>}
      </div>
    );
  };

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

  const addFileToArray = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), file],
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const removeFileFromArray = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
    setUploadedFiles((prev) => {
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const validateStep = (step) => {
    if (!fieldsConfig) return {};
    const errs = {};
    const visibleFields = getVisibleFieldsForStep(step, fieldsConfig, formData);

    visibleFields.forEach((field) => {
      // Skip file fields and tipo_persona radio for now (handled specially)
      if (field.type === 'file') return;
      if (field.key === 'tipo_persona') return;

      if (field.required) {
        const value = formData[field.key];
        if (!value || (typeof value === 'string' && !value.trim())) {
          errs[field.key] = `${field.label} es obligatorio`;
        }
      }
    });

    // Handle tipo_persona selection
    if (step === 1) {
      if (!formData.tipo_persona) {
        errs.tipo_persona = 'Seleccioná el tipo de persona';
      }
    }

    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(currentStep);
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

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('FileReader failed'));
      reader.readAsDataURL(file);
    });

  const simulateUpload = async (file, fieldName) => {
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));

    // Simulate progress independently
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const current = prev[fieldName] || 0;
        const next = Math.min(current + Math.random() * 25, 95);
        return { ...prev, [fieldName]: Math.round(next) };
      });
    }, 300);

    let dataUrl;
    try {
      // Try real upload first
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('field', fieldName);
      const res = await fetch('/api/habilitaciones/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (res.ok) {
        const data = await res.json();
        clearInterval(interval);
        setUploadProgress((prev) => ({ ...prev, [fieldName]: 100 }));
        setUploadedFiles((prev) => ({ ...prev, [fieldName]: data }));
        return data;
      }
      throw new Error('Upload server returned ' + res.status);
    } catch {
      // Fallback: read as base64 data URL (persists without server)
      clearInterval(interval);
      try {
        dataUrl = await readFileAsDataURL(file);
      } catch {
        dataUrl = URL.createObjectURL(file);
      }
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 100 }));
      const result = { url: dataUrl, name: file.name };
      setUploadedFiles((prev) => ({ ...prev, [fieldName]: result }));
      return result;
    }
  };

  const handleSubmit = async () => {
    const errs = validateStep(3);
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
      if (formData.dni_frente_file) fileFields.push({ file: formData.dni_frente_file, field: 'dni_frente_file' });
      if (formData.dni_dorso_file) fileFields.push({ file: formData.dni_dorso_file, field: 'dni_dorso_file' });
      if (formData.estatuto_file) fileFields.push({ file: formData.estatuto_file, field: 'estatuto_file' });
      if (formData.acta_designacion_file) fileFields.push({ file: formData.acta_designacion_file, field: 'acta_designacion_file' });
      // Multi-file fields
      const docPropiedadFiles = formData.documento_propiedad_file || [];
      const constanciaArcaFiles = formData.constancia_arca_file || [];

      const uploadedResults = {};
      for (const { file, field } of fileFields) {
        const result = await simulateUpload(file, field);
        uploadedResults[field] = result;
      }
      // Upload multi-file arrays
      const uploadedDocPropiedad = [];
      for (const file of docPropiedadFiles) {
        const result = await simulateUpload(file, 'documento_propiedad_file');
        uploadedDocPropiedad.push(result);
      }
      const uploadedConstanciaArca = [];
      for (const file of constanciaArcaFiles) {
        const result = await simulateUpload(file, 'constancia_arca_file');
        uploadedConstanciaArca.push(result);
      }

      // Build payload with correct field mapping for the API
      const archivos = [];
      if (uploadedResults.dni_frente_file) archivos.push({ nombre: 'DNI Frente', url: uploadedResults.dni_frente_file.url });
      if (uploadedResults.dni_dorso_file) archivos.push({ nombre: 'DNI Dorso', url: uploadedResults.dni_dorso_file.url });
      if (uploadedResults.estatuto_file) archivos.push({ nombre: 'Estatuto', url: uploadedResults.estatuto_file.url });
      if (uploadedResults.acta_designacion_file) archivos.push({ nombre: 'Acta Designación', url: uploadedResults.acta_designacion_file.url });
      uploadedDocPropiedad.forEach((f, i) => archivos.push({ nombre: `Documento Propiedad ${i + 1}`, url: f.url }));
      uploadedConstanciaArca.forEach((f, i) => archivos.push({ nombre: `Constancia ARCA/ATM ${i + 1}`, url: f.url }));

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
        superficie_cubierta: formData.superficie_cubierta,
        superficie_semicubierta: formData.superficie_semicubierta,
        superficie_total: formData.superficie_total,
        georeferenciacion: formData.georeferenciacion,
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
                          updateFile('dni_frente_file', null);
                          updateFile('dni_dorso_file', null);
                          updateFile('estatuto_file', null);
                          updateFile('acta_designacion_file', null);
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
                          updateFile('dni_frente_file', null);
                          updateFile('dni_dorso_file', null);
                          updateFile('estatuto_file', null);
                          updateFile('acta_designacion_file', null);
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
                        {renderTextField('dni', '')}
                        {renderTextField('apellido_nombre', '')}
                      </>
                    )}
                    {formData.tipo_persona === 'juridica' && (
                      <div className="md:col-span-2">
                        {renderTextField('razon_social', '')}
                      </div>
                    )}

                    {renderTextField('cuit_cuil', '')}
                    {renderTextField('domicilio_real', '')}
                    {renderTextField('email', '')}
                    {renderTextField('telefono', '')}
                  </div>

                  {/* File uploads - Step 1 */}
                  {formData.tipo_persona === 'fisica' && (
                    <div className="space-y-4">
                      <FileUploadField
                        label="Copia del DNI - Frente"
                        field="dni_frente_file"
                        accept="image/*,.pdf"
                        error={errors.dni_frente_file}
                        file={formData.dni_frente_file}
                        progress={uploadProgress.dni_frente_file}
                        uploaded={uploadedFiles.dni_frente_file}
                        onFileSelect={(f) => updateFile('dni_frente_file', f)}
                        onRemove={() => removeFile('dni_frente_file')}
                      />
                      <FileUploadField
                        label="Copia del DNI - Dorso"
                        field="dni_dorso_file"
                        accept="image/*,.pdf"
                        error={errors.dni_dorso_file}
                        file={formData.dni_dorso_file}
                        progress={uploadProgress.dni_dorso_file}
                        uploaded={uploadedFiles.dni_dorso_file}
                        onFileSelect={(f) => updateFile('dni_dorso_file', f)}
                        onRemove={() => removeFile('dni_dorso_file')}
                      />
                    </div>
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
                    {renderTextField('seccion', '')}
                    {renderTextField('manzana', '')}
                    {renderTextField('parcela', '')}
                  </div>

                  {renderTextField('direccion_completa', '')}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderTextField('propietario_local', '')}
                    {renderTextField('barrio', '')}
                  </div>

                  <MultiFileUploadField
                    label="Documento de Propiedad (título, contrato de alquiler)"
                    field="documento_propiedad_file"
                    accept=".pdf,image/*"
                    error={errors.documento_propiedad_file}
                    files={formData.documento_propiedad_file || []}
                    uploaded={uploadedFiles.documento_propiedad_file || []}
                    onFileSelect={(f) => addFileToArray('documento_propiedad_file', f)}
                    onRemove={(idx) => removeFileFromArray('documento_propiedad_file', idx)}
                  />

                  {/* Superficie del local */}
                  <div className="border border-gray-100 bg-slate-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-600 mb-3">Superficie del Local</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {renderTextField('superficie_cubierta', '')}
                      {renderTextField('superficie_semicubierta', '')}
                      {renderTextField('superficie_total', '')}
                      {renderTextField('georeferenciacion', '')}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 - Actividad */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelectField('tipo_tramite', '')}
                    {renderSelectField('categoria', '')}
                  </div>

                  {renderTextareaField('actividad_principal', 2, '')}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderTextField('actividad_secundaria', '')}
                    {renderTextField('otra_actividad', '')}
                  </div>

                  <MultiFileUploadField
                    label="Constancia ARCA/ATM"
                    field="constancia_arca_file"
                    accept=".pdf"
                    error={errors.constancia_arca_file}
                    files={formData.constancia_arca_file || []}
                    uploaded={uploadedFiles.constancia_arca_file || []}
                    onFileSelect={(f) => addFileToArray('constancia_arca_file', f)}
                    onRemove={(idx) => removeFileFromArray('constancia_arca_file', idx)}
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
        {label}
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

function MultiFileUploadField({
  label,
  field,
  accept,
  error,
  files,
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
        {label}
      </label>

      {/* List of already selected files */}
      {files.length > 0 && (
        <div className="space-y-2 mb-3">
          {files.map((file, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-3">
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
                  onClick={() => onRemove(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone to add more files */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-sky-400 bg-sky-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50/50'
        }`}
      >
        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">
          <span className="text-sky-600 font-medium">Hacé clic</span> o arrastrá {files.length > 0 ? 'otro ' : 'el '}archivo aquí
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {accept?.replace(/,/g, ', ') || 'Todos los formatos'}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

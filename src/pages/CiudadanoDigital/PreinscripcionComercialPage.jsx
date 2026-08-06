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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = /\.(pdf|jpg|jpeg|png|gif|webp)$/i;

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
  // Ref espejo de uploadedFiles para acceder al valor actual sincrónicamente
  // en handleSubmit (state de React es async; setState no es visible de inmediato).
  const uploadedFilesRef = React.useRef({});
  React.useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);
  const [submitError, setSubmitError] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [fileErrors, setFileErrors] = useState({}); // errores de validación previa por campo
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

  // Valida tipo y tamaño del archivo antes de subirlo.
    // Devuelve { ok: true } o { ok: false, message: '...' }.
    const validateFile = (file) => {
      if (!ALLOWED_EXTENSIONS.test(file.name)) {
        return { ok: false, message: `Tipo no permitido: ${file.name}. Solo PDF, JPG, PNG, GIF o WEBP.` };
      }
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        return { ok: false, message: `${file.name} pesa ${sizeMB} MB. Máximo permitido: 10 MB.` };
      }
      return { ok: true };
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
      uploadedFilesRef.current = next;
      return next;
    });
    setUploadProgress((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const addFileToArray = (field, file) => {
    const newIndex = (formData[field] || []).length;
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
    return newIndex;
  };

  const removeFileFromArray = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
    setUploadedFiles((prev) => {
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      const next = { ...prev, [field]: arr };
      uploadedFilesRef.current = next;
      return next;
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
      reader.onerror = () => reject(new Error('No se pudo leer el archivo localmente.'));
      reader.readAsDataURL(file);
    });

  // Sube un archivo al server (/api/habilitaciones/upload con multer).
  // Si el server falla, hace fallback a base64 data URL (persiste aunque el
  // server se caiga). NO usa blob URL porque se rompe en Dokploy.
  // Devuelve { url, name } o lanza error.
  const uploadOneFile = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('field', file._fieldHint || 'archivo');
    try {
      const res = await fetch('/api/habilitaciones/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (res.ok) {
        const data = await res.json();
        return { url: data.url, name: file.name, source: 'server' };
      }
      throw new Error('Server respondió ' + res.status);
    } catch (serverErr) {
      // Fallback: base64 data URL
      try {
        const dataUrl = await readFileAsDataURL(file);
        return { url: dataUrl, name: file.name, source: 'base64' };
      } catch (readErr) {
        throw new Error(
          `No se pudo subir "${file.name}". El servidor no responde y la lectura local falló. ` +
          'Verificá tu conexión y reintentá.'
        );
      }
    }
  };

  // Sube un archivo mostrando progreso y guardando el resultado en uploadedFiles.
  // Se llama al seleccionar un archivo (no al submit) para tener progreso inmediato.
  // isArray=true usa uploadedFiles[field] como array y uploadProgress[field] como array.
  const simulateUpload = async (file, fieldName, isArray = false, arrayIndex = null) => {
    if (!file) return null;

    setUploadProgress((prev) => {
      const next = { ...prev };
      if (isArray && arrayIndex !== null) {
        const arr = [...(next[fieldName] || [])];
        arr[arrayIndex] = 0;
        next[fieldName] = arr;
      } else {
        next[fieldName] = 0;
      }
      return next;
    });

    // Progreso simulado mientras sube (independiente del server real)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = { ...prev };
        if (isArray && arrayIndex !== null) {
          const arr = [...(next[fieldName] || [])];
          const current = arr[arrayIndex] || 0;
          const v = Math.min(current + Math.random() * 25, 95);
          arr[arrayIndex] = Math.round(v);
          next[fieldName] = arr;
        } else {
          const current = next[fieldName] || 0;
          next[fieldName] = Math.round(Math.min(current + Math.random() * 25, 95));
        }
        return next;
      });
    }, 300);

    try {
      const result = await uploadOneFile(file);
      clearInterval(interval);
      setUploadProgress((prev) => {
        const next = { ...prev };
        if (isArray && arrayIndex !== null) {
          const arr = [...(next[fieldName] || [])];
          arr[arrayIndex] = 100;
          next[fieldName] = arr;
        } else {
          next[fieldName] = 100;
        }
        return next;
      });
      // Guardar en uploadedFiles (state + ref)
      setUploadedFiles((prev) => {
        const next = { ...prev };
        if (isArray && arrayIndex !== null) {
          const arr = [...(next[fieldName] || [])];
          arr[arrayIndex] = result;
          next[fieldName] = arr;
        } else {
          next[fieldName] = result;
        }
        uploadedFilesRef.current = next;
        return next;
      });
      return result;
    } catch (err) {
      clearInterval(interval);
      setUploadProgress((prev) => {
        const next = { ...prev };
        if (isArray && arrayIndex !== null) {
          const arr = [...(next[fieldName] || [])];
          arr[arrayIndex] = -1;
          next[fieldName] = arr;
        } else {
          next[fieldName] = -1;
        }
        return next;
      });
      setUploadError(err.message);
      throw err;
    }
  };

  // Para un File de un array (documento_propiedad_file, constancia_arca_file):
  // chequea si ya está subido por nombre; si no, lo sube.
  const ensureUploaded = async (file, fieldName, arrayIndex) => {
    const existing = uploadedFilesRef.current[fieldName];
    if (Array.isArray(existing) && existing[arrayIndex] && existing[arrayIndex].name === file.name) {
      return existing[arrayIndex];
    }
    return await simulateUpload(file, fieldName, true, arrayIndex);
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
    setUploadError('');

    try {
      // Verificar y resubir solo lo que falte (en paralelo)
      const uploadedRef = uploadedFilesRef.current;
      const pending = [];
      if (formData.dni_frente_file && !uploadedRef.dni_frente_file) {
        pending.push(simulateUpload(formData.dni_frente_file, 'dni_frente_file'));
      }
      if (formData.dni_dorso_file && !uploadedRef.dni_dorso_file) {
        pending.push(simulateUpload(formData.dni_dorso_file, 'dni_dorso_file'));
      }
      if (formData.estatuto_file && !uploadedRef.estatuto_file) {
        pending.push(simulateUpload(formData.estatuto_file, 'estatuto_file'));
      }
      if (formData.acta_designacion_file && !uploadedRef.acta_designacion_file) {
        pending.push(simulateUpload(formData.acta_designacion_file, 'acta_designacion_file'));
      }
      // Multi-file: asegurar todos los items
      (formData.documento_propiedad_file || []).forEach((file, idx) => {
        pending.push(ensureUploaded(file, 'documento_propiedad_file', idx));
      });
      (formData.constancia_arca_file || []).forEach((file, idx) => {
        pending.push(ensureUploaded(file, 'constancia_arca_file', idx));
      });
      if (pending.length > 0) {
        await Promise.all(pending);
      }

      // Verificar que no haya errores de upload pendientes
      const anyError = Object.values(uploadProgress).some((p) =>
        Array.isArray(p) ? p.includes(-1) : p === -1
      );
      if (anyError) {
        throw new Error(uploadError || 'Uno o más archivos no se pudieron subir.');
      }

      // Build payload con field mapping para la API
      const uploadedFilesSnapshot = uploadedFilesRef.current;
      const archivos = [];
      if (uploadedFilesSnapshot.dni_frente_file) archivos.push({ nombre: 'DNI Frente', url: uploadedFilesSnapshot.dni_frente_file.url });
      if (uploadedFilesSnapshot.dni_dorso_file) archivos.push({ nombre: 'DNI Dorso', url: uploadedFilesSnapshot.dni_dorso_file.url });
      if (uploadedFilesSnapshot.estatuto_file) archivos.push({ nombre: 'Estatuto', url: uploadedFilesSnapshot.estatuto_file.url });
      if (uploadedFilesSnapshot.acta_designacion_file) archivos.push({ nombre: 'Acta Designación', url: uploadedFilesSnapshot.acta_designacion_file.url });
      (uploadedFilesSnapshot.documento_propiedad_file || []).forEach((f, i) =>
        archivos.push({ nombre: `Documento Propiedad ${i + 1}`, url: f.url })
      );
      (uploadedFilesSnapshot.constancia_arca_file || []).forEach((f, i) =>
        archivos.push({ nombre: `Constancia ARCA/ATM ${i + 1}`, url: f.url })
      );

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
                                              fileError={fileErrors.dni_frente_file}
                                              file={formData.dni_frente_file}
                                              progress={uploadProgress.dni_frente_file}
                                              uploaded={uploadedFiles.dni_frente_file}
                        onFileSelect={(f) => {
                                                  const validation = validateFile(f);
                                                  if (!validation.ok) {
                                                    setFileErrors((prev) => ({ ...prev, dni_frente_file: validation.message }));
                                                    return;
                                                  }
                                                  setFileErrors((prev) => { const n = { ...prev }; delete n.dni_frente_file; return n; });
                                                  updateFile('dni_frente_file', f);
                                                  simulateUpload(f, 'dni_frente_file');
                                                }}
                        onRemove={() => removeFile('dni_frente_file')}
                      />
                      <FileUploadField
                                              label="Copia del DNI - Dorso"
                                              field="dni_dorso_file"
                                              accept="image/*,.pdf"
                                              error={errors.dni_dorso_file}
                                              fileError={fileErrors.dni_dorso_file}
                                              file={formData.dni_dorso_file}
                                              progress={uploadProgress.dni_dorso_file}
                                              uploaded={uploadedFiles.dni_dorso_file}
                        onFileSelect={(f) => {
                                                  const validation = validateFile(f);
                                                  if (!validation.ok) {
                                                    setFileErrors((prev) => ({ ...prev, dni_dorso_file: validation.message }));
                                                    return;
                                                  }
                                                  setFileErrors((prev) => { const n = { ...prev }; delete n.dni_dorso_file; return n; });
                                                  updateFile('dni_dorso_file', f);
                                                  simulateUpload(f, 'dni_dorso_file');
                                                }}
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
                                              fileError={fileErrors.estatuto_file}
                                              file={formData.estatuto_file}
                                              progress={uploadProgress.estatuto_file}
                                              uploaded={uploadedFiles.estatuto_file}
                        onFileSelect={(f) => {
                                                  const validation = validateFile(f);
                                                  if (!validation.ok) {
                                                    setFileErrors((prev) => ({ ...prev, estatuto_file: validation.message }));
                                                    return;
                                                  }
                                                  setFileErrors((prev) => { const n = { ...prev }; delete n.estatuto_file; return n; });
                                                  updateFile('estatuto_file', f);
                                                  simulateUpload(f, 'estatuto_file');
                                                }}
                        onRemove={() => removeFile('estatuto_file')}
                      />
                      <FileUploadField
                                              label="Acta de Designación de Autoridades"
                                              field="acta_designacion_file"
                                              accept=".pdf"
                                              error={errors.acta_designacion_file}
                                              fileError={fileErrors.acta_designacion_file}
                                              file={formData.acta_designacion_file}
                                              progress={uploadProgress.acta_designacion_file}
                                              uploaded={uploadedFiles.acta_designacion_file}
                        onFileSelect={(f) => {
                                                  const validation = validateFile(f);
                                                  if (!validation.ok) {
                                                    setFileErrors((prev) => ({ ...prev, acta_designacion_file: validation.message }));
                                                    return;
                                                  }
                                                  setFileErrors((prev) => { const n = { ...prev }; delete n.acta_designacion_file; return n; });
                                                  updateFile('acta_designacion_file', f);
                                                  simulateUpload(f, 'acta_designacion_file');
                                                }}
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
                                      fileError={fileErrors.documento_propiedad_file}
                                      files={formData.documento_propiedad_file || []}
                    uploaded={uploadedFiles.documento_propiedad_file || []}
                    progress={uploadProgress.documento_propiedad_file}
                    onFileSelect={(f) => {
                                          const validation = validateFile(f);
                                          if (!validation.ok) {
                                            setFileErrors((prev) => ({ ...prev, documento_propiedad_file: validation.message }));
                                            return;
                                          }
                                          setFileErrors((prev) => { const n = { ...prev }; delete n.documento_propiedad_file; return n; });
                                          const idx = addFileToArray('documento_propiedad_file', f);
                                          simulateUpload(f, 'documento_propiedad_file', true, idx);
                                        }}
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
                                      fileError={fileErrors.constancia_arca_file}
                                      files={formData.constancia_arca_file || []}
                    uploaded={uploadedFiles.constancia_arca_file || []}
                    progress={uploadProgress.constancia_arca_file}
                    onFileSelect={(f) => {
                                          const validation = validateFile(f);
                                          if (!validation.ok) {
                                            setFileErrors((prev) => ({ ...prev, constancia_arca_file: validation.message }));
                                            return;
                                          }
                                          setFileErrors((prev) => { const n = { ...prev }; delete n.constancia_arca_file; return n; });
                                          const idx = addFileToArray('constancia_arca_file', f);
                                          simulateUpload(f, 'constancia_arca_file', true, idx);
                                        }}
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
  fileError,
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
          {progress !== undefined && progress < 100 && progress >= 0 && (
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
          {progress === -1 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3" />
              Error al subir. Quitalo y reintentá.
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
            {fileError && !file && (
              <p className="text-red-500 text-xs mt-1">{fileError}</p>
            )}
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
  progress,
  fileError,
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
          {files.map((file, idx) => {
            const fileUploaded = uploaded && uploaded[idx];
            const fileProgress = progress && progress[idx];
            const hasError = fileProgress === -1;
            const isUploading = fileProgress !== undefined && fileProgress >= 0 && fileProgress < 100;
            const isDone = fileUploaded && fileProgress === 100;
            return (
              <div key={idx} className="border border-gray-200 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center shrink-0">
                      <File className="w-5 h-5 text-sky-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                        {hasError && <span className="text-red-600 ml-2">· Error al subir</span>}
                        {isDone && <span className="text-emerald-600 ml-2">· Subido</span>}
                      </p>
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
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-sky-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${fileProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
            {fileError && (
              <p className="text-red-500 text-xs mt-1">{fileError}</p>
            )}
          </div>
        );
      }

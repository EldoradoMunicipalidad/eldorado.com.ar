import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionLayout from '../../../../../../assets/components/SectionLayout'
import { Section } from '../../../../../../assets/components/Section'
import RequireAuth from './RequireAuth'
import {
  createEspecializado,
  getConfig,
} from '../../../../../../data/registroVehiculos'

const TIPO_SERVICIO = [
  { value: 'auto', label: 'Auto' },
  { value: 'taxi', label: 'Taxi' },
  { value: 'remis', label: 'Remis' },
  { value: 'transporte_escolar', label: 'Transporte Escolar' },
]

const initialForm = {
  apellido: '',
  dni: '',
  dominio: '',
  marca: '',
  modelo: '',
  observaciones: '',
  licencia: '',
  resolucion: '',
  fecha_resolucion: '',
  tipo_servicio: '',
  parada: '',
  fecha_vto_vtv: '',
  fecha_vto_seguro: '',
  numero_poliza: '',
  fecha_habilitacion: '',
  empresa: '',
  propietario: '',
  direccion: '',
  movil: '',
  telefono: '',
}

const REQUIRED = [
  'apellido', 'dni', 'dominio', 'marca', 'modelo',
  'licencia', 'resolucion', 'fecha_resolucion', 'tipo_servicio',
  'empresa', 'propietario', 'direccion',
]

const fieldClass =
  'w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all'

const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5'

export default function RegistroTransporteEspecializadoPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [moduloPausado, setModuloPausado] = useState(false)

  React.useEffect(() => {
    getConfig().then((cfg) => setModuloPausado(!!cfg.modulo_pausado))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const validate = () => {
    const missing = REQUIRED.filter((k) => !form[k]?.toString().trim())
    if (missing.length > 0) {
      return `Faltan campos obligatorios: ${missing.join(', ')}`
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) return setError(v)

    setSubmitting(true)
    setError('')
    try {
      const result = await createEspecializado(form)
      setSuccess(result)
      setForm(initialForm)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (moduloPausado) {
    return (
      <>
        <SectionLayout
          title="Registro de"
          highlight="Transporte Especializado"
          description="Inscripción oficial de taxis, remises, autos y transporte escolar."
        />
        <Section>
          <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-amber-800 mb-2">Módulo momentáneamente no disponible</h3>
            <p className="text-amber-700">El Registro de Transporte Especializado se encuentra pausado. Vuelve a intentarlo más tarde.</p>
          </div>
        </Section>
      </>
    )
  }

  return (
    <>
      <SectionLayout
        title="Registro de"
        highlight="Transporte Especializado"
        description="Inscripción oficial de taxis, remises, autos y transporte escolar con toda la documentación habilitante."
      />

      <Section>
        <RequireAuth title="El registro de transporte especializado está disponible solo para usuarios autorizados.">
          <div className="max-w-5xl mx-auto">
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-emerald-800">¡Vehículo registrado con éxito!</h3>
                <p className="text-emerald-700 mt-1">
                  Dominio <strong>{success.dominio}</strong> — {success.marca} {success.modelo} ({success.tipo_servicio})
                </p>
                <button
                  onClick={() => setSuccess(null)}
                  className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Cargar otro vehículo
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECCIÓN 1: Datos Particulares y Vehiculares */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">1</span>
                <h2 className="text-xl font-bold text-slate-800">Datos Particulares y Vehiculares</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className={labelClass} htmlFor="apellido">Apellido *</label>
                  <input id="apellido" name="apellido" type="text" placeholder="Ej. González" value={form.apellido} onChange={handleChange} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="dni">D.N.I. *</label>
                  <input id="dni" name="dni" type="text" placeholder="Sin puntos ni espacios" value={form.dni} onChange={handleChange} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="dominio">Dominio (Patente) *</label>
                  <input id="dominio" name="dominio" type="text" placeholder="AA 123 BB" value={form.dominio} onChange={handleChange} style={{ textTransform: 'uppercase' }} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="marca">Marca *</label>
                  <input id="marca" name="marca" type="text" placeholder="Ej. Toyota" value={form.marca} onChange={handleChange} className={fieldClass} required />
                </div>
                <div className="lg:col-span-2">
                  <label className={labelClass} htmlFor="modelo">Modelo *</label>
                  <input id="modelo" name="modelo" type="text" placeholder="Ej. Corolla XEI 2.0" value={form.modelo} onChange={handleChange} className={fieldClass} required />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className={labelClass} htmlFor="observaciones">Observaciones</label>
                  <textarea id="observaciones" name="observaciones" placeholder="Detalles adicionales…" value={form.observaciones} onChange={handleChange} className={fieldClass + ' resize-none h-24'} />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Datos Resolutivos */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">2</span>
                <h2 className="text-xl font-bold text-slate-800">Datos Resolutivos</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className={labelClass} htmlFor="licencia">Licencia *</label>
                  <input id="licencia" name="licencia" type="text" placeholder="N° de Licencia" value={form.licencia} onChange={handleChange} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="resolucion">Resolución *</label>
                  <input id="resolucion" name="resolucion" type="text" placeholder="N° Resolución" value={form.resolucion} onChange={handleChange} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="fecha_resolucion">Fecha Resolución *</label>
                  <input id="fecha_resolucion" name="fecha_resolucion" type="date" value={form.fecha_resolucion} onChange={handleChange} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="tipo_servicio">Tipo Servicio *</label>
                  <select id="tipo_servicio" name="tipo_servicio" value={form.tipo_servicio} onChange={handleChange} className={fieldClass} required>
                    <option value="">Seleccione un tipo</option>
                    {TIPO_SERVICIO.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className={labelClass} htmlFor="parada">Parada en</label>
                  <input id="parada" name="parada" type="text" placeholder="Ubicación asignada" value={form.parada} onChange={handleChange} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="fecha_vto_vtv">Fecha Vto. VTV</label>
                  <input id="fecha_vto_vtv" name="fecha_vto_vtv" type="date" value={form.fecha_vto_vtv} onChange={handleChange} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="fecha_vto_seguro">Fecha Vto. Seguro</label>
                  <input id="fecha_vto_seguro" name="fecha_vto_seguro" type="date" value={form.fecha_vto_seguro} onChange={handleChange} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="numero_poliza">Póliza N°</label>
                  <input id="numero_poliza" name="numero_poliza" type="text" placeholder="Número de póliza" value={form.numero_poliza} onChange={handleChange} className={fieldClass} />
                </div>
                <div className="md:col-span-2 lg:col-span-3 pt-4 border-t border-slate-100">
                  <label className={labelClass} htmlFor="fecha_habilitacion">Fecha de Habilitación</label>
                  <div className="w-full md:w-1/3">
                    <input id="fecha_habilitacion" name="fecha_habilitacion" type="date" value={form.fecha_habilitacion} onChange={handleChange} className={fieldClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: Datos de la Empresa */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">3</span>
                <h2 className="text-xl font-bold text-slate-800">Datos de la Empresa</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div className="lg:col-span-2">
                  <label className={labelClass} htmlFor="empresa">Empresa *</label>
                  <input id="empresa" name="empresa" type="text" placeholder="Razón Social" value={form.empresa} onChange={handleChange} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="propietario">Propietario *</label>
                  <input id="propietario" name="propietario" type="text" placeholder="Nombre del Propietario" value={form.propietario} onChange={handleChange} className={fieldClass} required />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className={labelClass} htmlFor="direccion">Dirección *</label>
                  <input id="direccion" name="direccion" type="text" placeholder="Calle, Número, Localidad" value={form.direccion} onChange={handleChange} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="movil">Móvil (Asignación)</label>
                  <input id="movil" name="movil" type="text" placeholder="N° Interno/Móvil" value={form.movil} onChange={handleChange} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="telefono">Teléfono Contacto</label>
                  <input id="telefono" name="telefono" type="tel" placeholder="Cod. Área + Número" value={form.telefono} onChange={handleChange} className={fieldClass} />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/gobierno/secretaria-gobierno/transito-y-transporte/registro-vehiculos')}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2.5 bg-sky-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-500/20 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Guardando…' : 'Guardar Registro'}
              </button>
            </div>
          </form>
          </div>
        </RequireAuth>
      </Section>
    </>
  )
}

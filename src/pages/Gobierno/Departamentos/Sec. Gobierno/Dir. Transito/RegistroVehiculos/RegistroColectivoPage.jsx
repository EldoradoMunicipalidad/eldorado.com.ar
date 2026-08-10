import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionLayout from '../../../../../../assets/components/SectionLayout'
import { Section } from '../../../../../../assets/components/Section'
import {
  createColectivo,
  getConfig,
} from '../../../../../../data/registroVehiculos'

const TIPO_VEHICULO = [
  { value: 'urbano', label: 'Urbano' },
  { value: 'interurbano', label: 'Interurbano' },
  { value: 'larga_distancia', label: 'Larga Distancia' },
]

const TIPO_MOTOR = [
  { value: 'diesel', label: 'Diésel' },
  { value: 'gnc', label: 'GNC' },
  { value: 'electrico', label: 'Eléctrico' },
  { value: 'hibrido', label: 'Híbrido' },
]

const TIPO_COMBUSTIBLE = [
  { value: 'gasoil_grado_2', label: 'Gasoil Grado 2' },
  { value: 'gasoil_grado_3', label: 'Gasoil Grado 3' },
  { value: 'gas_natural', label: 'Gas Natural' },
  { value: 'electricidad', label: 'Electricidad' },
]

const initialForm = {
  tipo_vehiculo: '',
  marca: '',
  modelo: '',
  patente: '',
  titular: '',
  asientos: '',
  largo: '',
  ano_fabricacion: '',
  tipo_motor: '',
  tipo_combustible: '',
  vencimiento_vtv: '',
  numero_poliza: '',
  vencimiento_poliza: '',
}

const fieldClass =
  'w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all'

const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5'

export default function RegistroColectivoPage() {
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
    const req = ['tipo_vehiculo', 'marca', 'modelo', 'patente', 'titular']
    const missing = req.filter((k) => !form[k]?.toString().trim())
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
      const dataToSend = {
        ...form,
        asientos: form.asientos ? parseInt(form.asientos, 10) : null,
        ano_fabricacion: form.ano_fabricacion ? parseInt(form.ano_fabricacion, 10) : null,
        vencimiento_vtv: form.vencimiento_vtv || null,
        vencimiento_poliza: form.vencimiento_poliza || null,
      }
      const result = await createColectivo(dataToSend)
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
          highlight="Colectivos"
          description="Inscripción oficial de ómnibus y colectivos de transporte."
        />
        <Section>
          <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-amber-800 mb-2">Módulo momentáneamente no disponible</h3>
            <p className="text-amber-700">El Registro de Colectivos se encuentra pausado. Vuelve a intentarlo más tarde.</p>
          </div>
        </Section>
      </>
    )
  }

  return (
    <>
      <SectionLayout
        title="Registro de"
        highlight="Colectivos"
        description="Inscripción oficial de ómnibus y colectivos de transporte urbano, interurbano y larga distancia."
      />

      <Section>
        <div className="max-w-4xl mx-auto">
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-emerald-800">¡Colectivo registrado con éxito!</h3>
                <p className="text-emerald-700 mt-1">
                  Patente <strong>{success.patente}</strong> — {success.marca} {success.modelo}
                </p>
                <button
                  onClick={() => setSuccess(null)}
                  className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Cargar otro colectivo
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
            {/* SECCIÓN 1: Información General */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-800">Información General</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className={labelClass} htmlFor="tipo_vehiculo">Tipo de vehículo *</label>
                  <select
                    id="tipo_vehiculo"
                    name="tipo_vehiculo"
                    value={form.tipo_vehiculo}
                    onChange={handleChange}
                    className={fieldClass}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {TIPO_VEHICULO.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="marca">Marca *</label>
                  <input
                    id="marca"
                    name="marca"
                    type="text"
                    placeholder="Ej. Mercedes-Benz"
                    value={form.marca}
                    onChange={handleChange}
                    className={fieldClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="modelo">Modelo *</label>
                  <input
                    id="modelo"
                    name="modelo"
                    type="text"
                    placeholder="Ej. O 500 U"
                    value={form.modelo}
                    onChange={handleChange}
                    className={fieldClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="patente">Dominio / Patente *</label>
                  <input
                    id="patente"
                    name="patente"
                    type="text"
                    placeholder="Ej. AB 123 CD"
                    value={form.patente}
                    onChange={handleChange}
                    style={{ textTransform: 'uppercase' }}
                    className={fieldClass}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="titular">Titular *</label>
                  <input
                    id="titular"
                    name="titular"
                    type="text"
                    placeholder="Nombre de la empresa o propietario"
                    value={form.titular}
                    onChange={handleChange}
                    className={fieldClass}
                    required
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Especificaciones Técnicas */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-800">Especificaciones Técnicas</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className={labelClass} htmlFor="asientos">Número de asientos</label>
                  <input
                    id="asientos"
                    name="asientos"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.asientos}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="largo">Largo del coche</label>
                  <input
                    id="largo"
                    name="largo"
                    type="text"
                    placeholder="Ej. 12m"
                    value={form.largo}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="ano_fabricacion">Año de fabricación</label>
                  <input
                    id="ano_fabricacion"
                    name="ano_fabricacion"
                    type="number"
                    min="1950"
                    max={new Date().getFullYear()}
                    placeholder="YYYY"
                    value={form.ano_fabricacion}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="tipo_motor">Tipo de motor</label>
                  <select
                    id="tipo_motor"
                    name="tipo_motor"
                    value={form.tipo_motor}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    <option value="">Seleccionar</option>
                    {TIPO_MOTOR.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="tipo_combustible">Tipo de combustible</label>
                  <select
                    id="tipo_combustible"
                    name="tipo_combustible"
                    value={form.tipo_combustible}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    <option value="">Seleccionar</option>
                    {TIPO_COMBUSTIBLE.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: Documentación */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-800">Documentación y Vencimientos</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className={labelClass} htmlFor="vencimiento_vtv">Vencimiento VTV</label>
                  <input
                    id="vencimiento_vtv"
                    name="vencimiento_vtv"
                    type="date"
                    value={form.vencimiento_vtv}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="numero_poliza">Número de Póliza de Seguro</label>
                  <input
                    id="numero_poliza"
                    name="numero_poliza"
                    type="text"
                    placeholder="Ej. POL-987654321"
                    value={form.numero_poliza}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="vencimiento_poliza">Vencimiento Póliza</label>
                  <input
                    id="vencimiento_poliza"
                    name="vencimiento_poliza"
                    type="date"
                    value={form.vencimiento_poliza}
                    onChange={handleChange}
                    className={fieldClass}
                  />
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
      </Section>
    </>
  )
}

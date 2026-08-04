import { useState } from 'react'

const sectionClass = "bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
const titleClass = "flex items-center gap-3 text-sky-600 font-semibold text-lg mb-6"
const numberClass = "w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold"
const labelClass = "block text-xs font-medium text-slate-600 mb-1.5"
const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"

export default function RegistroEspecializadoVehiculos() {
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setMessage(null)
        const fd = new FormData(e.currentTarget)
        const data = Object.fromEntries(fd.entries())

        try {
            const res = await fetch('/api/registro-vehiculos/especializados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Error')
            setMessage({ type: 'success', text: `Registro guardado correctamente (ID #${json.id})` })
            e.currentTarget.reset()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-slate-900">Registro de Transporte Especializado</h1>

            {message && (
                <div className={`p-4 rounded-lg border ${
                    message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>1</span>
                    Datos Particulares y Vehiculares
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="apellido">Apellido *</label>
                        <input className={inputClass} id="apellido" name="apellido" placeholder="Ej. González" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="dni">D.N.I. *</label>
                        <input className={inputClass} id="dni" name="dni" placeholder="Sin puntos ni espacios" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="dominio">Dominio (Patente) *</label>
                        <input className={inputClass + " uppercase"} id="dominio" name="dominio" placeholder="AA 123 BB" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="marca">Marca *</label>
                        <input className={inputClass} id="marca" name="marca" placeholder="Ej. Toyota" type="text" required />
                    </div>
                    <div className="flex flex-col lg:col-span-2">
                        <label className={labelClass} htmlFor="modelo">Modelo *</label>
                        <input className={inputClass} id="modelo" name="modelo" placeholder="Ej. Corolla XEI 2.0" type="text" required />
                    </div>
                    <div className="flex flex-col md:col-span-2 lg:col-span-3">
                        <label className={labelClass} htmlFor="observaciones">Observaciones</label>
                        <textarea className={inputClass + " resize-none h-24"} id="observaciones" name="observaciones" placeholder="Detalles adicionales..." />
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>2</span>
                    Datos Resolutivos
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="licencia">Licencia *</label>
                        <input className={inputClass} id="licencia" name="licencia" placeholder="N° de Licencia" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="resolucion">Resolución *</label>
                        <input className={inputClass} id="resolucion" name="resolucion" placeholder="N° Resolución" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="fecha_resolucion">Fecha Resolución *</label>
                        <input className={inputClass} id="fecha_resolucion" name="fecha_resolucion" type="date" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="tipo_servicio">Tipo Servicio *</label>
                        <select className={inputClass} id="tipo_servicio" name="tipo_servicio" required defaultValue="">
                            <option disabled value="">Seleccione un tipo</option>
                            <option value="auto">Auto</option>
                            <option value="taxi">Taxi</option>
                            <option value="remis">Remis</option>
                            <option value="transporte_escolar">Transporte Escolar</option>
                        </select>
                    </div>
                    <div className="flex flex-col lg:col-span-2">
                        <label className={labelClass} htmlFor="parada">Parada en</label>
                        <input className={inputClass} id="parada" name="parada" placeholder="Ubicación asignada" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="fecha_vto_vtv">Fecha Vto. VTV</label>
                        <input className={inputClass} id="fecha_vto_vtv" name="fecha_vto_vtv" type="date" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="fecha_vto_seguro">Fecha Vto. Seguro</label>
                        <input className={inputClass} id="fecha_vto_seguro" name="fecha_vto_seguro" type="date" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="numero_poliza">Póliza N°</label>
                        <input className={inputClass} id="numero_poliza" name="numero_poliza" placeholder="Número de póliza" type="text" />
                    </div>
                    <div className="flex flex-col md:col-span-2 lg:col-span-3 pt-4 border-t border-slate-100">
                        <label className={labelClass} htmlFor="fecha_habilitacion">Fecha de Habilitación</label>
                        <div className="w-full md:w-1/3">
                            <input className={inputClass} id="fecha_habilitacion" name="fecha_habilitacion" type="date" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>3</span>
                    Datos de la Empresa
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="flex flex-col lg:col-span-2">
                        <label className={labelClass} htmlFor="empresa">Empresa *</label>
                        <input className={inputClass} id="empresa" name="empresa" placeholder="Razón Social" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="propietario">Propietario *</label>
                        <input className={inputClass} id="propietario" name="propietario" placeholder="Nombre del Propietario" type="text" required />
                    </div>
                    <div className="flex flex-col md:col-span-2 lg:col-span-3">
                        <label className={labelClass} htmlFor="direccion">Dirección *</label>
                        <input className={inputClass} id="direccion" name="direccion" placeholder="Calle, Número, Localidad" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="movil">Móvil (Asignación)</label>
                        <input className={inputClass} id="movil" name="movil" placeholder="N° Interno/Móvil" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="telefono">Teléfono Contacto</label>
                        <input className={inputClass} id="telefono" name="telefono" placeholder="Cod. Área + Número" type="tel" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pb-12">
                <button
                    type="button"
                    onClick={(e) => e.currentTarget.form.reset()}
                    className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Guardando…' : 'Guardar Registro'}
                </button>
            </div>
        </form>
    )
}
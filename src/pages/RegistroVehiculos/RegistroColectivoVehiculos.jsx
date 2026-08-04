import { useState } from 'react'

const sectionClass = "bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
const titleClass = "flex items-center gap-3 text-blue-700 font-semibold text-lg mb-6"
const numberClass = "w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold"
const labelClass = "block text-xs font-medium text-slate-600 mb-1.5"
const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"

export default function RegistroColectivoVehiculos() {
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setMessage(null)
        const fd = new FormData(e.currentTarget)
        const data = Object.fromEntries(fd.entries())

        try {
            const res = await fetch('/api/registro-vehiculos/colectivos', {
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
            <h1 className="text-2xl font-bold text-slate-900">Registro de Colectivo</h1>

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
                    Información General
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="tipo_vehiculo">Tipo de vehículo *</label>
                        <select className={inputClass} id="tipo_vehiculo" name="tipo_vehiculo" required defaultValue="">
                            <option disabled value="">Seleccione un tipo</option>
                            <option value="urbano">Urbano</option>
                            <option value="interurbano">Interurbano</option>
                            <option value="larga_distancia">Larga Distancia</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="marca">Marca *</label>
                        <input className={inputClass} id="marca" name="marca" placeholder="Ej. Mercedes-Benz" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="modelo">Modelo *</label>
                        <input className={inputClass} id="modelo" name="modelo" placeholder="Ej. O 500 U" type="text" required />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="patente">Dominio / Patente *</label>
                        <input className={inputClass + " uppercase"} id="patente" name="patente" placeholder="Ej. AB 123 CD" type="text" required />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className={labelClass} htmlFor="titular">Titular *</label>
                        <input className={inputClass} id="titular" name="titular" placeholder="Nombre de la empresa o propietario" type="text" required />
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>2</span>
                    Especificaciones Técnicas
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="asientos">Número de asientos</label>
                        <input className={inputClass} id="asientos" name="asientos" type="number" min="0" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="largo">Largo del coche</label>
                        <input className={inputClass} id="largo" name="largo" placeholder="Ej. 12m" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="ano_fabricacion">Año de fabricación</label>
                        <input className={inputClass} id="ano_fabricacion" name="ano_fabricacion" type="number" min="1900" max="2100" placeholder="YYYY" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="tipo_motor">Tipo de motor</label>
                        <select className={inputClass} id="tipo_motor" name="tipo_motor" defaultValue="">
                            <option disabled value="">Seleccionar</option>
                            <option value="diesel">Diésel</option>
                            <option value="gnc">GNC</option>
                            <option value="electrico">Eléctrico</option>
                            <option value="hibrido">Híbrido</option>
                        </select>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className={labelClass} htmlFor="tipo_combustible">Tipo de combustible</label>
                        <select className={inputClass} id="tipo_combustible" name="tipo_combustible" defaultValue="">
                            <option disabled value="">Seleccionar</option>
                            <option value="gasoil_grado_2">Gasoil Grado 2</option>
                            <option value="gasoil_grado_3">Gasoil Grado 3</option>
                            <option value="gas_natural">Gas Natural</option>
                            <option value="electricidad">Electricidad</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <div className={titleClass}>
                    <span className={numberClass}>3</span>
                    Documentación y Vencimientos
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="vencimiento_vtv">Vencimiento VTV</label>
                        <input className={inputClass} id="vencimiento_vtv" name="vencimiento_vtv" type="date" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="numero_poliza">Número de Póliza de Seguro</label>
                        <input className={inputClass} id="numero_poliza" name="numero_poliza" placeholder="Ej. POL-987654321" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className={labelClass} htmlFor="vencimiento_poliza">Vencimiento Póliza</label>
                        <input className={inputClass} id="vencimiento_poliza" name="vencimiento_poliza" type="date" />
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
                    className="px-8 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Guardando…' : 'Guardar Registro'}
                </button>
            </div>
        </form>
    )
}
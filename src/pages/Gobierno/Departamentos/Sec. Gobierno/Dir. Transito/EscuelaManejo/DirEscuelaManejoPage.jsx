import React from 'react'
import { Link } from 'react-router-dom'
import SectionLayout from '../../../../../../assets/components/SectionLayout'
import { Section } from '../../../../../../assets/components/Section'
import Icon from '../../../../../../assets/Icons/Icon'

const requisitos = [
  'DNI original y fotocopia (presentar el día del turno).',
  'Tener entre 16 años y 6 meses y 21 años (autorización de progenitores para menores de 18).',
  'Certificado de salud (FUT) vigente.',
  'Certificado de Antecedentes Nacionales de Tránsito (CENAT).',
  'Comprobante de pago del CENAT.',
]

const pasos = [
  {
    n: 1,
    titulo: 'Inscripción online',
    descripcion:
      'Completá el formulario con tus datos personales y elegí el día y horario disponibles en el Autódromo km 4.',
  },
  {
    n: 2,
    titulo: 'Confirmación',
    descripcion:
      'Recibirás la confirmación en pantalla. Presentate en el Autódromo km 4 con tu DNI original.',
  },
  {
    n: 3,
    titulo: 'Prácticas de manejo',
    descripcion:
      'Realizarás hasta 6 clases prácticas con un instructor habilitado. Duración: 1 hora por clase.',
  },
]

export default function DirEscuelaManejoPage() {
  return (
    <>
      <SectionLayout
        title="Escuela de"
        highlight="Manejo"
        description="Inscripción a clases prácticas de manejo en el Autódromo km 4. Para principiantes y mayores de 16 años y 6 meses."
      />

      <Section>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Card de acción */}
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="directionsCarIcon" size={28} className="text-white" />
                <h2 className="text-2xl font-bold">Reservá tu turno</h2>
              </div>
              <p className="text-rose-50 mb-4">
                Inscripción online a clases prácticas. 2 alumnos por hora, de lunes a viernes de 14 a 18 hs,
                en el Autódromo km 4. Hasta 6 clases por persona.
              </p>
              <Link
                to="/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias/escuela-manejo/turnero"
                className="inline-flex items-center gap-2 bg-white text-rose-600 px-5 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors"
              >
                <Icon name="eventIcon" size={20} />
                Sacar turno online
              </Link>
            </div>
            <div className="hidden md:block text-6xl opacity-20">🚗</div>
          </div>

          {/* Requisitos */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="assignmentIcon" size={22} className="text-rose-600" />
              Requisitos
            </h3>
            <ul className="space-y-2 text-slate-700">
              {requisitos.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pasos */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="formatListNumberedIcon" size={22} className="text-rose-600" />
              ¿Cómo funciona?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pasos.map((p) => (
                <div
                  key={p.n}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                >
                  <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold mb-3">
                    {p.n}
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-1">{p.titulo}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
            <h3 className="font-semibold text-rose-800 mb-2 flex items-center gap-2">
              <Icon name="infoIcon" size={20} />
              Información importante
            </h3>
            <ul className="space-y-1 text-sm text-rose-700">
              <li>• Edad mínima: 16 años y 6 meses (validación automática al momento de inscripción).</li>
              <li>• Máximo 6 clases por persona.</li>
              <li>• Indicar si vas a traer vehículo propio.</li>
              <li>• La presentación de la documentación es obligatoria el día del turno.</li>
              <li>• Cancelaciones o cambios: contactarte vía WhatsApp al Centro de Emisión de Licencias.</li>
            </ul>
          </div>

          {/* Volver */}
          <div className="text-center">
            <Link
              to="/gobierno/secretaria-gobierno/transito-y-transporte/centro-emision-licencias"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Volver a Centro de Emisión de Licencias
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
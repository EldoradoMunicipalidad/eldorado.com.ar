import React, { useState } from 'react'
import { LICITACIONES_DATA } from '../../../data/GobiernoAbierto/licitacionesData'
import Icon from '../../Icons/Icon'
import DocumentTable from './DocumentTable'

const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

const formatFechaPublicacion = (rawDate) => {
  if (!rawDate || typeof rawDate !== 'string') return ''

  const trimmed = rawDate.trim()
  const match = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)

  if (match) {
    const day = Number(match[1])
    const month = Number(match[2])
    const year = Number(match[3])
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return `${day} de ${MONTHS_ES[month - 1]} del ${year}`
    }
  }

  const parsed = new Date(trimmed)
  if (!Number.isNaN(parsed.getTime())) {
    const day = parsed.getDate()
    const month = parsed.getMonth()
    const year = parsed.getFullYear()
    return `${day} de ${MONTHS_ES[month]} del ${year}`
  }

  return trimmed
}

const TIPO_FILTERS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Pública', value: 'publica' },
  { label: 'Privada', value: 'privada' },
]

const COLUMNS = [
  {
    header: 'Tipo',
    headerClassName: 'text-left w-px whitespace-nowrap',
    cellClassName: 'w-px whitespace-nowrap',
    render: (item) => (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
        item.tipo === 'privada' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
      }`}>
        {item.tipo === 'privada' ? 'Privada' : 'Pública'}
      </span>
    ),
  },
  {
    header: 'Descripción',
    render: (item) => (
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-xs lg:text-sm text-slate-800">{item.codigo}</p>
          {item.fechaPublicacion && (
            <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] lg:text-xs font-semibold whitespace-nowrap">
              Publicado: {formatFechaPublicacion(item.fechaPublicacion)}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.descripcion}</p>
      </div>
    ),
  },
  {
    header: 'Acción',
    headerClassName: 'text-center w-px whitespace-nowrap',
    cellClassName: 'text-center w-px whitespace-nowrap',
    render: (item, { openPdf }) =>
      item.enlacePliego ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openPdf(item)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-semibold text-xs hover:bg-emerald-600 hover:text-white transition-colors shadow-sm"
            title="Ver online"
          >
            <Icon name="visibility" className="text-sm" />
            <span className="hidden sm:inline">Ver</span>
          </button>
          <a
            href={item.enlacePliego}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 text-white font-semibold text-xs hover:bg-sky-600 hover:text-white transition-colors shadow-sm"
            title="Descargar"
          >
            <Icon name="download" className="text-sm" />
            <span className="hidden sm:inline">Descargar</span>
          </a>
        </div>
      ) : (
        <span className="text-slate-300 text-xs">—</span>
      ),
  },
]

const LicitacionesList = () => {
  const [pdfModal, setPdfModal] = useState(null)

  const openPdf = (item) => {
    setPdfModal(item)
  }

  const closePdf = () => {
    setPdfModal(null)
  }

  return (
    <>
      <DocumentTable
        data={LICITACIONES_DATA}
        columns={COLUMNS}
        filters={TIPO_FILTERS}
        filterFn={(item, value) => item.tipo === value}
        searchFn={(item, q) =>
          item.codigo.toLowerCase().includes(q) ||
          item.descripcion.toLowerCase().includes(q) ||
          (item.fechaPublicacion ?? '').toLowerCase().includes(q)
        }
        context={{ openPdf }}
        searchPlaceholder="Buscar licitaciones..."
        emptyMessage="No se encontraron licitaciones para la búsqueda ingresada."
        title="Listado de Licitaciones"
      />

      {/* PDF Modal */}
      {pdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2 min-w-0">
                <Icon name="picture_as_pdf" className="text-red-500 text-xl" />
                <span className="font-bold text-slate-700 truncate text-sm lg:text-base">
                  {pdfModal.codigo} — {pdfModal.descripcion}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={pdfModal.enlacePliego}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold text-sm"
                >
                  <Icon name="open_in_new" className="text-base" />
                  <span className="hidden sm:inline">Abrir en pestaña</span>
                </a>
                <button
                  onClick={closePdf}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Cerrar"
                >
                  <Icon name="close" className="text-xl" />
                </button>
              </div>
            </div>
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={pdfModal.enlacePliego}
                title={`Pliego ${pdfModal.codigo}`}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LicitacionesList


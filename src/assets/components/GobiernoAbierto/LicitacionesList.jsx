import React from 'react'
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
    render: (item) =>
      item.enlacePliego ? (
        <a
          href={item.enlacePliego}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-semibold text-sm whitespace-nowrap"
        >
          <Icon name="downloadIcon" className="text-base" />
          <span className="hidden sm:inline">Pliego</span>
        </a>
      ) : (
        <span className="text-slate-300 text-xs">—</span>
      ),
  },
]

const LicitacionesList = () => {
  return (
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
      searchPlaceholder="Buscar licitaciones..."
      emptyMessage="No se encontraron licitaciones para la búsqueda ingresada."
      title="Listado de Licitaciones"
    />
  )
}

export default LicitacionesList


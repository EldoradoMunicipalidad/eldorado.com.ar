import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import Icon from '../../assets/Icons/Icon'
import DocumentTable from '../../assets/components/GobiernoAbierto/DocumentTable'
import { BOLETINES_OFICIALES } from '../../data/GobiernoAbierto/boletinosData'

const TIPO_FILTERS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Oficial', value: 'oficial' },
  { label: 'Especial', value: 'especial' },
]

const COLUMNS = [
  {
    header: 'Tipo',
    headerClassName: 'text-left w-px whitespace-nowrap',
    cellClassName: 'w-px whitespace-nowrap',
    render: (b) => {
      const esEspecial = b.tipo.includes('ESPECIAL')
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
          esEspecial ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
        }`}>
          {esEspecial ? 'Especial' : 'Oficial'}
        </span>
      )
    },
  },
  {
    header: 'Descripción',
    render: (b) => (
      <span className="font-semibold text-xs lg:text-sm text-slate-800">{b.titulo}</span>
    ),
  },
  {
    header: 'Acción',
    headerClassName: 'text-center w-px whitespace-nowrap',
    cellClassName: 'text-center w-px whitespace-nowrap',
    render: (b) =>
      b.enlace ? (
        <a
          href={b.enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-semibold text-sm"
        >
          <Icon name="descriptionIcon" className="text-base" />
          <span>Ver</span>
        </a>
      ) : (
        <span className="text-slate-300 text-xs">—</span>
      ),
  },
]

const BoletinOficialPage = () => {
  return (
    <>
      <SectionLayout
        title="Sistema de"
        highlight="Boletines Oficiales"
        description="Accede a los boletines oficiales de la Municipalidad de Eldorado"
      />
      <Section>
        <DocumentTable
          data={BOLETINES_OFICIALES}
          columns={COLUMNS}
          filters={TIPO_FILTERS}
          filterFn={(b, value) =>
            value === 'especial' ? b.tipo.includes('ESPECIAL') : !b.tipo.includes('ESPECIAL')
          }
          searchFn={(b, q) => b.titulo.toLowerCase().includes(q)}
          searchPlaceholder="Buscar boletín por título o número"
          emptyMessage="No se encontraron boletines con ese término de búsqueda."
          title="Listado de Boletines Oficiales"
        />
      </Section>
    </>
  )
}

export default BoletinOficialPage
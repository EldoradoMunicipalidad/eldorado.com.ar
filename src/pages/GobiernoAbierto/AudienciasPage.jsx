import React, { useState, useMemo } from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import { Search, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { AUDIENCIAS_2025, AUDIENCIAS_2026 } from '../../data/GobiernoAbierto/audienciasData'
import { DEFAULT_GOBIERNO_ABIERTO_SUBPAGES } from '../../data/GobiernoAbierto/cmsDefaults'
import { useCmsContent } from '../../lib/useCmsContent'

const ITEMS_PER_PAGE = 50

export default function AudienciasPage() {
  const [year, setYear] = useState('2026')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(null)
  const content = useCmsContent('gobierno-abierto-audiencias', DEFAULT_GOBIERNO_ABIERTO_SUBPAGES.audiencias)

  const data = content.years?.[year] || (year === '2025' ? AUDIENCIAS_2025 : AUDIENCIAS_2026)

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter((r) =>
      (r.fecha || '').includes(q) ||
      (r.motivo || '').toLowerCase().includes(q) ||
      (r.funcionarios || '').toLowerCase().includes(q) ||
      (r.externos || '').toLowerCase().includes(q) ||
      (r.institucion || '').toLowerCase().includes(q) ||
      (r.detalle || '').toLowerCase().includes(q)
    )
  }, [data, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <>
      <SectionLayout
        title={content.header?.title}
        highlight={content.header?.highlight}
        description={content.header?.description}
      />

      <Section>
        <div className="max-w-6xl mx-auto">

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
            {/* Year tabs */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => { setYear('2026'); setPage(1) }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  year === '2026' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                2026
              </button>
              <button
                onClick={() => { setYear('2025'); setPage(1) }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  year === '2025' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                2025
              </button>
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Buscar por fecha, motivo, funcionario, solicitante..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <span className="text-sm text-slate-400 whitespace-nowrap">
              {filtered.length} registros
            </span>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <th className="text-left px-4 py-3 w-28">Fecha</th>
                  <th className="text-left px-4 py-3 w-32">Motivo</th>
                  <th className="text-left px-4 py-3">Funcionario</th>
                  <th className="text-left px-4 py-3">Solicitante</th>
                  <th className="text-left px-4 py-3">Institución</th>
                  <th className="text-left px-4 py-3">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No se encontraron registros con ese filtro.
                    </td>
                  </tr>
                ) : (
                  paginated.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap font-mono">
                        {row.fecha}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 whitespace-nowrap">
                          {row.motivo || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 text-xs">
                        {row.funcionarios || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        {row.externos || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs max-w-[150px] truncate" title={row.institucion}>
                        {row.institucion || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs max-w-[300px]">
                        <div className="relative">
                          <p className={`${expanded === `${year}-${i}` ? '' : 'line-clamp-2'}`}>{row.detalle || '—'}</p>
                          {row.detalle && row.detalle.length > 80 && (
                            <button
                              onClick={() => setExpanded(expanded === `${year}-${i}` ? null : `${year}-${i}`)}
                              className="text-sky-600 hover:text-sky-700 text-[10px] font-semibold mt-0.5"
                            >
                              {expanded === `${year}-${i}` ? 'Ver menos' : 'Ver más'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-slate-500">
                Página {page} de {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-6 text-center">
            Fuente: Registro Único de Audiencias de Gestión de Interés — Municipalidad de Eldorado
          </p>
        </div>
      </Section>
    </>
  )
}

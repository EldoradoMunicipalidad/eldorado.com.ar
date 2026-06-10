import React, { useState, useMemo, useEffect } from 'react'
import Icon from '../../Icons/Icon'

const PAGE_SIZE_OPTIONS = [10, 25, 50]
const DESKTOP_DEFAULT_PAGE_SIZE = 7
const MOBILE_PAGE_SIZE = 4

/**
 * Reusable table component for gobierno abierto document lists.
 *
 * Props:
 *  - data: full array of items
 *  - columns: [{ header, render(item), className? }]
 *  - filters: [{ label, value }] — pill filters (optional)
 *  - filterFn(item, filterValue): returns bool (required when filters provided)
 *  - searchFn(item, query): returns bool
 *  - searchPlaceholder: string
 *  - emptyMessage: string (optional)
 */
const DocumentTable = ({
  data,
  columns,
  filters,
  filterFn,
  searchFn,
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No se encontraron resultados.',
  title,
  context,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState(filters?.[0]?.value ?? null)
  const [pageSize, setPageSize] = useState(DESKTOP_DEFAULT_PAGE_SIZE)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const effectivePageSize = isMobile ? MOBILE_PAGE_SIZE : pageSize

  const filtered = useMemo(() => {
    let result = data
    if (searchTerm && searchFn) {
      result = result.filter((item) => searchFn(item, searchTerm.trim().toLowerCase()))
    }
    if (activeFilter && filterFn && activeFilter !== filters?.[0]?.value) {
      result = result.filter((item) => filterFn(item, activeFilter))
    }
    return result
  }, [data, searchTerm, activeFilter, searchFn, filterFn, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / effectivePageSize))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * effectivePageSize, safePage * effectivePageSize)

  const handleFilterChange = (value) => {
    setActiveFilter(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-lg font-bold text-slate-700">{title}</h2>
      )}
      {/* Search + Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Icon name="searchIcon" className="absolute left-3 top-2.5 text-slate-400 text-base" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        {filters && filters.length > 0 && (
          <div className="flex gap-1.5 shrink-0">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeFilter === f.value
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider px-2 lg:px-5 ${col.headerClassName ?? 'text-left'}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length > 0 ? (
              paginated.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  {columns.map((col, ci) => (
                    <td
                      key={ci}
                      className={`px-2 lg:px-5 py-4 ${col.cellClassName ?? ''}`}
                    >
                      {col.render(item, context)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-slate-400 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Page size selector — hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
          <span>Mostrar</span>
          <div className="flex gap-1">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => handlePageSizeChange(size)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  pageSize === size
                    ? 'bg-sky-500 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <span>filas</span>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>
            {filtered.length === 0
              ? '0'
              : `${(safePage - 1) * effectivePageSize + 1}–${Math.min(safePage * effectivePageSize, filtered.length)}`}{' '}
            de {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="chevronLeftIcon" className="text-base" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="chevronRightIcon" className="text-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentTable

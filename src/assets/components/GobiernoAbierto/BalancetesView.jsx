import React, { useState, useMemo } from 'react'
import { BALANCETES_DATA } from '../../../data/GobiernoAbierto/balancetesData'
import Icon from '../../Icons/Icon'

const iconoCategoria = {
    'trendingDownIcon': 'text-red-500',
    'trendingUpIcon': 'text-emerald-500',
    'accountBalanceWallet': 'text-sky-500'
}

const BalancetesView = () => {
    const años = BALANCETES_DATA.map((d) => d.año)
    const [añoSeleccionado, setAñoSeleccionado] = useState(años[años.length - 1])
    const [trimestreSeleccionado, setTrimestreSeleccionado] = useState(1)
    const [busqueda, setBusqueda] = useState('')

    const añoData = useMemo(
        () => BALANCETES_DATA.find((d) => d.año === añoSeleccionado),
        [añoSeleccionado]
    )

    const trimestreData = useMemo(
        () => añoData?.trimestres.find((t) => t.numero === trimestreSeleccionado),
        [añoData, trimestreSeleccionado]
    )

    const categoriasFiltradas = useMemo(() => {
        if (!trimestreData) return []
        if (!busqueda) return trimestreData.categorias
        return trimestreData.categorias.filter((c) =>
            c.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
    }, [trimestreData, busqueda])

    const [expandedCategorias, setExpandedCategorias] = useState(new Set())
    const [filtroMobile, setFiltroMobile] = useState(null)

    const nombreMobile = (nombre) => {
        const map = {
            'Ejecución Egresos': 'Egresos',
            'Ejecución Ingresos': 'Ingresos',
        }
        return map[nombre] ?? nombre
    }

    const toggleCategoria = (nombre) => {
        setExpandedCategorias((prev) => {
            const next = new Set(prev)
            next.has(nombre) ? next.delete(nombre) : next.add(nombre)
            return next
        })
    }

    const handleAñoChange = (nuevoAño) => {
        setAñoSeleccionado(nuevoAño)
        setTrimestreSeleccionado(1)
        setExpandedCategorias(new Set())
        setFiltroMobile(null)
    }

    const handleFiltroMobile = (nombre) => {
        if (filtroMobile === nombre) {
            setFiltroMobile(null)
            setExpandedCategorias(new Set())
        } else {
            setFiltroMobile(nombre)
            setExpandedCategorias(new Set([nombre]))
        }
    }

    return (
        <>
            {/* MOBILE VERSION */}
            <div className="block lg:hidden">
                {/* TopAppBar */}
                <header className="bg-surface sticky top-0 z-40">
                    <div className="flex flex-col w-full px-2 pt-6 pb-3 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <h1 className="font-headline font-bold text-xl tracking-tight text-primary">Balancetes trimestrales</h1>
                        </div>
                    </div>
                </header>
                <main className="space-y-6 max-w-7xl mx-auto">
                    {/* Year & Quarter Selection Area */}
                    <section className="mt-3">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                <span className="font-label text-[9px] uppercase tracking-widest text-slate-400 mb-0.5">Año</span>
                                <div className="flex items-center gap-1 text-primary font-headline font-extrabold text-2xl">
                                    {añoSeleccionado}
                                </div>
                            </div>
                            <div className="bg-surface-container-low p-1 rounded-full flex gap-0.5">
                                {añoData?.trimestres.map((trimestre) => (
                                    <div
                                        key={trimestre.numero}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                            trimestre.numero === trimestreSeleccionado
                                                ? 'bg-sky-400 text-white shadow-lg shadow-primary/20'
                                                : 'text-slate-400'
                                        }`}
                                        onClick={() => { setTrimestreSeleccionado(trimestre.numero); setFiltroMobile(null); setExpandedCategorias(new Set()) }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {trimestre.numero}º
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Filtros de categorías (chips) */}
                        <div className="flex gap-2 pb-2">
                            <button
                                onClick={() => { setFiltroMobile(null); setExpandedCategorias(new Set()) }}
                                className={`w-9 h-9 flex-none rounded-full flex items-center justify-center transition-all ${
                                    filtroMobile === null
                                        ? 'bg-primary/10 shadow-[0px_4px_12px_rgba(0,101,141,0.15)] ring-2 ring-primary/30'
                                        : 'bg-surface-container-low'
                                }`}
                            >
                                <Icon name="appsIcon" className={`text-[18px] ${filtroMobile === null ? 'text-primary' : 'text-slate-400'}`} />
                            </button>
                            {trimestreData?.categorias.map((categoria) => (
                                <button
                                    key={categoria.nombre}
                                    onClick={() => handleFiltroMobile(categoria.nombre)}
                                    className={`w-9 h-9 flex-none rounded-full flex items-center justify-center transition-all ${
                                        filtroMobile === categoria.nombre
                                            ? 'bg-primary/10 shadow-[0px_4px_12px_rgba(0,101,141,0.15)] ring-2 ring-primary/30'
                                            : 'bg-surface-container-low'
                                    }`}
                                >
                                    <Icon name={categoria.icono} className={`text-[18px] ${filtroMobile === categoria.nombre ? (iconoCategoria[categoria.icono] ?? 'text-primary') : (iconoCategoria[categoria.icono] ?? 'text-slate-400')}`} />
                                </button>
                            ))}
                        </div>
                    </section>
                    {/* Cards de categorías */}
                    <section className="space-y-3">
                        {(filtroMobile ? categoriasFiltradas.filter(c => c.nombre === filtroMobile) : categoriasFiltradas).map((categoria) => {
                            const isOpen = expandedCategorias.has(categoria.nombre)
                            return (
                                <div
                                    key={categoria.nombre}
                                    className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,101,141,0.05)] border border-transparent overflow-hidden transition-all"
                                >
                                    {/* Header / Toggle */}
                                    <button
                                        onClick={() => toggleCategoria(categoria.nombre)}
                                        className="w-full flex items-center gap-3 p-4 text-left active:bg-surface-container-low transition-colors"
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconoCategoria[categoria.icono] ?? 'bg-primary-fixed text-primary'}`}>
                                            <Icon name={categoria.icono} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-headline font-bold text-base text-on-surface truncate">{nombreMobile(categoria.nombre)}</h3>
                                            {!isOpen && (
                                                <p className="text-slate-400 text-[10px] font-medium">
                                                    {categoria.informes.filter(i => i.enlace).length} informe{categoria.informes.filter(i => i.enlace).length !== 1 ? 's' : ''} disponible{categoria.informes.filter(i => i.enlace).length !== 1 ? 's' : ''}
                                                </p>
                                            )}
                                        </div>
                                        <Icon name="expandMoreIcon" className={`text-slate-400 text-xl shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Collapsible content */}
                                    {isOpen && (
                                        <div className="px-4 pb-4 space-y-2">
                                            {categoria.informes.map((informe) => (
                                                <div key={informe.mes} className="flex items-center justify-between px-3 py-3 bg-surface-container-low rounded-lg transition-transform active:scale-95">
                                                    <span className="font-headline font-bold text-sm text-on-surface">{informe.mes}</span>
                                                    {informe.enlace ? (
                                                        <a
                                                            href={informe.enlace}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-0.5 shrink-0"
                                                        >
                                                            Abrir
                                                            <Icon name="arrowOutwardIcon" className="text-sm" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-300 text-xs">—</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {categoriasFiltradas.length === 0 && (
                            <div className="bg-surface-container-lowest rounded-xl p-6 text-center text-slate-400 text-sm">
                                No se encontraron categorías con ese término.
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* DESKTOP VERSION */}
            <div className="hidden lg:block">
                {/* ...existing code... */}
                <div className="space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Icon name="searchIcon" className="absolute left-3 top-2.5 text-slate-400 text-base" />
                            <input
                                type="text"
                                placeholder="Buscar categorías..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                            />
                        </div>

                        {/* Year selector */}
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">Año:</span>
                            <div className="flex gap-1">
                                {años.map((año) => (
                                    <button
                                        key={año}
                                        onClick={() => handleAñoChange(año)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                            año === añoSeleccionado
                                                ? 'bg-sky-500 text-white'
                                                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {año}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main layout */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Sidebar */}
                        <div className="lg:w-52 shrink-0">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                Informes {añoSeleccionado}
                            </p>
                            <ul className="space-y-1">
                                {añoData?.trimestres.map((trimestre) => (
                                    <li key={trimestre.numero}>
                                        <button
                                            onClick={() => setTrimestreSeleccionado(trimestre.numero)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
                                                trimestre.numero === trimestreSeleccionado
                                                    ? 'text-sky-600'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                                trimestre.numero === trimestreSeleccionado
                                                    ? 'border-sky-500'
                                                    : 'border-slate-300'
                                            }`}>
                                                {trimestre.numero === trimestreSeleccionado && (
                                                    <span className="w-2 h-2 rounded-full bg-sky-500 block" />
                                                )}
                                            </span>
                                            {trimestre.titulo}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px bg-sky-200" />

                        {/* Content */}
                        {trimestreData ? (
                            <div className="flex-1 min-w-0 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            Presupuesto {añoSeleccionado} - {trimestreData.titulo}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">{trimestreData.descripcion}</p>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">
                                                    Categoría Reporte
                                                </th>
                                                {trimestreData.meses.map((mes) => (
                                                    <th key={mes} className="text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        {mes}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {categoriasFiltradas.length > 0 ? (
                                                categoriasFiltradas.map((categoria) => (
                                                    <tr key={categoria.nombre} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <Icon name={categoria.icono} className={`${iconoCategoria[categoria.icono] ?? 'text-slate-500'}`} />
                                                               <span className="font-semibold text-slate-800">
                                                                    {categoria.nombre}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        {categoria.informes.map((informe) => (
                                                            <td key={informe.mes} className="px-4 py-4 text-center">
                                                                {informe.enlace ? (
                                                                    <a
                                                                        href={informe.enlace}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-semibold text-sm"
                                                                    >
                                                                        <Icon name="descriptionIcon" className="text-base" />
                                                                        <span>Ver Informe</span>
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-slate-300 text-xs">—</span>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={trimestreData.meses.length + 1} className="px-5 py-8 text-center text-slate-400 text-sm">
                                                        No se encontraron categorías con ese término.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">Selecciona un trimestre para ver los informes.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BalancetesView

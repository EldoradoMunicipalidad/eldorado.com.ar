import React, { useState, useEffect } from 'react'
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis
} from 'recharts'
import { RESUMEN_CONSOLIDADO } from '../../../data/GobiernoAbierto/resumenConsolidadoData'

const PERIODOS = ['31/12/2023', '31/12/2024']

const PIE_COLORS = ['#1d4ed8', '#38bdf8', '#0f172a']

const PIE_DATA_2024 = [
    { name: 'Ingresos', value: 18000452006.88 },
    { name: 'Compromisos', value: 13937590231.80 },
    { name: 'Deudas Totales', value: 525446698.45 }
]

const BAR_COLORS = {
    y2023: '#1d4ed8',
    y2024: '#38bdf8'
}

const formatPeso = (value) => {
    const absFormatted = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    }).format(Math.abs(value))
    return value < 0 ? `-${absFormatted}` : absFormatted
}

const formatPesoMobile = (value) => {
    const millon = 1_000_000
    const absMM = Math.abs(value) / millon
    const formatted = new Intl.NumberFormat('es-AR', {
        maximumFractionDigits: 0
    }).format(absMM)
    return `${value < 0 ? '-' : ''}$ ${formatted} M`
}

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const item = payload[0]
        return (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg text-sm">
                <p className="font-semibold text-slate-800 mb-1">{item.name}</p>
                <p className="text-slate-600">{formatPeso(item.value)}</p>
            </div>
        )
    }
    return null
}

const ResumenConsolidadoView = () => {
    const [tab, setTab] = useState('comparativo')
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024)
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    const filas = RESUMEN_CONSOLIDADO[0]?.filas ?? []
    const comparativoChartData = filas.map((fila) => ({
        concepto: fila.concepto,
        y2023: Number((fila.valores['31/12/2023'] / 1000000000).toFixed(2)),
        y2024: Number((fila.valores['31/12/2024'] / 1000000000).toFixed(2))
    }))

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs lg:text-sm">
                        <thead>
                            <tr className="bg-sky-600 text-white">
                                <th className="px-2 lg:px-5 py-2 lg:py-3 text-left font-semibold">Conceptos</th>
                                {PERIODOS.map((p) => (
                                    <th key={p} className="px-2 lg:px-5 py-2 lg:py-3 text-right font-semibold whitespace-nowrap">
                                        {p}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filas.map((fila, idx) => (
                                <tr
                                    key={idx}
                                    className={`border-t border-slate-100 ${
                                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                                    } ${fila.negrita ? 'bg-sky-50/80' : ''}`}
                                >
                                    <td
                                        className={`px-2 lg:px-5 py-1.5 lg:py-3 ${
                                            fila.negrita
                                                ? 'font-bold text-slate-900'
                                                : 'text-slate-700'
                                        }`}
                                    >
                                        {fila.concepto}
                                    </td>
                                    {PERIODOS.map((p) => {
                                        const val = fila.valores[p]
                                        const esNegativo = val < 0
                                        return (
                                            <td
                                                key={p}
                                                className={`px-2 lg:px-5 py-1.5 lg:py-3 text-right whitespace-nowrap ${
                                                    fila.negrita ? 'font-bold' : ''
                                                } ${esNegativo ? 'text-red-600' : 'text-slate-800'}`}
                                            >
                                                {isMobile ? formatPesoMobile(val) : formatPeso(val)}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 lg:gap-2 border-b border-slate-200 pb-0">
                <button
                    onClick={() => setTab('comparativo')}
                    className={`px-3 lg:px-5 py-2 lg:py-2.5 rounded-t-xl font-semibold text-xs lg:text-sm transition-colors border-b-2 -mb-px ${
                        tab === 'comparativo'
                            ? 'border-sky-500 text-sky-600 bg-sky-50'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Comparativo Anual
                </button>
                <button
                    onClick={() => setTab('distribucion')}
                    className={`px-3 lg:px-5 py-2 lg:py-2.5 rounded-t-xl font-semibold text-xs lg:text-sm transition-colors border-b-2 -mb-px ${
                        tab === 'distribucion'
                            ? 'border-sky-500 text-sky-600 bg-sky-50'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Distribución 2024
                </button>
            </div>

            {tab === 'comparativo' && (
                <div className="rounded-2xl border border-slate-200 bg-[#f3f4f6] p-2 lg:p-6">
                    <h3 className="text-center text-base lg:text-2xl font-bold text-[#0369a1] mb-2 lg:mb-4">
                        Comparativo 2023 vs 2024 (en miles de millones)
                    </h3>
                    <ResponsiveContainer width="100%" height={isMobile ? 260 : 360}>
                        <BarChart
                            data={comparativoChartData}
                            margin={{ top: 10, right: isMobile ? 4 : 20, left: isMobile ? -20 : 0, bottom: isMobile ? 60 : 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                            <XAxis
                                dataKey="concepto"
                                angle={-45}
                                textAnchor="end"
                                height={isMobile ? 80 : 90}
                                tick={{ fill: '#4b5563', fontSize: isMobile ? 9 : 12 }}
                            />
                            <YAxis
                                tick={{ fill: '#4b5563', fontSize: isMobile ? 9 : 12 }}
                                label={isMobile ? undefined : { value: 'Miles de millones', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                formatter={(value) => [`${value} mil M`, '']}
                                labelFormatter={(label) => label}
                            />
                            <Legend formatter={(value) => (value === 'y2023' ? '2023' : '2024')} />
                            <Bar dataKey="y2023" name="y2023" fill={BAR_COLORS.y2023} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="y2024" name="y2024" fill={BAR_COLORS.y2024} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Distribución 2024 */}
            {tab === 'distribucion' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-3 lg:p-6 space-y-4">
                    <h3 className="text-center text-sm lg:text-base font-bold text-slate-700 tracking-wide uppercase">
                        Distribución Financiera 2024
                    </h3>
                    <ResponsiveContainer width="100%" height={isMobile ? 260 : 340}>
                        <PieChart>
                            <Pie
                                data={PIE_DATA_2024}
                                cx="50%"
                                cy="50%"
                                outerRadius={isMobile ? 70 : 120}
                                dataKey="value"
                                label={isMobile
                                    ? ({ percent }) => `${(percent * 100).toFixed(0)}%`
                                    : ({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`
                                }
                                labelLine={!isMobile}
                            >
                                {PIE_DATA_2024.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(value) => (
                                    <span className="text-sm text-slate-700">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}

export default ResumenConsolidadoView

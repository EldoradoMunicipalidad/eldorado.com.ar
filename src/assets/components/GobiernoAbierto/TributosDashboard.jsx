import React, { useMemo, useState } from 'react'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import {
    TRIBUTOS_RECAUDACION_DATA,
    TRIBUTOS_TOTALES
} from '../../../data/GobiernoAbierto/tributosData'

const PIE_COLORS = ['#2f95d1', '#8ab6d6', '#5fa9da', '#1976ba', '#145a8d', '#0a3f6d', '#072d52', '#031e38']

const formatCurrency = (value) => {
    const number = Number(value)
    const formatted = new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Math.abs(number))

    return number < 0 ? `-$ ${formatted}` : `$ ${formatted}`
}

const formatPercent = (value) => {
    const number = Number(value)
    const formatted = new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Math.abs(number))

    return number < 0 ? `-${formatted}%` : `${formatted}%`
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
            <p className="font-semibold text-slate-800">{label}</p>
            {payload.map((item) => (
                <p key={item.dataKey} style={{ color: item.color }}>
                    {item.name}: {item.dataKey === 'variacionPct' ? formatPercent(item.value) : `${item.value} M`}
                </p>
            ))}
        </div>
    )
}

const TributosDashboard = () => {
    const [distributionYear, setDistributionYear] = useState('2023')

    const comparativeData = useMemo(() => {
        return TRIBUTOS_RECAUDACION_DATA.map((item) => ({
            concepto: item.shortLabel,
            recaudo2023M: Number((item.recaudo2023 / 1000000).toFixed(2)),
            recaudo2024M: Number((item.recaudo2024 / 1000000).toFixed(2))
        }))
    }, [])

    const distributionData = useMemo(() => {
        const key = distributionYear === '2024' ? 'recaudo2024' : 'recaudo2023'
        return TRIBUTOS_RECAUDACION_DATA.map((item) => ({
            name: item.shortLabel,
            value: item[key]
        }))
    }, [distributionYear])

    const variationData = useMemo(() => {
        return TRIBUTOS_RECAUDACION_DATA.map((item) => ({
            concepto: item.shortLabel,
            variacionPct: item.variacionPct
        }))
    }, [])

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <h2 className="text-3xl font-bold text-sky-600">Recaudación de Tributos</h2>
                <p className="mt-2 text-slate-600">Comparativa de períodos 2023-2024</p>

                <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full min-w-[980px] text-left text-[15px]">
                        <thead className="bg-slate-100 text-slate-800">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Tributo ↑</th>
                                <th className="px-4 py-3 text-right font-semibold">Recaudado 2024</th>
                                <th className="px-4 py-3 text-right font-semibold">Recaudado 2023</th>
                                <th className="px-4 py-3 text-right font-semibold">Diferencia</th>
                                <th className="px-4 py-3 text-right font-semibold">Variación %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TRIBUTOS_RECAUDACION_DATA.map((item) => (
                                <tr key={item.tributo} className="border-t border-slate-200">
                                    <td className="px-4 py-3 text-slate-800">{item.tributo}</td>
                                    <td className="px-4 py-3 text-right text-slate-800 whitespace-nowrap">{formatCurrency(item.recaudo2024)}</td>
                                    <td className="px-4 py-3 text-right text-slate-800 whitespace-nowrap">{formatCurrency(item.recaudo2023)}</td>
                                    <td className={`px-4 py-3 text-right whitespace-nowrap ${item.diferencia < 0 ? 'text-red-500' : 'text-sky-600'}`}>
                                        {formatCurrency(item.diferencia)}
                                    </td>
                                    <td className={`px-4 py-3 text-right whitespace-nowrap ${item.variacionPct < 0 ? 'text-red-500' : 'text-sky-600'}`}>
                                        {formatPercent(item.variacionPct)}
                                    </td>
                                </tr>
                            ))}
                            <tr className="border-t border-slate-300 bg-slate-100 font-bold text-slate-900 text-[14px] sm:text-[15px]">
                                <td className="px-4 py-3">TOTAL</td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(TRIBUTOS_TOTALES.recaudo2024)}</td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(TRIBUTOS_TOTALES.recaudo2023)}</td>
                                <td className="px-4 py-3 text-right text-sky-600 whitespace-nowrap">{formatCurrency(TRIBUTOS_TOTALES.diferencia)}</td>
                                <td className="px-4 py-3 text-right text-sky-600 whitespace-nowrap">{formatPercent(TRIBUTOS_TOTALES.variacionPct)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                    <h3 className="text-[36px] leading-tight font-bold text-[#1e293b] sm:text-[40px]">
                        Comparativa de Recaudación 2023-2024
                    </h3>
                    <div className="mt-6 h-[420px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparativeData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                <XAxis
                                    dataKey="concepto"
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    height={95}
                                    tick={{ fill: '#475569', fontSize: 12 }}
                                />
                                <YAxis tickFormatter={(value) => `${value} M`} tick={{ fill: '#475569', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="recaudo2023M" name="Recaudado 2023" fill="#9fcae8" />
                                <Bar dataKey="recaudo2024M" name="Recaudado 2024" fill="#2f95d1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                    <h3 className="text-[36px] leading-tight font-bold text-[#1e293b] sm:text-[40px]">
                        Distribución de Tributos
                    </h3>
                    <div className="mt-4 flex gap-6 border-b border-slate-200 text-2xl font-semibold">
                        <button
                            onClick={() => setDistributionYear('2024')}
                            className={`pb-2 transition-colors ${
                                distributionYear === '2024' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            2024
                        </button>
                        <button
                            onClick={() => setDistributionYear('2023')}
                            className={`pb-2 transition-colors border-b-2 ${
                                distributionYear === '2023'
                                    ? 'text-sky-600 border-sky-500'
                                    : 'text-slate-400 border-transparent hover:text-slate-600'
                            }`}
                        >
                            2023
                        </button>
                    </div>

                    <div className="mt-5 h-[420px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Legend verticalAlign="top" align="center" />
                                <Pie
                                    data={distributionData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="58%"
                                    outerRadius={130}
                                >
                                    {distributionData.map((_, index) => (
                                        <Cell key={`slice-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <h3 className="text-[36px] leading-tight font-bold text-[#1e293b] sm:text-[40px]">
                    Variación Porcentual 2023-2024
                </h3>
                <div className="mt-6 h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={variationData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                            <XAxis
                                dataKey="concepto"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={95}
                                tick={{ fill: '#475569', fontSize: 12 }}
                            />
                            <YAxis tickFormatter={(value) => `${value}%`} tick={{ fill: '#475569', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="variacionPct" name="Variación %">
                                {variationData.map((entry) => (
                                    <Cell
                                        key={`var-${entry.concepto}`}
                                        fill={entry.variacionPct < 0 ? '#f97316' : '#2f95d1'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default TributosDashboard

import React from 'react'

const formatCellValue = (value) => {
  if (value === null || value === undefined) return ' - '
  return value
}

const PlantaPersonalGrid = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-sky-600 px-6 py-3 text-center text-sm font-extrabold tracking-wide text-white sm:text-xl">
        {data.periodo}
      </div>

      <div className="border-t border-sky-300 bg-sky-500 px-6 py-2 text-center text-xs font-bold uppercase tracking-wide text-white sm:text-base">
        {data.subtitulo}
      </div>

      <div className="overflow-x-auto bg-slate-50">
        <div className="min-w-[900px] px-4 py-4 sm:px-6">
          <div className="grid grid-cols-[2fr_1.1fr_1.1fr_0.9fr_1.2fr] rounded-t-lg bg-sky-500 text-[13px] font-bold uppercase tracking-wide text-white">
            {data.columnas.map((columna) => (
              <div key={columna} className="px-4 py-3">
                {columna}
              </div>
            ))}
          </div>

          {data.filas.map((fila) => (
            <div
              key={fila.categoria}
              className="grid grid-cols-[2fr_1.1fr_1.1fr_0.9fr_1.2fr] border-b border-slate-200 bg-white text-sm text-slate-800"
            >
              <div className="px-4 py-3 font-medium">{fila.categoria}</div>
              <div className="px-4 py-3 text-center">{formatCellValue(fila.administracion)}</div>
              <div className="px-4 py-3 text-center">{formatCellValue(fila.obrasPublicas)}</div>
              <div className="px-4 py-3 text-center">{formatCellValue(fila.cde)}</div>
              <div className="px-4 py-3 text-center">{formatCellValue(fila.juzgadoDeFaltas)}</div>
            </div>
          ))}

          <div className="grid grid-cols-[2fr_1.1fr_1.1fr_0.9fr_1.2fr] bg-sky-50 text-sm font-semibold text-sky-700">
            <div className="px-4 py-3 uppercase">Total</div>
            <div className="px-4 py-3 text-center">{data.totales.administracion}</div>
            <div className="px-4 py-3 text-center">{data.totales.obrasPublicas}</div>
            <div className="px-4 py-3 text-center">{data.totales.cde}</div>
            <div className="px-4 py-3 text-center">{data.totales.juzgadoDeFaltas}</div>
          </div>
        </div>
      </div>

      <div className="bg-sky-600 px-6 py-3 text-base font-extrabold text-white sm:text-2xl">
        TOTAL EMPLEADOS: {data.totales.totalEmpleados}
      </div>
    </div>
  )
}

export default PlantaPersonalGrid

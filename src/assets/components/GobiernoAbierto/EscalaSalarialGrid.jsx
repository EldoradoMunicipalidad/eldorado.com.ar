import React from 'react'

const EscalaSalarialGrid = ({ data }) => {
  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="px-6 py-4 text-center text-xl font-bold text-sky-600 sm:text-2xl">
        {data.titulo}
      </div>

      <div className="grid grid-cols-2 bg-sky-500 text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
        {data.columnas.map((columna) => (
          <div key={columna} className="px-4 py-3 sm:px-5">
            {columna}
          </div>
        ))}
      </div>

      <div>
        {data.filas.map((fila) => (
          <div
            key={fila.categoria}
            className="grid grid-cols-2 border-t border-slate-200 bg-white text-sm text-slate-900 sm:text-base"
          >
            <div className="px-4 py-3 sm:px-5">{fila.categoria}</div>
            <div className="px-4 py-3 sm:px-5">{fila.sueldoBasico}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EscalaSalarialGrid

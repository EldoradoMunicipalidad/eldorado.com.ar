import React from 'react'
import Icon from '../../Icons/Icon'

const BoletiCard = ({ boletin, index }) => {
  const esEspecial = boletin.tipo.includes("ESPECIAL")

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className={`px-6 py-3 text-white font-bold text-center text-sm tracking-wide bg-blue-500`}>
        {boletin.tipo}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 flex flex-col items-center text-center">
        <h3 className="text-lg font-bold text-slate-900">
          {boletin.titulo}
        </h3>

        {/* Download Button */}
        {boletin.enlace ? (
          <a
            href={boletin.enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            <Icon name="downloadIcon" className="text-base" />
            <span>Descargar</span>
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-slate-300 text-slate-500 font-semibold cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Descargar</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default BoletiCard

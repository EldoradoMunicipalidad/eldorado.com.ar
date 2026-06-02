import React from 'react'
import Icon from '../../Icons/Icon'

const BoletinesFilters = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="relative">
        <Icon name="searchIcon" className="absolute left-2 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar boletín por título o número"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </div>
  )
}

export default BoletinesFilters

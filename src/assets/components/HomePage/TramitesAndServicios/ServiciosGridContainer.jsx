import React from 'react'
import ServiciosCard from './ServiciosCard'

export const ServiciosGridContainer = ( { data = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {data.map((item) => (
        <ServiciosCard
          key={item.id}
          Icon={item.Icon} 
          title={item.title}
          subtitle={item.subtitle}
          to={item.to}
        />
      ))}
    </div>
  )
}

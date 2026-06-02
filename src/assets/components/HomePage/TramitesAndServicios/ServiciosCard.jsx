import React from 'react'
import { Link } from 'react-router-dom'
import { isExternal } from '../../../hooks/isExternal'

export const ServiciosCard = ({ title, subtitle, Icon, to = '' }) => {
  const cardClassName = `bg-blue-50 border border-slate-200 rounded-xl aspect-4/2 flex flex-row items-center justify-start px-6 py-4 hover:shadow-lg transition-all duration-300 group overflow-hidden relative ${to ? 'cursor-pointer' : 'cursor-default'}`

  const cardContent = (
    <>
      <div className="w-16 h-16 shrink-0 flex items-center justify-center mr-6 relative z-0">
        {Icon && (
          <Icon className="w-full h-full text-sky-600 opacity-90 group-hover:scale-105 transition-all duration-500" />
        )}
      </div>

      <div className="flex flex-col gap-1 relative z-10 text-left">
        <h3 className="text-base md:text-lg font-bold text-[#0F172A] leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-slate-500 text-xs md:text-sm leading-snug font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </>
  )

  if (!to) {
    return <div className={cardClassName}>{cardContent}</div>
  }

  if (isExternal(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cardClassName}>
        {cardContent}
      </a>
    )
  }

  return (
    <Link to={to} className={cardClassName}>
      {cardContent}
    </Link>
  )
}

export default ServiciosCard;
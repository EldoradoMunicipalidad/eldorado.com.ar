import React, { useId, useState } from 'react'
import Icon from '../Icons/Icon'

const Accordion = ({
  title,
  icon,
  openIcon = 'visibilityIcon',
  defaultOpen = false,
  children,
  className = '',
  headerClassName = '',
  contentClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <div className={`border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md ${className}`}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prevState) => !prevState)}
        className={`w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50/50 transition-colors ${headerClassName}`}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-600'}`}>
              <Icon name={isOpen ? openIcon : icon} />
            </div>
          )}

          <span className="font-bold text-slate-800 text-lg leading-tight">
            {title}
          </span>
        </div>

        <Icon name="expandMoreIcon" className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        id={contentId}
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className={`border-t border-slate-50 ${contentClassName}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accordion
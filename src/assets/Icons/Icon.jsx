import React from 'react'
import { ICONS_MAP } from './index'

const Icon = ( { name, size = 24, className = '', ...props }) => {
  const IconComponent = ICONS_MAP[name];

  if ( !IconComponent ) {
    return (
      <span
        className={`material-symbols-outlined leading-none text-red-600 ${className}`.trim()}
        style={{ fontSize: size, lineHeight: 1 }}
        {...props}
      >
        {name}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      <IconComponent
        width="100%"
        height="100%"
        className="block w-full h-full"
        fill="currentColor"
        color="currentColor"
        {...props}
      />
    </span>
  )
}

export default Icon
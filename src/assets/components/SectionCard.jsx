import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isExternal } from '../hooks/isExternal';
import Icon from '../Icons/Icon';

/**
 * Reusable card used throughout the site.
 * Supports a normal "feature" layout (icon/title/description)
 * as well as a "profile" variant containing an image, name and role.
 */
const SectionCard = ({
  variant = 'default',
  icon,
  title,
  description,
  imageSrc,
  name,
  role,
  to,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to && !isExternal(to)) {
      navigate(to);
    }
  };

  if (variant === 'profile') {
    const profileClassName = `group relative bg-white p-8 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ${to ? 'cursor-pointer' : ''} ${className}`;

    if (to && isExternal(to)) {
      return (
        <a
          href={to}
          target="_blank"
          rel="noreferrer"
          className={profileClassName}
        >
          <img
            src={imageSrc}
            alt={name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
            {name}
          </h3>
          <p className="text-slate-500 text-sm mb-2">{role}</p>
        </a>
      );
    }

    return (
      <div
        onClick={handleClick}
        className={profileClassName}
      >
        <img
          src={imageSrc}
          alt={name}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
          {name}
        </h3>
        <p className="text-slate-500 text-sm mb-2">{role}</p>
      </div>
    );
  }

  // default card style
  const defaultClassName = `group relative bg-white p-5 md:p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-start text-left h-full hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ${to ? 'cursor-pointer' : ''} ${className}`;

  if (to && isExternal(to)) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noreferrer"
        className={defaultClassName}
      >
        <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-sky-200">
          <Icon name={icon} size={24} className="text-white" />
        </div>

        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 leading-tight">{title}</h3>

        <p className="text-slate-500 leading-relaxed text-sm md:text-base line-clamp-4">
          {description}
        </p>

        <div className="absolute inset-0 bg-linear-to-br from-sky-50/0 to-sky-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      </a>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={defaultClassName}
    >
      <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-sky-200">
        <Icon name={icon} size={24} className="text-white" />
      </div>

      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 leading-tight">{title}</h3>

      <p className="text-slate-500 leading-relaxed text-sm md:text-base line-clamp-4">
        {description}
      </p>

      <div className="absolute inset-0 bg-linear-to-br from-sky-50/0 to-sky-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
    </div>
  );
};

export default SectionCard;

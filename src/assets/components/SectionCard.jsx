import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isExternal } from '../hooks/isExternal';
import Icon from '../Icons/Icon';

/**
 * Reusable card with Vercel/Stripe-inspired design.
 * Shadow-as-border technique with multi-layer depth.
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

  // Shared card styles: Vercel shadow-border + Stripe hover
  const cardBase = `group relative bg-white p-6 rounded-xl transition-all duration-300 ${
    to ? 'cursor-pointer' : ''
  } ${className}`;

  const cardShadow = 'shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_2px_4px_rgba(0,0,0,0.04)]';

  const cardHover = 'hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5';

  // Stripe-inspired purple accent icon container
  const iconContainer = "w-10 h-10 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c6aff] flex items-center justify-center mb-4 shadow-[0px_4px_12px_rgba(83,58,253,0.25)] group-hover:shadow-[0px_6px_16px_rgba(83,58,253,0.35)] transition-shadow duration-300";

  if (variant === 'profile') {
    const profileClassName = `${cardBase} ${cardShadow} ${cardHover} flex flex-col items-center text-center p-8`;

    if (to && isExternal(to)) {
      return (
        <a href={to} target="_blank" rel="noreferrer" className={profileClassName}>
          <img src={imageSrc} alt={name} className="w-24 h-24 rounded-full object-cover mb-4" />
          <h3 className="text-lg font-semibold text-[#171717] mb-1">{name}</h3>
          <p className="text-[#4d4d4d] text-sm">{role}</p>
        </a>
      );
    }

    return (
      <div onClick={handleClick} className={profileClassName}>
        <img src={imageSrc} alt={name} className="w-24 h-24 rounded-full object-cover mb-4" />
        <h3 className="text-lg font-semibold text-[#171717] mb-1">{name}</h3>
        <p className="text-[#4d4d4d] text-sm">{role}</p>
      </div>
    );
  }

  // Default card
  const defaultClassName = `${cardBase} ${cardShadow} ${cardHover} flex flex-col items-start text-left h-full`;

  const content = (
    <>
      <div className={iconContainer}>
        <Icon name={icon} size={20} className="text-white" />
      </div>

      <h3 className="text-base font-semibold text-[#171717] mb-1.5 leading-snug tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-[#4d4d4d] leading-relaxed line-clamp-3">
        {description}
      </p>

      {/* Subtle arrow indicator on hover for links */}
      {to && (
        <div className="mt-auto pt-3 flex items-center gap-1 text-xs font-medium text-[#533afd] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Acceder</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </>
  );

  if (to && isExternal(to)) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={defaultClassName}>
        {content}
      </a>
    );
  }

  return (
    <div onClick={handleClick} className={defaultClassName}>
      {content}
    </div>
  );
};

export default SectionCard;

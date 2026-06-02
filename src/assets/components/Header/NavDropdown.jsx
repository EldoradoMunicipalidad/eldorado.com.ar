import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubItemCard } from './SubItemCard';
import ContactCard from './ContactCard';
import { Phone, Sidebar } from 'lucide-react';
import SidebarItem from './SidebarItem';
import MegaMenuContent from './MegaMenuContent';

// NavDropdown.jsx
const NavDropdown = ({ title, items, isOpen, onToggle, closeMenu, onMouseEnter, isMobile }) => {
  const [activeItem, setActiveItem] = useState(items[0]);

  // Reseteamos el item activo si cambian los items
  useEffect(() => {
    setActiveItem(items[0]);
  }, [items]);

  const handleLinkClick = () => {
    onToggle();
    if (closeMenu) closeMenu();
  };

  // --- RENDER MÓVIL (ACORDEÓN) ---
  if (isMobile) {
    return (
      <li className="list-none border-b border-gray-100">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full py-4 text-[#009EE3] font-semibold text-lg"
        >
          <span>{title}</span>
          <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-250 pb-4' : 'max-h-0'}`}>
          {items.map((item, idx) => (
            <div key={idx} className="pl-4 mb-2">
              <Link
                to={item.to}
                onClick={handleLinkClick}
                className="block py-2 text-gray-700 font-medium border-l-2 border-blue-200 pl-3 hover:text-blue-600"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </li>
    );
  }

  // --- RENDER DESKTOP (MEGA MENU) ---
  return (
    <li className="static list-none" onMouseEnter={onMouseEnter}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`relative flex items-center gap-2 font-medium outline-none py-2 transition-all duration-300 group
          ${isOpen ? 'text-blue-800 scale-110' : 'text-[#009EE3] hover:text-blue-700 hover:scale-105'}`}
      >
        <span className="relative">
          {title}
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-700 transition-all duration-300 
            ${isOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
          />
        </span>
        <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[70vw] min-h-100 bg-white shadow-2xl rounded-b-xl overflow-hidden z-50 flex border-t border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          <div className='w-1/3 bg-[#F8F9FA] border-r border-gray-100 flex flex-col'>
            {items.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                isActive={activeItem?.label === item.label}
                onHover={setActiveItem}
                onLinkClick={handleLinkClick}
              />
            ))}
          </div>
          <MegaMenuContent activeItem={activeItem} onLinkClick={handleLinkClick} />
        </div>
      )}
    </li>
  );
};

export default NavDropdown;
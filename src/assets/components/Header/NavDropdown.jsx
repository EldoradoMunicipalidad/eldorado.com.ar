import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubItemCard } from './SubItemCard';
import ContactCard from './ContactCard';
import { ChevronDown } from 'lucide-react';
import SidebarItem from './SidebarItem';
import MegaMenuContent from './MegaMenuContent';

const NavDropdown = ({ title, items, isOpen, onToggle, closeMenu, onMouseEnter, isMobile }) => {
  const [activeItem, setActiveItem] = useState(items[0]);

  useEffect(() => {
    setActiveItem(items[0]);
  }, [items]);

  const handleLinkClick = () => {
    onToggle();
    if (closeMenu) closeMenu();
  };

  // --- MÓVIL ---
  if (isMobile) {
    return (
      <li className="list-none">
        <button
          onClick={onToggle}
          className={`flex items-center justify-between w-full py-3.5 px-1 rounded-xl transition-all ${
            isOpen ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
          }`}
        >
          <span className="font-semibold text-sm">{title}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-sky-500' : 'text-slate-400'
            }`}
          />
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-250 pb-3' : 'max-h-0'
        }`}>
          {items.map((item, idx) => (
            <div key={idx} className="ml-2 mb-1">
              <Link
                to={item.to}
                onClick={handleLinkClick}
                className="block py-2 px-4 text-sm text-slate-600 font-medium rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors border-l-2 border-transparent hover:border-sky-400"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </li>
    );
  }

  // --- DESKTOP ---
  return (
    <li className="static list-none" onMouseEnter={onMouseEnter}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`relative flex items-center gap-1.5 font-medium outline-none px-3 py-2 rounded-xl transition-all duration-200 ${
          isOpen
            ? 'text-sky-600 bg-sky-50'
            : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
        }`}
      >
        <span className="text-sm">{title}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[70vw] bg-white shadow-xl rounded-b-xl overflow-hidden z-50 flex border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col">
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

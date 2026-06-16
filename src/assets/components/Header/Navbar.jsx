import React, { useState, useRef, useEffect, useMemo } from 'react';
import NavDropdown from './NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import {
  itemsCiudad,
  itemsGobierno,
  itemsCiudadanoDigital,
  itemsGobiernoAbierto,
  allNavigationLinks,
} from '../../../data/navigationData';
import { Search, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseEnter = (name) => {
    if (activeDropdown) setActiveDropdown(name);
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeEverything = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
    setSearchQuery('');
    setShowResults(false);
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeEverything();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus en input cuando se abre la búsqueda
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Filtrar links de navegación para búsqueda
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];

    const walkItems = (items) => {
      items.forEach((item) => {
        if (item.label?.toLowerCase().includes(q)) {
          results.push({ label: item.label, to: item.to });
        }
        if (item.subItems) {
          item.subItems.forEach((sub) => {
            if (sub.title?.toLowerCase().includes(q)) {
              results.push({ label: sub.title, to: sub.to });
            }
          });
        }
        if (item.cards) {
          item.cards.forEach((card) => {
            if (card.title?.toLowerCase().includes(q)) {
              results.push({ label: card.title, to: card.to });
            }
          });
        }
      });
    };

    walkItems(itemsCiudad);
    walkItems(itemsGobierno);
    walkItems(itemsCiudadanoDigital);
    walkItems(itemsGobiernoAbierto);

    return results.slice(0, 8);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      closeEverything();
    }
  };

  const handleSearchResultClick = (to) => {
    navigate(to);
    closeEverything();
  };

  return (
    <nav ref={navRef} className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Línea decorativa superior */}
      <div className="h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600" />

      <div className="max-w-7xl mx-auto px-4 h-(--nav-height) flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" onClick={closeEverything} className="shrink-0">
          <img
            src="/logo_Eldorad_Avancemos.png"
            alt="Eldorado Logo"
            className="h-14 w-auto md:h-16"
          />
        </Link>

        {/* Menú Desktop */}
        <ul className="hidden md:flex items-center gap-1 font-medium">
          <NavDropdown
            title="Ciudad"
            items={itemsCiudad}
            isOpen={activeDropdown === 'ciudad'}
            onToggle={() => toggleDropdown('ciudad')}
            onMouseEnter={() => handleMouseEnter('ciudad')}
          />
          <NavDropdown
            title="Gobierno"
            items={itemsGobierno}
            isOpen={activeDropdown === 'gobierno'}
            onToggle={() => toggleDropdown('gobierno')}
            onMouseEnter={() => handleMouseEnter('gobierno')}
          />
          <NavDropdown
            title="Ciudadano Digital"
            items={itemsCiudadanoDigital}
            isOpen={activeDropdown === 'ciudadanoDigital'}
            onToggle={() => toggleDropdown('ciudadanoDigital')}
            onMouseEnter={() => handleMouseEnter('ciudadanoDigital')}
          />
          <NavDropdown
            title="Gobierno Abierto"
            items={itemsGobiernoAbierto}
            isOpen={activeDropdown === 'gobiernoAbierto'}
            onToggle={() => toggleDropdown('gobiernoAbierto')}
            onMouseEnter={() => handleMouseEnter('gobiernoAbierto')}
          />
        </ul>

        {/* Búsqueda + Hamburguesa */}
        <div className="flex items-center gap-2">
          {/* Buscador Desktop */}
          <div className="hidden md:relative md:flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    placeholder="Buscar en el sitio..."
                    className="w-64 pl-9 pr-9 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); setShowResults(false); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Resultados de búsqueda */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-1 right-0 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {searchResults.map((r, i) => (
                        <button
                          key={i}
                          onMouseDown={() => handleSearchResultClick(r.to)}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors flex items-center gap-2"
                        >
                          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Hamburguesa (móvil) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-sky-600 transition-colors"
            aria-label="Menú"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-100 absolute w-full z-50 shadow-xl max-h-[85vh] overflow-y-auto`}>
        <ul className="px-5 pt-2 pb-6 space-y-1">

          {/* Buscador móvil */}
          <li className="pb-3 pt-1">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en el sitio..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-slate-50"
                />
              </div>
            </form>
          </li>

          <NavDropdown
            title="La Ciudad"
            items={itemsCiudad}
            isOpen={activeDropdown === 'ciudad'}
            onToggle={() => toggleDropdown('ciudad')}
            closeMenu={closeEverything}
            isMobile={true}
          />
          <NavDropdown
            title="Gobierno"
            items={itemsGobierno}
            isOpen={activeDropdown === 'gobierno'}
            onToggle={() => toggleDropdown('gobierno')}
            closeMenu={closeEverything}
            isMobile={true}
          />
          <NavDropdown
            title="Ciudadano Digital"
            items={itemsCiudadanoDigital}
            isOpen={activeDropdown === 'ciudadanoDigital'}
            onToggle={() => toggleDropdown('ciudadanoDigital')}
            closeMenu={closeEverything}
            isMobile={true}
          />
          <NavDropdown
            title="Gobierno Abierto"
            items={itemsGobiernoAbierto}
            isOpen={activeDropdown === 'gobiernoAbierto'}
            onToggle={() => toggleDropdown('gobiernoAbierto')}
            closeMenu={closeEverything}
            isMobile={true}
          />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useRef, useEffect } from 'react';
import InstagramIcon from '../../Icons/RedesSociales/InstagramIcon';
import { FacebookIcon } from '../../Icons/RedesSociales/FacebookIcon';
import { XIcon } from '../../Icons/RedesSociales/XIcon';
import { YoutubeIcon } from '../../Icons/RedesSociales/YoutubeIcon';
import { ThreadsIcon } from '../../Icons/RedesSociales/ThreadsIcon';
import NavDropdown from './NavDropdown';
import { Link } from 'react-router-dom';
import {
  itemsCiudad,
  itemsGobierno,
  itemsCiudadanoDigital,
  itemsGobiernoAbierto
} from '../../../data/navigationData';

const Navbar = () => {
  {/**Estado para controlar si el menu hamburguesa esta abierto o cerrado */ }
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null); // Referencia para el menú móvil


  {/**Funcion para detectar que dropdown debe estar activo */ }
  const handleMouseEnter = (name) => {
    if (activeDropdown) {
      setActiveDropdown(name);
    }
  };

  // Función para alternar dropdowns
  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Función para cerrar todo (usada al navegar)
  const closeEverything = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  // Cerrar al hacer clic fuera de todo el Navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeEverything();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <nav ref={navRef} className="w-full bg-white shadow-sm relative">

      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-4 h-(--nav-height) flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link to='/' onClick={closeEverything}>
            <img
              src="/logo_Eldorad_Avancemos.png"
              alt="Eldorado Logo"
              className="h-16 w-auto"
            />
          </Link>
        </div>

        {/* Menú de Navegación (Desktop) */}
        <ul className="hidden md:flex items-center space-x-8 font-medium">
          <NavDropdown
            title='Ciudad'
            items={itemsCiudad}
            isOpen={activeDropdown === 'ciudad'}
            onToggle={() => toggleDropdown('ciudad')}
            onMouseEnter={() => handleMouseEnter('ciudad')}
          />
          <NavDropdown
            title='Gobierno'
            items={itemsGobierno}
            isOpen={activeDropdown === 'gobierno'}
            onToggle={() => toggleDropdown('gobierno')}
            onMouseEnter={() => handleMouseEnter('gobierno')}
          />
          <NavDropdown
            title='Ciudadano Digital'
            items={itemsCiudadanoDigital}
            isOpen={activeDropdown === 'ciudadanoDigital'}
            onToggle={() => toggleDropdown('ciudadanoDigital')}
            onMouseEnter={() => handleMouseEnter('ciudadanoDigital')}
          />
          <NavDropdown
            title='Gobierno Abierto'
            items={itemsGobiernoAbierto}
            isOpen={activeDropdown === 'gobiernoAbierto'}
            onToggle={() => toggleDropdown('gobiernoAbierto')}
            onMouseEnter={() => handleMouseEnter('gobiernoAbierto')}
          />
        </ul>

        {/* Iconos de Redes Sociales (Desktop) */}
        <div className="hidden md:flex items-center space-x-4 text-[#009EE3]">
          <InstagramIcon to='https://www.instagram.com/munieldorado/' />
          <FacebookIcon to='https://www.facebook.com/profile.php?id=61550302085992' />
          <XIcon to='https://x.com/munieldorado' />
          <YoutubeIcon to='https://www.youtube.com/@munieldoradook' />
          <ThreadsIcon to='https://www.threads.net/@munieldorado' />
        </div>

        {/* Botón Hamburguesa (Solo móvil) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#009EE3] focus:outline-none"
            aria-label="Menu"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú Desplegable (Móvil) - Formato Acordeón */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-100 absolute w-full z-50 shadow-lg max-h-[85vh] overflow-y-auto`}>
        <ul className="px-6 pt-2 pb-8 space-y-2">
          <NavDropdown
            title='La Ciudad'
            items={itemsCiudad}
            isOpen={activeDropdown === 'ciudad'}
            onToggle={() => toggleDropdown('ciudad')}
            closeMenu={closeEverything}
            isMobile={true}
          />
          <NavDropdown
            title='Gobierno'
            items={itemsGobierno}
            isOpen={activeDropdown === 'gobierno'}
            onToggle={() => toggleDropdown('gobierno')}
            closeMenu={closeEverything}
            isMobile={true}
          />
          <NavDropdown
            title='Ciudadano Digital'
            items={itemsCiudadanoDigital}
            isOpen={activeDropdown === 'ciudadanoDigital'}
            onToggle={() => toggleDropdown('ciudadanoDigital')}
            closeMenu={closeEverything}
            isMobile={true}
          />
          <NavDropdown
            title='Gobierno Abierto'
            items={itemsGobiernoAbierto}
            isOpen={activeDropdown === 'gobiernoAbierto'}
            onToggle={() => toggleDropdown('gobiernoAbierto')}
            closeMenu={closeEverything}
            isMobile={true}
          />

          {/* Redes sociales dentro del menú móvil */}
          <div className="flex space-x-6 pt-8 justify-center border-t border-gray-100 mt-4">
            <InstagramIcon to='https://www.instagram.com/munieldorado/' />
            <FacebookIcon to='https://www.facebook.com/profile.php?id=61550302085992' />
            <XIcon to='https://x.com/munieldorado' />
            <YoutubeIcon to='https://www.youtube.com/@munieldoradook' />
            <ThreadsIcon to='https://www.threads.net/@munieldorado' />
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
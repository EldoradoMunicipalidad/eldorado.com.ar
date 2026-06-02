import React from 'react';
import { NoticiaCard } from './NoticiaCard';
import { SectionTitle } from '../SectionTitle'


export const NoticiasSection = ({ noticias }) => {
    return (
        /* h-screen para intentar ocupar el alto total en desktop, con padding reducido */
        <section id='noticias' className="lg:min-h-screen py-10 px-4 max-w-7xl mx-auto flex flex-col justify-center">
            {/* Título más pequeño y margen reducido */}
            <SectionTitle title="Noticias" />

            {/* Grilla con gap reducido para ahorrar espacio vertical */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {noticias?.map((noticia) => (
                    <NoticiaCard key={noticia.id} noticia={noticia} />
                ))}
            </div>

            {/* Botón Ver Más */}
            <div className="flex justify-center">
                <a
                    href="https://prensa.eldorado.gob.ar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-blue-500 text-blue-600 text-sm font-bold rounded-full transition-all duration-300 hover:bg-blue-500 hover:text-white active:scale-95"
                >
                    <span>VER MÁS NOTICIAS</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </a>
            </div>
        </section>
    );
};
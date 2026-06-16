import React, { useState, useEffect } from 'react';
import { NoticiaCard } from './NoticiaCard';
import { SectionTitle } from '../SectionTitle'

const API_URL = 'https://prensa.eldorado.gob.ar/directus'
const IMG_URL = `${API_URL}/assets`

async function fetchNoticias() {
  try {
    const res = await fetch(
      `${API_URL}/items/noticias?limit=3&fields=id,titulo,slug,resumen,fecha_publicacion,destacada,categoria.nombre,imagen.id,imagen.filename_download,imagen.type,status&filter[status]=published&sort=-fecha_publicacion`
    )
    const data = await res.json()
    if (!data?.data) return []
    return data.data.map((item) => ({
      id: item.id,
      titulo: item.titulo || '',
      categoria: item.categoria?.nombre || 'General',
      fecha: formatDate(item.fecha_publicacion),
      imagen: item.imagen ? `${IMG_URL}/${item.imagen.id}` : '/placeholder-noticia.jpg',
      link: `https://prensa.eldorado.gob.ar/articulo/${item.slug}`,
      resumen: item.resumen || '',
    }))
  } catch (e) {
    console.warn('Error fetching noticias:', e)
    return []
  }
}

function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const NoticiasSection = () => {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNoticias().then((data) => {
      setNoticias(data)
      setLoading(false)
    })
  }, [])

  return (
    <section id='noticias' className="lg:min-h-screen py-10 px-4 max-w-7xl mx-auto flex flex-col justify-center">
      <SectionTitle title="Noticias" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-44 bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-slate-200 rounded w-24" />
                <div className="h-5 bg-slate-200 rounded w-full" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))
        ) : noticias.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 py-12">
            No hay noticias disponibles
          </div>
        ) : (
          noticias.map((noticia) => (
            <NoticiaCard key={noticia.id} noticia={noticia} />
          ))
        )}
      </div>

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

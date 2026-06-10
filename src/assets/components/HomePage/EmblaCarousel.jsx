import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function EmblaCarousel() {
  // 1. Estados para la navegación (Mantenidos)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  // 2. Inicializar Embla con Autoplay (Mantenido)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  // Funciones de navegación (Mantenidas)
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  // 3. Array de datos (Actualizado para Eldorado)
  const slides = [
    {
      id: 1,
      title: "",
      subtitle: "",
      imgDesktop: "/slider-calendario-junio-2026.jpg",
      imgTablet: "/slider-calendario-junio-2026.jpg",
      imgMobile: "/slider-calendario-junio-2026.jpg",
    }
  ]

  return (
    <section className="w-full bg-white pt-3 pb-12 flex justify-center">

      {/* Contenedor adaptado al aspect ratio de la imagen (1280:293) */}
      <div className="w-full sm:w-[94%] max-w-325 sm:mx-auto relative overflow-hidden rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-2xl sm:shadow-blue-900/10" style={{ aspectRatio: '1280/293' }}>

        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 h-full relative bg-white">

                {/* Imagen con object-contain para que no se corte */}
                <picture>
                  <source srcSet={slide.imgDesktop} media="(min-width: 1024px)" />
                  <source srcSet={slide.imgTablet} media="(min-width: 640px)" />
                  <img
                    src={slide.imgMobile}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-contain object-center"
                  />
                </picture>

              </div>
            ))}
          </div>
        </div>

        {/* Botones de navegación (ocultos si hay solo un slide) */}
        {slides.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
              onClick={scrollPrev}
            >
              <ChevronLeftIcon />
            </button>
            <button
              className="absolute top-1/2 right-6 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
              onClick={scrollNext}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* DOTS (ocultos si hay solo un slide) */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-3">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? 'w-10 bg-white' : 'w-2 bg-white/50'
                  }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

// Iconos (Mantenidos)
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
)
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
)
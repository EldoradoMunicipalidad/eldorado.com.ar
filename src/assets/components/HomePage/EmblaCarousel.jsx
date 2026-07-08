import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function EmblaCarousel() {
  // 1. Estados para la navegación
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  // 2. Inicializar Embla con Autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  // Funciones de navegación
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

  // 3. Array de slides — dos imágenes distintas
  const slides = [
    {
      id: 1,
      img: "/slider-2.jpg",
    },
    {
      id: 2,
      img: "/slider-3.jpg",
    }
  ]

  return (
    <section className="w-full bg-white pt-3 pb-12 flex justify-center">

      {/* Carrusel único — responsive (antes había dos con el mismo ref, bug) */}
      <div className="w-full sm:w-[94%] max-w-325 sm:mx-auto relative overflow-hidden rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-2xl sm:shadow-blue-900/10" style={{ aspectRatio: '1280/550' }}>

        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 h-full relative bg-white">
                <img
                  src={slide.img}
                  alt={`Slide ${slide.id}`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botones de navegación */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-sky-600 transition-all shadow-md"
          aria-label="Anterior"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-sky-600 transition-all shadow-md"
          aria-label="Siguiente"
        >
          <ChevronRightIcon />
        </button>

        {/* Dots de navegación */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all rounded-full ${
                index === selectedIndex
                  ? 'w-6 h-2.5 bg-white'
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

    </section>
  )
}

// Iconos
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
)
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
)

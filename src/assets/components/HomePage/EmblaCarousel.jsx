import React, { useState, useEffect, useCallback, useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function EmblaCarousel({ slides: propSlides }) {
  // 1. Estados para la navegación
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  // 2. Inicializar Embla con una instancia estable de Autoplay
  const plugins = useMemo(() => [Autoplay()], [])
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins)

  // 3. El CMS es la única fuente del carrusel. Slides vacíos no se publican.
  const slides = useMemo(
    () => (Array.isArray(propSlides) ? propSlides.filter((slide) => slide?.img) : []),
    [propSlides]
  )
  const slideSignature = useMemo(
    () => slides.map((slide) => `${slide.id}:${slide.img}`).join('|'),
    [slides]
  )

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

    const syncCarouselState = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      onSelect()
    }

    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', syncCarouselState)
    emblaApi.reInit()
    syncCarouselState()

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', syncCarouselState)
    }
  }, [emblaApi, onSelect, slideSignature])

  if (slides.length === 0) return null

  return (
    <section className="w-full bg-white pt-3 pb-12 flex justify-center">

      {/* Carrusel único — responsive (antes había dos con el mismo ref, bug) */}
      <div className="w-full sm:w-[94%] max-w-325 sm:mx-auto relative overflow-hidden rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-2xl sm:shadow-blue-900/10" style={{ aspectRatio: '1280/550' }}>

        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div key={`${slide.id}:${slide.img}`} className="flex-[0_0_100%] min-w-0 h-full relative bg-white">
                <CarouselImage slide={slide} />
              </div>
            ))}
          </div>
        </div>

        {/* Botones de navegación */}
        {slides.length > 1 && (
          <>
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
          </>
        )}

        {/* Dots de navegación */}
        {slides.length > 1 && (
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
        )}

      </div>

    </section>
  )
}

function CarouselImage({ slide }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
        Imagen temporalmente no disponible
      </div>
    )
  }

  return (
    <img
      src={slide.img}
      alt={slide.title || `Imagen del carrusel ${slide.id}`}
      className="absolute inset-0 w-full h-full object-cover object-center"
      onError={() => setFailed(true)}
    />
  )
}

// Iconos
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
)
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
)

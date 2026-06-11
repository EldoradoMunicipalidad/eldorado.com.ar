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
      imgDesktop: "/slider-1.jpg",
      imgTablet: "/slider-1.jpg",
      imgMobile: "/slider-1.jpg",
    },
    {
      id: 2,
      title: "",
      subtitle: "",
      imgDesktop: "/slider-2.jpg",
      imgTablet: "/slider-2.jpg",
      imgMobile: "/slider-2.jpg",
    }
  ]

  return (
    <section className="w-full bg-white pt-3 pb-12 flex justify-center">

      {/* Desktop / Tablet (≥640px): Calendario panorámico */}
      <div className="hidden sm:block w-full sm:w-[94%] max-w-325 sm:mx-auto relative overflow-hidden rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-2xl sm:shadow-blue-900/10" style={{ aspectRatio: '1280/293' }}>

        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 h-full relative bg-white">
                <img
                  src={slide.imgDesktop}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-contain object-center"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Mobile (<640px): Impuesto automotor vertical */}
      <div className="sm:hidden w-full relative overflow-hidden rounded-none shadow-none" style={{ aspectRatio: '960/1280' }}>
        <div className="overflow-hidden h-full w-full">
          <div className="flex h-full">
            <div className="flex-[0_0_100%] min-w-0 h-full relative bg-white">
              <img
                src="/slider-impuesto-automotor-2026.jpg"
                alt="Impuesto Provincial del Automotor 2026"
                className="absolute inset-0 w-full h-full object-contain object-center"
              />
            </div>
          </div>
        </div>
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
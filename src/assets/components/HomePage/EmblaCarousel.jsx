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
      imgDesktop: "/slider1-adaptado.png",
      imgTablet: "/hero-1-tablet.jpg", // Nueva imagen
      imgMobile: "/hero-1-mobile.jpg",
    },
    {
      id: 2,
      title: "",
      subtitle: "",
      imgDesktop: "/slider2-adaptado.png",
      imgTablet: "/hero-1-tablet.jpg", // Nueva imagen
      imgMobile: "/hero-1-mobile.jpg",
    }
  ]

  return (
    <section className="w-full bg-white pt-3 pb-12 flex justify-center">

      {/* El contenedor principal con rounded-3xl y shadow */}
      <div className="w-full h-112.5 sm:w-[94%] sm:h-auto max-w-325 sm:mx-auto sm:aspect-4/3 md:aspect-video lg:h-137.5 relative group overflow-hidden rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-2xl sm:shadow-blue-900/10">

        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 h-full relative">

                {/* Imagen con object-cover */}
                <picture>
                  <source srcSet={slide.imgDesktop} media="(min-width: 1024px)" />
                  <source srcSet={slide.imgTablet} media="(min-width: 640px)" />
                  <img
                    src={slide.imgMobile}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </picture>

                {/* OVERLAY DE TEXTO ESTILO "HORIZON COURTS" */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10 flex flex-col items-center justify-center text-center px-6">

                  <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight max-w-4xl">
                    {slide.title}
                  </h1>

                  <p className="text-white/90 text-lg md:text-xl mt-6 max-w-2xl font-light leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Botón de Acción (CTA) */}
                  <button className="hidden mt-8 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors items-center gap-2">
                    Explorar Eldorado
                    <span className="text-xl">↗</span>
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTONES IZQUIERDA / DERECHA (Tus estilos mantenidos) */}
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

        {/* BOTONES INFERIORES (DOTS - Sobrepuestos al slider) */}
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
export const eldoradoSections = [
  {
    id: "sobre-nosotros",
    title: "Acerca de Nosotros",
    text: "Eldorado, un encantador destino situado a orillas del majestuoso río Paraná, es un lugar que cautiva a todos sus visitantes.",
    images: ["/Ciudad/Eldorado/sobre-nosotros1.avif", "/Ciudad/Eldorado//sobre-nosotros2.avif"],
    reverse: false, // Texto a la izquierda
    buttonText: "Explorar",
    buttonTo: "https://historia.eldorado.gob.ar/"
  },
  {
    id: "ubicacion-ciudad",
    title: "Ubicación Ciudad",
    text: "La Ruta Nacional N° 12 conecta al Sur con la ciudad de Posadas (capital de la Provincia de Misiones) a una distancia aproximada 200 km y conecta al Norte con la ciudad de Puerto Iguazú ubicada a 100 km, y desde allí con las localidades de Foz do Iguazú (Brasil) y Ciudad del Este (Paraguay), a través del paso fronterizo Tancredo Neves.",
    images: [],
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14343.435728867375!2d-54.629391!3d-26.411627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f76ea65692628b%3A0xc3c942941b96497!2sEldorado%2C%20Misiones!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar",
    reverse: true, // Texto a la derecha
  },
  {
    id: "foresto-industrial",
    title: "Actividad Foresto-Industrial",
    text: "La Micro Región basa su economía en la explotación forestal y la industrialización de productos primarios, como aserraderos e industria celulósica. Eldorado concentra el 68,53% del PBG del Alto Paraná, equivalente a $1.156,31 millones (2008), mientras que el resto se reparte entre cinco municipios. La agricultura, centrada en cultivos industriales como yerba mate, té, tabaco y cítricos, es la segunda actividad económica más relevante.",
    images: ["/Ciudad/Eldorado/foresto-industrial.avif"],
    reverse: false,
  },
  {
    id: "actividad-turistica",
    title: "Actividad Turística",
    text: `Los atractivos turísticos de esta ciudad son: el Parque Schwelm, el vivero municipal (dentro del parque), la Plazoleta de las Naciones, el camping Piray Guazú (a orillas del arroyo homónimo), el camping Faubel (en el arroyo Piray Miní), el camping La Playita, los saltos Elena, Küppers y Pomar, la Cueva Miní,el camping "Las Praderas", en la localidad de Santiago de Liniers, el Museo Municipal (en el Parque Schwelm), el Museo Cooperativo y la Plaza sarmiento.`,
    images: ["/Ciudad/Eldorado/turismo.avif"],
    reverse: true,
    buttonText: "Conoce Mas",
    buttonTo: "https://turismo.eldorado.gob.ar/"
  },
  {
    id: "actividad-comercial",
    title: "Actividad Comercial",
    text: "La actividad comercial en la ciudad de Eldorado se concentra principalmente en pequeñas y medianas empresas, así como en artesanos locales. Con un notable crecimiento en el sector comercial, Eldorado se compromete a apoyar a todos los emprendimientos y negocios, fomentando su desarrollo de la manera más eficiente y sostenible.",
    images: ["/Ciudad/Eldorado/act-comercial.avif"],
    reverse: false,
    buttonText: ""
  },
  {
    id: "expo-eldorado",
    title: "EXPO Eldorado",
    subtitle: "La exposición a cielo abierto más grande de la provincia", // Se usa en el modo grid
    text: "La exposición a cielo abierto más grande de la provincia se destaca por su excelente organización y su ubicación privilegiada a orillas del río Paraná. Reúne comercios de todo el país, ofreciendo una experiencia única y diversa para visitantes y expositores.",
    images: [
      "/Ciudad/Eldorado/expo1.avif",
      "/Ciudad/Eldorado/expo2.avif",
      "/Ciudad/Eldorado/expo3.avif"
    ], // El componente mapeará estas 3 imágenes en 3 columnas
    type: "grid", // Activa el renderizado especial centrado
    buttonText: "Conoce Mas",
    buttonTo: "https://expo.eldorado.gob.ar/"
  }
];
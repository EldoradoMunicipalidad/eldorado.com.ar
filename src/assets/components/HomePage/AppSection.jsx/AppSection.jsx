import React, { useState } from 'react'

export const AppSection = () => {
    const [showVideo, setShowVideo] = useState(false);
    const videoId = "wcDWGr0ygSg"; //


    return (
        <section id='app' className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">

                {/* Lado Izquierdo: Texto */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-sky-500 font-semibold text-lg uppercase">Nuestra App -</h3>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-sky-600">MI MUNI MI CUENTA</h2>
                    </div>
                    <p className="text-gray-600 text-lg max-w-xl">
                        Accede a los trámites y servicios de la Municipalidad desde cualquier lugar de forma rápida y segura.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 cursor-pointer hover:opacity-80 transition" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-10 cursor-pointer hover:opacity-80 transition" />
                    </div>
                </div>

                {/* Lado Derecho: Card con Video */}
                <div className="flex-1 w-full max-w-2xl">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

                        {/* Contenedor Multimedia */}
                        <div className="relative aspect-video bg-white">
                            {!showVideo ? (
                                // Miniatura con botón de Play
                                <div
                                    className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group"
                                    onClick={() => setShowVideo(true)}
                                >
                                    <img
                                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                        alt="Tutorial Thumbnail"
                                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                    {/* Overlay oscuro */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                                    {/* Botón Play Estilo YouTube */}
                                    <div className="relative z-10 w-16 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-xl group-hover:bg-red-700 transition-all scale-100 group-hover:scale-110">
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-15 border-l-white border-b-8 border-b-transparent ml-1" />
                                    </div>

                                    {/* Badge superior */}
                                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        VIDEO TUTORIAL
                                    </div>
                                </div>
                            ) : (
                                // Iframe de YouTube
                                <iframe
                                    className="absolute inset-0 w-full h-full bg-white scale-[1.01]"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                    title="Tutorial Mi Muni Mi Cuenta"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>

                        {/* Texto de la Card */}
                        <div className="p-8">
                            <h4 className="text-2xl font-bold text-gray-800 mb-2">
                                Tutorial: Mi Muni Mi Cuenta
                            </h4>
                            <p className="text-gray-500 leading-relaxed">
                                Aprende paso a paso cómo registrarte y gestionar tus servicios municipales de forma digital y segura.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

import React, { useState } from 'react'

export const AppSection = () => {
    const [showVideo, setShowVideo] = useState(false);
    const videoId = "wcDWGr0ygSg";

    const features = [
        { icon: "smartphone", label: "Trámites online" },
        { icon: "payments", label: "Pagos digitales" },
        { icon: "notifications", label: "Alertas y noticias" },
        { icon: "verified", label: "Seguro y confiable" },
    ];

    return (
        <section id="app" className="relative py-20 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50" />
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14">

                <div className="flex-1 space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        Nuestra App
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            <span className="bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">
                                MI MUNI
                            </span>
                            <br />
                            <span className="text-slate-700">MI CUENTA</span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Accedé a trámites, pagos, noticias y servicios municipales desde tu celular. Rápido, seguro y siempre a mano.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                        {features.map((f) => (
                            <div
                                key={f.icon}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-sm text-slate-600 font-medium"
                            >
                                <svg className="w-[18px] h-[18px] text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                                </svg>
                                {f.label}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                        <button className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.14-.91.65.08 1.92.56 2.53 1.36-.08.05-2.08 1.21-2.06 3.61.02 2.87 2.52 3.83 2.55 3.84-.03.07-.42 1.42-1.25 2.79zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            <div className="text-left">
                                <div className="text-[10px] uppercase tracking-wider text-slate-400">Descargar en</div>
                                <div className="text-sm font-semibold -mt-0.5">App Store</div>
                            </div>
                        </button>

                        <button className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                            </svg>
                            <div className="text-left">
                                <div className="text-[10px] uppercase tracking-wider text-slate-400">Disponible en</div>
                                <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-xl">
                    <div className="relative bg-white rounded-3xl shadow-2xl shadow-sky-900/10 overflow-hidden border border-slate-100">
                        <div className="h-1.5 bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400" />

                        <div className="relative aspect-video bg-slate-100">
                            {!showVideo ? (
                                <div
                                    className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group"
                                    onClick={() => setShowVideo(true)}
                                >
                                    <img
                                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                        alt="Tutorial Thumbnail"
                                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                                    <div className="relative z-10 w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-red-600 border-b-[10px] border-b-transparent ml-1" />
                                    </div>

                                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        VIDEO TUTORIAL
                                    </div>
                                </div>
                            ) : (
                                <iframe
                                    className="absolute inset-0 w-full h-full bg-white"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                    title="Tutorial Mi Muni Mi Cuenta"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                                </svg>
                                <h4 className="text-lg font-bold text-slate-800">
                                    Tutorial: Mi Muni Mi Cuenta
                                </h4>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Aprendé paso a paso cómo registrarte y gestionar tus servicios municipales de forma digital y segura.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

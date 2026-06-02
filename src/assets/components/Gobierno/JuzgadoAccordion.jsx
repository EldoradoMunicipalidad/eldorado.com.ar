import { useState } from "react";
import { Listado } from "./Listado";
import Icon from "../../Icons/Icon";

export const JuzgadoAccordion = ({
    id,
    titulo,
    icon,
    parrafo1,
    parrafo2,
    parrafo3,
    Lista1,
    Lista2,
    Lista3,
    whatsapp,
    email
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div id={id} className="border border-slate-100 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
            {/* Encabezado / Botón de Acción */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-600'}`}>
                        <Icon name={isOpen ? 'visibilityIcon' : icon} />
                    </div>
                    <span className="font-bold text-slate-800 text-lg leading-tight">
                        {titulo}
                    </span>
                </div>
                <Icon name="expandMoreIcon" className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Contenido Desplegable */}
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-750 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-6 pt-2 border-t border-slate-50 space-y-5">

                    {/* Renderizado Condicional: Párrafo 1 */}
                    {parrafo1 && (
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {parrafo1}
                        </p>
                    )}

                    {/* Renderizado de Listas */}
                    {Lista1 && <Listado titulo={Lista1.titulo} items={Lista1.items} />}
                    {Lista2 && <Listado titulo={Lista2.titulo} items={Lista2.items} />}
                    {Lista3 && <Listado titulo={Lista3.titulo} items={Lista3.items} />}

                    {/* Sección: Canales de Comunicación */}
                    {parrafo2 && (
                        <div className="space-y-4">
                            <div className="border-t border-slate-100 pt-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    Canales de Comunicación
                                </h3>
                                <div className="space-y-3">
                                    {/* WhatsApp - Recomendado */}
                                    {whatsapp && (
                                        <a
                                            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
                                        >
                                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                                                <Icon name="chatIcon" className="text-white text-2xl" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-green-900 text-sm">WhatsApp</span>
                                                    <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs font-bold rounded-full">
                                                        Recomendado
                                                    </span>
                                                </div>
                                                <p className="text-green-700 text-xs">
                                                    Lunes a Viernes 7 a 13 hs
                                                </p>
                                            </div>
                                            <Icon name="arrowOutwardIcon" className="text-green-600 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    )}

                                    {/* Correo Electrónico */}
                                    {email && (
                                        <a
                                            href={`mailto:${email}`}
                                            className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors group"
                                        >
                                            <div className="w-12 h-12 bg-slate-500 rounded-lg flex items-center justify-center shrink-0">
                                                <Icon name="mailIcon" className="text-white text-sm mb-1" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-bold text-slate-900 text-sm block mb-1">Correo Electrónico</span>
                                                <p className="text-slate-600 text-xs">
                                                    Respuesta dentro de las 24hs
                                                </p>
                                            </div>
                                            <Icon name="arrowOutwardIcon" className="text-green-600 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Renderizado Condicional: Párrafo 3 */}
                    {parrafo3 && (
                        <p className="text-slate-600 leading-relaxed">
                            {parrafo3}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
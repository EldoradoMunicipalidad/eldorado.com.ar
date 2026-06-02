import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../Icons/Icon'

const MAP_THUMBNAIL = `${import.meta.env.BASE_URL}Ciudad/Barrios/miniatura_cards_barrios.png`;
const THUMBNAIL_RETRY_DELAY_MS = 3000;
const THUMBNAIL_MAX_RETRIES = 6;

/**
 * Muestra la miniatura local mientras carga la imagen de Drive.
 * Cuando termina de cargar, hace crossfade a la imagen real.
 */
const LazyDriveThumbnail = ({ driveSrc, children, className, style }) => {
    const [bgSrc, setBgSrc] = useState(MAP_THUMBNAIL);

    useEffect(() => {
        if (!driveSrc || driveSrc === MAP_THUMBNAIL) {
            setBgSrc(MAP_THUMBNAIL);
            return;
        }

        let isCancelled = false;
        let retryTimerId = null;

        const tryLoad = (attempt = 1) => {
            if (isCancelled) return;

            const img = new Image();
            const cacheBust = `${Date.now()}-${attempt}`;
            const separator = driveSrc.includes('?') ? '&' : '?';

            img.onload = () => {
                if (isCancelled) return;
                setBgSrc(img.src);
            };

            img.onerror = () => {
                if (isCancelled) return;

                if (attempt < THUMBNAIL_MAX_RETRIES) {
                    retryTimerId = setTimeout(() => {
                        tryLoad(attempt + 1);
                    }, THUMBNAIL_RETRY_DELAY_MS);
                }
            };

            img.src = `${driveSrc}${separator}cb=${cacheBust}`;
        };

        setBgSrc(MAP_THUMBNAIL);

        tryLoad();

        return () => {
            isCancelled = true;
            if (retryTimerId) {
                clearTimeout(retryTimerId);
            }
        };
    }, [driveSrc]);

    return (
        <div
            className={className}
            style={{
                ...style,
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.38) 100%), url(${bgSrc})`,
                transition: 'background-image 0.3s ease',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {children}
        </div>
    );
};

const getDriveFileId = (value = '') => {
    if (!value) return null;

    // Supports direct IDs like: "1TLmu15D7wowmlFve1482v27_VoDyihvJ"
    if (/^[a-zA-Z0-9_-]{20,}$/.test(value)) {
        return value;
    }

    // Supports URLs like /file/d/:id/(preview|view), /uc?id=:id and /thumbnail?id=:id
    const byPath = value.match(/\/file\/d\/([^/?]+)/);
    if (byPath?.[1]) return byPath[1];

    const byQuery = value.match(/[?&]id=([^&#]+)/);
    return byQuery?.[1] || null;
};

const getCardThumbnail = (item = {}) => {
    const fileId = getDriveFileId(item.fileId || item.documentUrl || item.image || item.to);
    if (!fileId) return MAP_THUMBNAIL;

    // Lightweight preview image served by Drive (no PDF viewer UI).
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w480`;
};

const MapExplorer = ({
    items = [],
    mainTitle = "Visor de Mapas",
}) => {
    const [selectedId, setSelectedId] = useState(items[0]?.id);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activeItem = items.find((item) => item.id === selectedId) || items[0];
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const docUrl = activeItem?.documentUrl || activeItem?.image;
    const isDriveUrl = docUrl?.includes('drive.google.com');
    const viewerRef = useRef(null);

    useEffect(() => {
        const onEscape = (event) => {
            if (event.key === 'Escape') {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', onEscape);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onEscape);
        };
    }, [isModalOpen]);

    const openPreviewModal = (itemId) => {
        setSelectedId(itemId);
        setIsModalOpen(true);
    };

    return (
        <section
            id='delimitacion-barrios'
            className="overflow-hidden bg-slate-50 px-4 py-8 md:px-8 md:py-12 xl:px-16"
        >
            <div className="mx-auto max-w-360 text-slate-900">

                <section className="px-4 py-6 md:px-6 md:py-8">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <h3 className="text-2xl font-black tracking-[-0.04em] text-[#00355f] md:text-4xl">Divisiones barriales</h3>

                        </div>
                    </div>

                    <div className="mb-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                        <label className="relative block">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Icon name="searchIcon" size={18} className="text-current" />
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar barrio o sector urbano"
                                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </label>
                    </div>

                    {filteredItems.length ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                            {filteredItems.map((item, index) => {
                                const isSelected = selectedId === item.id;
                                const itemNumber = String(index + 1).padStart(2, '0');
                                const thumbnailSrc = getCardThumbnail(item);

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => openPreviewModal(item.id)}
                                        className={`group flex flex-col items-center text-center transition-all duration-300 ${isSelected ? 'scale-[1.01]' : 'hover:-translate-y-1 hover:scale-[1.01]'}`}
                                    >

                                        <div className={`relative aspect-5/6 w-full overflow-hidden rounded-xl border bg-white p-2 text-left shadow-[0_4px_14px_rgba(15,76,129,0.08)] transition-all duration-300 ${isSelected ? 'border-[#00355f] ring-2 ring-sky-100 shadow-[0_12px_24px_rgba(15,76,129,0.16)]' : 'border-slate-200 group-hover:border-sky-300 group-hover:shadow-[0_10px_20px_rgba(15,76,129,0.14)]'}`}>
                                            <div className="absolute inset-x-2 top-2 flex items-center justify-between">
                                                <span className="rounded-full border border-slate-200/80 bg-white/90 px-1.5 py-0.5 text-[0.52rem] font-bold uppercase tracking-[0.14em] text-slate-500">
                                                    Plano
                                                </span>
                                                <span className="text-[0.56rem] font-bold tracking-[0.12em] text-slate-400">{itemNumber}</span>
                                            </div>

                                            <LazyDriveThumbnail
                                                driveSrc={thumbnailSrc}
                                                className="relative flex h-full flex-col justify-end overflow-hidden rounded-lg border border-slate-200/70 px-2 py-2"
                                            >
                                                <div className="relative mb-1 flex items-center justify-end">
                                                    <span className="rounded-full border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-[#00355f] opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                        Vista previa
                                                    </span>
                                                </div>

                                                <div className="relative space-y-1">
                                                    <div className="h-px w-6 bg-slate-300" />
                                                    <p className="line-clamp-2 text-[0.68rem] font-black uppercase leading-4 tracking-[0.03em] text-slate-700">
                                                        {item.name}
                                                    </p>
                                                </div>
                                            </LazyDriveThumbnail>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid min-h-90 place-items-center rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 text-center">
                            <div>
                                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                                    <Icon name="mapIcon" size={28} className="text-current" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-700">No se encontraron coincidencias</h4>
                                <p className="mt-2 text-sm text-slate-500">Ajusta la búsqueda para volver a cargar el índice territorial.</p>
                            </div>
                        </div>
                    )}
                </section>

                <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(114, 119, 128, 0.35); border-radius: 999px; }
        .custom-scrollbar {
          touch-action: pan-y;
          overscroll-behavior: contain;
        }
      `}</style>
            </div>

            {isModalOpen && activeItem && (
                <div
                    className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm md:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Vista previa ampliada de ${activeItem.name}`}
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="relative flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-[#0f1724] shadow-[0_22px_65px_rgba(2,6,23,0.55)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-white/10 bg-[#0b2238] px-4 py-3 text-white md:px-6">
                            <div className="flex items-center gap-3">
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sky-100">
                                    <Icon name="locationOnIcon" size={18} className="text-current" />
                                </span>
                                <div>
                                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-sky-100/70">Vista previa ampliada</p>
                                    <h4 className="text-base font-bold uppercase tracking-wide md:text-lg">{activeItem.name}</h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={docUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-white/15 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10"
                                >
                                    Abrir archivo
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
                                    aria-label="Cerrar vista previa"
                                >
                                    <span className="text-xl leading-none">×</span>
                                </button>
                            </div>
                        </div>

                        <div ref={viewerRef} className="relative flex-1 bg-[radial-gradient(circle_at_top,#1f4666_0%,#0f1724_55%,#09111c_100%)] p-2 md:p-4">
                            <div className="h-full overflow-hidden rounded-[20px] border border-white/10 bg-white">
                                {isDriveUrl ? (
                                    <iframe
                                        src={docUrl}
                                        title={activeItem.name}
                                        className="h-full w-full border-0"
                                        allowFullScreen
                                    />
                                ) : (
                                    <img
                                        src={docUrl}
                                        alt={activeItem.name}
                                        className="h-full w-full object-contain bg-slate-100"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MapExplorer;
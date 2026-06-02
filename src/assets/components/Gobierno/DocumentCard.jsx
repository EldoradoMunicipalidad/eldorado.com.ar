import Icon from '../../Icons/Icon';

export const DocumentCard = ({ titulo, to }) => {
  return (
    <div className="group flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <div className="flex-1">
        <p className="text-sky-500 font-bold text-sm mb-1 group-hover:text-sky-400 transition-colors">
          {titulo}
        </p>
      </div>

      {to ? (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-10 h-10 flex items-center justify-center bg-sky-200 rounded-full hover:bg-sky-500 hover:cursor-pointer transition-all group-hover:scale-105 active:scale-85"
          aria-label={`Descargar ${titulo}`}
        >
          <Icon name="downloadIcon" className="text-sky-500 group-hover:text-sky-500 hover:text-white text-xl leading-none" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="shrink-0 w-10 h-10 flex items-center justify-center bg-slate-200 rounded-full cursor-not-allowed opacity-70"
          aria-label={`Sin enlace para ${titulo}`}
        >
          <span className="material-symbols-outlined text-slate-400 text-xl leading-none">download</span>
        </button>
      )}
    </div>
  );
};
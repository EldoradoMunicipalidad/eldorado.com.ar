export const Titulo = ({ subtitulo, textoPrincipal }) => (
  <div className="mb-8">
    <span className="text-xs font-bold tracking-widest text-sky-500 uppercase mb-2 block">
      {subtitulo}
    </span>
    <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">
      {textoPrincipal}
    </h1>
  </div>
);
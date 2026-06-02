import Icon from "../../Icons/Icon";

export const Mision = ({ texto }) => (
  <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-20">
      <Icon name="target" size={128} className="text-slate-500" />
    </div>
    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
      <span className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
        <Icon name="flag" size={24} className="text-sky-600" />
      </span>
      Misión
    </h2>
    <p className="text-lg leading-relaxed text-slate-600 relative z-10">
      {texto}
    </p>
  </div>
);
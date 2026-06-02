import Icon from '../../Icons/Icon';

export const FuncionesPrincipales = ({ items = [] }) => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 mb-6 px-2">
      Funciones Principales
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div key={index} className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-primary/10 shrink-0 flex items-center justify-center">
            <Icon
              name={item.icono || item.icon}
              className="h-6 w-6 text-sky-500"
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">{item.titulo}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {item.descripcion || item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
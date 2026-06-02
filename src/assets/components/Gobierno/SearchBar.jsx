import Icon from '../../Icons/Icon';

export const SearchBar = ({ onSearch }) => {
  return (
    <div className="relative max-w-2xl mx-auto mb-10 px-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="searchIcon" className="text-slate-400 group-focus-within:text-sky-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Buscar leyes, decretos o resoluciones..."
          className="w-full bg-white border border-slate-100 py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-600 placeholder:text-slate-400"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};
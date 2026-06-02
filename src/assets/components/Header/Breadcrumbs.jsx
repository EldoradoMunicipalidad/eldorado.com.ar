import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = ({ allLinks }) => {
    const location = useLocation();

    // 1. Limpiamos la ruta actual de anclas (#) y la dividimos en partes
    const currentPath = location.pathname.split('#')[0];
    const pathnames = currentPath.split('/').filter((x) => x);

    // No renderizar en la Home
    if (location.pathname === "/" || pathnames.length === 0) return null;

    // Función robusta para encontrar datos del item ignorando el hash (#)
    const findItemData = (path) => {
        const clean = (url) => url?.split(/[?#]/)[0];

        for (const item of allLinks) {
            if (clean(item.to) === path) return item;

            if (item.subItems) {
                for (const sub of item.subItems) {
                    if (clean(sub.to) === path) return sub;

                    const kw = sub.keywords?.find(k => clean(k.to) === path);
                    if (kw) return kw;
                }
            }
        }
        return null;
    };

    // Obtenemos el item principal de la ruta actual para sacar el dropdownLabel
    const currentItem = findItemData(currentPath);

    return (
        <div className="w-full bg-slate-50 ">
            <div className="max-w-7xl mx-auto px-6 py-3">
                <ol className="flex items-center space-x-2 text-sm text-slate-600 font-medium">
                    {/* Nivel 1: Inicio */}
                    <li className="flex items-center">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
                    </li>

                    {/* Nivel 2: Categoría del Dropdown (ej: Ciudad, Gobierno, Servicios) */}
                    {currentItem?.dropdownLabel && (
                        <li className="flex items-center space-x-2">
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-500 cursor-default">
                                {currentItem.dropdownLabel}
                            </span>
                        </li>
                    )}

                    {/* Nivel 3 y 4: Path dinámico basado en la URL */}
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const item = findItemData(to);

                        const redirects = {
                            "/ciudad": "/ciudad/eldorado",
                            "/gobierno": "/gobierno/intendencia", // Ejemplo: Agrega otros si los necesitas
                            "/servicios": "/servicios/hacienda"   // Ejemplo
                        };

                        // Si la ruta actual está en la lista, usamos el destino nuevo, sino usamos la original
                        const linkDestination = redirects[to] || to;

                        // Prioridad de nombres: breadcrumbLabel > title > label > texto-url
                        const fallbackLabel = value.replace(/-/g, ' ');
                        const label = item?.breadcrumbLabel || item?.title || item?.label || fallbackLabel;
                        const last = index === pathnames.length - 1;

                        return (
                            <li key={to} className="flex items-center space-x-2">
                                <span className="text-slate-400">/</span>
                                {last ? (
                                    <span className="text-gray-900 font-bold capitalize">{label}</span>
                                ) : (
                                    <Link to={linkDestination} className="hover:text-blue-600 capitalize font-medium">
                                        {label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    );
};

export default Breadcrumbs;
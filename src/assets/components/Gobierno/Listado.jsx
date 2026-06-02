import { Link } from 'react-router-dom';

export const Listado = ({ titulo, items = [] }) => {
    if (!items || items.length === 0) return null;

    return (
        <div>
            {titulo && (
                <h4 className="font-bold text-slate-700 mb-3">{titulo}</h4>
            )}
            <ul className="space-y-3">
                {items.map((item, index) => {
                    // Si item es un objeto con propiedades
                    const isObject = typeof item === 'object' && item !== null;
                    const text = isObject ? item.text : item;
                    const to = isObject ? item.to : null;

                    return (
                        <li key={index} className="flex items-start gap-3 text-slate-600">
                            <span className="text-sky-500 font-bold mt-1">•</span>
                            {to ? (
                                <Link to={to} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline hover:text-sky-700 transition-colors">
                                    {text}
                                </Link>
                            ) : (
                                <span>{text}</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

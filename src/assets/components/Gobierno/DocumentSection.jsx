import { useMemo, useState } from 'react';
import { DocumentCard } from '../../components/Gobierno/DocumentCard';
import { SearchBar } from '../../components/Gobierno/SearchBar';

export const DocumentSection = ({ id,  documentos }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const normalizeText = (text = '') =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filteredDocumentos = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    if (!normalizedSearch) return documentos;

    return documentos.filter((doc) =>
      normalizeText(doc.titulo).includes(normalizedSearch)
    );
  }, [documentos, searchTerm]);

  return (
    <section id={id} className="bg-slate-50/50 py-12 px-4 md:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl mb-4">
            Portal de <span className="text-sky-500">Normativas</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Acceda de forma rápida y transparente a toda la documentación oficial actualizada.
          </p>
        </div>

        <SearchBar onSearch={setSearchTerm} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {filteredDocumentos.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredDocumentos.map((doc, index) => (
                <div key={index} className="hover:bg-slate-50/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl overflow-hidden">
                  <DocumentCard {...doc} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-500">
              No se encontraron documentos para esa búsqueda.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
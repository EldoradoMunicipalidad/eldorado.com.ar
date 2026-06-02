import React from 'react';
import { CardsGridContainer } from './CardsGridContainer';
import { SectionTitle } from '../SectionTitle';  

export function InformacionAdicionalSection({
  tag,
  title,
  cardsData = [],
  statsData = []
}) {
  return (
    <section id='info-adicional' className="bg-white text-slate-900 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">

        <SectionTitle
          title="Infórmacion Destacada"
          centered={true}
        />

        {/* Grilla de Tarjetas (Usa tu lógica de 2, 3 o 4 items) */}
        <CardsGridContainer data={cardsData} />

        {/* Sección de Estadísticas Dinámica */}
        {statsData.length > 0 && (
          <div className="mt-8">
            <h4 className="text-center text-xl font-medium text-slate-800 pt-4 mb-8">
              Cifras que transforman la ciudad
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {statsData.map((stat, index) => (
                <StatItem
                  key={index}
                  count={stat.count}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </section>
  );
}

const StatItem = ({ count, label }) => (
  <div className="text-center group">
    <div className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 group-hover:text-[#0EA5E9] transition-colors">
      {count}
    </div>
    <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
      {label}
    </p>
  </div>
);

export default InformacionAdicionalSection;
import React from 'react';

const SectionLayout = ({ title, highlight, description, children }) => {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
      <main className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12 md:mb-20">
          <div>
            <h1 className="text-3xl md:text-5xl font-light text-sky-500 leading-tight">
              {title} <br />
              <span className="text-4xl md:text-6xl text-sky-500 font-semibold">{highlight}</span>
            </h1>
          </div>
          <div>
            <p className="text-lg md:text-slate-600 pl-6">
              {description}
            </p>
          </div>
        </div>

        {/* Contenedor de Grillas de Cards */}
        <div className="space-y-16">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SectionLayout;
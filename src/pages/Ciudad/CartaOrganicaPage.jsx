import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import Icon from '../../assets/Icons/Icon';

export const CartaOrganicaPage = () => {
  return (
    <SectionLayout
      title="Carta Organica"
      highlight=""
      description="La Carta Orgánica es el documento que recoge las diversas normas que organizan el funcionamiento económico, político e institucional de un municipio."
    >
      {/* Cuerpo de texto organizado */}
      <div className="max-w-4xl mx-auto space-y-10 text-slate-700">

        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            Se dice que la carta orgánica es la ley fundamental de esas divisiones administrativas debido a que establece los principios que gobiernan su sistema.
          </p>

          <p className="text-lg leading-relaxed">
            Contiene las funciones y las atribuciones de los organismos locales, la división de los poderes, la distribución de los recursos y otras cuestiones son definidas mediante este conjunto de leyes y disposiciones.
          </p>
        </div>

        {/* Sección de descarga (Replica de la imagen) */}
        <div className="pt-6">
          <a
            href="https://drive.google.com/file/d/1ptME0xx8lbJzN7soO8J05rQj9I6FOUyo/view"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-full shadow-lg shadow-sky-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Icon name="downloadIcon" size={20} className="mr-2" />
            Descargar Archivo
          </a>
        </div>

      </div>
    </SectionLayout>
  )
}

export default CartaOrganicaPage;

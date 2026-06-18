import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import { SECRETARIA_AMBIENTE } from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'
import SectionCardGrid from '../../../../assets/components/SectionCardGrid'
import { getPageContent } from '../../../../lib/pages'
import { Pencil } from 'lucide-react'

const PAGE_ID = 'direccion-ambiente'

const DirAmbientePage = () => {
  const navigate = useNavigate()
  const ambienteSection = SECRETARIA_AMBIENTE[0]
  const ambienteCard = ambienteSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-de-ambiente/ambiente'
  )

  const [isAdmin, setIsAdmin] = useState(false)
  const [content, setContent] = useState(null)

  useEffect(() => {
    setIsAdmin(
      sessionStorage.getItem('reclamos_admin_auth') === 'true' ||
      sessionStorage.getItem('ambiente_admin_auth') === 'true' ||
      sessionStorage.getItem('contenido_admin_auth') === 'true'
    )

    getPageContent(PAGE_ID).then((data) => {
      if (data.content) {
        setContent(data.content)
      }
    }).catch(() => {})
  }, [])

  const header = content?.header
  const mision = content?.mision || ambienteCard?.mision || ''
  const funciones = content?.funciones?.length > 0 ? content.funciones : (ambienteCard?.funciones || [])

  return (
    <>
      <SectionLayout
        title={header?.title || "Dirección de"}
        highlight={header?.highlight || "Ambiente"}
        description={header?.description || "Nos encargamos de gestionar y proteger el medio ambiente, promoviendo prácticas sostenibles y la conservación de los recursos naturales. A través de programas de concientización y proyectos ecológicos, buscamos mejorar la calidad ambiental y garantizar un entorno saludable para todos."}
      >
        {isAdmin && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate(`/admin/contenido/${PAGE_ID}`)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition-colors shadow-sm"
            >
              <Pencil className="w-4 h-4" />
              Editar contenido
            </button>
          </div>
        )}
      </SectionLayout>

      {ambienteCard?.subcards?.length > 0 && (
        <SectionCardGrid
          id="servicios-ambiente"
          bgColor="bg-white"
          categoryTitle="Links de Interés"
          cards={ambienteCard.subcards}
        />
      )}

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {mision && (
            <div className="lg:col-span-12">
              <Mision texto={mision} />
            </div>
          )}

          {funciones?.length > 0 && (
            <div className="lg:col-span-12">
              <FuncionesPrincipales items={funciones} />
            </div>
          )}
        </div>
      </Section>

      
    </>
  )
}

export default DirAmbientePage

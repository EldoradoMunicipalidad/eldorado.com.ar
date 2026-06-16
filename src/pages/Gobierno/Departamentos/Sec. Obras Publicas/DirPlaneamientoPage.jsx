import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import SectionLayout from '../../../../assets/components/SectionLayout'
import {
  SECRETARIA_OBRAS_PUBLICAS,
} from '../../../../data/Gobierno/secretariasCards'
import { Section } from '../../../../assets/components/Section'
import Accordion from '../../../../assets/components/Accordion'
import SectionCardGrid from '../../../../assets/components/SectionCardGrid'
import { Mision } from '../../../../assets/components/Gobierno/Mision'
import { FuncionesPrincipales } from '../../../../assets/components/Gobierno/FuncionesPrincipales'
import Icon from '../../../../assets/Icons/Icon'
import { getPageContent } from '../../../../lib/pages'
import { Pencil } from 'lucide-react'

const PAGE_ID = 'planeamiento'

const DirPlaneamientoPage = () => {
  const navigate = useNavigate()

  // Static fallback data
  const planeamientoSection = SECRETARIA_OBRAS_PUBLICAS[0]
  const planeamientoCard = planeamientoSection?.cards.find(
    (card) => card.to === '/gobierno/secretaria-obras-publicas/planeamiento'
  )
  const staticAccordionItems = planeamientoSection?.accordionItems ?? []

  // Dynamic content from API
  const [content, setContent] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if logged in as admin
    setIsAdmin(sessionStorage.getItem('reclamos_admin_auth') === 'true')

    // Load dynamic content
    getPageContent(PAGE_ID).then((data) => {
      if (data.content) {
        setContent(data.content)
      }
    }).catch(() => {})
  }, [])

  // Use dynamic content if available, otherwise fall back to static
  const header = content?.header
  const mision = content?.mision || planeamientoCard?.mision || ''
  const funciones = content?.funciones?.length > 0 ? content.funciones : (planeamientoCard?.funciones || [])
  const accordionItems = content?.accordionItems?.length > 0 ? content.accordionItems : staticAccordionItems

  return (
    <>
      <SectionLayout
        title={header?.title || "Dirección de"}
        highlight={header?.highlight || "Planeamiento"}
        description={header?.description || "Nos encargamos de la planificación estratégica y el desarrollo urbano, trabajando para diseñar un futuro ordenado y sostenible. A través de proyectos visionarios y una gestión integral, buscamos mejorar la infraestructura y los servicios de la comunidad, promoviendo el crecimiento organizado y armónico."}
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

      {/* Turnero CTA */}
      <Section>
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Sistema de Turnos</h3>
              <p className="text-sky-100 text-sm md:text-base">
                Reservá tu turno para Mesa de Entradas, Catastro, Zonificación y más áreas de Planeamiento.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => navigate('/gobierno/secretaria-obras-publicas/planeamiento/turnero')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-colors shadow-sm"
              >
                <Icon name="calendarIcon" size={20} />
                Sacar Turno
              </button>
              <button
                onClick={() => navigate('/gobierno/secretaria-obras-publicas/planeamiento/turnero/admin')}
                className="flex items-center gap-2 px-4 py-3 bg-white/15 text-white rounded-xl font-semibold hover:bg-white/25 transition-colors text-sm"
              >
                <Icon name="settingsAlertIcon" size={18} />
                Admin
              </button>
            </div>
          </div>
        </div>
      </Section>

      {accordionItems?.length > 0 && (
        <Section>
          <div className="space-y-4">
            {accordionItems.map((accordionItem, index) => (
              <Accordion
                key={accordionItem.title}
                title={accordionItem.title}
                icon={accordionItem.icon}
                contentClassName="p-0"
                defaultOpen={index === 0}
              >
                <SectionCardGrid
                  categoryTitle={null}
                  cards={accordionItem.cards}
                  bgColor="bg-white"
                />
              </Accordion>
            ))}
          </div>
        </Section>
      )}

      
    </>
  )
}

export default DirPlaneamientoPage

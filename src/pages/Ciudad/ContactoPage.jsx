import React, { useState } from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { ContactCard } from '../../assets/components/Ciudad/Contacto/ContactCard'
import { ContactInfo } from '../../assets/components/Ciudad/Contacto/ContactInfo'
import { contactData } from '../../data/contactoSectionData'
import Icon from '../../assets/Icons/Icon'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { useCmsContent } from '../../lib/useCmsContent'
import { DEFAULT_SITE_SETTINGS, SITE_SETTINGS_PAGE_ID } from '../../data/siteSettings'

export const ContactoPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const settings = useCmsContent(SITE_SETTINGS_PAGE_ID, DEFAULT_SITE_SETTINGS)
  const municipality = { ...DEFAULT_SITE_SETTINGS.municipality, ...(settings.municipality || {}) }

  const filteredContacts = contactData.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <>
      <SectionLayout
        title="Contacto"
        highlight=""
        description={`Información de atención de ${municipality.name}`}
      />

      <section className="px-10 md:px-16 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 bg-sky-50 border border-sky-100 rounded-2xl p-5">
          {municipality.phone && <a href={`tel:${municipality.phone.replace(/[^\d+]/g, '')}`} className="flex items-start gap-3 text-slate-700 hover:text-sky-700"><Phone className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" /><span><strong className="block text-xs uppercase tracking-wide text-slate-500">Teléfono principal</strong><span className="text-sm font-semibold">{municipality.phone}</span></span></a>}
          {municipality.email && <a href={`mailto:${municipality.email}`} className="flex items-start gap-3 text-slate-700 hover:text-sky-700 min-w-0"><Mail className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" /><span className="min-w-0"><strong className="block text-xs uppercase tracking-wide text-slate-500">Correo</strong><span className="text-sm font-semibold break-all">{municipality.email}</span></span></a>}
          {municipality.address && <a href={municipality.mapUrl || undefined} target={municipality.mapUrl ? '_blank' : undefined} rel={municipality.mapUrl ? 'noopener noreferrer' : undefined} className="flex items-start gap-3 text-slate-700 hover:text-sky-700"><MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" /><span><strong className="block text-xs uppercase tracking-wide text-slate-500">Dirección</strong><span className="text-sm font-semibold">{municipality.address}</span></span></a>}
          {municipality.hours && <div className="flex items-start gap-3 text-slate-700"><Clock3 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" /><span><strong className="block text-xs uppercase tracking-wide text-slate-500">Horario</strong><span className="text-sm font-semibold">{municipality.hours}</span></span></div>}
        </div>
      </section>
      
      {/* Buscador */}
      <div className="px-10 md:px-16 py-2">
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 hover:border-primary/30 transition-colors">
          <Icon name="searchIcon" className="text-slate-400 text-xl" /><input
            type="text"
            placeholder="Buscar por nombre, teléfono o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Icon name="closeIcon" size={16} />
              </button>
          )}
        </div>
      </div>

      {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-10 py-2 md:px-16 md:pb-12">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
            <ContactCard
              key={index}
              id={contact.id}
              icon="supportAgentIcon"
              title={contact.name}
              subtitle={contact.phone}
              footerLink={contact.location}
              footerText="Ver en el mapa"
              footerIcon="mapIcon"
            >
              {contact.phone && (
                <ContactInfo icon="phoneIcon" label="Teléfono" value={contact.phone} href={`tel:${contact.phone.replace(/\s|-/g, '')}`} />
              )}
              {contact.email && (
                <ContactInfo icon="mailIcon" label="Correo Electrónico" value={contact.email} href={`mailto:${contact.email}`} />
              )}
              {contact.address && (
                <ContactInfo icon="pinDropIcon" label="Dirección" value={contact.address} />
              )}
              {contact.additionalInfo && (
                <ContactInfo icon="infoIcon" label="Información Adicional" value={contact.additionalInfo} />
              )}
            </ContactCard>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">manage_search</span>
              <p className="text-slate-500 text-lg">No se encontraron contactos que coincidan con tu búsqueda</p>
            </div>
          )}
        </div>
    </>

  )
}

export default ContactoPage;

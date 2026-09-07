import React from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { DEFAULT_SITE_SETTINGS } from '../../data/siteSettings'

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500'

function Field({ label, children, hint }) {
  return <label className="block space-y-1"><span className="block text-sm font-semibold text-slate-700">{label}</span>{children}{hint && <span className="block text-xs text-slate-400">{hint}</span>}</label>
}

export default function SiteSettingsAdmin({ data, onChange }) {
  const content = data || DEFAULT_SITE_SETTINGS
  const municipality = { ...DEFAULT_SITE_SETTINGS.municipality, ...(content.municipality || {}) }
  const social = { ...DEFAULT_SITE_SETTINGS.social, ...(content.social || {}) }
  const links = content.footerLinks || []

  const updateMunicipality = (key, value) => onChange({ ...content, municipality: { ...municipality, [key]: value } })
  const updateSocial = (key, value) => onChange({ ...content, social: { ...social, [key]: value } })
  const updateLink = (index, key, value) => {
    const next = [...links]
    next[index] = { ...next[index], [key]: value }
    onChange({ ...content, footerLinks: next })
  }
  const addLink = () => onChange({ ...content, footerLinks: [...links, { id: `enlace-${Date.now()}`, label: '', href: '' }] })
  const removeLink = (index) => onChange({ ...content, footerLinks: links.filter((_, itemIndex) => itemIndex !== index) })
  const moveLink = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= links.length) return
    const next = [...links]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange({ ...content, footerLinks: next })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Configuración general</h2>
        <p className="text-sm text-slate-500 mt-1">Estos datos se muestran en el pie del sitio y en la página de contacto.</p>
      </div>

      <section className="space-y-4">
        <div><h3 className="font-bold text-slate-800">Datos municipales</h3><p className="text-xs text-slate-500">Información principal de atención al ciudadano.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre institucional"><input value={municipality.name} onChange={(e) => updateMunicipality('name', e.target.value)} className={inputClass} /></Field>
          <Field label="Teléfono principal"><input value={municipality.phone} onChange={(e) => updateMunicipality('phone', e.target.value)} className={inputClass} /></Field>
          <Field label="Correo principal"><input type="email" value={municipality.email} onChange={(e) => updateMunicipality('email', e.target.value)} className={inputClass} /></Field>
          <Field label="Horario de atención"><input value={municipality.hours} onChange={(e) => updateMunicipality('hours', e.target.value)} className={inputClass} /></Field>
          <Field label="Dirección"><input value={municipality.address} onChange={(e) => updateMunicipality('address', e.target.value)} className={inputClass} /></Field>
          <Field label="Enlace del mapa"><input value={municipality.mapUrl} onChange={(e) => updateMunicipality('mapUrl', e.target.value)} placeholder="https://maps.google.com/…" className={inputClass} /></Field>
        </div>
      </section>

      <section className="space-y-4">
        <div><h3 className="font-bold text-slate-800">Redes sociales</h3><p className="text-xs text-slate-500">Dejá un campo vacío para ocultar esa red del pie del sitio.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['x', 'X / Twitter'],
            ['youtube', 'YouTube'], ['threads', 'Threads'],
          ].map(([key, label]) => <Field key={key} label={label}><input value={social[key] || ''} onChange={(e) => updateSocial(key, e.target.value)} placeholder="https://…" className={inputClass} /></Field>)}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div><h3 className="font-bold text-slate-800">Enlaces del pie ({links.length})</h3><p className="text-xs text-slate-500">Accesos destacados que aparecen en la columna “Explorar”.</p></div>
          <button onClick={addLink} className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"><Plus className="w-4 h-4" /> Agregar enlace</button>
        </div>
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={link.id || index} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-end bg-slate-50 border border-slate-200 rounded-xl p-3">
              <Field label="Texto"><input value={link.label || ''} onChange={(e) => updateLink(index, 'label', e.target.value)} className={inputClass} /></Field>
              <Field label="Ruta o URL"><input value={link.href || ''} onChange={(e) => updateLink(index, 'href', e.target.value)} placeholder="/ruta o https://…" className={inputClass} /></Field>
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => moveLink(index, -1)} disabled={index === 0} title="Mover arriba" className="p-2 text-slate-500 hover:text-sky-600 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => moveLink(index, 1)} disabled={index === links.length - 1} title="Mover abajo" className="p-2 text-slate-500 hover:text-sky-600 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => removeLink(index)} title="Eliminar" className="p-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Field label="Texto de copyright" hint="El año se agrega automáticamente.">
        <textarea rows={2} value={content.copyright || ''} onChange={(e) => onChange({ ...content, copyright: e.target.value })} className={`${inputClass} resize-none`} />
      </Field>
    </div>
  )
}

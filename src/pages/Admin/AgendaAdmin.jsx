import React, { useMemo, useState } from 'react'
import { AlertCircle, CalendarDays, Loader2, Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react'
import { DEFAULT_AGENDA } from '../../data/siteSettings'
import { uploadCmsImage } from '../../lib/cmsDocuments'

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500'

function Field({ label, children, hint }) {
  return <label className="block space-y-1"><span className="block text-sm font-semibold text-slate-700">{label}</span>{children}{hint && <span className="block text-xs text-slate-400">{hint}</span>}</label>
}

const createEvent = () => ({
  id: `evento-${Date.now()}`,
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  endDate: '',
  time: '',
  location: '',
  category: 'Actividad municipal',
  link: '',
  image: '',
  imageFilename: '',
  enabled: true,
  featured: false,
})

function EventModal({ item, onClose, onSave }) {
  const [draft, setDraft] = useState(item || createEvent())
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const update = (key, value) => setDraft((previous) => ({ ...previous, [key]: value }))

  const uploadImage = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const result = await uploadCmsImage(file)
      setDraft((previous) => ({ ...previous, image: result.url, imageFilename: result.filename }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const submit = (event) => {
    event.preventDefault()
    if (!draft.title.trim() || !draft.date || !draft.location.trim()) {
      setError('Título, fecha y lugar son obligatorios')
      return
    }
    if (draft.endDate && draft.endDate < draft.date) {
      setError('La fecha de finalización no puede ser anterior a la fecha de inicio')
      return
    }
    onSave({ ...draft, title: draft.title.trim(), location: draft.location.trim() })
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">{item ? 'Editar actividad' : 'Nueva actividad'}</h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto">
          <Field label="Título"><input value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="Nombre del evento u operativo" className={inputClass} /></Field>
          <Field label="Descripción"><textarea rows={3} value={draft.description} onChange={(e) => update('description', e.target.value)} className={`${inputClass} resize-none`} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Fecha de inicio"><input type="date" value={draft.date} onChange={(e) => update('date', e.target.value)} className={inputClass} /></Field>
            <Field label="Fecha de finalización" hint="Opcional"><input type="date" value={draft.endDate || ''} min={draft.date} onChange={(e) => update('endDate', e.target.value)} className={inputClass} /></Field>
            <Field label="Horario"><input value={draft.time} onChange={(e) => update('time', e.target.value)} placeholder="18:00 o 8:00 a 12:00" className={inputClass} /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Lugar"><input value={draft.location} onChange={(e) => update('location', e.target.value)} placeholder="Plaza Sarmiento" className={inputClass} /></Field>
            <Field label="Categoría"><input value={draft.category} onChange={(e) => update('category', e.target.value)} placeholder="Cultura, Salud, Deportes…" className={inputClass} /></Field>
          </div>
          <Field label="Enlace con más información" hint="Opcional"><input value={draft.link} onChange={(e) => update('link', e.target.value)} placeholder="/ruta o https://…" className={inputClass} /></Field>
          <Field label="Imagen o flyer" hint="Opcional. Máximo 8 MB.">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-50 border border-sky-300 text-sky-700 rounded-lg text-sm font-semibold cursor-pointer hover:bg-sky-100">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}{uploading ? 'Subiendo…' : 'Subir imagen'}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={uploading} onChange={(e) => uploadImage(e.target.files?.[0])} className="sr-only" />
              </label>
              <span className="text-xs text-slate-500 truncate">{draft.imageFilename || (draft.image ? 'Imagen vinculada' : 'Sin imagen')}</span>
              {draft.image && <button type="button" onClick={() => setDraft((previous) => ({ ...previous, image: '', imageFilename: '' }))} className="text-xs font-semibold text-red-500 hover:text-red-700">Quitar imagen</button>}
            </div>
            <input value={draft.image || ''} onChange={(e) => update('image', e.target.value)} placeholder="O pegá una URL de imagen" className={inputClass} />
          </Field>
          <div className="flex flex-wrap gap-5">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={draft.enabled !== false} onChange={(e) => update('enabled', e.target.checked)} className="w-4 h-4 accent-sky-600" /> Publicado</label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={draft.featured === true} onChange={(e) => update('featured', e.target.checked)} className="w-4 h-4 accent-sky-600" /> Destacado</label>
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 bg-slate-50 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg">Cancelar</button>
          <button type="submit" disabled={uploading} className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg disabled:opacity-50">Aplicar actividad</button>
        </div>
      </form>
    </div>
  )
}

export default function AgendaAdmin({ data, onChange }) {
  const content = data || DEFAULT_AGENDA
  const items = useMemo(() => content.items || [], [content.items])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const query = search.trim().toLowerCase()
  const filtered = items.filter((item) => !query || `${item.title} ${item.location} ${item.category}`.toLowerCase().includes(query))

  const saveItem = (nextItem) => {
    const exists = items.some((item) => item.id === nextItem.id)
    const nextItems = exists ? items.map((item) => item.id === nextItem.id ? nextItem : item) : [nextItem, ...items]
    onChange({ ...content, items: nextItems })
    setModal(null)
  }
  const removeItem = (item) => {
    if (!window.confirm(`¿Eliminar “${item.title}” de la agenda?`)) return
    onChange({ ...content, items: items.filter((entry) => entry.id !== item.id) })
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Agenda Municipal</h2>
        <p className="text-sm text-slate-500 mt-1">Organizá eventos, operativos, actividades culturales y fechas importantes que aparecerán en el inicio.</p>
      </div>
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Título de la sección"><input value={content.title || ''} onChange={(e) => onChange({ ...content, title: e.target.value })} className={inputClass} /></Field>
          <div className="flex flex-wrap items-end gap-5 pb-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={content.enabled !== false} onChange={(e) => onChange({ ...content, enabled: e.target.checked })} className="w-4 h-4 accent-sky-600" /> Mostrar agenda en el inicio</label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={content.showPastEvents === true} onChange={(e) => onChange({ ...content, showPastEvents: e.target.checked })} className="w-4 h-4 accent-sky-600" /> Mostrar vencidos</label>
          </div>
        </div>
        <Field label="Descripción de la sección"><textarea rows={2} value={content.subtitle || ''} onChange={(e) => onChange({ ...content, subtitle: e.target.value })} className={`${inputClass} resize-none`} /></Field>
      </section>
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div><h3 className="font-bold text-slate-800">Actividades ({items.length})</h3><p className="text-xs text-slate-500">Las actividades vencidas se ocultan automáticamente, salvo que habilites su visualización.</p></div>
          <button onClick={() => setModal({ type: 'create' })} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"><Plus className="w-4 h-4" /> Nueva actividad</button>
        </div>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por actividad, lugar o categoría…" className={`${inputClass} pl-9`} /></div>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {filtered.length === 0 ? <div className="py-12 text-center text-sm text-slate-400">No hay actividades para mostrar.</div> : <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className={`flex flex-col md:flex-row md:items-center gap-3 p-4 hover:bg-slate-50 ${item.enabled === false ? 'opacity-55' : ''}`}>
                {item.image ? <img src={item.image} alt="" className="w-full md:w-20 h-24 md:h-14 rounded-lg object-cover bg-slate-100" /> : <div className="w-12 h-12 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0"><CalendarDays className="w-6 h-6" /></div>}
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-sm text-slate-800">{item.title}</p>{item.featured && <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">Destacado</span>}{item.enabled === false && <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-600 rounded-full px-2 py-0.5">Oculto</span>}</div><p className="text-xs text-slate-500 mt-1">{item.date}{item.endDate ? ` al ${item.endDate}` : ''} · {item.time || 'Horario a confirmar'} · {item.location}</p></div>
                <div className="flex gap-1 self-end md:self-auto"><button onClick={() => setModal({ type: 'edit', item })} title="Editar" className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg"><Pencil className="w-4 h-4" /></button><button onClick={() => removeItem(item)} title="Eliminar" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
              </div>
            ))}
          </div>}
        </div>
      </section>
      {modal?.type === 'create' && <EventModal onClose={() => setModal(null)} onSave={saveItem} />}
      {modal?.type === 'edit' && <EventModal item={modal.item} onClose={() => setModal(null)} onSave={saveItem} />}
    </div>
  )
}

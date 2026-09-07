import React, { useMemo, useState } from 'react'
import { AlertCircle, FileText, Loader2, Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react'
import { uploadCmsDocument } from '../../lib/cmsDocuments'

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500'

const emptyBulletin = () => ({
  id: `boletin-${Date.now()}`,
  fechaPublicacion: new Date().toLocaleDateString('es-AR'),
  tipo: 'BOLETÍN OFICIAL',
  titulo: '',
  enlace: '',
  archivoNombre: '',
})

function Field({ label, children, hint }) {
  return <label className="block space-y-1"><span className="block text-sm font-semibold text-slate-700">{label}</span>{children}{hint && <span className="block text-xs text-slate-400">{hint}</span>}</label>
}

function BulletinModal({ item, onClose, onSave }) {
  const [draft, setDraft] = useState(item || emptyBulletin())
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  const uploadPdf = async (file) => {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const result = await uploadCmsDocument(file)
      setDraft((prev) => ({ ...prev, enlace: result.url, archivoNombre: result.filename }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const submit = (event) => {
    event.preventDefault()
    if (!draft.titulo.trim() || !draft.fechaPublicacion.trim() || !draft.enlace.trim()) {
      setError('Título, fecha y PDF o enlace son obligatorios')
      return
    }
    onSave({ ...draft, titulo: draft.titulo.trim(), fechaPublicacion: draft.fechaPublicacion.trim(), enlace: draft.enlace.trim() })
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">{item ? 'Editar boletín' : 'Nuevo boletín oficial'}</h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tipo">
              <select value={draft.tipo} onChange={(e) => update('tipo', e.target.value)} className={`${inputClass} bg-white`}>
                <option value="BOLETÍN OFICIAL">Boletín oficial</option>
                <option value="BOLETÍN OFICIAL ESPECIAL">Edición especial</option>
              </select>
            </Field>
            <Field label="Fecha de publicación" hint="Formato DD/MM/AAAA">
              <input value={draft.fechaPublicacion} onChange={(e) => update('fechaPublicacion', e.target.value)} placeholder="01/09/2026" className={inputClass} />
            </Field>
          </div>
          <Field label="Título">
            <input value={draft.titulo} onChange={(e) => update('titulo', e.target.value)} placeholder="Boletín Nº18 Municipalidad de Eldorado Septiembre 2026" className={inputClass} />
          </Field>
          <Field label="Documento PDF">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-50 border border-sky-300 text-sky-700 rounded-lg text-sm font-semibold cursor-pointer hover:bg-sky-100">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Subiendo…' : 'Subir PDF'}
                <input type="file" accept="application/pdf,.pdf" disabled={uploading} onChange={(e) => uploadPdf(e.target.files?.[0])} className="sr-only" />
              </label>
              <span className="text-xs text-slate-500 truncate">{draft.archivoNombre || (draft.enlace ? 'Documento vinculado' : 'Ningún archivo seleccionado')}</span>
            </div>
          </Field>
          <Field label="O usar un enlace externo" hint="Podés pegar un enlace de Drive u otra fuente en lugar de subir el PDF.">
            <input value={draft.enlace} onChange={(e) => update('enlace', e.target.value)} placeholder="https://…" className={inputClass} />
          </Field>
          {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 bg-slate-50 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg">Cancelar</button>
          <button type="submit" disabled={uploading} className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg disabled:opacity-50">Aplicar boletín</button>
        </div>
      </form>
    </div>
  )
}

export default function BoletinesAdmin({ data, onChange }) {
  const content = data || { header: {}, items: [] }
  const items = useMemo(() => content.items || [], [content.items])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((item) => `${item.titulo} ${item.fechaPublicacion} ${item.tipo}`.toLowerCase().includes(query))
  }, [items, search])

  const updateHeader = (key, value) => onChange({ ...content, header: { ...(content.header || {}), [key]: value } })
  const saveItem = (nextItem) => {
    const exists = items.some((item) => item.id === nextItem.id)
    onChange({ ...content, items: exists ? items.map((item) => item.id === nextItem.id ? nextItem : item) : [nextItem, ...items] })
    setModal(null)
  }
  const removeItem = (item) => {
    if (!window.confirm(`¿Quitar “${item.titulo}” del sitio?`)) return
    onChange({ ...content, items: items.filter((entry) => entry.id !== item.id) })
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Boletines Oficiales</h2>
        <p className="text-sm text-slate-500 mt-1">Publicá, corregí o retirá boletines y ediciones especiales. Los cambios se hacen públicos al presionar “Guardar cambios”.</p>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Título del encabezado"><input value={content.header?.title || ''} onChange={(e) => updateHeader('title', e.target.value)} className={inputClass} /></Field>
        <Field label="Texto destacado"><input value={content.header?.highlight || ''} onChange={(e) => updateHeader('highlight', e.target.value)} className={inputClass} /></Field>
        <div className="md:col-span-2"><Field label="Descripción"><textarea rows={2} value={content.header?.description || ''} onChange={(e) => updateHeader('description', e.target.value)} className={`${inputClass} resize-none`} /></Field></div>
      </section>
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div><h3 className="font-bold text-slate-800">Publicaciones ({items.length})</h3><p className="text-xs text-slate-500">El PDF puede subirse directamente o vincularse mediante una URL.</p></div>
          <button onClick={() => setModal({ type: 'create' })} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"><Plus className="w-4 h-4" /> Nuevo boletín</button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título, fecha o tipo…" className={`${inputClass} pl-9`} />
        </div>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {filtered.length === 0 ? <div className="py-12 text-center text-sm text-slate-400">No se encontraron boletines.</div> : (
            <div className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-3 p-4 hover:bg-slate-50">
                  <FileText className="w-5 h-5 text-red-500 shrink-0" />
                  <div className="min-w-0 flex-1"><p className="font-semibold text-sm text-slate-800">{item.titulo}</p><p className="text-xs text-slate-500 mt-1">{item.fechaPublicacion} · {item.tipo}</p></div>
                  <div className="flex gap-1 self-end md:self-auto">
                    <a href={item.enlace} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-50 rounded-lg">Ver PDF</a>
                    <button onClick={() => setModal({ type: 'edit', item })} title="Editar" className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => removeItem(item)} title="Quitar" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {modal?.type === 'create' && <BulletinModal onClose={() => setModal(null)} onSave={saveItem} />}
      {modal?.type === 'edit' && <BulletinModal item={modal.item} onClose={() => setModal(null)} onSave={saveItem} />}
    </div>
  )
}

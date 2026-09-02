import React, { useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500'

function Field({ label, children }) {
  return <label className="block space-y-1"><span className="block text-sm font-semibold text-slate-700">{label}</span>{children}</label>
}

function TextInput({ value, onChange, ...props }) {
  return <input {...props} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />
}

function TextArea({ value, onChange, ...props }) {
  return <textarea {...props} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputClass} resize-none`} />
}

const SUBPAGE_LABELS = {
  boletines: 'Boletines oficiales',
  finanzas: 'Finanzas públicas',
  balancetes: 'Balancetes trimestrales',
  tributos: 'Tributos',
  resumenConsolidado: 'Resumen consolidado de finanzas',
  organigrama: 'Organigrama',
  plantaPersonal: 'Planta de personal',
  escalaSalarial: 'Escala salarial',
  audiencias: 'Registro de audiencias',
}

function SubpageDataEditor({ content, onChange }) {
  const availableKeys = Object.keys(SUBPAGE_LABELS)
  const [selected, setSelected] = useState(availableKeys[0])
  const [draft, setDraft] = useState(() => JSON.stringify(content.subpages?.[availableKeys[0]] || {}, null, 2))
  const [error, setError] = useState('')

  const selectPage = (key) => {
    setSelected(key)
    setDraft(JSON.stringify(content.subpages?.[key] || {}, null, 2))
    setError('')
  }

  const applyDraft = () => {
    try {
      const parsed = JSON.parse(draft)
      onChange({ ...content, subpages: { ...(content.subpages || {}), [selected]: parsed } })
      setError('')
    } catch {
      setError('El contenido no es un JSON válido. Revisá comas, comillas y llaves.')
    }
  }

  return (
    <section className="space-y-4">
      <div><h3 className="font-bold text-slate-800">Datos de las subpáginas</h3><p className="text-xs text-slate-500">Permite modificar los registros completos de boletines, finanzas, balancetes, tributos, organigrama, personal, salarios y audiencias.</p></div>
      <div className="flex flex-col md:flex-row gap-3">
        <select value={selected} onChange={(e) => selectPage(e.target.value)} className={`${inputClass} md:max-w-xs bg-white`}>
          {availableKeys.map((key) => <option key={key} value={key}>{SUBPAGE_LABELS[key]}</option>)}
        </select>
        <button onClick={applyDraft} className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900">Aplicar datos</button>
      </div>
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={18} spellCheck="false" className={`${inputClass} font-mono text-xs`} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  )
}

export default function GobiernoAbiertoAdmin({ data, onChange }) {
  const content = data || { header: {}, intro: '', sections: [], ordinance: { documentos: [] } }
  const sections = content.sections || []
  const ordinance = content.ordinance || { documentos: [] }

  const update = (key, value) => onChange({ ...content, [key]: value })
  const updateHeader = (key, value) => update('header', { ...(content.header || {}), [key]: value })

  const addSection = () => update('sections', [...sections, {
    id: `seccion-${Date.now()}`,
    categoryTitle: 'Nueva sección',
    cards: [],
  }])

  const updateSection = (index, key, value) => {
    const next = [...sections]
    next[index] = { ...next[index], [key]: value }
    update('sections', next)
  }

  const moveSection = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    const next = [...sections]
    ;[next[index], next[target]] = [next[target], next[index]]
    update('sections', next)
  }

  const removeSection = (index) => update('sections', sections.filter((_, i) => i !== index))

  const addCard = (sectionIndex) => {
    const cards = [...(sections[sectionIndex].cards || []), {
      id: `tarjeta-${Date.now()}`,
      title: '',
      description: '',
      icon: 'descriptionIcon',
      to: '',
    }]
    updateSection(sectionIndex, 'cards', cards)
  }

  const updateCard = (sectionIndex, cardIndex, key, value) => {
    const cards = [...(sections[sectionIndex].cards || [])]
    cards[cardIndex] = { ...cards[cardIndex], [key]: value }
    updateSection(sectionIndex, 'cards', cards)
  }

  const removeCard = (sectionIndex, cardIndex) => {
    const cards = (sections[sectionIndex].cards || []).filter((_, i) => i !== cardIndex)
    updateSection(sectionIndex, 'cards', cards)
  }

  const updateOrdinance = (key, value) => update('ordinance', { ...ordinance, [key]: value })
  const updateDocument = (index, key, value) => {
    const documents = [...(ordinance.documentos || [])]
    documents[index] = { ...documents[index], [key]: value }
    updateOrdinance('documentos', documents)
  }
  const addDocument = () => updateOrdinance('documentos', [...(ordinance.documentos || []), { etiqueta: '', href: '', textoEnlace: 'Ver documento' }])
  const removeDocument = (index) => updateOrdinance('documentos', (ordinance.documentos || []).filter((_, i) => i !== index))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Gobierno Abierto</h2>
        <p className="text-sm text-slate-500 mt-1">Administrá la portada, los enlaces principales y la documentación de transparencia.</p>
      </div>

      <section className="space-y-4">
        <h3 className="font-bold text-slate-800">Encabezado y presentación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Título"><TextInput value={content.header?.title} onChange={(v) => updateHeader('title', v)} /></Field>
          <Field label="Texto destacado"><TextInput value={content.header?.highlight} onChange={(v) => updateHeader('highlight', v)} /></Field>
        </div>
        <Field label="Descripción"><TextArea rows={3} value={content.header?.description} onChange={(v) => updateHeader('description', v)} /></Field>
        <Field label="Texto introductorio"><TextArea rows={4} value={content.intro} onChange={(v) => update('intro', v)} /></Field>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div><h3 className="font-bold text-slate-800">Secciones y enlaces ({sections.length})</h3><p className="text-xs text-slate-500">Podés crear, ordenar, ocultar o modificar cada tarjeta.</p></div>
          <button onClick={addSection} className="inline-flex items-center gap-1 px-3 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"><Plus className="w-4 h-4" /> Agregar sección</button>
        </div>
        {sections.map((section, sectionIndex) => (
          <div key={section.id || sectionIndex} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <TextInput value={section.categoryTitle} onChange={(v) => updateSection(sectionIndex, 'categoryTitle', v)} placeholder="Nombre de la sección" />
              <div className="flex items-center gap-1 shrink-0">
                <button title="Mover arriba" disabled={sectionIndex === 0} onClick={() => moveSection(sectionIndex, -1)} className="p-2 text-slate-400 hover:text-sky-600 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                <button title="Mover abajo" disabled={sectionIndex === sections.length - 1} onClick={() => moveSection(sectionIndex, 1)} className="p-2 text-slate-400 hover:text-sky-600 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                <button title="Eliminar sección" onClick={() => removeSection(sectionIndex)} className="p-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {(section.cards || []).map((card, cardIndex) => (
              <div key={card.id || cardIndex} className="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-500">Tarjeta #{cardIndex + 1}</span><button onClick={() => removeCard(sectionIndex, cardIndex)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Título"><TextInput value={card.title} onChange={(v) => updateCard(sectionIndex, cardIndex, 'title', v)} /></Field>
                  <Field label="Ícono"><TextInput value={card.icon} onChange={(v) => updateCard(sectionIndex, cardIndex, 'icon', v)} /></Field>
                  <Field label="Enlace"><TextInput value={card.to} onChange={(v) => updateCard(sectionIndex, cardIndex, 'to', v)} placeholder="/ruta o https://..." /></Field>
                </div>
                <Field label="Descripción"><TextArea rows={2} value={card.description} onChange={(v) => updateCard(sectionIndex, cardIndex, 'description', v)} /></Field>
              </div>
            ))}
            <button onClick={() => addCard(sectionIndex)} className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-800"><Plus className="w-4 h-4" /> Agregar tarjeta</button>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3"><div><h3 className="font-bold text-slate-800">Ordenanza y documentos</h3><p className="text-xs text-slate-500">Estos documentos aparecen en el bloque de transparencia.</p></div><button onClick={addDocument} className="inline-flex items-center gap-1 px-3 py-2 border border-sky-300 text-sky-700 rounded-lg text-sm font-semibold hover:bg-sky-50"><Plus className="w-4 h-4" /> Agregar documento</button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Título"><TextInput value={ordinance.titulo} onChange={(v) => updateOrdinance('titulo', v)} /></Field><Field label="Ancla HTML"><TextInput value={ordinance.id} onChange={(v) => updateOrdinance('id', v)} /></Field></div>
        <Field label="Descripción"><TextArea rows={3} value={ordinance.descripcion} onChange={(v) => updateOrdinance('descripcion', v)} /></Field>
        {(ordinance.documentos || []).map((document, index) => <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end bg-slate-50 rounded-lg p-3 border border-slate-200"><Field label="Etiqueta"><TextInput value={document.etiqueta} onChange={(v) => updateDocument(index, 'etiqueta', v)} /></Field><Field label="URL"><TextInput value={document.href} onChange={(v) => updateDocument(index, 'href', v)} placeholder="https://..." /></Field><button onClick={() => removeDocument(index)} className="p-2 text-red-500 hover:text-red-700" title="Eliminar documento"><Trash2 className="w-4 h-4" /></button></div>)}
      </section>

      <SubpageDataEditor content={content} onChange={onChange} />
    </div>
  )
}

import React from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500'

function Field({ label, children }) { return <label className="block space-y-1"><span className="block text-sm font-semibold text-slate-700">{label}</span>{children}</label> }
function Input({ value, onChange, ...props }) { return <input {...props} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass} /> }

export default function GabineteMunicipalAdmin({ data, onChange }) {
  const content = data || { header: {}, sections: [] }
  const sections = content.sections || []
  const update = (key, value) => onChange({ ...content, [key]: value })
  const updateHeader = (key, value) => update('header', { ...(content.header || {}), [key]: value })
  const updateSection = (index, key, value) => { const next = [...sections]; next[index] = { ...next[index], [key]: value }; update('sections', next) }
  const move = (index, direction) => { const target = index + direction; if (target < 0 || target >= sections.length) return; const next = [...sections]; [next[index], next[target]] = [next[target], next[index]]; update('sections', next) }
  const addSection = () => update('sections', [...sections, { id: `secretaria-${Date.now()}`, titulo: 'Nueva secretaría', integrantes: [] }])
  const removeSection = (index) => update('sections', sections.filter((_, i) => i !== index))
  const addMember = (sectionIndex) => updateSection(sectionIndex, 'integrantes', [...(sections[sectionIndex].integrantes || []), { nombre: '', cargo: '', telefono: '', email: '', icon: 'person' }])
  const updateMember = (sectionIndex, memberIndex, key, value) => { const members = [...(sections[sectionIndex].integrantes || [])]; members[memberIndex] = { ...members[memberIndex], [key]: value }; updateSection(sectionIndex, 'integrantes', members) }
  const removeMember = (sectionIndex, memberIndex) => updateSection(sectionIndex, 'integrantes', (sections[sectionIndex].integrantes || []).filter((_, i) => i !== memberIndex))
  const moveMember = (sectionIndex, memberIndex, direction) => { const members = [...(sections[sectionIndex].integrantes || [])]; const target = memberIndex + direction; if (target < 0 || target >= members.length) return; [members[memberIndex], members[target]] = [members[target], members[memberIndex]]; updateSection(sectionIndex, 'integrantes', members) }

  return (
    <div className="space-y-8">
      <div><h2 className="text-xl font-bold text-slate-800">Gabinete Municipal</h2><p className="text-sm text-slate-500 mt-1">Actualizá secretarías, cargos y datos de contacto publicados.</p></div>
      <section className="space-y-4"><h3 className="font-bold text-slate-800">Encabezado</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Título"><Input value={content.header?.title} onChange={(v) => updateHeader('title', v)} /></Field><Field label="Texto destacado"><Input value={content.header?.highlight} onChange={(v) => updateHeader('highlight', v)} /></Field></div><Field label="Descripción"><Input value={content.header?.description} onChange={(v) => updateHeader('description', v)} /></Field></section>
      <section className="space-y-4"><div className="flex items-center justify-between gap-3"><h3 className="font-bold text-slate-800">Secretarías ({sections.length})</h3><button onClick={addSection} className="inline-flex items-center gap-1 px-3 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"><Plus className="w-4 h-4" /> Agregar secretaría</button></div>
        {sections.map((section, sectionIndex) => <div key={section.id || sectionIndex} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4"><div className="flex items-center gap-2"><Input value={section.titulo} onChange={(v) => updateSection(sectionIndex, 'titulo', v)} placeholder="Nombre de secretaría" /><button title="Mover arriba" disabled={sectionIndex === 0} onClick={() => move(sectionIndex, -1)} className="p-2 text-slate-400 hover:text-sky-600 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button><button title="Mover abajo" disabled={sectionIndex === sections.length - 1} onClick={() => move(sectionIndex, 1)} className="p-2 text-slate-400 hover:text-sky-600 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button><button title="Eliminar secretaría" onClick={() => removeSection(sectionIndex)} className="p-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>
          {(section.integrantes || []).map((member, memberIndex) => <div key={member.id || memberIndex} className="bg-white border border-slate-200 rounded-lg p-3 space-y-3"><div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-500">Integrante #{memberIndex + 1}</span><div className="flex gap-1"><button title="Mover arriba" disabled={memberIndex === 0} onClick={() => moveMember(sectionIndex, memberIndex, -1)} className="p-1 text-slate-400 hover:text-sky-600 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button><button title="Mover abajo" disabled={memberIndex === (section.integrantes || []).length - 1} onClick={() => moveMember(sectionIndex, memberIndex, 1)} className="p-1 text-slate-400 hover:text-sky-600 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button><button title="Eliminar integrante" onClick={() => removeMember(sectionIndex, memberIndex)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Field label="Nombre"><Input value={member.nombre} onChange={(v) => updateMember(sectionIndex, memberIndex, 'nombre', v)} /></Field><Field label="Cargo"><Input value={member.cargo} onChange={(v) => updateMember(sectionIndex, memberIndex, 'cargo', v)} /></Field><Field label="Teléfono"><Input value={member.telefono} onChange={(v) => updateMember(sectionIndex, memberIndex, 'telefono', v)} /></Field><Field label="Correo electrónico"><Input type="email" value={member.email} onChange={(v) => updateMember(sectionIndex, memberIndex, 'email', v)} /></Field><Field label="Ícono"><Input value={member.icon} onChange={(v) => updateMember(sectionIndex, memberIndex, 'icon', v)} /></Field></div></div>)}
          <button onClick={() => addMember(sectionIndex)} className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-800"><Plus className="w-4 h-4" /> Agregar integrante</button>
        </div>)}
      </section>
    </div>
  )
}

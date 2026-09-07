import React, { useMemo } from 'react'
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from 'lucide-react'

const formatDate = (value) => {
  if (!value) return { day: '', month: '', full: '' }
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return { day: '', month: '', full: value }
  return {
    day: new Intl.DateTimeFormat('es-AR', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(date).replace('.', ''),
    full: new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date),
  }
}

const localToday = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export default function AgendaMunicipalSection({ data }) {
  const events = useMemo(() => {
    const today = localToday()
    return (data?.items || [])
      .filter((item) => item.enabled !== false)
      .filter((item) => data?.showPastEvents === true || (item.endDate || item.date) >= today)
      .sort((first, second) => String(first.date || '').localeCompare(String(second.date || '')) || Number(second.featured) - Number(first.featured))
      .slice(0, 6)
  }, [data])

  if (data?.enabled === false || events.length === 0) return null

  return (
    <section className="bg-slate-50 py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-600"><CalendarDays className="w-4 h-4" /> Próximamente</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-3">{data?.title || 'Agenda Municipal'}</h2>
          {data?.subtitle && <p className="text-slate-600 mt-3 leading-relaxed">{data.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map((event) => {
            const date = formatDate(event.date)
            return (
              <article key={event.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${event.featured ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'}`}>
                {event.image && <img src={event.image} alt="" className="w-full h-44 object-cover bg-slate-100" loading="lazy" />}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 shrink-0 rounded-xl overflow-hidden border border-sky-200 text-center">
                      <div className="bg-sky-600 text-white text-[10px] uppercase font-bold tracking-wider py-1">{date.month}</div>
                      <div className="text-2xl font-black text-slate-800 py-1.5">{date.day}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wide text-sky-700 bg-sky-50 rounded-full px-2 py-1">{event.category || 'Actividad municipal'}</span>
                        {event.featured && <span className="text-[10px] uppercase font-bold tracking-wide text-amber-700 bg-amber-100 rounded-full px-2 py-1">Destacado</span>}
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg leading-snug">{event.title}</h3>
                    </div>
                  </div>
                  {event.description && <p className="text-sm text-slate-600 leading-relaxed mt-4 line-clamp-3">{event.description}</p>}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                    <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-sky-500" /><span>{date.full}{event.endDate ? ` al ${formatDate(event.endDate).full}` : ''}</span></p>
                    {event.time && <p className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-sky-500" /><span>{event.time}</span></p>}
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-500" /><span>{event.location}</span></p>
                  </div>
                  {event.link && <a href={event.link} target={event.link.startsWith('http') ? '_blank' : undefined} rel={event.link.startsWith('http') ? 'noopener noreferrer' : undefined} className="inline-flex items-center gap-1 mt-4 text-sm font-bold text-sky-600 hover:text-sky-800">Más información <ArrowUpRight className="w-4 h-4" /></a>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

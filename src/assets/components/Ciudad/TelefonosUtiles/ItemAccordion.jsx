export const ItemAccordion = ({ name, phone }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 gap-2">
      <div className="flex flex-col flex-1">
        <span className="font-bold text-slate-900 text-xs md:text-sm">{name}</span>
      </div>
      <a 
        href={`tel:${phone.replace(/\s|-/g, '')}`} 
        className="px-2 md:px-3 py-2 rounded-lg bg-sky-50 text-sky-500 transition-transform active:scale-95 hover:bg-sky-100 flex-shrink-0"
      >
        <span className="font-bold text-xs md:text-sm whitespace-nowrap">{phone}</span>
      </a>
    </div>
  );
};
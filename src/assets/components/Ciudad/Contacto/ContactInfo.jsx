import Icon from "../../../Icons/Icon";

export const ContactInfo = ({ icon, label, value, href }) => (
  <div className="flex items-start gap-4">
    <Icon name={icon} className="text-sky-500"/>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
      {href ? (
        <a className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors" href={href}>
          {value}
        </a>
      ) : (
        <p className="text-sm font-semibold text-slate-700 leading-relaxed">{value}</p>
      )}
    </div>
  </div>
);
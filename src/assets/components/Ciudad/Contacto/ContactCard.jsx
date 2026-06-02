import Icon from '../../../Icons/Icon'

export const ContactCard = ({ id, icon, title, subtitle, children, footerLink, footerText, footerIcon }) => (
  <div id={id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-primary/20 group">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon name={icon} className="text-sky-500"/>
      </div>
      <div>
        <h3 className="font-bold text-lg text-slate-800 leading-tight">{title}</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</span>
      </div>
    </div>
    
    <div className="space-y-5">
      {children}
      
      {footerLink && (
        <div className="pt-2 border-t border-slate-50">
          <a className="inline-flex items-center gap-2 text-sky-500 text-sm font-bold hover:translate-x-1 transition-transform" href={footerLink} target="_blank" rel="noopener noreferrer">
            {footerText}
            <Icon name={footerIcon} size={16} className="text-sky-500" />
          </a>
        </div>
      )}
    </div>
  </div>
);
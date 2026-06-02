import { ItemAccordion } from './ItemAccordion';
import Icon from '../../../Icons/Icon';

export const Accordion = ({id, title, icon, contacts }) => {
  return (
    <details id={id} className="group bg-white rounded-xl shadow-sm border border-slate-200 transition-all overflow-hidden">
      <summary className="flex cursor-pointer items-center justify-between p-4 list-none">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-sky-50">
            <Icon name={icon} className="text-sky-500"/>
          </div>
          <p className="font-semibold text-slate-800">{title}</p>
        </div>
        <Icon name="expandMoreIcon" className="text-slate-400 group-open:rotate-180 transition-transform"/>
      </summary>
      
      <div className="px-4 pb-2 pt-0 flex flex-col border-t border-slate-50">
        {contacts.map((contact, index) => (
          <ItemAccordion 
            key={index}
            name={contact.name}
            phone={contact.phone}
          />
        ))}
      </div>
    </details>
  );
};
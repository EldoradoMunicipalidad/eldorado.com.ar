import React from 'react'
import { Phone, Mail, MapPin, Map } from 'lucide-react';

export const ContactCard = ({ title, phone, email, address, googleMapsUrl }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Encabezado: Texto fijo a partir de md */}
      {title && (
        <div className="bg-[#31A1E4] px-3 py-1.5 md:px-4 md:py-2">
          <h2 className="text-white font-bold text-xs md:text-sm leading-tight">
            {title}
          </h2>
        </div>
      )}

      {/* Cuerpo: Espaciado fijo a partir de md */}
      <div className="p-3 md:p-4 space-y-2 md:space-y-3 flex-grow">
        
        {phone && (
          <div className="flex items-start gap-2 md:gap-3">
            <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#31A1E4] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-gray-800 font-bold text-[10px] md:text-xs">Teléfono:</span>
              <span className="text-gray-600 text-[10px] md:text-xs leading-tight">{phone}</span>
            </div>
          </div>
        )}

        {email && (
          <div className="flex items-start gap-2 md:gap-3">
            <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#31A1E4] shrink-0 mt-0.5" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-gray-800 font-bold text-[10px] md:text-xs">Correo:</span>
              <a href={`mailto:${email}`} className="text-[#31A1E4] hover:underline text-[10px] md:text-xs truncate">
                {email}
              </a>
            </div>
          </div>
        )}

        {address && (
          <div className="flex items-start gap-2 md:gap-3">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#31A1E4] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-gray-800 font-bold text-[10px] md:text-xs">Dirección:</span>
              <p className="text-gray-600 text-[10px] md:text-xs leading-snug">
                {address}
              </p>
            </div>
          </div>
        )}

        {googleMapsUrl && (
          <div className="flex items-center gap-2 mt-auto">
            <Map className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#31A1E4] shrink-0" />
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" 
               className="text-[#31A1E4] hover:underline text-[10px] md:text-xs font-bold">
              Ver en Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCard;

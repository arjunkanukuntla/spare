import React from 'react';
import { RequestItem } from '../../types';
import { MapPin, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';

interface RequestCardProps {
  request: RequestItem;
  onRespond?: (request: RequestItem) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onRespond }) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-2 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1">
          <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">
            {request.category}
          </span>
          {request.isVerifiedRequester && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
        </div>
        <span className="text-amber-400 font-bold text-[10px]">
          {request.urgency}
        </span>
      </div>

      <div>
        <h4 className="font-extrabold text-xs text-white line-clamp-1">{request.title}</h4>
        <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{request.description}</p>
      </div>

      <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-800 text-slate-400">
        <span>Needs: <strong className="text-white">{request.quantity} {request.unit}</strong></span>
        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-emerald-400" /> {request.distanceKm} km away</span>
      </div>
    </div>
  );
};

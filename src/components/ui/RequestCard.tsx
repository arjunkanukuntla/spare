import React from 'react';
import { RequestItem } from '../../types';
import { MapPin, Clock, Tag, MessageCircle, AlertCircle } from 'lucide-react';

interface RequestCardProps {
  request: RequestItem;
  onRespond?: (request: RequestItem) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onRespond }) => {
  const urgencyColors = {
    Whenever: 'bg-stone-100 text-stone-700 border-stone-200',
    Soon: 'bg-amber-50 text-amber-800 border-amber-200',
    Today: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 rounded-md">
              {request.category}
            </span>
            <span className={`px-2 py-0.5 text-[10px] rounded-md border ${urgencyColors[request.urgency]}`}>
              Needed: {request.urgency}
            </span>
          </div>
          <span className="text-[10px] text-stone-400">
            {new Date(request.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <h3 className="font-bold text-stone-900 text-sm mt-2 line-clamp-1">
          {request.title}
        </h3>
        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
          {request.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={request.requesterAvatar}
            alt={request.requesterName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <div className="text-[11px]">
            <p className="font-medium text-stone-800">{request.requesterName}</p>
            <p className="text-stone-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{request.location}</span>
            </p>
          </div>
        </div>

        {onRespond && (
          <button
            onClick={() => onRespond(request)}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 active:scale-95 transition-all"
          >
            I can help
          </button>
        )}
      </div>
    </div>
  );
};

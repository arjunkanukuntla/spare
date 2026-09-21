import React from 'react';
import { Listing } from '../types';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onClaimQuick: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, onClaimQuick }) => {
  return (
    <div 
      className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group cursor-pointer"
      onClick={() => onSelect(listing)}
    >
      {/* Visual Thumbnail Cover */}
      <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* FREE / Price Badge */}
        <div className="absolute top-2.5 left-2.5">
          {listing.distributionType === 'FREE' ? (
            <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow tracking-wide">
              FREE
            </span>
          ) : (
            <span className="bg-slate-900 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow">
              ₹{listing.price}
            </span>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{listing.distanceKm} km</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-extrabold text-slate-900 text-xs line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          <p className="text-[11px] text-slate-500 font-medium">
            {listing.condition ? `${listing.condition} · ` : ''}
            {listing.remainingQuantity} {listing.unit} left
          </p>
        </div>

        {/* Pickup deadline & CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>{listing.pickupDeadlineTime}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClaimQuick(listing);
            }}
            disabled={listing.remainingQuantity <= 0}
            className={`font-bold text-xs py-1.5 px-3 rounded-xl transition flex items-center gap-1 ${
              listing.remainingQuantity > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{listing.remainingQuantity > 0 ? 'Claim' : 'Claimed'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

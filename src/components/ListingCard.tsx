import React from 'react';
import { Listing } from '../types';
import { MapPin, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onClaimQuick: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, onClaimQuick }) => {
  return (
    <div 
      className="bg-white rounded-3xl border border-slate-200/80 shadow-app-card hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer"
      onClick={() => onSelect(listing)}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* FREE Tag Pill */}
        <div className="absolute top-3 left-3">
          {listing.distributionType === 'FREE' ? (
            <span className="bg-emerald-600 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-md tracking-wider">
              FREE
            </span>
          ) : (
            <span className="bg-slate-900 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-md">
              ₹{listing.price}
            </span>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{listing.distanceKm} km</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Provider Badge */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
            <img src={listing.providerAvatar} alt={listing.providerName} className="w-4 h-4 rounded-full object-cover" />
            <span className="truncate max-w-[120px]">{listing.providerName}</span>
            {listing.isVerifiedProvider && <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />}
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
            {listing.title}
          </h3>

          {/* Quantity & Condition pill */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {listing.remainingQuantity} {listing.unit}
            </span>
            {listing.condition && (
              <span className="bg-slate-100 font-medium px-2 py-0.5 rounded-md text-slate-600">
                {listing.condition}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Pickup Time & Claim Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
            <span className="truncate">{listing.pickupDeadlineTime}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClaimQuick(listing);
            }}
            disabled={listing.remainingQuantity <= 0}
            className={`font-extrabold text-xs py-1.5 px-3.5 rounded-xl transition flex items-center gap-1 flex-shrink-0 ${
              listing.remainingQuantity > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
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

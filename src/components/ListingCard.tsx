import React from 'react';
import { Listing } from '../types';
import { Clock, ShieldCheck, MapPin } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onClaimQuick: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, onClaimQuick }) => {
  const isPaid = listing.distributionType === 'SURPLUS_SALE' || listing.price > 0;

  return (
    <div 
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer"
      onClick={() => onSelect(listing)}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* ONLY show price badge if paid/sale item - FREE is default on SPARE */}
        {isPaid && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-amber-600 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
              ₹{listing.price}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Provider & Distance Subtitle Line */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <div className="flex items-center gap-1 min-w-0">
              <img src={listing.providerAvatar} alt={listing.providerName} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" />
              <span className="truncate">{listing.providerName}</span>
              {listing.isVerifiedProvider && <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />}
            </div>
            <span className="text-slate-400 flex-shrink-0 flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400" /> {listing.distanceKm} km
            </span>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
            {listing.title}
          </h3>

          {/* Quantity & Condition */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {listing.remainingQuantity} {listing.unit}
            </span>
            {listing.condition && (
              <span className="text-slate-500 font-medium">
                {listing.condition}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Pickup Time & Claim Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium min-w-0">
            <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
            <span className="truncate">{listing.pickupDeadlineTime}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClaimQuick(listing);
            }}
            disabled={listing.remainingQuantity <= 0}
            className={`font-extrabold text-xs py-1.5 px-3.5 rounded-xl transition flex-shrink-0 ${
              listing.remainingQuantity > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {listing.remainingQuantity > 0 ? 'Claim' : 'Claimed'}
          </button>
        </div>
      </div>
    </div>
  );
};

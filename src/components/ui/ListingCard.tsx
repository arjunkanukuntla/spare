import React, { useState } from 'react';
import { Listing } from '../../types';
import { MapPin, Clock, Package } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onClaim?: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, onClaim }) => {
  const [imageError, setImageError] = useState(false);
  const isFood = listing.category === 'Food';
  const isAvailable = listing.status === 'ACTIVE';

  // Check if newly added (within 24 hours)
  const isNew = new Date().getTime() - new Date(listing.createdAt).getTime() < 86400000;

  return (
    <div 
      onClick={() => onSelect(listing)}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-stone-300 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col group"
    >
      {/* Fixed 4:3 Aspect Ratio Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {listing.images && listing.images.length > 0 && !imageError ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100 gap-1">
            <Package className="w-7 h-7 text-stone-300 stroke-[1.5]" />
            <span className="text-[11px] font-medium">{listing.category}</span>
          </div>
        )}

        {/* Special Status Tags ONLY (Expiring soon, Claimed, New) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1 items-end">
          {isFood && listing.pickupDeadline && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500 text-white rounded-md shadow-xs">
              Expiring soon
            </span>
          )}
          {!isAvailable && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-stone-800 text-stone-100 rounded-md">
              {listing.status === 'CLAIMED' ? 'Claimed' : listing.status}
            </span>
          )}
          {isAvailable && !isFood && isNew && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-600 text-white rounded-md shadow-xs">
              New
            </span>
          )}
        </div>
      </div>

      {/* Card Content Below Image */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category */}
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            {listing.category}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-stone-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1 mt-0.5">
            {listing.title}
          </h3>
        </div>

        {/* Condition & Location Footer */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span className="font-medium text-stone-600">
            {listing.condition || 'Good'} condition
          </span>

          <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium truncate max-w-[55%]">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{listing.approximateLocation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

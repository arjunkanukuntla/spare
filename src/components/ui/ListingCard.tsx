import React from 'react';
import { Listing } from '../../types';
import { MapPin, Clock, ShieldCheck, Tag, Utensils } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onClaim?: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, onClaim }) => {
  const isFood = listing.category === 'Food';
  const isAvailable = listing.status === 'ACTIVE';

  return (
    <div 
      onClick={() => onSelect(listing)}
      className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer flex flex-col group"
    >
      {/* Photo Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100 font-medium text-xs">
            No Photo
          </div>
        )}

        {/* Category & Condition Tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/90 backdrop-blur-md text-stone-800 rounded-lg shadow-xs border border-stone-200/60">
            {listing.category}
          </span>
          {listing.condition && (
            <span className="px-2 py-1 text-[10px] font-semibold bg-stone-900/80 backdrop-blur-md text-white rounded-lg">
              {listing.condition}
            </span>
          )}
        </div>

        {/* Status Badge or Food Veg Indicator */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isFood && listing.foodDetails ? (
            <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border ${
              listing.foodDetails.vegetarian 
                ? 'bg-emerald-500 text-white border-emerald-600' 
                : 'bg-amber-600 text-white border-amber-700'
            }`}>
              {listing.foodDetails.vegetarian ? '🌱 VEG' : '🍖 NON-VEG'}
            </span>
          ) : (
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-xs ${
              isAvailable 
                ? 'bg-emerald-600 text-white' 
                : 'bg-stone-800 text-stone-200'
            }`}>
              {listing.status}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-stone-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Metadata & Actions Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
          
          {/* Location & Distance */}
          <div className="flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1 font-medium text-stone-700 truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{listing.approximateLocation}</span>
            </div>
            {listing.distanceKm && (
              <span className="text-[11px] text-stone-400 font-medium shrink-0">
                ~{listing.distanceKm} km
              </span>
            )}
          </div>

          {/* Food Deadline Alert if applicable */}
          {isFood && listing.pickupDeadline && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span className="truncate">Pickup by {new Date(listing.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}

          {/* Owner Info & Claim CTA */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <img
                src={listing.ownerAvatar}
                alt={listing.ownerName}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-[11px] font-medium text-stone-600 truncate max-w-[100px]">
                {listing.ownerName}
              </span>
            </div>

            {isAvailable && onClaim && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClaim(listing);
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg active:scale-95 transition-all shadow-xs"
              >
                Claim
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

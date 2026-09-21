import React from 'react';
import { Listing } from '../types';
import { MapPin, Clock, ShieldCheck, Tag, ArrowUpRight, AlertTriangle } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onClaimQuick: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, onClaimQuick }) => {
  const isFood = listing.category === 'Food';

  // Category Emoji helper
  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'Food': return '🍛';
      case 'Books': return '📚';
      case 'College': return '🎓';
      case 'Electronics': return '📱';
      case 'Clothes': return '👕';
      case 'Furniture': return '🪑';
      case 'Household': return '🏠';
      default: return '📦';
    }
  };

  return (
    <div 
      className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden flex flex-col justify-between group"
    >
      {/* Thumbnail Container */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelect(listing)}>
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* FREE / PRICE Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {listing.distributionType === 'FREE' ? (
            <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
              <span>{getCategoryEmoji(listing.category)}</span> FREE
            </span>
          ) : (
            <span className="bg-amber-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md tracking-wider">
              SURPLUS SALE ₹{listing.price}
            </span>
          )}
          {isFood && listing.foodDetails?.vegetarian && (
            <span className="bg-emerald-900/90 text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md">
              🌱 Veg
            </span>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{listing.distanceKm} km</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between cursor-pointer" onClick={() => onSelect(listing)}>
        <div className="space-y-1.5">
          {/* Provider Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 truncate max-w-[140px]">{listing.providerName}</span>
              {listing.isVerifiedProvider && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
              {listing.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {listing.title}
          </h3>

          {/* Quantity & Condition */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-100">
              Available: {listing.remainingQuantity} {listing.unit}
            </span>
            {listing.condition && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-medium">
                {listing.condition}
              </span>
            )}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          {/* Deadline timer */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{listing.pickupDeadlineTime}</span>
            </div>
            <span className="text-slate-400 text-[10px]">Self pickup</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClaimQuick(listing);
            }}
            disabled={listing.remainingQuantity <= 0}
            className={`w-full flex items-center justify-center gap-1 font-bold text-xs py-2.5 px-4 rounded-xl transition ${
              listing.remainingQuantity > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{listing.remainingQuantity > 0 ? 'Claim Now' : 'Fully Claimed'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

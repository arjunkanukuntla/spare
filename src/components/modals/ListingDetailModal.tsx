import React, { useState } from 'react';
import { Listing } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, MapPin, Clock, Star, Share2, Utensils } from 'lucide-react';
import { getShareMessageForListing, openWhatsAppShare, openTelegramShare, copyToClipboard } from '../../utils/sharing';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onClaim: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose, onClaim }) => {
  const { currentUser } = useApp();
  const [copied, setCopied] = useState(false);

  if (!listing) return null;

  const isFood = listing.category === 'Food';
  const isOwner = currentUser.id === listing.ownerId;
  const isAvailable = listing.status === 'ACTIVE';

  const handleCopyLink = async () => {
    const text = getShareMessageForListing(listing);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const text = getShareMessageForListing(listing);
    openWhatsAppShare(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-stone-500 uppercase tracking-wider">
              {listing.category}
            </span>
            <span>•</span>
            <span className="font-medium text-stone-700">
              {listing.condition || 'Good'} condition
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Main Photo (Fixed 4:3 Aspect Ratio) */}
          <div className="relative aspect-4/3 w-full bg-stone-100 rounded-2xl overflow-hidden shadow-inner">
            <img
              src={listing.images[0] || 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600'}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Distance */}
          <div>
            <h2 className="text-xl font-bold text-stone-900 leading-snug">{listing.title}</h2>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1 font-medium text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{listing.approximateLocation}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">About this item</h4>
            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Food Details if applicable */}
          {isFood && listing.pickupDeadline && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pickup deadline:</span>
              </div>
              <strong className="font-bold text-amber-800">
                {new Date(listing.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </div>
          )}

          {/* Pickup Area */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
            <p className="font-semibold text-stone-700">Agreed Pickup Area</p>
            <p className="text-stone-900 font-medium">{listing.pickupArea}</p>
            <p className="text-[10px] text-stone-400">
              Exact private addresses are never revealed publicly. Handovers take place at safe agreed spots.
            </p>
          </div>

          {/* Owner Profile & Reliability */}
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-3">
              <img
                src={listing.ownerAvatar}
                alt={listing.ownerName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-600/20"
              />
              <div>
                <h4 className="font-semibold text-stone-900 text-xs">{listing.ownerName}</h4>
                <p className="text-[11px] text-stone-500">
                  {listing.ownerReliability || 4.9} rating · Reliable
                </p>
              </div>
            </div>
          </div>

          {/* Share Action */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleWhatsApp}
              className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share via WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-all"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Close
          </button>

          {!isOwner && isAvailable && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onClaim(listing)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
              >
                Claim this
              </button>
            </div>
          )}

          {isOwner && (
            <span className="text-xs text-stone-500 italic">
              Your listing
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

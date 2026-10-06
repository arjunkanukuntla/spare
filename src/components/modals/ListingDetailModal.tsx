import React, { useState } from 'react';
import { Listing } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, MapPin, Clock, ShieldCheck, Share2, Utensils, AlertTriangle, MessageCircle, Star } from 'lucide-react';
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

  const handleTelegram = () => {
    const text = getShareMessageForListing(listing);
    openTelegramShare(text, window.location.href);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-lg">
              {listing.category}
            </span>
            {listing.condition && (
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-stone-100 text-stone-700 rounded-md">
                {listing.condition}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Main Image */}
          <div className="relative aspect-16/9 w-full bg-stone-100 rounded-2xl overflow-hidden shadow-inner">
            <img
              src={listing.images[0] || 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600'}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md ${
                isAvailable ? 'bg-emerald-600 text-white' : 'bg-stone-900 text-stone-200'
              }`}>
                {listing.status}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-stone-900 leading-snug">{listing.title}</h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Location & Pickup Area */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-700 font-semibold">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Approximate Location:</span>
              </div>
              <span className="text-stone-900 font-bold">{listing.approximateLocation}</span>
            </div>
            
            <div className="pt-2 border-t border-stone-200/60 flex items-start gap-1.5 text-stone-600">
              <span className="font-bold text-emerald-800 shrink-0">Agreed Pickup Area:</span>
              <span className="font-medium text-stone-800">{listing.pickupArea}</span>
            </div>
            <p className="text-[10px] text-stone-400">
              * Exact private addresses are never revealed publicly. Pickup takes place at safe agreed campus spots.
            </p>
          </div>

          {/* Food Details Section if category is Food */}
          {isFood && listing.foodDetails && (
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Food Surplus Declaration</span>
                </div>
                <span className={`px-2 py-0.5 font-bold rounded-md ${
                  listing.foodDetails.vegetarian ? 'bg-emerald-600 text-white' : 'bg-amber-700 text-white'
                }`}>
                  {listing.foodDetails.vegetarian ? '🌱 VEGETARIAN' : '🍖 NON-VEG'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-amber-900">
                <div>Quantity: <strong className="font-bold">{listing.quantity} {listing.unit}</strong></div>
                <div>Prepared: <strong>{listing.foodDetails.preparationTime}</strong></div>
                <div>Storage: <strong>{listing.foodDetails.storageCondition}</strong></div>
                {listing.pickupDeadline && (
                  <div>Deadline: <strong className="text-amber-700">{new Date(listing.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
                )}
              </div>

              {listing.foodDetails.ingredients && (
                <p className="text-[11px] text-amber-800 border-t border-amber-200 pt-2">
                  <strong>Ingredients / Allergens:</strong> {listing.foodDetails.ingredients}
                </p>
              )}

              <p className="text-[10px] text-amber-700 italic">
                The giver confirms that this food was hygienically prepared and remains safe for redistribution.
              </p>
            </div>
          )}

          {/* Owner Profile Card */}
          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-3">
              <img
                src={listing.ownerAvatar}
                alt={listing.ownerName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-600/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-stone-900 text-sm">{listing.ownerName}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                    {listing.ownerReliability || 5.0} Reliability
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Verified Giver
            </span>
          </div>

          {/* Social Sharing Options */}
          <div className="pt-2">
            <p className="text-xs font-bold text-stone-700 mb-2">Share listing with campus friends:</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleTelegram}
                className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Telegram</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-all"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            Close
          </button>

          {!isOwner && isAvailable && (
            <button
              onClick={() => onClaim(listing)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              Claim this Item
            </button>
          )}

          {isOwner && (
            <span className="text-xs text-stone-500 italic">
              This is your listing
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

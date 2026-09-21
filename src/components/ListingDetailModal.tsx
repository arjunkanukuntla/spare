import React, { useState } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertOctagon, 
  Share2, 
  Heart, 
  Sparkles, 
  Utensils, 
  CheckCircle2, 
  Flag 
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onClaim: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose, onClaim }) => {
  const { submitReport, currentUser } = useApp();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Unsafe food handling');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!listing) return null;

  const isFood = listing.category === 'Food';

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(listing.id, reportReason, reportDetails);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 my-8">
        
        {/* Gallery / Cover Header */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900">
          <img 
            src={listing.images[0]} 
            alt={listing.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="bg-emerald-600 text-white font-black text-sm px-3.5 py-1 rounded-full shadow-lg">
              {listing.distributionType === 'FREE' ? 'FREE (₹0)' : `SURPLUS SALE ₹${listing.price}`}
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-slate-900/80 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {listing.distanceKm} km away
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Header Title & Provider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Category: {listing.category}
              </span>
              <button 
                onClick={() => setReportOpen(!reportOpen)} 
                className="flex items-center gap-1 text-slate-400 hover:text-rose-600 text-xs font-semibold"
              >
                <Flag className="w-3.5 h-3.5" /> Report listing
              </button>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">{listing.title}</h2>

            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
              <img 
                src={listing.providerAvatar} 
                alt={listing.providerName} 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                  {listing.providerName}
                  {listing.isVerifiedProvider && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                </p>
                <p className="text-xs text-slate-500">{listing.providerRole} Provider • {listing.location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{listing.description}</p>
          </div>

          {/* Food Safety & Details Card (If Food) */}
          {isFood && listing.foodDetails && (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <Utensils className="w-4 h-4 text-emerald-700" /> Food Safety & Storage Verification
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Dietary:</span>{' '}
                  <span className="font-bold text-slate-800">{listing.foodDetails.vegetarian ? '🌱 Vegetarian' : '🍖 Non-Veg'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Storage:</span>{' '}
                  <span className="font-bold text-slate-800">{listing.foodDetails.storageCondition}</span>
                </div>
                <div>
                  <span className="text-slate-500">Packaging:</span>{' '}
                  <span className="font-bold text-slate-800">{listing.foodDetails.packagingStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500">Prep Time:</span>{' '}
                  <span className="font-bold text-slate-800">{listing.foodDetails.preparationTime}</span>
                </div>
              </div>
              {listing.foodDetails.safetyConfirmed && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 p-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Provider confirmed food safety & hygiene standards.
                </div>
              )}
            </div>
          )}

          {/* Quantity & Pickup Specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">Remaining Available</p>
              <p className="text-lg font-black text-emerald-600">{listing.remainingQuantity} {listing.unit}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">Pickup Deadline</p>
              <p className="text-sm font-bold text-slate-900">{listing.pickupDeadlineTime}</p>
            </div>
          </div>

          {/* Report Modal Accordion */}
          {reportOpen && (
            <form onSubmit={handleReportSubmit} className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1">
                <AlertOctagon className="w-4 h-4 text-rose-600" /> Report Listing to SPARE Moderation
              </h4>
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Reason</label>
                <select 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-white border border-rose-300 rounded-xl p-2 text-xs text-slate-900"
                >
                  <option value="Unsafe food handling">Unsafe food handling / storage</option>
                  <option value="Misleading details">Misleading details / wrong photo</option>
                  <option value="Wrong location">Incorrect location</option>
                  <option value="Commercial resale scam">Commercial resale scam</option>
                  <option value="Already unavailable">Already unavailable</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Additional details</label>
                <textarea 
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain why this listing violates SPARE guidelines..."
                  className="w-full bg-white border border-rose-300 rounded-xl p-2 text-xs text-slate-900 h-16"
                />
              </div>
              <button 
                type="submit" 
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-4 rounded-xl w-full"
              >
                {reportSubmitted ? 'Report Submitted ✓' : 'Submit Report'}
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 font-medium">Hyperlocal Pickup</p>
            <p className="text-xs font-bold text-emerald-700">₹0 Free Redistribution</p>
          </div>
          <button
            onClick={() => {
              onClose();
              onClaim(listing);
            }}
            disabled={listing.remainingQuantity <= 0}
            className={`font-bold text-sm py-3 px-6 rounded-2xl shadow-lg transition transform active:scale-95 ${
              listing.remainingQuantity > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {listing.remainingQuantity > 0 ? 'Proceed to Claim' : 'Fully Claimed'}
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Utensils, 
  Flag 
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onClaim: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose, onClaim }) => {
  const { submitReport } = useApp();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Unsafe food handling');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!listing) return null;

  const isFood = listing.category === 'Food';
  const isPaid = listing.distributionType === 'SURPLUS_SALE' || listing.price > 0;

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 max-h-[90vh] flex flex-col">
        
        {/* Cover Header */}
        <div className="relative h-56 w-full bg-slate-900 flex-shrink-0">
          <img 
            src={listing.images[0]} 
            alt={listing.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 bg-slate-900/80 text-white p-1.5 rounded-full backdrop-blur-md transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            {isPaid ? (
              <span className="bg-amber-600 text-white font-black text-xs px-3 py-1 rounded-full shadow">
                ₹{listing.price}
              </span>
            ) : <div />}
            <span className="bg-slate-900/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" /> {listing.distanceKm} km away
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="uppercase font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {listing.category}
              </span>
              <button 
                onClick={() => setReportOpen(!reportOpen)} 
                className="flex items-center gap-1 text-slate-400 hover:text-rose-600 text-[11px] font-semibold"
              >
                <Flag className="w-3 h-3" /> Report
              </button>
            </div>

            <h2 className="text-base font-extrabold text-slate-900 leading-snug">{listing.title}</h2>

            <div className="flex items-center gap-2 pt-1">
              <img 
                src={listing.providerAvatar} 
                alt={listing.providerName} 
                className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/30"
              />
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                {listing.providerName}
                {listing.isVerifiedProvider && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">{listing.description}</p>

          {/* Food Details if applicable */}
          {isFood && listing.foodDetails && (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                <Utensils className="w-3.5 h-3.5 text-emerald-700" /> Food Details
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                <div>Diet: <strong className="text-slate-900">{listing.foodDetails.vegetarian ? '🌱 Veg' : '🍖 Non-Veg'}</strong></div>
                <div>Storage: <strong className="text-slate-900">{listing.foodDetails.storageCondition}</strong></div>
              </div>
            </div>
          )}

          {/* Quantity & Pickup Deadline */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <p className="text-[10px] text-slate-500 font-medium">Available</p>
              <p className="text-sm font-black text-slate-900">{listing.remainingQuantity} {listing.unit}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <p className="text-[10px] text-slate-500 font-medium">Pickup Deadline</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{listing.pickupDeadlineTime}</p>
            </div>
          </div>

          {/* Report Accordion */}
          {reportOpen && (
            <form onSubmit={handleReportSubmit} className="bg-rose-50 border border-rose-200 p-3 rounded-2xl space-y-2 text-xs">
              <h4 className="font-bold text-rose-900">Report Listing</h4>
              <select 
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-lg p-1.5 text-xs text-slate-900"
              >
                <option value="Unsafe food handling">Unsafe handling</option>
                <option value="Misleading details">Misleading details</option>
                <option value="Wrong location">Incorrect location</option>
                <option value="Already unavailable">Already unavailable</option>
              </select>
              <button 
                type="submit" 
                className="bg-rose-600 text-white font-bold text-xs py-1.5 px-3 rounded-lg w-full"
              >
                {reportSubmitted ? 'Submitted ✓' : 'Submit Report'}
              </button>
            </form>
          )}

        </div>

        {/* Footer CTA */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <div>
            <p className="text-[10px] text-slate-500 font-medium">Self Pickup</p>
            <p className="text-xs font-bold text-slate-900">{isPaid ? `₹${listing.price}` : 'Free'}</p>
          </div>
          <button
            onClick={() => {
              onClose();
              onClaim(listing);
            }}
            disabled={listing.remainingQuantity <= 0}
            className={`font-bold text-xs py-2.5 px-5 rounded-xl transition ${
              listing.remainingQuantity > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
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

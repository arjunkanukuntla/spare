import React, { useState } from 'react';
import { Listing } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, MessageSquare, ShieldCheck } from 'lucide-react';

interface ClaimModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ listing, onClose }) => {
  const { claimItem, setActiveTab } = useApp();
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!listing) return null;

  const handleConfirmClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const success = claimItem(listing.id, message);
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
        onClose();
        setActiveTab('activity');
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-bold text-stone-900 text-lg">Claim Item</h2>
            <p className="text-xs text-stone-500">100% Free Surplus Exchange</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg">Claim Request Sent!</h3>
            <p className="text-xs text-stone-600">
              We notified <strong>{listing.ownerName}</strong>. Once accepted, your pickup details will be unlocked under Activity.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmClaim} className="p-6 space-y-4">
            
            {/* Listing Summary Box */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{listing.title}</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">From: {listing.ownerName}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Add a quick message to {listing.ownerName} (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Hi! I've been looking for this calculator for my upcoming semester exams. I can pick up near CSE Block tomorrow."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>SPARE transfers are always free. No payments or fees are involved.</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Submit Claim
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

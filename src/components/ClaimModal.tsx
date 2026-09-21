import React, { useState } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, MapPin, Truck, ArrowRight } from 'lucide-react';

interface ClaimModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ listing, onClose }) => {
  const { claimItem, setActiveTab } = useApp();

  const [claimQty, setClaimQty] = useState<number>(1);
  const [pickupMethod, setPickupMethod] = useState<'SELF_PICKUP' | 'DELIVERY'>('SELF_PICKUP');
  const [claimedOtp, setClaimedOtp] = useState<string | null>(null);

  if (!listing) return null;

  const maxAvailable = listing.remainingQuantity;

  const handleConfirmClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const claimResult = claimItem(listing.id, claimQty, pickupMethod);
    if (claimResult) {
      setClaimedOtp(claimResult.otpCode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">Claim item</h2>
            <p className="text-xs text-slate-500 line-clamp-1">{listing.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!claimedOtp ? (
          <form onSubmit={handleConfirmClaim} className="space-y-3.5">
            
            {/* Item Summary */}
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
              <img src={listing.images[0]} alt={listing.title} className="w-12 h-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{listing.title}</p>
                <p className="text-[11px] text-emerald-700 font-bold">FREE</p>
                <p className="text-[10px] text-slate-500">{maxAvailable} {listing.unit} available</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Quantity</span>
                <span className="text-emerald-700 font-extrabold">{claimQty} {listing.unit}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={maxAvailable}
                  value={claimQty}
                  onChange={(e) => setClaimQty(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min={1}
                  max={maxAvailable}
                  value={claimQty}
                  onChange={(e) => setClaimQty(Math.min(maxAvailable, Math.max(1, Number(e.target.value))))}
                  className="w-14 bg-slate-50 border border-slate-200 rounded-xl p-1.5 text-center text-xs font-bold"
                />
              </div>
            </div>

            {/* Pickup choice */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Fulfillment</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPickupMethod('SELF_PICKUP')}
                  className={`p-2.5 rounded-2xl border text-left transition ${
                    pickupMethod === 'SELF_PICKUP'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup
                  </div>
                  <span className="text-[10px] text-emerald-700 font-extrabold block mt-0.5">Free</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPickupMethod('DELIVERY')}
                  className={`p-2.5 rounded-2xl border text-left transition ${
                    pickupMethod === 'DELIVERY'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" /> Delivery
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold block mt-0.5">₹59</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-1.5"
            >
              <span>Claim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* Claimed Success Screen */
          <div className="text-center space-y-3 py-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Claimed.</h3>
              <p className="text-xs text-slate-500 mt-0.5">Someone can use it now.</p>
            </div>

            {/* OTP Code Box */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Pickup OTP</p>
              <div className="text-3xl font-black font-mono tracking-widest text-emerald-300">
                {claimedOtp}
              </div>
              <p className="text-[10px] text-slate-400">{listing.location}</p>
            </div>

            <button
              onClick={() => {
                onClose();
                setActiveTab('activity');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              View Activity
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

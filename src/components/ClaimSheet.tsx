import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, Claim } from '../types';
import { 
  X, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShoppingBag, 
  ShieldCheck, 
  KeyRound,
  Sparkles
} from 'lucide-react';

interface ClaimSheetProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimSheet: React.FC<ClaimSheetProps> = ({ listing, isOpen, onClose }) => {
  const { claimItem } = useApp();
  const [claimQty, setClaimQty] = useState(1);
  const [pickupMethod, setPickupMethod] = useState<'SELF_PICKUP' | 'DELIVERY'>('SELF_PICKUP');
  const [completedClaim, setCompletedClaim] = useState<Claim | null>(null);

  if (!isOpen || !listing) return null;

  const handleClaim = () => {
    const claim = claimItem(listing.id, claimQty, pickupMethod);
    if (claim) {
      setCompletedClaim(claim);
    }
  };

  const handleCloseAll = () => {
    setCompletedClaim(null);
    setClaimQty(1);
    setPickupMethod('SELF_PICKUP');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 transition-all">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h2 className="text-base font-bold text-slate-900">
              {completedClaim ? 'Claim Confirmed!' : 'Claim Surplus Item'}
            </h2>
          </div>
          <button 
            onClick={handleCloseAll}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {completedClaim ? (
            /* CLAIM SUCCESS STATE */
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Successfully Claimed!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  You claimed <strong className="text-slate-900">{completedClaim.quantity} {completedClaim.unit}</strong> of {listing.title}.
                </p>
              </div>

              {/* OTP CODE BOX */}
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase text-emerald-800 tracking-wider">
                  <KeyRound size={16} /> Pickup Verification OTP
                </div>
                <div className="text-4xl font-extrabold tracking-widest text-emerald-900">
                  {completedClaim.otpCode}
                </div>
                <p className="text-[11px] text-emerald-700">
                  Share this 4-digit code with <span className="font-semibold">{listing.providerName}</span> upon pickup to complete transfer.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="font-medium">{listing.location} ({listing.distanceKm} km away)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock size={16} className="text-slate-400" />
                  <span>Deadline: {listing.pickupDeadlineTime || 'Today'}</span>
                </div>
                {completedClaim.pickupMethod === 'DELIVERY' && (
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold pt-1 border-t border-slate-200/60">
                    <Truck size={16} />
                    <span>Delivery assigned (₹59 delivery fee)</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CLAIM FORM STATE */
            <>
              {/* Item Card Brief */}
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <img 
                  src={listing.images[0]} 
                  alt={listing.title} 
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {listing.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm truncate mt-1">{listing.title}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>📍 {listing.distanceKm} km</span>
                    <span>·</span>
                    <span>{listing.remainingQuantity} available</span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Quantity Needed
                </label>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-sm font-semibold text-slate-700">
                    {claimQty} {listing.unit}
                  </span>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setClaimQty(Math.max(1, claimQty - 1))}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 hover:bg-slate-100 transition active:scale-95"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-slate-900 text-base">{claimQty}</span>
                    <button 
                      type="button"
                      onClick={() => setClaimQty(Math.min(listing.remainingQuantity, claimQty + 1))}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 hover:bg-slate-100 transition active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Pickup / Delivery Options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPickupMethod('SELF_PICKUP')}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      pickupMethod === 'SELF_PICKUP'
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <ShoppingBag size={20} className={pickupMethod === 'SELF_PICKUP' ? 'text-emerald-600' : 'text-slate-400'} />
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        FREE
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs font-bold text-slate-900">Self Pickup</div>
                      <div className="text-[11px] text-slate-500">Pick up directly from address</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPickupMethod('DELIVERY')}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      pickupMethod === 'DELIVERY'
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Truck size={20} className={pickupMethod === 'DELIVERY' ? 'text-emerald-600' : 'text-slate-400'} />
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        ₹59
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs font-bold text-slate-900">Hyperlocal Delivery</div>
                      <div className="text-[11px] text-slate-500">Delivered within 45 mins</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Price / Total Summary */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Item Cost</span>
                  <span className="font-semibold text-emerald-600">
                    {listing.price === 0 ? 'FREE' : `₹${listing.price * claimQty}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Fulfillment</span>
                  <span className="font-semibold text-slate-900">
                    {pickupMethod === 'SELF_PICKUP' ? 'Self Pickup (₹0)' : 'Delivery (₹59)'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200/80 pt-2 text-sm">
                  <span>Total Due</span>
                  <span className="text-emerald-600">
                    {listing.price === 0 && pickupMethod === 'SELF_PICKUP' 
                      ? 'FREE (₹0)' 
                      : `₹${(listing.price * claimQty) + (pickupMethod === 'DELIVERY' ? 59 : 0)}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Fair Redistribution Policy: Claim only what you intend to collect.</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-white">
          {completedClaim ? (
            <button
              type="button"
              onClick={handleCloseAll}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition shadow-md text-sm"
            >
              Done & View Activity
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles size={18} /> Confirm Claim ({claimQty} {listing.unit})
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

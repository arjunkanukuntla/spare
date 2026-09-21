import React, { useState } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, ShieldCheck, MapPin, Truck, QrCode, ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Claim Surplus Item</h2>
            <p className="text-xs text-slate-500">{listing.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!claimedOtp ? (
          <form onSubmit={handleConfirmClaim} className="space-y-4">
            
            {/* Item summary */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img src={listing.images[0]} alt={listing.title} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <p className="text-xs font-bold text-slate-900 line-clamp-1">{listing.title}</p>
                <p className="text-xs text-emerald-700 font-bold">
                  {listing.distributionType === 'FREE' ? 'FREE (₹0)' : `₹${listing.price}`}
                </p>
                <p className="text-[11px] text-slate-500">Available: {maxAvailable} {listing.unit}</p>
              </div>
            </div>

            {/* Partial Claim Quantity Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Select Claim Quantity</span>
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
                  className="w-16 bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-xs font-bold"
                />
              </div>
            </div>

            {/* Pickup Method Choice */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Fulfillment Convenience</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPickupMethod('SELF_PICKUP')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    pickupMethod === 'SELF_PICKUP'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Self Pickup
                  </div>
                  <span className="text-[11px] text-emerald-700 font-extrabold mt-1">₹0 FREE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPickupMethod('DELIVERY')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    pickupMethod === 'DELIVERY'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <Truck className="w-4 h-4 text-emerald-600" /> Optional Delivery
                  </div>
                  <span className="text-[11px] text-slate-600 font-bold mt-1">₹59 Logistics Fee</span>
                </button>
              </div>
            </div>

            {/* Price Transparency Breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Surplus Item Cost ({claimQty} {listing.unit})</span>
                <span className="font-bold text-emerald-700">₹0</span>
              </div>
              {pickupMethod === 'DELIVERY' && (
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Convenience Fee</span>
                  <span className="font-bold">₹59</span>
                </div>
              )}
              <div className="pt-1.5 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Total Payable</span>
                <span className="text-emerald-700">{pickupMethod === 'DELIVERY' ? '₹59' : '₹0 FREE'}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Confirm Claim ({claimQty} {listing.unit})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Claim Success & Pickup OTP Screen */
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Item Successfully Claimed!</h3>
              <p className="text-xs text-slate-500 mt-1">Show this 4-Digit Pickup OTP to provider at pickup location.</p>
            </div>

            {/* OTP Code Card */}
            <div className="bg-slate-900 text-white p-5 rounded-3xl border border-emerald-500/40 space-y-2 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Your Pickup Verification OTP</p>
              <div className="text-4xl font-black font-mono tracking-widest text-emerald-300">
                {claimedOtp}
              </div>
              <p className="text-[11px] text-slate-400">Pickup Location: {listing.location}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('activity');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition"
              >
                Go to My Activity
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

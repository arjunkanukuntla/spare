import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Claim } from '../types';
import { X, ShieldCheck, CheckCircle2, KeyRound } from 'lucide-react';

interface OTPVerificationModalProps {
  claim: Claim | null;
  onClose: () => void;
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({ claim, onClose }) => {
  const { verifyPickupOTP } = useApp();
  const [otpInput, setOtpInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!claim) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const isValid = verifyPickupOTP(claim.id, otpInput);
    if (isValid) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } else {
      setErrorMsg('Invalid OTP. Please check claimant code or try universal demo code 1234.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 text-center">
        
        <div className="flex justify-end">
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">Verify Pickup OTP</h3>
          <p className="text-xs text-slate-500 mt-0.5">Enter 4-digit code provided by {claim.claimantName}</p>
        </div>

        {!success ? (
          <form onSubmit={handleVerify} className="space-y-3">
            <input
              type="text"
              maxLength={4}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="e.g. 7429"
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-center text-2xl font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:border-emerald-500"
              required
            />

            {errorMsg && <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition"
            >
              Confirm & Complete Pickup
            </button>

            <p className="text-[10px] text-slate-400">Demo backup code: 1234</p>
          </form>
        ) : (
          <div className="py-4 space-y-2 text-emerald-700">
            <CheckCircle2 className="w-10 h-10 mx-auto" />
            <p className="font-extrabold text-sm">OTP Verified! Transaction Completed.</p>
          </div>
        )}

      </div>
    </div>
  );
};

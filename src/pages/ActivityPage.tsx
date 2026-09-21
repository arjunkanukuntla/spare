import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Claim } from '../types';
import { OTPVerificationModal } from '../components/OTPVerificationModal';
import { ChatModal } from '../components/ChatModal';
import { 
  Activity, 
  MessageSquare
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { claims, listings, requests, currentUser } = useApp();
  const [tab, setTab] = useState<'CLAIMS' | 'GIVEAWAYS' | 'REQUESTS'>('CLAIMS');

  const [verifyModalClaim, setVerifyModalClaim] = useState<Claim | null>(null);
  const [chatModalClaim, setChatModalClaim] = useState<Claim | null>(null);

  const myClaims = claims;
  const myGiveaways = listings.filter(l => l.providerId === currentUser.id);

  return (
    <div className="space-y-4 px-4 py-5 overflow-x-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" /> Activity
        </h1>

        {/* Tab selector */}
        <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl">
          {(['CLAIMS', 'GIVEAWAYS'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                tab === t
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              {t === 'CLAIMS' ? `Claims (${myClaims.length})` : `Giveaways (${myGiveaways.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Claims */}
      {tab === 'CLAIMS' && (
        <div className="space-y-3">
          {myClaims.length > 0 ? (
            myClaims.map((claim) => (
              <div key={claim.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={claim.listingImage} alt={claim.listingTitle} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{claim.listingTitle}</h4>
                      <p className="text-[11px] text-emerald-700 font-bold">
                        {claim.quantity} {claim.unit} · {claim.pickupMethod === 'DELIVERY' ? 'Delivery' : 'Pickup'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    claim.status === 'COMPLETED' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {claim.status === 'COMPLETED' ? 'Completed' : 'Claimed'}
                  </span>
                </div>

                {/* OTP Box */}
                <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">Pickup OTP</span>
                    <span className="text-xl font-black font-mono text-emerald-300">{claim.otpCode}</span>
                  </div>
                  <button
                    onClick={() => setVerifyModalClaim(claim)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Verify
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                  <span>From: <strong className="text-slate-800">{claim.providerName}</strong></span>
                  <button
                    onClick={() => setChatModalClaim(claim)}
                    className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-500 border border-slate-200">
              You haven't claimed anything yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Giveaways */}
      {tab === 'GIVEAWAYS' && (
        <div className="space-y-3">
          {myGiveaways.map((l) => (
            <div key={l.id} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900">{l.title}</h4>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {l.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{l.remainingQuantity} / {l.quantity} {l.unit} left</p>
            </div>
          ))}
        </div>
      )}

      {/* OTP Modal */}
      <OTPVerificationModal
        claim={verifyModalClaim}
        onClose={() => setVerifyModalClaim(null)}
      />

      {/* Chat Modal */}
      <ChatModal
        claim={chatModalClaim}
        onClose={() => setChatModalClaim(null)}
      />

    </div>
  );
};

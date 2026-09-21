import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Claim } from '../types';
import { OTPVerificationModal } from '../components/OTPVerificationModal';
import { ChatModal } from '../components/ChatModal';
import { 
  Activity, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  KeyRound, 
  MessageSquare, 
  Truck,
  PlusCircle
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { claims, listings, requests, currentUser } = useApp();
  const [tab, setTab] = useState<'CLAIMS' | 'GIVEAWAYS' | 'REQUESTS' | 'DELIVERIES'>('CLAIMS');

  const [verifyModalClaim, setVerifyModalClaim] = useState<Claim | null>(null);
  const [chatModalClaim, setChatModalClaim] = useState<Claim | null>(null);

  const myClaims = claims;
  const myGiveaways = listings.filter(l => l.providerId === currentUser.id);
  const myRequests = requests.filter(r => r.requesterId === currentUser.id);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" /> My Activity Dashboard
          </h1>
          <p className="text-xs text-slate-500">Track claim states, pickup OTP verification & fulfillment</p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {(['CLAIMS', 'GIVEAWAYS', 'REQUESTS', 'DELIVERIES'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                tab === t
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'CLAIMS' ? `My Claims (${myClaims.length})` : t === 'GIVEAWAYS' ? `My Giveaways (${myGiveaways.length})` : t === 'REQUESTS' ? `My Requests (${myRequests.length})` : 'Deliveries'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: My Claims */}
      {tab === 'CLAIMS' && (
        <div className="space-y-4">
          {myClaims.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myClaims.map((claim) => (
                <div key={claim.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={claim.listingImage} alt={claim.listingTitle} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{claim.listingTitle}</h4>
                        <p className="text-xs text-emerald-700 font-bold">
                          {claim.quantity} {claim.unit} • {claim.pickupMethod === 'DELIVERY' ? 'Paid Delivery' : 'Self Pickup'}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                      claim.status === 'COMPLETED' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>

                  {/* OTP Code Box */}
                  <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Pickup OTP Code</span>
                      <span className="text-2xl font-black font-mono tracking-widest text-emerald-300">{claim.otpCode}</span>
                    </div>
                    <button
                      onClick={() => setVerifyModalClaim(claim)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition"
                    >
                      Provider Verify
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                    <span>Provider: <strong className="text-slate-800">{claim.providerName}</strong></span>
                    <button
                      onClick={() => setChatModalClaim(claim)}
                      className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
              No claims made yet. Browse nearby surplus on the home feed!
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Giveaways */}
      {tab === 'GIVEAWAYS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGiveaways.map((l) => (
              <div key={l.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900">{l.title}</h4>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {l.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Remaining: {l.remainingQuantity} / {l.quantity} {l.unit}</p>
              </div>
            ))}
          </div>
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

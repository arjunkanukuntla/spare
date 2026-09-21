import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Claim } from '../types';
import { OTPVerificationModal } from '../components/OTPVerificationModal';
import { ChatModal } from '../components/ChatModal';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  Activity, 
  MessageSquare,
  KeyRound,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Package,
  HelpCircle
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { claims, listings, requests, currentUser, setGiveModalOpen, setRequestModalOpen } = useApp();
  const [tab, setTab] = useState<'CLAIMS' | 'GIVES' | 'REQUESTS'>('CLAIMS');

  const [verifyModalClaim, setVerifyModalClaim] = useState<Claim | null>(null);
  const [chatModalClaim, setChatModalClaim] = useState<Claim | null>(null);

  const myClaims = claims;
  const myGives = listings.filter(l => l.providerId === currentUser.id);
  const myRequests = requests.filter(r => r.requesterId === currentUser.id);

  return (
    <div className="space-y-4 px-4 py-4 pb-24">
      
      {/* Page Header & Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" /> My Activity
          </h1>
          <span className="text-xs font-semibold text-slate-500">
            {currentUser.name}
          </span>
        </div>

        {/* 3 Tab Selector */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
          <button
            onClick={() => setTab('CLAIMS')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              tab === 'CLAIMS'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claims ({myClaims.length})
          </button>

          <button
            onClick={() => setTab('GIVES')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              tab === 'GIVES'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gives ({myGives.length})
          </button>

          <button
            onClick={() => setTab('REQUESTS')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              tab === 'REQUESTS'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Requests ({myRequests.length})
          </button>
        </div>
      </div>

      {/* TAB 1: MY CLAIMS */}
      {tab === 'CLAIMS' && (
        <div className="space-y-3">
          {myClaims.length > 0 ? (
            myClaims.map((claim) => (
              <div key={claim.id} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3.5 hover:border-slate-300 transition">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={claim.listingImage || 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=200'} 
                      alt={claim.listingTitle} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100" 
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{claim.listingTitle}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        <strong className="text-emerald-700">{claim.quantity} {claim.unit}</strong> · {claim.pickupMethod === 'DELIVERY' ? 'Hyperlocal Delivery (₹59)' : 'Self Pickup'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    claim.status === 'COMPLETED' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {claim.status === 'COMPLETED' ? 'Completed' : 'Claimed'}
                  </span>
                </div>

                {/* OTP Verification Bar */}
                {claim.status !== 'COMPLETED' ? (
                  <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                        <KeyRound size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Pickup Code</span>
                        <span className="text-xl font-extrabold font-mono text-emerald-400 tracking-wider">{claim.otpCode}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setVerifyModalClaim(claim)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition active:scale-95 shadow-xs"
                    >
                      Verify OTP
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50/80 border border-emerald-100 p-3 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Pickup verified and transaction completed successfully!</span>
                  </div>
                )}

                {/* Footer details */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="truncate max-w-[180px]">From: <strong className="text-slate-800">{claim.providerName}</strong></span>
                  </div>

                  <button
                    onClick={() => setChatModalClaim(claim)}
                    className="flex items-center gap-1 text-emerald-700 font-bold hover:underline bg-emerald-50 px-2.5 py-1 rounded-lg"
                  >
                    <MessageSquare size={14} /> Chat
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              icon={<Package size={28} />}
              title="No Claims Yet"
              description="Find free food, books, or household items nearby and claim them instantly."
              actionLabel="Explore Items Nearby"
              onAction={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          )}
        </div>
      )}

      {/* TAB 2: MY GIVES */}
      {tab === 'GIVES' && (
        <div className="space-y-3">
          {myGives.length > 0 ? (
            myGives.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3 hover:border-slate-300 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100" 
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <strong className="text-slate-900">{item.remainingQuantity}</strong> of {item.quantity} {item.unit} remaining
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-slate-400" />
                    <span>Expires: {item.pickupDeadlineTime || 'Soon'}</span>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    {item.price === 0 ? 'FREE' : `₹${item.price}`}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              icon={<Sparkles size={28} />}
              title="No Active Gives"
              description="Do you have extra food, meals, books, or items lying around? Share them with your community."
              actionLabel="Give Something"
              onAction={() => setGiveModalOpen(true)}
            />
          )}
        </div>
      )}

      {/* TAB 3: MY REQUESTS */}
      {tab === 'REQUESTS' && (
        <div className="space-y-3">
          {myRequests.length > 0 ? (
            myRequests.map((req) => (
              <div key={req.id} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-2 hover:border-slate-300 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {req.urgency} Request
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{req.title}</h4>
                    <p className="text-xs text-slate-500">{req.quantity} {req.unit} · Radius {req.radiusKm} km</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {req.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              icon={<HelpCircle size={28} />}
              title="No Requests Posted"
              description="Looking for specific items, food for a drive, or surplus supplies? Post a request to reach nearby givers."
              actionLabel="Request An Item"
              onAction={() => setRequestModalOpen(true)}
            />
          )}
        </div>
      )}

      {/* OTP Verification Modal */}
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

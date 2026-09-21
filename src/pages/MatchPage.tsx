import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateSmartMatches } from '../services/matchingEngine';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  ArrowRight
} from 'lucide-react';

export const MatchPage: React.FC = () => {
  const { listings, requests, claimItem, triggerConfetti, setActiveTab } = useApp();

  const weddingListing = listings.find(l => l.id === 'list_wedding_220') || listings[0];
  const [selectedListingId, setSelectedListingId] = useState<string>(weddingListing.id);
  const [dispatched, setDispatched] = useState(false);

  const activeListing = listings.find(l => l.id === selectedListingId) || listings[0];
  const matches = calculateSmartMatches(activeListing, requests);

  const handleAutoDistribute = () => {
    matches.forEach(m => {
      claimItem(activeListing.id, m.allocatedQty, 'SELF_PICKUP');
    });
    setDispatched(true);
    triggerConfetti();
  };

  return (
    <div className="space-y-5 px-4 py-5 overflow-x-hidden">
      
      {/* Simple Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Matched for you</h1>

        {/* Listing Selector */}
        <div className="bg-white border border-slate-200 p-3 rounded-2xl">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Listing
          </label>
          <select
            value={selectedListingId}
            onChange={(e) => {
              setSelectedListingId(e.target.value);
              setDispatched(false);
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-xl p-2"
          >
            {listings.map(l => (
              <option key={l.id} value={l.id}>
                {l.title} ({l.remainingQuantity} {l.unit})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recipient Match Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">Recommended matches</h2>
          {!dispatched ? (
            <button
              onClick={handleAutoDistribute}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share surplus</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Shared</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {matches.map((m) => (
            <div 
              key={m.id} 
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img src={m.avatar} alt={m.recipientName} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200" />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-extrabold text-xs text-slate-900">{m.recipientName}</h4>
                      {m.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">{m.distanceKm} km away · {m.allocatedQty} {activeListing.unit}</p>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                  Good match
                </span>
              </div>

              {/* Match reasons pills */}
              <div className="flex flex-wrap gap-1">
                {m.matchReasons.map((reason, rIdx) => (
                  <span 
                    key={rIdx} 
                    className="bg-slate-50 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-100"
                  >
                    ✓ {reason}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Navigation */}
      {dispatched && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 text-center space-y-2 border border-slate-800">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-extrabold">Surplus allocated.</h3>
          <p className="text-xs text-slate-300">
            Pickup codes ready for recipient organizations.
          </p>
          <button
            onClick={() => setActiveTab('activity')}
            className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-500 transition"
          >
            <span>View Activity</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};

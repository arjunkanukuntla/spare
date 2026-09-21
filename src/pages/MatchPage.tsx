import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateSmartMatches } from '../services/matchingEngine';
import { 
  GitMerge, 
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

  const totalAllocated = matches.reduce((acc, m) => acc + m.allocatedQty, 0);

  const handleAutoDistribute = () => {
    matches.forEach(m => {
      claimItem(activeListing.id, m.allocatedQty, 'SELF_PICKUP');
    });
    setDispatched(true);
    triggerConfetti();
  };

  return (
    <div className="space-y-8 pb-24 md:pb-12 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header Banner */}
      <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/30">
              <GitMerge className="w-4 h-4" /> Smart Allocation Matrix
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">Hyperlocal Matching & Allocation</h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Calculates optimal distribution vectors across NGOs, community kitchens, student hostels & nearby individuals based on radius, urgency & capacity.
            </p>
          </div>

          {/* Target Listing Selector */}
          <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-2xl min-w-[260px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Select Surplus Listing
            </label>
            <select
              value={selectedListingId}
              onChange={(e) => {
                setSelectedListingId(e.target.value);
                setDispatched(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white font-bold text-xs rounded-xl p-2 focus:border-emerald-500"
            >
              {listings.map(l => (
                <option key={l.id} value={l.id}>
                  {l.title} ({l.remainingQuantity} {l.unit})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs text-slate-500 font-semibold">Surplus Available</p>
          <p className="text-xl font-black text-slate-900 mt-1">{activeListing.remainingQuantity} {activeListing.unit}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs text-slate-500 font-semibold">Match Score</p>
          <p className="text-xl font-black text-emerald-600 mt-1">98% Optimal</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs text-slate-500 font-semibold">Matched Entities</p>
          <p className="text-xl font-black text-slate-900 mt-1">{matches.length} Groups</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs text-slate-500 font-semibold">Total Allocated</p>
          <p className="text-xl font-black text-teal-600 mt-1">{totalAllocated} {activeListing.unit}</p>
        </div>
      </div>

      {/* Recipient Match Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Recommended Allocation Matrix</h2>
          {!dispatched ? (
            <button
              onClick={handleAutoDistribute}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow transition transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>1-Click Batch Auto-Distribute</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 font-bold text-xs px-4 py-2 rounded-xl border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Dispatched & Claim Codes Generated!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((m) => (
            <div 
              key={m.id} 
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card hover:border-emerald-500/50 transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={m.avatar} alt={m.recipientName} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/20" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-slate-900">{m.recipientName}</h4>
                      {m.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-500">{m.recipientType} • {m.distanceKm} km away</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-50 text-emerald-700 font-black text-xs px-2.5 py-1 rounded-full border border-emerald-200">
                    {m.matchScorePercent}% Match
                  </span>
                </div>
              </div>

              {/* Quantity allocation bar */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Allocation Requirement</span>
                  <span className="text-emerald-700">{m.allocatedQty} / {m.requestedQty} {activeListing.unit}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${(m.allocatedQty / m.requestedQty) * 100}%` }}
                  />
                </div>
              </div>

              {/* Match Reasons Badges */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Match factors</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.matchReasons.map((reason, rIdx) => (
                    <span 
                      key={rIdx} 
                      className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-lg border border-slate-200"
                    >
                      ✓ {reason}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Footer Navigation */}
      {dispatched && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 text-center space-y-3 border border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-extrabold">Surplus Allocation Active!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            All recipient entities received claim confirmations and 4-digit pickup verification codes.
          </p>
          <button
            onClick={() => setActiveTab('activity')}
            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition"
          >
            <span>View Pickup Activity & OTP Codes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

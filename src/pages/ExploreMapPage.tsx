import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, RequestItem } from '../types';
import { MapPin, Navigation, Filter, ShieldCheck, Clock, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { ClaimModal } from '../components/ClaimModal';

export const ExploreMapPage: React.FC = () => {
  const { listings, requests } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FOOD' | 'BOOKS' | 'REQUESTS'>('ALL');
  const [selectedPin, setSelectedPin] = useState<Listing | null>(null);
  const [claimListing, setClaimListing] = useState<Listing | null>(null);

  const filteredListings = listings.filter(l => {
    if (activeFilter === 'FOOD') return l.category === 'Food';
    if (activeFilter === 'BOOKS') return l.category === 'Books' || l.category === 'College';
    return true;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" /> Hyperlocal Explore Map
          </h1>
          <p className="text-xs text-slate-500">Discover active surplus & requests within walking & pickup radius</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['ALL', 'FOOD', 'BOOKS', 'REQUESTS'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeFilter === f 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'ALL' ? '🌟 All Pins' : f === 'FOOD' ? '🍛 Food' : f === 'BOOKS' ? '📚 Books & Gear' : '💡 Requests'}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Simulated Map Container */}
      <div className="relative w-full h-[520px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        
        {/* Map Background Canvas Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        
        {/* Radius Circle Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-dashed border-emerald-500/30 rounded-full pointer-events-none animate-pulse-subtle flex items-center justify-center">
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-emerald-500/30">
            2.5 km Hyperlocal Radius
          </span>
        </div>

        {/* User Location Center Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="w-5 h-5 bg-emerald-500 rounded-full ring-4 ring-emerald-500/30 animate-ping" />
          <div className="w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-lg -mt-4" />
          <span className="bg-slate-900/90 text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-md mt-1 border border-slate-700">
            You Are Here
          </span>
        </div>

        {/* Listing Map Pins */}
        {filteredListings.map((l, i) => {
          // Offsets for demo map visualizer
          const offsets = [
            { top: '32%', left: '42%' },
            { top: '58%', left: '35%' },
            { top: '28%', left: '62%' },
            { top: '65%', left: '60%' },
            { top: '45%', left: '25%' },
            { top: '72%', left: '48%' },
          ];
          const pos = offsets[i % offsets.length];

          const isSelected = selectedPin?.id === l.id;

          return (
            <button
              key={l.id}
              onClick={() => setSelectedPin(l)}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-125 ${
                isSelected ? 'scale-125 z-40' : ''
              }`}
            >
              <div className="relative group">
                <div className={`px-2.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 border text-xs font-black transition ${
                  l.category === 'Food' 
                    ? 'bg-emerald-600 border-emerald-400 text-white' 
                    : 'bg-indigo-600 border-indigo-400 text-white'
                }`}>
                  <span>{l.category === 'Food' ? '🍛' : '📚'}</span>
                  <span>{l.distributionType === 'FREE' ? 'FREE' : `₹${l.price}`}</span>
                </div>
                {/* Pin Tip */}
                <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
              </div>
            </button>
          );
        })}

        {/* Interactive Pin Popup Modal Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 bg-slate-900/95 text-white border border-emerald-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <img src={selectedPin.images[0]} alt={selectedPin.title} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-extrabold text-sm text-white line-clamp-1">{selectedPin.title}</h4>
                  <p className="text-xs text-emerald-400 font-bold">{selectedPin.distanceKm} km away • {selectedPin.remainingQuantity} {selectedPin.unit} left</p>
                </div>
              </div>
              <button onClick={() => setSelectedPin(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300 mt-2 line-clamp-2">{selectedPin.description}</p>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-400 text-[10px]">Exact pin hidden until claim</span>
              <button
                onClick={() => {
                  setClaimListing(selectedPin);
                  setSelectedPin(null);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition flex items-center gap-1"
              >
                <span>Claim Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Claim Modal */}
      <ClaimModal
        listing={claimListing}
        onClose={() => setClaimListing(null)}
      />

    </div>
  );
};

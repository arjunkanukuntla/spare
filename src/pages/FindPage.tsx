import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, ListingCategory } from '../types';
import { ListingCard } from '../components/ui/ListingCard';
import { CategoryChip } from '../components/ui/CategoryChip';
import { Search, MapPin, List } from 'lucide-react';

interface FindPageProps {
  onSelectListing?: (listing: Listing) => void;
}

export const FindPage: React.FC<FindPageProps> = ({ onSelectListing }) => {
  const { listings, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useApp();

  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [claimListing, setClaimListing] = useState<Listing | null>(null);

  const categories: { label: ListingCategory | 'All'; emoji: string }[] = [
    { label: 'All', emoji: '🌟' },
    { label: 'College', emoji: '🎓' },
    { label: 'Books', emoji: '📚' },
    { label: 'Food', emoji: '🍛' },
    { label: 'Electronics', emoji: '📱' },
    { label: 'Clothes', emoji: '👕' },
    { label: 'Furniture', emoji: '🪑' },
    { label: 'Household', emoji: '🏠' },
    { label: 'Other', emoji: '📦' },
  ];

  const filteredListings = listings.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesRadius = item.distanceKm <= radiusKm;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRadius && matchesSearch;
  });

  return (
    <div className="space-y-4 px-4 py-4 pb-24 overflow-x-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Find nearby</h1>
        
        {/* View Toggle */}
        <div className="bg-slate-200 p-0.5 rounded-xl flex items-center gap-0.5">
          <button
            onClick={() => setViewMode('LIST')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List
          </button>
          <button
            onClick={() => setViewMode('MAP')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              viewMode === 'MAP' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Map
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for something you need..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 shadow-spare-card"
        />
      </div>

      {/* Radius Filter Pills */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold text-slate-500">Radius:</span>
        {[1, 3, 5, 10].map((r) => (
          <button
            key={r}
            onClick={() => setRadiusKm(r)}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              radiusKm === r ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {r} km
          </button>
        ))}
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <CategoryChip
            key={cat.label}
            label={cat.label}
            emoji={cat.emoji}
            selected={selectedCategory === cat.label}
            onClick={() => setSelectedCategory(cat.label)}
          />
        ))}
      </div>

      {/* Content */}
      {viewMode === 'LIST' ? (
        <div className="grid grid-cols-2 gap-3 pt-1">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onSelect={(item) => onSelectListing?.(item)}
              onClaimQuick={(item) => setClaimListing(item)}
            />
          ))}
        </div>
      ) : (
        /* Map View Canvas */
        <div className="relative w-full h-[420px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-dashed border-emerald-500/40 rounded-full pointer-events-none animate-pulse flex items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-slate-900/90 px-2 py-0.5 rounded-full">
              {radiusKm} km radius
            </span>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
            <div className="w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-emerald-500/30" />
          </div>

          {filteredListings.map((l, i) => {
            const offsets = [
              { top: '32%', left: '42%' },
              { top: '58%', left: '35%' },
              { top: '28%', left: '62%' },
              { top: '65%', left: '60%' },
              { top: '45%', left: '25%' },
            ];
            const pos = offsets[i % offsets.length];

            return (
              <button
                key={l.id}
                onClick={() => onSelectListing?.(l)}
                style={{ top: pos.top, left: pos.left }}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
              >
                <div className="bg-slate-900 border border-emerald-500 text-white font-bold text-[10px] px-2 py-1 rounded-xl shadow-lg flex items-center gap-1">
                  <span>{l.category === 'Food' ? '🍛' : '📦'}</span>
                  <span>{l.distanceKm}km</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, ListingCategory } from '../types';
import { ListingCard } from '../components/ListingCard';
import { ListingDetailModal } from '../components/ListingDetailModal';
import { ClaimModal } from '../components/ClaimModal';
import { 
  Search, 
  PlusCircle, 
  HeartHandshake, 
  ArrowRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    listings, 
    requests, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    setGiveModalOpen,
    setRequestModalOpen,
    setActiveTab
  } = useApp();

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [claimListing, setClaimListing] = useState<Listing | null>(null);

  const categories: { label: ListingCategory | 'All'; emoji: string }[] = [
    { label: 'All', emoji: '🌟' },
    { label: 'Food', emoji: '🍛' },
    { label: 'College', emoji: '🎓' },
    { label: 'Books', emoji: '📚' },
    { label: 'Electronics', emoji: '📱' },
    { label: 'Clothes', emoji: '👕' },
    { label: 'Furniture', emoji: '🪑' },
    { label: 'Household', emoji: '🏠' },
    { label: 'Other', emoji: '📦' },
  ];

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const freeListings = filteredListings.filter(l => l.distributionType === 'FREE');
  const expiringListings = listings.filter(
    (l) => l.category === 'Food' && l.remainingQuantity > 0 && l.status === 'ACTIVE'
  ).slice(0, 4);

  return (
    <div className="space-y-6 px-4 py-5 overflow-x-hidden">
      
      {/* Clean Header & Quick Actions */}
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          What's around you?
        </h1>

        {/* Action CTAs */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setGiveModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Give</span>
          </button>

          <button
            onClick={() => setRequestModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow transition active:scale-95"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>I need something</span>
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
          placeholder="Search for something you need"
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
        />
      </div>

      {/* Categories Horizontal Slider */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: Free near you */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Free near you</h2>
          <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
            {freeListings.length} available
          </span>
        </div>

        {freeListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {freeListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={setSelectedListing}
                onClaimQuick={setClaimListing}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-500 border border-slate-200">
            Nothing nearby yet. Check back later or create a request!
          </div>
        )}
      </section>

      {/* SECTION 2: Expiring soon */}
      {expiringListings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Expiring soon</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {expiringListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={setSelectedListing}
                onClaimQuick={setClaimListing}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: Requests nearby */}
      {requests.length > 0 && (
        <section className="bg-slate-900 rounded-3xl p-5 text-white space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white">Requests nearby</h2>
            <button 
              onClick={() => setActiveTab('explore')}
              className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:underline"
            >
              <span>Map</span> <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className="bg-slate-800 border border-slate-700 rounded-2xl p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                    {req.category}
                  </span>
                  <span className="text-amber-400 font-bold">
                    {req.urgency}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-white line-clamp-1">{req.title}</h4>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-700/60">
                  <span>Needs: <strong className="text-white">{req.quantity} {req.unit}</strong></span>
                  <span>{req.distanceKm} km away</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Listing Details Inspection Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onClaim={(item) => setClaimListing(item)}
      />

      {/* Claim Flow Modal */}
      <ClaimModal
        listing={claimListing}
        onClose={() => setClaimListing(null)}
      />

    </div>
  );
};

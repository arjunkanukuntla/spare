import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, ListingCategory } from '../types';
import { ListingCard } from '../components/ListingCard';
import { ListingDetailModal } from '../components/ListingDetailModal';
import { ClaimModal } from '../components/ClaimModal';
import { 
  Search, 
  MapPin, 
  Clock, 
  PlusCircle, 
  HeartHandshake, 
  ArrowRight,
  GitMerge
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    listings, 
    requests, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    filterFreeOnly,
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
    const matchesFree = !filterFreeOnly || item.distributionType === 'FREE';
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesFree && matchesSearch;
  });

  const expiringListings = listings.filter(
    (l) => l.category === 'Food' && l.remainingQuantity > 0 && l.status === 'ACTIVE'
  ).slice(0, 4);

  return (
    <div className="space-y-8 pb-24 md:pb-12 max-w-7xl mx-auto px-4 py-6">
      
      {/* Minimal Clean Hero Banner */}
      <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-lg">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
            Hyperlocal Surplus Redistribution
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            What can you find <span className="text-emerald-400">nearby?</span>
          </h1>

          <p className="text-slate-300 text-sm font-normal max-w-xl">
            Give away surplus food, books, calculators & household items for <strong className="text-emerald-400">FREE (₹0)</strong> to nearby students & community organizations.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setGiveModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Give Something</span>
            </button>

            <button
              onClick={() => setRequestModalOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>I Need Something</span>
            </button>

            <button
              onClick={() => setActiveTab('match')}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition"
            >
              <GitMerge className="w-4 h-4 text-emerald-400" />
              <span>Smart Matching</span>
            </button>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white rounded-3xl p-4 shadow-card border border-slate-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for something you need ('free calculator', 'food', 'books')..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 1: Expiring Soon */}
      {expiringListings.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Expiring Soon Near You</h2>
                <p className="text-[11px] text-slate-500">Time-sensitive surplus food requiring quick pickup</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* SECTION 2: Requests Near You */}
      {requests.length > 0 && (
        <section className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-extrabold text-white">Requests Near You</h2>
                <p className="text-xs text-slate-400">People & organizations asking for surplus items</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('explore')}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Explore Map</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2.5 hover:border-emerald-500/50 transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                    {req.category}
                  </span>
                  <span className="text-amber-400 font-mono text-[11px] font-bold">
                    {req.urgency}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white line-clamp-1">{req.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{req.description}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-700/80 text-slate-400">
                  <span>Needs: <strong className="text-white">{req.quantity} {req.unit}</strong></span>
                  <span>{req.distanceKm} km away</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: Main Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Nearby Surplus</h2>
            <p className="text-xs text-slate-500">Free items available within your radius</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {filteredListings.length} Listings
          </span>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={setSelectedListing}
                onClaimQuick={setClaimListing}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm">No surplus listings match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching for broader keywords or post a request asking nearby community members!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Listing Detail Inspection Modal */}
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

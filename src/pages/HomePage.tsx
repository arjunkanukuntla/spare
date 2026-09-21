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
  ArrowRight,
  Clock,
  Sparkles
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

  const categories: { label: ListingCategory | 'All'; emoji: string; bg: string }[] = [
    { label: 'All', emoji: '🌟', bg: 'bg-emerald-100 text-emerald-800' },
    { label: 'College', emoji: '🎓', bg: 'bg-indigo-100 text-indigo-800' },
    { label: 'Books', emoji: '📚', bg: 'bg-blue-100 text-blue-800' },
    { label: 'Food', emoji: '🍛', bg: 'bg-amber-100 text-amber-800' },
    { label: 'Electronics', emoji: '📱', bg: 'bg-purple-100 text-purple-800' },
    { label: 'Clothes', emoji: '👕', bg: 'bg-pink-100 text-pink-800' },
    { label: 'Furniture', emoji: '🪑', bg: 'bg-orange-100 text-orange-800' },
    { label: 'Household', emoji: '🏠', bg: 'bg-teal-100 text-teal-800' },
    { label: 'Other', emoji: '📦', bg: 'bg-slate-100 text-slate-800' },
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
    <div className="space-y-5 px-4 py-4 overflow-x-hidden">
      
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 'calculator', 'textbooks', 'food', 'chairs'..."
          className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
        />
      </div>

      {/* Swiggy Style Quick Action Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-4 text-white shadow-md flex items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block">
            Hyperlocal Sharing
          </span>
          <h2 className="text-base font-black tracking-tight leading-tight">
            Someone can use what you don't.
          </h2>
          <p className="text-[11px] text-emerald-100 font-medium">Free redistribution near you.</p>
        </div>

        <button
          onClick={() => setGiveModalOpen(true)}
          className="bg-white text-emerald-800 font-extrabold text-xs py-2.5 px-4 rounded-2xl shadow hover:bg-emerald-50 active:scale-95 transition flex-shrink-0"
        >
          + Give
        </button>
      </div>

      {/* Category Circles Carousel (Swiggy / Zomato style) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Categories</h3>
          {selectedCategory !== 'All' && (
            <button 
              onClick={() => setSelectedCategory('All')} 
              className="text-[11px] font-bold text-emerald-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
              >
                <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl transition-transform ${
                  isSelected ? 'ring-2 ring-emerald-600 scale-105 shadow-md' : ''
                } ${cat.bg}`}>
                  {cat.emoji}
                </div>
                <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Free Near You (OLX 2-column Grid) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Free near you</h2>
          <span className="text-[11px] font-bold text-slate-400">
            {freeListings.length} items
          </span>
        </div>

        {freeListings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
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
          <div className="bg-white rounded-3xl p-6 text-center text-xs text-slate-500 border border-slate-200 shadow-sm">
            Nothing nearby yet. Check back later or create a request!
          </div>
        )}
      </section>

      {/* SECTION 2: Expiring Soon (Too Good To Go style) */}
      {expiringListings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> Expiring soon
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

      {/* SECTION 3: Requests Nearby (OLX Need Posts) */}
      {requests.length > 0 && (
        <section className="bg-slate-900 rounded-3xl p-4 text-white space-y-3 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-400" /> Requests nearby
            </h2>
            <button 
              onClick={() => setRequestModalOpen(true)}
              className="text-[11px] font-bold text-emerald-400 hover:underline"
            >
              + I need something
            </button>
          </div>

          <div className="space-y-2">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className="bg-slate-800 border border-slate-700/80 rounded-2xl p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">
                    {req.category}
                  </span>
                  <span className="text-amber-400 font-bold">
                    {req.urgency}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-white line-clamp-1">{req.title}</h4>

                <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400 border-t border-slate-700/60">
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

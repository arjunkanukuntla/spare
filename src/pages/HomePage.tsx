import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { ListingCard } from '../components/ui/ListingCard';
import { RequestCard } from '../components/ui/RequestCard';
import { PromotionSlot } from '../components/ui/PromotionSlot';
import { Search, PlusCircle, ArrowRight, Clock } from 'lucide-react';

interface HomePageProps {
  onSelectListing: (listing: Listing) => void;
  onClaimListing: (listing: Listing) => void;
}

const SEARCH_SUGGESTIONS = [
  'Charger',
  'Calculator',
  'Books',
  'Multimeter',
  'Arduino',
  'Tools',
  'Event food'
];

export const HomePage: React.FC<HomePageProps> = ({ onSelectListing, onClaimListing }) => {
  const { 
    listings, 
    requests, 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    setGiveModalOpen, 
    setRequestModalOpen 
  } = useApp();

  const [visibleCount, setVisibleCount] = useState(8);

  const activeListings = listings.filter(l => l.status === 'ACTIVE');
  const openRequests = requests.filter(r => r.status === 'OPEN');
  const expiringFoodListings = activeListings.filter(l => l.category === 'Food' && l.pickupDeadline);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('find');
    }
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    setActiveTab('find');
  };

  return (
    <div className="space-y-8 pb-24 sm:pb-8 animate-in fade-in duration-200">
      
      {/* Home Hero Section */}
      <section className="bg-stone-50 px-4 pt-6 pb-2 border-b border-stone-200/60">
        <div className="max-w-4xl mx-auto space-y-4">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-semibold text-emerald-800 tracking-wide">
              Give what you don't need. Find what you do.
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              What do you need?
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Find something useful nearby. Or put something you no longer need back into use.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5 stroke-[1.8]" />
            <input
              type="text"
              placeholder="Search for a charger, calculator, books, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-all"
            >
              Search
            </button>
          </form>

          {/* Suggested Searches */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[11px] font-medium text-stone-400 shrink-0">Popular:</span>
            {SEARCH_SUGGESTIONS.map((term) => (
              <button
                key={term}
                onClick={() => handleSuggestionClick(term)}
                className="px-2.5 py-0.5 bg-white hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 text-xs font-medium rounded-lg border border-stone-200 shrink-0 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons: Give & Request */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setGiveModalOpen(true)}
              className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xs text-left flex flex-col justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-lg">🎁</span>
                <PlusCircle className="w-5 h-5 stroke-[2] group-hover:rotate-90 transition-transform text-white/90" />
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-sm">Give something</h3>
                <p className="text-[11px] text-emerald-100 italic mt-0.5">
                  I don't need this anymore
                </p>
              </div>
            </button>

            <button
              onClick={() => setRequestModalOpen(true)}
              className="p-4 bg-white hover:bg-stone-50 text-stone-900 border border-stone-200/90 rounded-2xl shadow-xs text-left flex flex-col justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-lg">🙋‍♂️</span>
                <ArrowRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-sm">Request something</h3>
                <p className="text-[11px] text-stone-500 italic mt-0.5">
                  I'm looking for this
                </p>
              </div>
            </button>
          </div>

        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-9">
        
        {/* Optional Promotion Slot (Renders NULL if no active promotion exists) */}
        <PromotionSlot placement="home_feed" />

        {/* Section 1: Expiring Soon (Food items only) */}
        {expiringFoodListings.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-amber-100 text-amber-800 rounded-md">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-stone-900 text-base">Expiring soon</h2>
                <p className="text-xs text-stone-500">Time-sensitive food surplus</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {expiringFoodListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={onSelectListing}
                  onClaim={onClaimListing}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Available near you */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-stone-900 text-lg">Available near you</h2>
              <p className="text-xs text-stone-500">Items people have put up nearby</p>
            </div>
            <button
              onClick={() => setActiveTab('find')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeListings.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
              <h3 className="font-bold text-stone-800 text-sm">Nothing nearby yet.</h3>
              <p className="text-xs text-stone-500 mt-1">
                Be the first to put something useful back into use.
              </p>
              <button
                onClick={() => setGiveModalOpen(true)}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Give something
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeListings.slice(0, visibleCount).map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={onSelectListing}
                    onClaim={onClaimListing}
                  />
                ))}
              </div>

              {/* Load More Pagination */}
              {activeListings.length > visibleCount && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 8)}
                    className="px-5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Load more items
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section 3: People are looking for */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-stone-900 text-lg">People are looking for</h2>
              <p className="text-xs text-stone-500">Requests from people around you</p>
            </div>
          </div>

          {openRequests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
              <h3 className="font-bold text-stone-800 text-sm">No requests nearby.</h3>
              <p className="text-xs text-stone-500 mt-1">Someone might be looking for what you have.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {openRequests.map(req => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onRespond={() => setGiveModalOpen(true)}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

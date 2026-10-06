import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, RequestItem } from '../types';
import { ListingCard } from '../components/ui/ListingCard';
import { RequestCard } from '../components/ui/RequestCard';
import { Search, PlusCircle, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

interface HomePageProps {
  onSelectListing: (listing: Listing) => void;
  onClaimListing: (listing: Listing) => void;
}

const SEARCH_SUGGESTIONS = [
  'Scientific Calculator',
  'Laptop Charger',
  'Engineering Book',
  'Digital Multimeter',
  'Arduino Board',
  'Tools',
  'Event Meals'
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
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      
      {/* Search & Hero Banner Section */}
      <section className="bg-gradient-to-b from-emerald-50/60 via-stone-50 to-stone-50 px-4 pt-6 pb-4 border-b border-stone-200/60">
        <div className="max-w-4xl mx-auto space-y-4">
          
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-800 rounded-full border border-emerald-200 text-xs font-semibold shadow-xs mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SPARE — Local Surplus Exchange</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              What do you need today?
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Gifting surplus calculators, chargers, books, tools, & food directly within your local area. 100% free permanent transfer.
            </p>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search for something you need (calculator, charger, books)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 bg-white border border-stone-300/90 rounded-2xl text-stone-900 text-sm shadow-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Search
            </button>
          </form>

          {/* Search Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-bold text-stone-400 shrink-0">Try:</span>
            {SEARCH_SUGGESTIONS.map((term) => (
              <button
                key={term}
                onClick={() => handleSuggestionClick(term)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-xs font-medium rounded-lg border border-stone-200 shrink-0 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons: Give & Request */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setGiveModalOpen(true)}
              className="p-4 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl shadow-sm text-left flex flex-col justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl">🎁</span>
                <PlusCircle className="w-5 h-5 stroke-[2.2] group-hover:rotate-90 transition-transform" />
              </div>
              <div className="mt-3">
                <h3 className="font-bold text-sm">Give something</h3>
                <p className="text-[11px] text-emerald-100 leading-tight mt-0.5">
                  I don't need this anymore
                </p>
              </div>
            </button>

            <button
              onClick={() => setRequestModalOpen(true)}
              className="p-4 bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 rounded-2xl shadow-sm text-left flex flex-col justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl">🙋‍♂️</span>
                <ArrowRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="mt-3">
                <h3 className="font-bold text-sm">Request something</h3>
                <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                  I've been looking for this
                </p>
              </div>
            </button>
          </div>

        </div>
      </section>

      {/* Main Content Sections Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10">
        
        {/* Section 1: Expiring Soon (Food items) */}
        {expiringFoodListings.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-stone-900 text-base">Expiring Soon (Food Surplus)</h2>
                  <p className="text-xs text-stone-500">Pick up time-sensitive event food before deadline</p>
                </div>
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

        {/* Section 2: Available Near You */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-stone-900 text-lg">Available near you</h2>
              <p className="text-xs text-stone-500">Items posted by people in your area</p>
            </div>
            <button
              onClick={() => setActiveTab('find')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeListings.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-stone-200">
              <p className="font-bold text-stone-700 text-sm">Nothing nearby yet.</p>
              <p className="text-xs text-stone-500 mt-1">
                Be the first to put something useful back into circulation.
              </p>
              <button
                onClick={() => setGiveModalOpen(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Give Something Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeListings.slice(0, 8).map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={onSelectListing}
                  onClaim={onClaimListing}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 3: People are looking for */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-stone-900 text-lg">People are looking for</h2>
              <p className="text-xs text-stone-500">Requests waiting for a match</p>
            </div>
          </div>

          {openRequests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
              <p className="font-bold text-stone-700 text-sm">No requests open right now.</p>
              <p className="text-xs text-stone-500 mt-1">You can create a request if you need something!</p>
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

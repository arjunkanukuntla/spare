import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, ListingCategory } from '../types';
import { ListingCard } from '../components/ui/ListingCard';
import { Search } from 'lucide-react';

interface FindPageProps {
  onSelectListing: (listing: Listing) => void;
  onClaimListing: (listing: Listing) => void;
}

const CATEGORIES: (ListingCategory | 'All')[] = [
  'All', 'Electronics', 'Books', 'College', 'DIY & Tools', 'Food', 'Clothing', 'Household', 'Accessories', 'Other'
];

const CONDITIONS = ['All', 'New', 'Like new', 'Good', 'Used', 'Needs repair'];

export const FindPage: React.FC<FindPageProps> = ({ onSelectListing, onClaimListing }) => {
  const { 
    listings, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    selectedCondition,
    setSelectedCondition,
  } = useApp();

  const activeListings = listings.filter(l => l.status === 'ACTIVE');

  // Filter listings by searchQuery, category, condition
  const filteredListings = activeListings.filter((l) => {
    if (selectedCategory !== 'All' && l.category !== selectedCategory) {
      return false;
    }
    if (selectedCondition !== 'All' && l.condition !== selectedCondition) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchDesc = l.description.toLowerCase().includes(q);
      const matchCategory = l.category.toLowerCase().includes(q);
      const matchLoc = l.approximateLocation.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCategory || matchLoc;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* Search Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-extrabold text-stone-900">Find Items</h1>
        <p className="text-xs text-stone-500">
          Discover surplus items available for free pickup near your area
        </p>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by keyword, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-stone-900 text-sm shadow-xs focus:border-emerald-600 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Category</span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Condition Filter Options */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
        <span className="text-[11px] font-bold text-stone-400 shrink-0">Condition:</span>
        {CONDITIONS.map((cond) => (
          <button
            key={cond}
            onClick={() => setSelectedCondition(cond)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCondition === cond
                ? 'bg-stone-900 text-white font-bold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cond}
          </button>
        ))}
      </div>

      {/* Results Count & Grid */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-stone-600">
            Showing {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {filteredListings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
            <p className="font-bold text-stone-800 text-base">No items found matching your filters.</p>
            <p className="text-xs text-stone-500 mt-1">Try resetting filters or search for another item.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedCondition('All');
              }}
              className="mt-4 px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredListings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={onSelectListing}
                onClaim={onClaimListing}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

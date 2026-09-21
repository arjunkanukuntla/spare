import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, ListingCategory } from '../types';
import { ListingCard } from '../components/ui/ListingCard';
import { RequestCard } from '../components/ui/RequestCard';
import { CategoryChip } from '../components/ui/CategoryChip';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  Search, 
  PlusCircle, 
  HeartHandshake, 
  Clock,
  ArrowRight
} from 'lucide-react';

interface HomePageProps {
  onSelectListing?: (listing: Listing) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectListing }) => {
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
    <div className="space-y-5 px-4 py-4 pb-24 overflow-x-hidden">
      
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What do you need?"
          className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 shadow-spare-card"
        />
      </div>

      {/* Two Clear Quick Action CTAs */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setGiveModalOpen(true)}
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Give something</span>
        </button>

        <button
          onClick={() => setRequestModalOpen(true)}
          className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-sm transition"
        >
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>Request something</span>
        </button>
      </div>

      {/* Horizontal Category Chips */}
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

      {/* SECTION 1: Free near you */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">Free near you</h2>
          <span className="text-[11px] font-semibold text-slate-500">
            {freeListings.length} available
          </span>
        </div>

        {freeListings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {freeListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={(item) => onSelectListing?.(item)}
                onClaimQuick={(item) => setClaimListing(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing nearby yet"
            message="Check back later or post a request asking the community."
            actionText="Request something"
            onAction={() => setRequestModalOpen(true)}
          />
        )}
      </section>

      {/* SECTION 2: Expiring soon (Food surplus countdown) */}
      {expiringListings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> Expiring soon
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {expiringListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={(item) => onSelectListing?.(item)}
                onClaimQuick={(item) => setClaimListing(item)}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: Requests nearby */}
      {requests.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-600" /> Requests nearby
            </h2>
            <button 
              onClick={() => setActiveTab('explore')}
              className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
            >
              <span>Explore map</span> <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {requests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

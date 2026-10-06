import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalLink } from 'lucide-react';

export interface PromotionCampaign {
  id: string;
  advertiserName: string;
  title: string;
  description: string;
  imageUrl: string;
  destinationUrl: string;
  placement: 'home_feed' | 'find_feed' | 'request_feed' | 'category';
  categoryMatch?: string;
  status: 'ACTIVE' | 'PAUSED';
}

interface PromotionSlotProps {
  placement: 'home_feed' | 'find_feed' | 'request_feed' | 'category';
  categoryMatch?: string;
}

// Global feature flag: Monetization disabled during early validation
export const FEATURE_FLAGS = {
  promotions_enabled: false, // Default OFF for early validation
  sponsored_listings_enabled: false,
};

// Seed campaigns for when feature flag is enabled later
const SAMPLE_CAMPAIGNS: PromotionCampaign[] = [
  {
    id: 'camp_01',
    advertiserName: 'Local Hardware & Component Store',
    title: 'Arduino & Circuit Components near Campus',
    description: 'Breadboards, sensors, multimeters & soldering kits available locally.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
    destinationUrl: 'https://example.com/hardware',
    placement: 'home_feed',
    categoryMatch: 'DIY & Tools',
    status: 'ACTIVE',
  }
];

export const PromotionSlot: React.FC<PromotionSlotProps> = ({ placement, categoryMatch }) => {
  const { organization } = useApp();
  const [activeCampaign, setActiveCampaign] = useState<PromotionCampaign | null>(null);

  useEffect(() => {
    // 1. If feature flag is disabled, return early
    if (!FEATURE_FLAGS.promotions_enabled) {
      setActiveCampaign(null);
      return;
    }

    // 2. Find eligible active campaign
    const eligible = SAMPLE_CAMPAIGNS.find(c => 
      c.status === 'ACTIVE' && 
      c.placement === placement && 
      (!categoryMatch || c.categoryMatch === categoryMatch)
    );

    setActiveCampaign(eligible || null);
  }, [placement, categoryMatch]);

  // CRITICAL RULE: If no active campaign or feature flag OFF, render NOTHING (null).
  // Zero empty placeholders, zero reserved whitespace, normal content moves up!
  if (!activeCampaign || !FEATURE_FLAGS.promotions_enabled) {
    return null;
  }

  return (
    <div className="my-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-150">
      <div className="flex items-center gap-3">
        {activeCampaign.imageUrl && (
          <img
            src={activeCampaign.imageUrl}
            alt={activeCampaign.title}
            className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
          />
        )}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-200/70 rounded-md">
              Sponsored
            </span>
            <span className="text-[11px] font-medium text-stone-500">
              {activeCampaign.advertiserName}
            </span>
          </div>
          <h4 className="font-semibold text-stone-900 text-xs sm:text-sm">
            {activeCampaign.title}
          </h4>
          <p className="text-xs text-stone-500 line-clamp-1">
            {activeCampaign.description}
          </p>
        </div>
      </div>

      <a
        href={activeCampaign.destinationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
      >
        <span>View offer</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};

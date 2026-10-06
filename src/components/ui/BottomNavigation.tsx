import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Search, PlusCircle, Activity } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, setGiveModalOpen, claims, exchanges } = useApp();

  const activeBadgeCount = claims.filter(c => c.status === 'pending').length + 
                           exchanges.filter(e => e.status === 'accepted' || e.status === 'pickup_pending').length;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 shadow-xs">
      <div className="grid grid-cols-4 items-center max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-emerald-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5">Home</span>
        </button>

        {/* Find */}
        <button
          onClick={() => setActiveTab('find')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'find' ? 'text-emerald-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5">Find</span>
        </button>

        {/* Give (Equal visual weight, standard tab) */}
        <button
          onClick={() => setGiveModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-stone-700 hover:text-emerald-700 transition-all group"
        >
          <PlusCircle className="w-5 h-5 stroke-[1.8] text-emerald-600 group-hover:scale-105 transition-transform" />
          <span className="text-[11px] mt-0.5 font-medium text-emerald-800">Give</span>
        </button>

        {/* Activity */}
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
            activeTab === 'activity' ? 'text-emerald-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Activity className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5">Activity</span>
          {activeBadgeCount > 0 && (
            <span className="absolute top-0.5 right-4 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeBadgeCount}
            </span>
          )}
        </button>

      </div>
    </nav>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Search, PlusCircle, Activity } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, setGiveModalOpen, claims, exchanges } = useApp();

  const pendingExchangesCount = exchanges.filter(e => e.status === 'accepted' || e.status === 'pickup_pending').length;
  const pendingClaimsCount = claims.filter(c => c.status === 'pending').length;
  const activeActivityBadge = pendingExchangesCount + pendingClaimsCount;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-emerald-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </button>

        {/* Find */}
        <button
          onClick={() => setActiveTab('find')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'find' ? 'text-emerald-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[11px]">Find</span>
        </button>

        {/* Central Give CTA Button */}
        <button
          onClick={() => setGiveModalOpen(true)}
          className="flex flex-col items-center -mt-5 group focus:outline-none"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-active:scale-95 transition-all">
            <PlusCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700 mt-0.5">Give</span>
        </button>

        {/* Activity */}
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
            activeTab === 'activity' ? 'text-emerald-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[11px]">Activity</span>
          {activeActivityBadge > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeActivityBadge}
            </span>
          )}
        </button>

      </div>
    </nav>
  );
};

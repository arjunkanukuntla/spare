import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Search, 
  PlusCircle, 
  Activity
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setGiveModalOpen, 
    claims
  } = useApp();

  const activeClaimsCount = claims.filter(c => c.status !== 'COMPLETED').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-2xl">
      {/* 1. Home */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition ${
          activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      {/* 2. Find */}
      <button
        onClick={() => setActiveTab('explore')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition ${
          activeTab === 'explore' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Search className="w-5 h-5" />
        <span>Find</span>
      </button>

      {/* 3. Give (Primary Creation Action) */}
      <button
        onClick={() => setGiveModalOpen(true)}
        className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {/* 4. Activity */}
      <button
        onClick={() => setActiveTab('activity')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition relative ${
          activeTab === 'activity' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Activity className="w-5 h-5" />
        <span>Activity</span>
        {activeClaimsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
            {activeClaimsCount}
          </span>
        )}
      </button>
    </nav>
  );
};

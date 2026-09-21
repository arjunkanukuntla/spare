import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  PlusCircle, 
  HeartHandshake, 
  Activity, 
  User as UserIcon
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setGiveModalOpen, 
    setRequestModalOpen,
    claims
  } = useApp();

  const activeClaimsCount = claims.filter(c => c.status !== 'COMPLETED').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-slate-900 border-t border-slate-800 text-slate-400 px-2 py-2 flex items-center justify-around shadow-2xl">
      {/* 1. Explore / Home */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
          activeTab === 'home' || activeTab === 'explore' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Explore</span>
      </button>

      {/* 2. Give */}
      <button
        onClick={() => setGiveModalOpen(true)}
        className="flex flex-col items-center gap-1 text-[10px] font-semibold transition text-slate-300 hover:text-emerald-400"
      >
        <PlusCircle className="w-5 h-5 text-emerald-400" />
        <span>Give</span>
      </button>

      {/* 3. Request (Center Highlight FAB) */}
      <button
        onClick={() => setRequestModalOpen(true)}
        className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg active:scale-95 transition"
      >
        <HeartHandshake className="w-6 h-6" />
      </button>

      {/* 4. Activity */}
      <button
        onClick={() => setActiveTab('activity')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition relative ${
          activeTab === 'activity' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
        }`}
      >
        <Activity className="w-5 h-5" />
        <span>Activity</span>
        {activeClaimsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center">
            {activeClaimsCount}
          </span>
        )}
      </button>

      {/* 5. Profile */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
          activeTab === 'profile' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};

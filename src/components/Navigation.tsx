import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  MapPin, 
  PlusCircle, 
  Activity, 
  User as UserIcon, 
  Calendar, 
  BarChart3, 
  ShieldAlert, 
  Globe2, 
  HeartHandshake,
  GitMerge
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    setGiveModalOpen, 
    setRequestModalOpen,
    claims
  } = useApp();

  const activeClaimsCount = claims.filter(c => c.status !== 'COMPLETED').length;

  interface NavItem {
    id: 'home' | 'explore' | 'match' | 'event' | 'activity' | 'dashboards' | 'impact' | 'admin' | 'profile';
    label: string;
    icon: any;
    count?: number;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'explore', label: 'Explore Map', icon: MapPin },
    { id: 'match', label: 'Smart Matching', icon: GitMerge },
    { id: 'event', label: 'Event Surplus', icon: Calendar },
    { id: 'activity', label: 'My Activity', icon: Activity, count: activeClaimsCount },
    { id: 'dashboards', label: 'Dashboards', icon: BarChart3 },
    { id: 'impact', label: 'SPARE Impact', icon: Globe2 },
    { id: 'admin', label: 'Moderation', icon: ShieldAlert },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
  ];

  return (
    <>
      {/* Desktop Navigation Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 sticky top-12 h-[calc(100vh-3rem)] justify-between z-30">
        <div className="space-y-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                SPARE
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Someone can use what you don't.</p>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setGiveModalOpen(true)}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Give</span>
            </button>
            <button
              onClick={() => setRequestModalOpen(true)}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl transition active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Request</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                    isActive 
                      ? 'bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-500/30' 
                      : 'hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count ? (
                    <span className="bg-slate-800 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer Card */}
        <div className="p-3 bg-slate-800/60 border border-slate-800 rounded-2xl flex items-center gap-3">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-emerald-400 font-semibold truncate">{currentUser.verificationBadgeText || currentUser.role}</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-slate-400 px-2 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
            activeTab === 'home' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
            activeTab === 'explore' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setGiveModalOpen(true)}
          className="flex flex-col items-center justify-center -mt-6 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg active:scale-95 transition"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition relative ${
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

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
            activeTab === 'profile' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
};

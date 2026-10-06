import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Search, PlusCircle, Activity, User, Shield } from 'lucide-react';

export const DesktopSidebar: React.FC = () => {
  const { activeTab, setActiveTab, setGiveModalOpen, currentUser, claims, exchanges } = useApp();

  const activeCount = claims.filter(c => c.status === 'pending').length + 
                      exchanges.filter(e => e.status === 'accepted' || e.status === 'pickup_pending').length;

  const isAdmin = currentUser.role === 'ADMIN';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'find', label: 'Find', icon: Search },
    { id: 'activity', label: 'Activity', icon: Activity, badge: activeCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Dashboard', icon: Shield, badge: 0 });
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-stone-200/80 bg-white min-h-[calc(100vh-61px)] p-4 shrink-0">
      
      {/* Primary Give Action */}
      <div className="mb-5">
        <button
          onClick={() => setGiveModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2]" />
          <span>Give something</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Subtle Supporting Text */}
      <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
        <p className="font-semibold text-stone-700">SPARE Network</p>
        <p className="text-stone-400 leading-tight">
          Give what you don't need. Find what you do.
        </p>
      </div>

    </aside>
  );
};

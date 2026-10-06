import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Search, PlusCircle, Activity, User, Shield, QrCode, Sparkles } from 'lucide-react';

export const DesktopSidebar: React.FC = () => {
  const { activeTab, setActiveTab, setGiveModalOpen, currentUser, claims, exchanges } = useApp();

  const activeCount = claims.filter(c => c.status === 'pending').length + 
                      exchanges.filter(e => e.status === 'accepted' || e.status === 'pickup_pending').length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'find', label: 'Find Items', icon: Search },
    { id: 'activity', label: 'Activity & Exchanges', icon: Activity, badge: activeCount },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'join', label: 'Campus QR / Posters', icon: QrCode },
    { id: 'admin', label: 'Admin Dashboard', icon: Shield },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-stone-200/80 bg-white min-h-[calc(100vh-61px)] p-5 shrink-0">
      
      {/* Primary Give CTA Card */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20">
        <h3 className="font-bold text-sm">Have something spare?</h3>
        <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
          Help someone in your campus by giving what you no longer need.
        </p>
        <button
          onClick={() => setGiveModalOpen(true)}
          className="mt-3.5 w-full flex items-center justify-center gap-2 py-2 px-3 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>Give an Item</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60'
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

      {/* Trust & Campus Badge */}
      <div className="pt-4 border-t border-stone-200 text-xs text-stone-500">
        <div className="flex items-center gap-2 font-medium text-stone-700">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>SR University Campus</span>
        </div>
        <p className="text-[11px] text-stone-400 mt-1">
          Direct local exchange without money, fees, or selling.
        </p>
      </div>

    </aside>
  );
};

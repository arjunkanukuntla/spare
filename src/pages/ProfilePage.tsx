import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  MapPin, 
  Globe2, 
  BarChart2, 
  ShieldAlert, 
  Calendar, 
  GitMerge, 
  ChevronRight 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, setOnboardingOpen, setActiveTab } = useApp();

  return (
    <div className="space-y-5 px-4 py-5 overflow-x-hidden">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500/30"
        />

        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <h1 className="text-lg font-black text-slate-900">{currentUser.name}</h1>
            {currentUser.isVerified && (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            )}
          </div>

          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" /> {currentUser.location}
          </p>
        </div>
      </div>

      {/* Human Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm">
          <p className="text-xl font-black text-emerald-600">{currentUser.itemsGiven}</p>
          <p className="text-[11px] font-bold text-slate-600 mt-0.5">given</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm">
          <p className="text-xl font-black text-teal-600">{currentUser.itemsClaimed}</p>
          <p className="text-[11px] font-bold text-slate-600 mt-0.5">claimed</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm">
          <p className="text-xl font-black text-slate-900">{currentUser.successRate}%</p>
          <p className="text-[11px] font-bold text-slate-600 mt-0.5">completed</p>
        </div>
      </div>

      {/* App Modules Shortcuts */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-2">
        <h3 className="font-extrabold text-slate-900 text-xs px-1">More tools</h3>

        <div className="space-y-1 text-xs">
          <button
            onClick={() => setActiveTab('match')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-800 transition"
          >
            <div className="flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-emerald-600" />
              <span>Smart Matching</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('event')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-800 transition"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Event Surplus Calculator</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('dashboards')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-800 transition"
          >
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              <span>Business & Organization Dashboards</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-800 transition"
          >
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600" />
              <span>SPARE Impact</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-800 transition"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Moderation Admin</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

    </div>
  );
};

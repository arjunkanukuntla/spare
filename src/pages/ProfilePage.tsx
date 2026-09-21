import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, ShieldCheck, MapPin, Award, CheckCircle2, HeartHandshake } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, setOnboardingOpen } = useApp();

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-3xl mx-auto px-4 py-6">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-xl"
        />

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
            {currentUser.isVerified && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {currentUser.verificationBadgeText || 'Verified Member ✓'}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {currentUser.location} • Member since Jan 2025
          </p>

          <p className="text-xs text-slate-700 font-medium max-w-md">{currentUser.bio || 'Active surplus redistribution community member.'}</p>
        </div>
      </div>

      {/* Trust & Reputation Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 text-center shadow-card">
          <p className="text-2xl font-black text-emerald-600">{currentUser.itemsGiven}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Items Given</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 text-center shadow-card">
          <p className="text-2xl font-black text-teal-600">{currentUser.itemsClaimed}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Items Claimed</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 text-center shadow-card">
          <p className="text-2xl font-black text-slate-900">{currentUser.successRate}%</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Fulfillment Rate</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">Account Preferences</h3>
        <button
          onClick={() => setOnboardingOpen(true)}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs p-3.5 rounded-2xl border border-slate-200 transition text-left flex items-center justify-between"
        >
          <span>Re-configure Onboarding Preferences</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
};

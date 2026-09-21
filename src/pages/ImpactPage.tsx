import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe2, Utensils, Package, Users, TrendingUp, Clock, CheckCircle2, Sparkles } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { impact } = useApp();

  return (
    <div className="space-y-8 pb-24 md:pb-12 max-w-7xl mx-auto px-4 py-6">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full">
          <Globe2 className="w-3.5 h-3.5" /> Real-time Platform Telemetry
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">SPARE Hyperlocal Impact</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
          Quantifying the environmental and economic power of hyperlocal surplus redistribution across food, academic tools, household gear, and community supplies.
        </p>
      </section>

      {/* Primary 6 Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-2 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meals Redistributed</span>
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{impact.mealsRedistributed.toLocaleString()}</p>
          <p className="text-xs text-emerald-700 font-semibold">🍛 Unserved meals diverted from landfill</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-2 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Items Reused</span>
            <div className="p-2.5 bg-teal-100 text-teal-800 rounded-2xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{impact.itemsReused.toLocaleString()}</p>
          <p className="text-xs text-teal-700 font-semibold">📦 Calculators, textbooks & gear given second life</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-2 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">People & NGOs Helped</span>
            <div className="p-2.5 bg-indigo-100 text-indigo-800 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{impact.peopleHelped.toLocaleString()}</p>
          <p className="text-xs text-indigo-700 font-semibold">👥 Individuals & shelter communities served</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-2 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Value Rescued</span>
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">₹{(impact.valueRescuedInr / 100000).toFixed(2)} Lakhs</p>
          <p className="text-xs text-amber-700 font-semibold">₹ Hyperlocal financial value preserved</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-2 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Time to Claim</span>
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{impact.avgTimeToClaimMins} Mins</p>
          <p className="text-xs text-blue-700 font-semibold">⏱ Rapid matching velocity</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-2 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Redistribution Rate</span>
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{impact.successRatePercent}%</p>
          <p className="text-xs text-emerald-700 font-semibold">♻️ Completed transaction rate</p>
        </div>
      </div>

    </div>
  );
};

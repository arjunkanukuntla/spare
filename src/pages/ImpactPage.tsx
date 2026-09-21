import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe2, Utensils, Package, Users, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { impact } = useApp();

  return (
    <div className="space-y-5 px-4 py-5 overflow-x-hidden">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Globe2 className="w-6 h-6 text-emerald-600" /> Platform impact
        </h1>
        <p className="text-xs text-slate-500">Real-time statistics across the network.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <Utensils className="w-4 h-4" />
            <span className="text-xs font-bold">Meals shared</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{impact.mealsRedistributed.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-teal-700">
            <Package className="w-4 h-4" />
            <span className="text-xs font-bold">Items reused</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{impact.itemsReused.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-700">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold">People reached</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{impact.peopleHelped.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-amber-700">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold">Rescued value</span>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{(impact.valueRescuedInr / 100000).toFixed(1)}L</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-blue-700">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold">Avg claim time</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{impact.avgTimeToClaimMins}m</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold">Completed rate</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{impact.successRatePercent}%</p>
        </div>
      </div>

    </div>
  );
};

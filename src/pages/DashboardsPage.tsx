import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  BarChart2
} from 'lucide-react';

export const DashboardsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'BUSINESS' | 'ORGANIZATION'>('BUSINESS');

  return (
    <div className="space-y-5 px-4 py-5 overflow-x-hidden">
      
      {/* Header & Toggle */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-emerald-600" /> Operational Dashboards
          </h1>
          <p className="text-xs text-slate-500">Business & organization management.</p>
        </div>

        {/* View Toggle */}
        <div className="bg-slate-200 p-1 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setViewMode('BUSINESS')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              viewMode === 'BUSINESS'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Business
          </button>
          <button
            onClick={() => setViewMode('ORGANIZATION')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              viewMode === 'ORGANIZATION'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" /> Organization
          </button>
        </div>
      </div>

      {viewMode === 'BUSINESS' ? (
        /* BUSINESS DASHBOARD */
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Prepared today</p>
              <p className="text-2xl font-black text-slate-900 mt-1">100</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Sold</p>
              <p className="text-2xl font-black text-slate-900 mt-1">65</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-amber-600">Surplus</p>
              <p className="text-2xl font-black text-amber-600 mt-1">35</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 shadow-sm">
              <p className="text-xs font-bold text-emerald-700">Redistributed</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">35</p>
            </div>
          </div>
        </div>
      ) : (
        /* ORGANIZATION DASHBOARD */
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Verified Organization
            </div>
            <h2 className="text-lg font-black">Annapurna Community Kitchen</h2>
            <p className="text-xs text-slate-400">Daily Capacity: 400 meals/day</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-extrabold text-xs text-slate-900">Active Requests</h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-xs">
              <span className="font-bold text-slate-800">Need 100 meals</span>
              <span className="text-emerald-700 font-bold">Urgent</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

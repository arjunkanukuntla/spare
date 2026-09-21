import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  BarChart2, 
  PieChart, 
  Calendar, 
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const DashboardsPage: React.FC = () => {
  const { currentUser } = useApp();
  const [viewMode, setViewMode] = useState<'BUSINESS' | 'ORGANIZATION'>('BUSINESS');

  return (
    <div className="space-y-8 pb-24 md:pb-12 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-emerald-600" /> Professional Dashboards
          </h1>
          <p className="text-xs text-slate-500">Analytics & operations suite for businesses & verified organizations</p>
        </div>

        {/* View Toggle */}
        <div className="bg-slate-200 p-1 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setViewMode('BUSINESS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'BUSINESS'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" /> Business Suite
          </button>
          <button
            onClick={() => setViewMode('ORGANIZATION')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'ORGANIZATION'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" /> NGO / Organization
          </button>
        </div>
      </div>

      {viewMode === 'BUSINESS' ? (
        /* BUSINESS DASHBOARD */
        <div className="space-y-6">
          
          {/* Today Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meals Prepared Today</p>
              <p className="text-2xl font-black text-slate-900 mt-2">100</p>
              <p className="text-[11px] text-slate-400 mt-1">Banquet & dining total</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sold / Consumed</p>
              <p className="text-2xl font-black text-slate-900 mt-2">65</p>
              <p className="text-[11px] text-slate-400 mt-1">65% commercial sales</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Kitchen Surplus</p>
              <p className="text-2xl font-black text-amber-600 mt-2">35</p>
              <p className="text-[11px] text-amber-700/80 mt-1">Closing-hour surplus</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card bg-emerald-50/50 border-emerald-200">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Redistributed on SPARE</p>
              <p className="text-2xl font-black text-emerald-600 mt-2">35</p>
              <p className="text-[11px] text-emerald-700 mt-1">100% Zero-Waste achieved!</p>
            </div>
          </div>

          {/* Detailed Impact Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <TrendingUp className="w-4 h-4" /> Value Rescued Telemetry
              </div>
              <p className="text-3xl font-black">₹18,450</p>
              <p className="text-xs text-slate-400">Estimated retail meal value rescued from landfill disposal this month.</p>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <Clock className="w-4 h-4" /> Avg Claim Time
              </div>
              <p className="text-3xl font-black">14 mins</p>
              <p className="text-xs text-slate-400">From listing publication to 100% claim confirmation by nearby NGOs.</p>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Award className="w-4 h-4" /> ESG Sustainability Rating
              </div>
              <p className="text-3xl font-black">99.2%</p>
              <p className="text-xs text-slate-400">Highest zero-waste certified rating in Koramangala hospitality sector.</p>
            </div>
          </div>

        </div>
      ) : (
        /* ORGANIZATION DASHBOARD */
        <div className="space-y-6">
          <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full">
                <ShieldCheck className="w-4 h-4" /> Verified Organization Status
              </div>
              <h2 className="text-2xl font-black">Annapurna Community Kitchen</h2>
              <p className="text-xs text-slate-300">Daily Feeding Capacity: 400 meals/day • Indiranagar Shelter Hub</p>
            </div>

            <div className="hidden sm:block text-right">
              <span className="bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl">
                Verified ✓
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Active Bulk Requests</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900">Need 100 Vegetarian Meals</span>
                  <span className="text-emerald-700 font-bold">URGENT</span>
                </div>
                <p className="text-xs text-slate-500">Matched with Royal Caterers 220 banquet meals.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Received Surplus History</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>80 Banquet Meals from Royal Caterers</span>
                  <span className="font-mono text-emerald-700 font-bold">Completed</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>40 Sandwiches from Spice Garden</span>
                  <span className="font-mono text-emerald-700 font-bold">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Users, Package, FileText, CheckCircle2, AlertTriangle, Activity, Database } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { adminMetrics, listings, requests, reports, users, organization } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h1 className="text-2xl font-extrabold text-stone-900">Admin Dashboard</h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time platform telemetry & operations for {organization.name}
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
          Live Database Active
        </span>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Users</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2">{adminMetrics.totalUsers}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">100% Verified Campus</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Listings</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{adminMetrics.activeListings}</p>
          <p className="text-[11px] text-stone-500 mt-1">Total: {adminMetrics.totalListings}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2">{adminMetrics.completedExchanges}</p>
          <p className="text-[11px] text-stone-500 mt-1">Successful Handovers</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Open Requests</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2">{adminMetrics.openRequests}</p>
          <p className="text-[11px] text-stone-500 mt-1">Total: {adminMetrics.totalRequests}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-4">
        <h3 className="font-bold text-stone-900 text-sm">Listing Distribution by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(adminMetrics.categoryDistribution).map(([cat, count]) => (
            <div key={cat} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">{cat}</span>
              <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Moderation / Users List */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-4">
        <h3 className="font-bold text-stone-900 text-sm">Registered Campus Users ({users.length})</h3>
        <div className="divide-y divide-stone-100">
          {users.map(u => (
            <div key={u.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold text-stone-900">{u.name}</p>
                  <p className="text-[11px] text-stone-500">{u.email} • {u.department || 'Campus'} {u.year || ''}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-stone-600 font-semibold">{u.itemsGiven} Given</span>
                <span className="text-emerald-700 font-bold">{u.reliabilityRating} ★</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

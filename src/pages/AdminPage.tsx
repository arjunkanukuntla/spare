import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, AlertOctagon, CheckCircle2, UserCheck, Flag } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { reports, listings } = useApp();

  return (
    <div className="space-y-8 pb-24 md:pb-12 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-400 font-bold text-xs rounded-full">
          <ShieldAlert className="w-3.5 h-3.5" /> SPARE Moderation & Admin Suite
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Platform Trust & Moderation</h1>
        <p className="text-xs text-slate-400">Review reported listings, food safety violations & organization credentials</p>
      </div>

      {/* Moderation Queue */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Flag className="w-4 h-4 text-rose-600" /> Pending Moderation Reports ({reports.length})
        </h3>

        {reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between font-bold text-rose-900">
                  <span>Listing: {rep.listingTitle}</span>
                  <span className="bg-rose-200 text-rose-900 px-2 py-0.5 rounded">{rep.reason}</span>
                </div>
                <p className="text-slate-700">{rep.details || 'No additional comment.'}</p>
                <div className="flex gap-2 pt-1">
                  <button className="bg-rose-600 text-white font-bold px-3 py-1 rounded-lg">Remove Listing</button>
                  <button className="bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-lg">Dismiss Report</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl">
            No active flagged listings in moderation queue. System running cleanly.
          </div>
        )}
      </div>

    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, ShieldCheck, Gift, ArrowRight, Download, Share2 } from 'lucide-react';
import { copyToClipboard } from '../utils/sharing';

export const CampusJoinPage: React.FC = () => {
  const { organization, setActiveTab } = useApp();
  const [copied, setCopied] = React.useState(false);

  const joinUrl = `${window.location.origin}/?join=sru`;

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(joinUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Poster Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md">
          <QrCode className="w-6 h-6 text-emerald-200" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          SPARE at {organization.name}
        </h1>

        <p className="text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
          "A lot of things become useless to one person without actually becoming useless. SPARE connects them."
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Official Campus Surplus Exchange</span>
        </div>
      </div>

      {/* QR Code Container Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 text-center space-y-6 shadow-xs">
        <div>
          <h2 className="font-bold text-stone-900 text-lg">Scan or Share Campus Link</h2>
          <p className="text-xs text-stone-500 mt-1">
            Display this QR code during class presentations, campus posters, or hostel notice boards.
          </p>
        </div>

        {/* QR Code Visual Graphic */}
        <div className="w-48 h-48 mx-auto p-4 bg-stone-50 rounded-2xl border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center gap-2 shadow-inner">
          <QrCode className="w-28 h-28 text-stone-900" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">SR University QR</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Open SPARE Web App</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-all"
          >
            {copied ? 'Copied Link!' : 'Copy Join Link'}
          </button>
        </div>
      </div>

      {/* 4 Steps Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
          <span className="text-xs font-bold text-emerald-600">1. Give</span>
          <h4 className="font-bold text-stone-900 text-sm">Post what you no longer need</h4>
          <p className="text-xs text-stone-500">Calculators, books, chargers, components, clothing, extra food.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
          <span className="text-xs font-bold text-emerald-600">2. Find</span>
          <h4 className="font-bold text-stone-900 text-sm">Browse campus items</h4>
          <p className="text-xs text-stone-500">Search items listed by fellow students across departments.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
          <span className="text-xs font-bold text-emerald-600">3. Connect</span>
          <h4 className="font-bold text-stone-900 text-sm">Agree on safe pickup spot</h4>
          <p className="text-xs text-stone-500">Meet near CSE Block lobby, library entrance, or canteen.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
          <span className="text-xs font-bold text-emerald-600">4. Complete</span>
          <h4 className="font-bold text-stone-900 text-sm">100% Free Transfer</h4>
          <p className="text-xs text-stone-500">No money, selling, or fees involved. Pure usefulness.</p>
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ChevronDown, Check, RefreshCw, User } from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const { 
    activePersona, 
    personas, 
    switchPersona, 
    resetDemoData,
    setActiveDemoTour,
    setActiveTab
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        
        {/* Swiggy/OLX Style Location & Profile Selector */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-600 font-black">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-left min-w-0 flex-1 group"
          >
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-slate-900 truncate">
                {activePersona.location.split(',')[0]}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <p className="text-[11px] text-slate-500 truncate font-medium">
              {activePersona.name} ({activePersona.roleTitle.split(' ')[0]})
            </p>
          </button>
        </div>

        {/* Demo Preset Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => {
              setActiveDemoTour(1);
              switchPersona('p1');
              setActiveTab('match');
            }}
            className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition"
          >
            Demo 1
          </button>

          <button
            onClick={() => {
              setActiveDemoTour(2);
              switchPersona('p2');
              setActiveTab('give');
            }}
            className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-200 transition"
          >
            Demo 2
          </button>

          <button
            onClick={resetDemoData}
            title="Reset"
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Mobile Persona Switcher Drawer / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Switch Persona</h3>
                <p className="text-xs text-slate-500">Test different user roles & permissions</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-700">
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {personas.map((p) => {
                const isSelected = p.id === activePersona.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchPersona(p.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-center gap-3 ${
                      isSelected ? 'bg-emerald-50 border-emerald-500 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-slate-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold truncate">{p.roleTitle}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

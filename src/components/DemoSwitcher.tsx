import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        
        {/* Persona Info & Selector */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Active Role:
          </span>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition"
            >
              <img 
                src={activePersona.avatar} 
                alt={activePersona.name} 
                className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
              />
              <span className="font-bold text-emerald-400">{activePersona.demoBadge}</span>
              <span className="hidden md:inline text-slate-300">({activePersona.name})</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch Persona</p>
                  <p className="text-[10px] text-slate-300">Test different permissions and views instantly</p>
                </div>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {personas.map((p) => {
                    const isSelected = p.id === activePersona.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchPersona(p.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition ${
                          isSelected ? 'bg-emerald-950/80 border border-emerald-500/50' : 'hover:bg-slate-800/80'
                        }`}
                      >
                        <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover mt-0.5" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-100">{p.name}</span>
                            {isSelected && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className="text-[11px] text-emerald-400 font-medium">{p.roleTitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preset Flow Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveDemoTour(1);
              switchPersona('p1');
              setActiveTab('match');
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Wedding Flow</span>
          </button>

          <button
            onClick={() => {
              setActiveDemoTour(2);
              switchPersona('p2');
              setActiveTab('give');
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition"
          >
            <span>Calculator Flow</span>
          </button>

          <button
            onClick={resetDemoData}
            title="Reset data"
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 transition"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

      </div>
    </header>
  );
};

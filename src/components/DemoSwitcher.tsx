import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, RefreshCw, ChevronDown } from 'lucide-react';

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
    <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30">
      
      {/* Brand & Persona Switcher */}
      <div className="flex items-center gap-2">
        <span className="font-black text-sm text-emerald-400 tracking-tight">SPARE</span>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-700 transition"
          >
            <img 
              src={activePersona.avatar} 
              alt={activePersona.name} 
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="font-semibold text-slate-100 truncate max-w-[110px]">{activePersona.name.split(' ')[0]}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-800 mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Persona View</p>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {personas.map((p) => {
                  const isSelected = p.id === activePersona.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchPersona(p.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl flex items-center gap-2 transition ${
                        isSelected ? 'bg-emerald-950 border border-emerald-500/50' : 'hover:bg-slate-800'
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-100 truncate">{p.name}</p>
                        <p className="text-[10px] text-emerald-400 truncate">{p.roleTitle}</p>
                      </div>
                      {isSelected && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Demo Triggers */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            setActiveDemoTour(1);
            switchPersona('p1');
            setActiveTab('match');
          }}
          className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition"
        >
          Demo 1
        </button>
        <button
          onClick={() => {
            setActiveDemoTour(2);
            switchPersona('p2');
            setActiveTab('give');
          }}
          className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition"
        >
          Demo 2
        </button>
        <button
          onClick={resetDemoData}
          title="Reset state"
          className="text-slate-400 hover:text-white p-1 rounded"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

    </header>
  );
};

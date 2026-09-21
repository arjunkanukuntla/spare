import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, X } from 'lucide-react';

export const DemoTourModal: React.FC = () => {
  const { 
    activeDemoTour, 
    setActiveDemoTour, 
    switchPersona, 
    setActiveTab,
    setGiveModalOpen,
    claimItem,
    triggerConfetti
  } = useApp();

  const [step, setStep] = useState(1);

  if (!activeDemoTour) return null;

  const closeTour = () => {
    setActiveDemoTour(null);
    setStep(1);
  };

  const handleNextStep1 = () => {
    if (step === 1) {
      setActiveTab('match');
      setStep(2);
    } else if (step === 2) {
      claimItem('list_wedding_220', 80, 'SELF_PICKUP');
      claimItem('list_wedding_220', 60, 'SELF_PICKUP');
      claimItem('list_wedding_220', 40, 'SELF_PICKUP');
      claimItem('list_wedding_220', 40, 'SELF_PICKUP');
      triggerConfetti();
      setStep(3);
    } else {
      closeTour();
      setActiveTab('activity');
    }
  };

  const handleNextStep2 = () => {
    if (step === 1) {
      switchPersona('p2');
      setGiveModalOpen(true);
      setStep(2);
    } else if (step === 2) {
      setGiveModalOpen(false);
      switchPersona('p3');
      setActiveTab('home');
      setStep(3);
    } else {
      closeTour();
      setActiveTab('home');
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">
            {activeDemoTour === 1 ? 'Demo: Wedding Surplus Flow' : 'Demo: Student Calculator Flow'}
          </span>
        </div>
        <button onClick={closeTour} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-3">
        {activeDemoTour === 1 ? (
          <div>
            {step === 1 && (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-white">1. Logged in as Wedding Caterer</p>
                <p className="text-xs text-slate-300">
                  "220 Vegetarian Meals" surplus listed. Next step opens SPARE's Hyperlocal Smart Matching Matrix.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-emerald-400">2. Smart Matching Recommendation</p>
                <p className="text-xs text-slate-300">
                  SPARE calculated optimal distribution vectors (NGO: 80, Hostel: 60, Kitchen: 40, Users: 40). Click next to execute batch claim.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3. 100% Redistributed!
                </p>
                <p className="text-xs text-slate-300">
                  All 220 meals allocated and 4-digit pickup verification OTP codes generated.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {step === 1 && (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-white">1. Rohan (4th-Year Senior)</p>
                <p className="text-xs text-slate-300">
                  Rohan selects his scientific calculator. The auto-fill helper populates item category and description.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-emerald-400">2. Free Listing Published</p>
                <p className="text-xs text-slate-300">
                  Listing is active for ₹0. Click next to switch to Ananya (1st-Year Student) and claim it nearby!
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3. Claimed Nearby!
                </p>
                <p className="text-xs text-slate-300">
                  Ananya located the calculator 700m away on campus. Redistribution complete!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
        <span className="text-slate-400 font-mono">Step {step} of 3</span>
        <button
          onClick={activeDemoTour === 1 ? handleNextStep1 : handleNextStep2}
          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition"
        >
          <span>{step === 3 ? 'Finish Tour' : 'Next Step'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

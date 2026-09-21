import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, ListingCategory } from '../types';
import { Sparkles, MapPin, Check, ArrowRight, ShieldCheck, Building2, User, Users } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { onboardingOpen, setOnboardingOpen, triggerConfetti } = useApp();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('INDIVIDUAL');
  const [selectedInterests, setSelectedInterests] = useState<ListingCategory[]>(['Food', 'College']);
  const [locationInput, setLocationInput] = useState('Koramangala, Bengaluru');

  if (!onboardingOpen) return null;

  const categories: { label: ListingCategory; emoji: string }[] = [
    { label: 'Food', emoji: '🍛' },
    { label: 'Books', emoji: '📚' },
    { label: 'College', emoji: '🎓' },
    { label: 'Electronics', emoji: '📱' },
    { label: 'Clothes', emoji: '👕' },
    { label: 'Furniture', emoji: '🪑' },
    { label: 'Household', emoji: '🏠' },
    { label: 'Other', emoji: '📦' },
  ];

  const toggleInterest = (cat: ListingCategory) => {
    setSelectedInterests(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const finishOnboarding = () => {
    setOnboardingOpen(false);
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to SPARE
          </div>
          <h2 className="text-2xl font-black tracking-tight">Set Up Your Profile</h2>
          <p className="text-xs text-slate-400">Someone can use what you don't. Less waste. More use.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all ${
                s === step ? 'w-8 bg-emerald-500' : s < step ? 'w-4 bg-emerald-700' : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-200">What best describes you?</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { 
                  role: 'INDIVIDUAL' as UserRole, 
                  title: 'Individual', 
                  icon: User, 
                  desc: 'Browse, give, request, claim surplus food or goods nearby.' 
                },
                { 
                  role: 'BUSINESS' as UserRole, 
                  title: 'Business (Restaurant, Caterer, Store)', 
                  icon: Building2, 
                  desc: 'Manage closing-hour surplus, banquets, reduce waste & track impact.' 
                },
                { 
                  role: 'ORGANIZATION' as UserRole, 
                  title: 'Organization (NGO, Hostel, Shelter)', 
                  icon: Users, 
                  desc: 'Post bulk needs, receive large food/gear matches, verify status.' 
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    onClick={() => setSelectedRole(item.role)}
                    className={`w-full text-left p-4 rounded-2xl border transition flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-emerald-950/80 border-emerald-500 text-white' 
                        : 'bg-slate-800/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-200">What are you interested in?</label>
            <p className="text-xs text-slate-400">Select items you would like to give or receive nearby.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => {
                const selected = selectedInterests.includes(cat.label);
                return (
                  <button
                    key={cat.label}
                    onClick={() => toggleInterest(cat.label)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                      selected 
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-bold">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-200">Hyperlocal Location</label>
            <p className="text-xs text-slate-400">SPARE prioritizes free listings within walking or short pickup distance.</p>
            
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <MapPin className="w-4 h-4" /> Selected Neighborhood
              </div>
              <input 
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter area, college or landmark..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400">Exact residential locations remain private until a claim is confirmed.</p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-bold text-slate-400 hover:text-white px-3 py-2"
            >
              Back
            </button>
          ) : <div />}

          <button
            onClick={step === 3 ? finishOnboarding : () => setStep(step + 1)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition"
          >
            <span>{step === 3 ? 'Get Started' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

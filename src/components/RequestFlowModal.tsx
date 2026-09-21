import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCategory, UrgencyLevel } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  MapPin, 
  Package, 
  AlertCircle,
  Tag
} from 'lucide-react';

const CATEGORIES: { name: ListingCategory; icon: string }[] = [
  { name: 'Food', icon: '🍲' },
  { name: 'Books', icon: '📚' },
  { name: 'College', icon: '🎓' },
  { name: 'Electronics', icon: '⚡' },
  { name: 'Clothes', icon: '👕' },
  { name: 'Furniture', icon: '🪑' },
  { name: 'Household', icon: '🏠' },
  { name: 'Other', icon: '📦' },
];

export const RequestFlowModal: React.FC = () => {
  const { requestModalOpen, setRequestModalOpen, createRequest } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [category, setCategory] = useState<ListingCategory>('Food');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('meals');
  const [urgency, setUrgency] = useState<UrgencyLevel>('NORMAL');
  const [deadline, setDeadline] = useState('By tonight 9 PM');
  const [radiusKm, setRadiusKm] = useState(5);

  if (!requestModalOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as any);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as any);
  };

  const handleClose = () => {
    setRequestModalOpen(false);
    setStep(1);
  };

  const handleSubmit = () => {
    createRequest({
      category,
      title: title || `Request for ${category}`,
      description,
      quantity,
      unit,
      urgency,
      deadline,
      radiusKm,
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 transition-all">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="p-1.5 hover:bg-slate-200/60 rounded-full text-slate-500 transition"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Step {step} of 4
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {step === 1 && 'What do you need?'}
                {step === 2 && 'Quantity & Urgency'}
                {step === 3 && 'Radius & Timeline'}
                {step === 4 && 'Review & Publish Request'}
              </h2>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div 
            className="bg-emerald-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {/* STEP 1: Category & Title */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => {
                        setCategory(cat.name);
                        if (cat.name === 'Food') setUnit('meals');
                        else setUnit('items');
                      }}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                        category === cat.name
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Request Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Need 15 packed meals for evening community drive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Details / Context (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide context so nearby givers can help quickly..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Quantity & Urgency */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Package size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-800 font-medium">Needed Quantity</div>
                    <div className="text-sm font-bold text-slate-900">{quantity} {unit}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition active:scale-95"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                  <button 
                    type="button" 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Urgency Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'NORMAL', label: 'Normal', desc: 'Needed within 24 hours' },
                    { id: 'URGENT', label: 'Urgent ⚡', desc: 'Needed within 2-4 hours' },
                    { id: 'EMERGENCY', label: 'Emergency 🚨', desc: 'Surplus rescue needed immediately' },
                    { id: 'LOW', label: 'Flexible', desc: 'No tight time deadline' }
                  ].map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id as UrgencyLevel)}
                      className={`p-3 rounded-xl border text-left transition ${
                        urgency === u.id
                          ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{u.label}</div>
                      <div className="text-[11px] text-slate-500">{u.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unit Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. meals, items, books, boxes"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-sm outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Radius & Timeline */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Search Radius ({radiusKm} km)
                  </label>
                  <span className="text-xs font-semibold text-emerald-600">Hyperlocal Search</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="15"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 km (Neighborhood)</span>
                  <span>5 km (City Zone)</span>
                  <span>15 km (Wide)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Needed By Timeline
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. Today by 8:00 PM"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200/70 p-3.5 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="font-semibold block mb-0.5">Smart Notification Active</span>
                  Nearby givers with active listings matching <strong>{category}</strong> will be notified of your request automatically.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Publish */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-slate-900">{category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">Title</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[200px] truncate">{title || `Request for ${category}`}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">Quantity Needed</span>
                  <span className="font-semibold text-emerald-600">{quantity} {unit}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">Urgency</span>
                  <span className="font-semibold text-slate-900">{urgency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Search Radius</span>
                  <span className="font-semibold text-slate-900">Within {radiusKm} km</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
                <Sparkles size={16} className="text-emerald-600 shrink-0" />
                <span>Your request will be visible on the hyperlocal community feed instantly.</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !title.trim()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <CheckCircle2 size={18} /> Publish Community Request
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

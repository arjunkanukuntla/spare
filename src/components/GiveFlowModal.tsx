import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCategory } from '../types';
import { analyzeListingItem } from '../services/aiAssistant';
import { X, Check, Utensils, ArrowRight } from 'lucide-react';

export const GiveFlowModal: React.FC = () => {
  const { giveModalOpen, setGiveModalOpen, createListing } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestionsApplied, setSuggestionsApplied] = useState(false);

  // Form Fields
  const [category, setCategory] = useState<ListingCategory>('College');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('items');
  const [condition, setCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair'>('Good');
  const [pickupDeadlineTime, setPickupDeadlineTime] = useState('Today 9:00 PM');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600');

  // Food specific fields
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [storageCondition, setStorageCondition] = useState<'Ambient / Room Temp' | 'Refrigerated' | 'Hot Held (>60°C)' | 'Packaged Sealed'>('Packaged Sealed');
  const [safetyDeclared, setSafetyDeclared] = useState(false);

  if (!giveModalOpen) return null;

  const categories: { label: ListingCategory; emoji: string }[] = [
    { label: 'College', emoji: '🎓' },
    { label: 'Books', emoji: '📚' },
    { label: 'Food', emoji: '🍛' },
    { label: 'Electronics', emoji: '📱' },
    { label: 'Clothes', emoji: '👕' },
    { label: 'Furniture', emoji: '🪑' },
    { label: 'Household', emoji: '🏠' },
    { label: 'Other', emoji: '📦' },
  ];

  const handlePhotoUpload = async (sampleUrl?: string) => {
    const targetUrl = sampleUrl || imageUrl;
    setAnalyzing(true);
    try {
      const res = await analyzeListingItem(targetUrl);
      setTitle(res.title);
      setCategory(res.category);
      setCondition(res.condition);
      setDescription(res.description);
      setUnit(res.unit);
      setQuantity(res.quantity);
      setSuggestionsApplied(true);
    } catch (e) {
      // Fallback
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (category === 'Food' && !safetyDeclared) {
      alert('Please confirm the food safety declaration.');
      return;
    }

    createListing({
      category,
      title: title || 'Spare item',
      description,
      quantity,
      unit,
      condition,
      price: 0,
      distributionType: 'FREE',
      pickupDeadlineTime,
      images: [imageUrl],
      foodDetails: category === 'Food' ? {
        vegetarian: isVegetarian,
        preparationTime: 'Prepared today',
        storageCondition,
        packagingStatus: 'Individually Packed',
        safetyConfirmed: safetyDeclared,
      } : undefined,
    });

    setGiveModalOpen(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">Give something</h2>
            <p className="text-[11px] text-slate-500">Step {step} of 4</p>
          </div>
          <button onClick={() => setGiveModalOpen(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* STEP 1: Category & Photo */}
          {step === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  What are you giving?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label)}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        category === cat.label
                          ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="text-[11px]">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Helper */}
              <div className="bg-slate-900 text-white rounded-2xl p-3 space-y-2">
                <span className="font-bold text-xs text-emerald-400 block">Add photo</span>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Photo URL..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handlePhotoUpload()}
                    disabled={analyzing}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl"
                  >
                    <span>{analyzing ? 'Scanning...' : 'Auto-fill'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600');
                      handlePhotoUpload('https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488');
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                  >
                    Calculator
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600');
                      handlePhotoUpload('https://images.unsplash.com/photo-1555244162-803834f70033');
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                  >
                    Meals
                  </button>
                </div>

                {suggestionsApplied && (
                  <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Details auto-filled!
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl hover:bg-emerald-500"
                >
                  <span>Next: Item Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Item Details */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">What is it?</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scientific Calculator or 20 Meals"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe condition, pickup instructions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="items / meals"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl hover:bg-emerald-500"
                >
                  <span>Next: Location</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Food Safety */}
          {step === 3 && (
            <div className="space-y-3">
              {category === 'Food' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Utensils className="w-3.5 h-3.5 text-emerald-700" /> Food Safety Declaration
                  </div>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isVegetarian} 
                      onChange={(e) => setIsVegetarian(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-start gap-2 text-[11px] text-emerald-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safetyDeclared}
                      onChange={(e) => setSafetyDeclared(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600"
                    />
                    <span>"Food is fresh and properly handled for redistribution."</span>
                  </label>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available until?</label>
                <input
                  type="text"
                  value={pickupDeadlineTime}
                  onChange={(e) => setPickupDeadlineTime(e.target.value)}
                  placeholder="e.g. Today 9:00 PM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl hover:bg-emerald-500"
                >
                  <span>Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Preview & Publish */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <p className="font-extrabold text-slate-900">{title}</p>
                <p className="text-slate-600">{quantity} {unit} · {category}</p>
                <p className="text-slate-500 text-[11px]">{description || 'No description.'}</p>
                <p className="text-emerald-700 font-bold pt-1">FREE</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl shadow"
                >
                  Give
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};

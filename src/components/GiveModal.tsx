import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCategory, DistributionType } from '../types';
import { analyzeListingItem } from '../services/aiAssistant';
import { 
  X, 
  Sparkles, 
  Check, 
  Utensils, 
  ArrowRight
} from 'lucide-react';

export const GiveModal: React.FC = () => {
  const { giveModalOpen, setGiveModalOpen, createListing } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestionsApplied, setSuggestionsApplied] = useState(false);

  // Form Fields
  const [category, setCategory] = useState<ListingCategory>('College');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('items');
  const [condition, setCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair'>('Good');
  const [distributionType, setDistributionType] = useState<DistributionType>('FREE');
  const [surplusPrice, setSurplusPrice] = useState(60);
  const [originalPrice, setOriginalPrice] = useState(200);
  const [pickupDeadlineTime, setPickupDeadlineTime] = useState('Tomorrow 9:00 PM');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600');

  // Food specific fields
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [storageCondition, setStorageCondition] = useState<'Ambient / Room Temp' | 'Refrigerated' | 'Hot Held (>60°C)' | 'Packaged Sealed'>('Packaged Sealed');
  const [packagingStatus, setPackagingStatus] = useState<'Individually Packed' | 'Bulk Containers' | 'Sealed Boxes'>('Individually Packed');
  const [safetyDeclared, setSafetyDeclared] = useState(false);

  if (!giveModalOpen) return null;

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
      // Ignore fallback
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (category === 'Food' && !safetyDeclared) {
      alert('Please confirm the Food Safety & Handling Declaration before publishing.');
      return;
    }

    createListing({
      category,
      title: title || 'Surplus Item',
      description,
      quantity,
      unit,
      condition,
      price: distributionType === 'FREE' ? 0 : surplusPrice,
      originalPrice: distributionType === 'SURPLUS_SALE' ? originalPrice : undefined,
      distributionType,
      pickupDeadlineTime,
      images: [imageUrl],
      foodDetails: category === 'Food' ? {
        vegetarian: isVegetarian,
        preparationTime: 'Prepared recently',
        storageCondition,
        packagingStatus,
        safetyConfirmed: safetyDeclared,
      } : undefined,
    });

    setGiveModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              +
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Give Something Spare</h2>
              <p className="text-xs text-slate-500">Free redistribution near you</p>
            </div>
          </div>
          <button onClick={() => setGiveModalOpen(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* STEP 1: Category & Photo Assistant */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label)}
                      className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                        category === cat.label
                          ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="text-xs">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Auto-Fill Helper */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                    Quick Auto-Fill Helper
                  </span>
                  <span className="text-[10px] text-slate-400">Auto-detects item details</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL or preset..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handlePhotoUpload()}
                    disabled={analyzing}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
                  >
                    <span>{analyzing ? 'Scanning...' : 'Auto-Fill'}</span>
                  </button>
                </div>

                {/* Preset sample photos */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400">Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600');
                      handlePhotoUpload('https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488');
                    }}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
                  >
                    🧮 Calculator
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600');
                      handlePhotoUpload('https://images.unsplash.com/photo-1555244162-803834f70033');
                    }}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
                  >
                    🍛 Feast Surplus
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600');
                      handlePhotoUpload('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c');
                    }}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
                  >
                    📚 Textbooks
                  </button>
                </div>

                {suggestionsApplied && (
                  <div className="text-[11px] text-emerald-300 bg-emerald-950 p-2 rounded-xl flex items-center gap-1.5 border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Item details auto-filled! Review below.</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 bg-emerald-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl hover:bg-emerald-500 transition"
                >
                  <span>Next: Item Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Details & Food Safety */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Casio Scientific Calculator or 20 Veg Meals"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe condition, pickup instructions, details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 h-16 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="meals / items / books"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:border-emerald-500"
                  />
                </div>
              </div>

              {category !== 'Food' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Item Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              ) : (
                /* Food Safety Section */
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-3">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <Utensils className="w-4 h-4 text-emerald-700" /> Food Safety Declaration
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isVegetarian} 
                        onChange={(e) => setIsVegetarian(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Vegetarian</span>
                    </label>

                    <select
                      value={storageCondition}
                      onChange={(e) => setStorageCondition(e.target.value as any)}
                      className="bg-white border border-emerald-300 rounded-lg p-1.5 text-xs text-slate-800 font-semibold"
                    >
                      <option value="Ambient / Room Temp">Room Temp</option>
                      <option value="Refrigerated">Refrigerated</option>
                      <option value="Hot Held (>60°C)">Hot Held (&gt;60°C)</option>
                      <option value="Packaged Sealed">Packaged Sealed</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-emerald-200">
                    <label className="flex items-start gap-2 text-[11px] text-emerald-950 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={safetyDeclared}
                        onChange={(e) => setSafetyDeclared(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>
                        "I confirm that this listing is suitable for redistribution and has been handled/stored according to applicable requirements."
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Distribution Toggle */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Distribution Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDistributionType('FREE')}
                    className={`p-2 rounded-xl text-xs font-extrabold border transition ${
                      distributionType === 'FREE'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    GIVE — FREE (₹0)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistributionType('SURPLUS_SALE')}
                    className={`p-2 rounded-xl text-xs font-extrabold border transition ${
                      distributionType === 'SURPLUS_SALE'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Optional Surplus Sale
                  </button>
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
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 px-6 rounded-xl shadow transition"
                >
                  Publish Listing
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};

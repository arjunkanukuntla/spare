import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListingCategory, ListingCondition } from '../../types';
import { X, Camera, Upload, Check, AlertCircle, Utensils, MapPin, Sparkles } from 'lucide-react';

const CATEGORIES: { id: ListingCategory; icon: string; desc: string }[] = [
  { id: 'College', icon: '🎓', desc: 'Calculators, lab coats, drawing tools' },
  { id: 'Electronics', icon: '⚡', desc: 'Chargers, cables, power banks, mice' },
  { id: 'Books', icon: '📚', desc: 'Textbooks, notes, reference guides' },
  { id: 'DIY & Tools', icon: '🔧', desc: 'Multimeters, components, Arduino, tools' },
  { id: 'Food', icon: '🍱', desc: 'Canteen surplus, event food, snacks' },
  { id: 'Clothing', icon: '👕', desc: 'Hoodies, jackets, event wear' },
  { id: 'Household', icon: '🏠', desc: 'Hostel items, kettles, extension boards' },
  { id: 'Accessories', icon: '🎧', desc: 'Headphones, bags, cases' },
  { id: 'Other', icon: '📦', desc: 'General useful items' },
];

const PRESET_PHOTOS: Record<ListingCategory, string[]> = {
  College: [
    'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=600'
  ],
  Electronics: [
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'
  ],
  Books: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'
  ],
  'DIY & Tools': [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&q=80&w=600'
  ],
  Food: [
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600'
  ],
  Clothing: [
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600'
  ],
  Household: [
    'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&q=80&w=600'
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
  ],
  Other: [
    'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600'
  ]
};

export const GiveFlowModal: React.FC = () => {
  const { giveModalOpen, setGiveModalOpen, createListing, currentUser, organization } = useApp();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListingCategory>('College');
  const [condition, setCondition] = useState<ListingCondition>('Good');
  const [description, setDescription] = useState('');
  const [pickupArea, setPickupArea] = useState('Near CSE Block Lobby');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  // Food specific state
  const [isVeg, setIsVeg] = useState(true);
  const [prepTime, setPrepTime] = useState('Today 4:00 PM');
  const [foodQuantity, setFoodQuantity] = useState(10);
  const [pickupHours, setPickupHours] = useState(4);
  const [foodSafetyConfirmed, setFoodSafetyConfirmed] = useState(false);

  if (!giveModalOpen) return null;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const photoToUse = selectedPhoto || PRESET_PHOTOS[category]?.[0] || 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600';

    const isFood = category === 'Food';
    const deadline = isFood ? new Date(Date.now() + pickupHours * 3600000).toISOString() : undefined;

    createListing({
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      ownerRole: currentUser.role,
      ownerReliability: currentUser.reliabilityRating,
      isVerifiedOwner: currentUser.isVerified,
      category,
      title: title.trim(),
      description: description.trim() || 'Useful item available for campus surplus redistribution.',
      quantity: isFood ? foodQuantity : 1,
      unit: isFood ? 'meals' : 'item',
      condition,
      approximateLocation: `Near ${pickupArea.split(' ')[0] || 'Campus'}, ${organization.name}`,
      pickupArea: pickupArea.trim(),
      distanceKm: Number((Math.random() * 0.5 + 0.2).toFixed(1)),
      images: [photoToUse],
      foodDetails: isFood ? {
        vegetarian: isVeg,
        preparationTime: prepTime,
        storageCondition: 'Ambient / Room Temp',
        packagingStatus: 'Individually Packed',
        safetyConfirmed: foodSafetyConfirmed,
      } : undefined,
      pickupDeadline: deadline,
    });

    // Reset & close modal
    setStep(1);
    setTitle('');
    setDescription('');
    setSelectedPhoto('');
    setGiveModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-bold text-stone-900 text-lg">Give something</h2>
            <p className="text-xs text-stone-500">Step {step} of {category === 'Food' ? '5' : '4'}</p>
          </div>
          <button
            onClick={() => setGiveModalOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-stone-800">
                What are you giving?
              </label>
              <input
                type="text"
                placeholder="e.g. Casio FX-991EX Calculator, Lenovo Type-C Charger, BS Grewal Maths Book"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                autoFocus
              />

              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Select Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        category === cat.id
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold ring-2 ring-emerald-600/20'
                          : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="text-xl mb-1">{cat.icon}</span>
                      <span className="text-xs font-semibold">{cat.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-stone-800">
                What condition is it in?
              </label>
              <div className="space-y-2">
                {(['New', 'Like new', 'Good', 'Used', 'Needs repair'] as ListingCondition[]).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                      condition === cond
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>{cond}</span>
                    {condition === cond && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-stone-800">
                Tell people about it
              </label>
              <textarea
                rows={3}
                placeholder="Describe the item, why you are giving it, and any helpful details for someone who needs it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
              />

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Agreed Pickup Point (Safe Campus Location)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. CSE Block Lobby / Central Library Entrance"
                    value={pickupArea}
                    onChange={(e) => setPickupArea(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Note: Exact private home address will never be publicly displayed.
                </p>
              </div>
            </div>
          )}

          {step === 4 && category === 'Food' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                <Utensils className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Food Safety Notice</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Food listings expire automatically. Please confirm food is fresh & safe.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-stone-700">Type:</label>
                <button
                  type="button"
                  onClick={() => setIsVeg(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isVeg ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700'}`}
                >
                  🌱 Vegetarian
                </button>
                <button
                  type="button"
                  onClick={() => setIsVeg(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${!isVeg ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'}`}
                >
                  🍖 Non-Veg
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Quantity (Meals / Boxes)</label>
                <input
                  type="number"
                  min="1"
                  value={foodQuantity}
                  onChange={(e) => setFoodQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pickup Deadline (Hours from now)</label>
                <select
                  value={pickupHours}
                  onChange={(e) => setPickupHours(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value={2}>2 Hours</option>
                  <option value={4}>4 Hours</option>
                  <option value={8}>8 Hours</option>
                  <option value={12}>12 Hours</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="safetyCheck"
                  checked={foodSafetyConfirmed}
                  onChange={(e) => setFoodSafetyConfirmed(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-md"
                />
                <label htmlFor="safetyCheck" className="text-xs font-medium text-stone-700">
                  I confirm this surplus food was hygienically prepared and safe to eat.
                </label>
              </div>
            </div>
          )}

          {step === (category === 'Food' ? 5 : 4) && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-stone-800">
                Item Preview & Photo
              </label>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-stone-900 text-sm">{title || 'Surplus Item'}</h4>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <span>{category}</span>
                  <span>•</span>
                  <span>{condition}</span>
                </div>
                <p className="text-xs text-stone-600 mt-2">{description || 'No description provided.'}</p>
                <p className="text-xs text-emerald-700 font-semibold mt-2">Pickup: {pickupArea}</p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                <p>
                  Your listing will be instantly visible to students near <strong>{organization.name}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Back
            </button>
          ) : <div />}

          {step < (category === 'Food' ? 5 : 4) ? (
            <button
              type="button"
              disabled={!title.trim()}
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-all shadow-xs"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              Publish Listing
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

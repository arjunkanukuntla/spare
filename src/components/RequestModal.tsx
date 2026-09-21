import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCategory, UrgencyLevel } from '../types';
import { X, HeartHandshake, MapPin, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const RequestModal: React.FC = () => {
  const { requestModalOpen, setRequestModalOpen, createRequest, currentUser } = useApp();

  const [category, setCategory] = useState<ListingCategory>('Food');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('units');
  const [urgency, setUrgency] = useState<UrgencyLevel>('NORMAL');
  const [radiusKm, setRadiusKm] = useState(5);
  const [deadline, setDeadline] = useState('As soon as possible');

  if (!requestModalOpen) return null;

  const categories: ListingCategory[] = ['Food', 'Books', 'College', 'Electronics', 'Clothes', 'Furniture', 'Household', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest({
      category,
      title: title || `Need ${category} Surplus`,
      description,
      quantity,
      unit,
      urgency,
      radiusKm,
      deadline,
    });
    setRequestModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <HeartHandshake className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Create a Need Request</h2>
              <p className="text-xs text-slate-500">Ask nearby community & surplus providers</p>
            </div>
          </div>
          <button onClick={() => setRequestModalOpen(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">What do you need?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need 100 vegetarian meals or Need scientific calculator"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent (Within hours)</option>
                <option value="EMERGENCY">Emergency (Immediate)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity Needed</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="meals / items / mattresses"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Context</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context on who will use this surplus..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 h-16"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Search Radius (km)</label>
              <input
                type="number"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Need By</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. 9:30 PM Tonight"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRequestModalOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition"
            >
              Post Request
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

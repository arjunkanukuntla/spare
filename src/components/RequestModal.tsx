import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCategory, UrgencyLevel } from '../types';
import { X, HeartHandshake } from 'lucide-react';

export const RequestModal: React.FC = () => {
  const { requestModalOpen, setRequestModalOpen, createRequest } = useApp();

  const [category, setCategory] = useState<ListingCategory>('Food');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('items');
  const [urgency, setUrgency] = useState<UrgencyLevel>('NORMAL');
  const [radiusKm, setRadiusKm] = useState(5);
  const [deadline, setDeadline] = useState('As soon as possible');

  if (!requestModalOpen) return null;

  const categories: ListingCategory[] = ['Food', 'Books', 'College', 'Electronics', 'Clothes', 'Furniture', 'Household', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest({
      category,
      title: title || `Need ${category.toLowerCase()} spare`,
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">What do you need?</h2>
            <p className="text-[11px] text-slate-500">Ask people & organizations nearby</p>
          </div>
          <button onClick={() => setRequestModalOpen(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">What are you looking for?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need a calculator or 20 meals"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-semibold"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-bold"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">How many?</label>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Needed by?</label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. Tonight 9 PM"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-semibold"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setRequestModalOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow"
            >
              Post request
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListingCategory, UrgencyLevel } from '../../types';
import { X, Search, MapPin, Send } from 'lucide-react';

const CATEGORIES: ListingCategory[] = [
  'College', 'Electronics', 'Books', 'DIY & Tools', 'Food', 'Clothing', 'Household', 'Accessories', 'Other'
];

export const RequestFlowModal: React.FC = () => {
  const { requestModalOpen, setRequestModalOpen, createRequest, currentUser, organization } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListingCategory>('College');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Whenever');

  if (!requestModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createRequest({
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      category,
      title: title.trim(),
      description: description.trim() || 'Looking for this item on campus.',
      quantity: 1,
      unit: 'item',
      location: `${organization.name} Campus`,
      distanceKm: 0.5,
      urgency,
    });

    setTitle('');
    setDescription('');
    setRequestModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-bold text-stone-900 text-lg">Request something</h2>
            <p className="text-xs text-stone-500">Post what you're looking for on campus</p>
          </div>
          <button
            onClick={() => setRequestModalOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              What do you need?
            </label>
            <input
              type="text"
              placeholder="e.g. Scientific Calculator, Type-C Charger, BS Grewal Maths Book"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ListingCategory)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Details / Course / Specification
            </label>
            <textarea
              rows={3}
              placeholder="Add details like model number, specific edition, or why you need it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Urgency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Whenever', 'Soon', 'Today'] as UrgencyLevel[]).map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    urgency === u
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Publish Request</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

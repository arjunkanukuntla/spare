import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const EventModePage: React.FC = () => {
  const { createListing, setActiveTab, triggerConfetti } = useApp();

  const [eventType, setEventType] = useState('Wedding');
  const [eventName, setEventName] = useState('Royal Reception');
  const [expectedGuests, setExpectedGuests] = useState(1000);
  const [attendedGuests, setAttendedGuests] = useState(780);
  const [pickupDeadlineTime, setPickupDeadlineTime] = useState('9:30 PM');
  const [published, setPublished] = useState(false);

  const calculatedSurplus = Math.max(0, expectedGuests - attendedGuests);

  const handleCreateEventSurplus = (e: React.FormEvent) => {
    e.preventDefault();

    if (calculatedSurplus <= 0) {
      alert('Calculated surplus must be greater than 0.');
      return;
    }

    createListing({
      category: 'Food',
      title: `${calculatedSurplus} Vegetarian Meals (${eventName})`,
      description: `Fresh meals from ${eventType} (${eventName}). Prepared for ${expectedGuests}, ${attendedGuests} attended.`,
      quantity: calculatedSurplus,
      unit: 'meals',
      price: 0,
      distributionType: 'FREE',
      pickupDeadlineTime,
      images: ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600'],
      foodDetails: {
        vegetarian: true,
        preparationTime: 'Prepared today',
        storageCondition: 'Hot Held (>60°C)',
        packagingStatus: 'Bulk Containers',
        safetyConfirmed: true,
      },
    });

    setPublished(true);
    triggerConfetti();
  };

  return (
    <div className="space-y-5 px-4 py-5 overflow-x-hidden">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Got event surplus?</h1>
        <p className="text-xs text-slate-500">Calculate leftover meals and list in seconds.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4 shadow-sm">
        <form onSubmit={handleCreateEventSurplus} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900"
              >
                <option value="Wedding">Wedding 💒</option>
                <option value="Birthday">Birthday 🎂</option>
                <option value="Corporate Event">Corporate 🏢</option>
                <option value="College Event">College Fest 🎓</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Guests prepared for</label>
              <input
                type="number"
                value={expectedGuests}
                onChange={(e) => setExpectedGuests(Number(e.target.value))}
                min={1}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-black text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Attended</label>
              <input
                type="number"
                value={attendedGuests}
                onChange={(e) => setAttendedGuests(Number(e.target.value))}
                min={0}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-black text-slate-900"
              />
            </div>
          </div>

          {/* Calculator Output */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Leftover Meals</span>
              <p className="text-2xl font-black text-emerald-400">{calculatedSurplus} meals</p>
            </div>

            {!published ? (
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition shadow"
              >
                Give {calculatedSurplus} meals on SPARE
              </button>
            ) : (
              <div className="flex items-center justify-center gap-1.5 bg-emerald-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" /> Listed!
              </div>
            )}
          </div>

        </form>

        {published && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Ready for matching</span>
            <button
              onClick={() => setActiveTab('match')}
              className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs py-2 px-3.5 rounded-xl"
            >
              <span>View Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

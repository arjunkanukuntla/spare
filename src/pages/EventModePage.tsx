import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Utensils, Sparkles, CheckCircle2, ArrowRight, Calculator } from 'lucide-react';

export const EventModePage: React.FC = () => {
  const { createListing, setActiveTab, triggerConfetti } = useApp();

  const [eventType, setEventType] = useState('Wedding');
  const [eventName, setEventName] = useState('Royal Grand Banquet');
  const [expectedGuests, setExpectedGuests] = useState(1000);
  const [attendedGuests, setAttendedGuests] = useState(780);
  const [pickupDeadlineTime, setPickupDeadlineTime] = useState('9:30 PM Tonight');
  const [isVeg, setIsVeg] = useState(true);
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
      title: `${calculatedSurplus} Vegetarian Meals from ${eventName}`,
      description: `Unserved high quality surplus meals from ${eventType} (${eventName}). Prepared for ${expectedGuests} guests, ${attendedGuests} attended.`,
      quantity: calculatedSurplus,
      unit: 'meals',
      price: 0,
      distributionType: 'FREE',
      pickupDeadlineTime,
      images: ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600'],
      foodDetails: {
        vegetarian: isVeg,
        preparationTime: 'Prepared recently',
        storageCondition: 'Hot Held (>60°C)',
        packagingStatus: 'Bulk Containers',
        safetyConfirmed: true,
      },
    });

    setPublished(true);
    triggerConfetti();
  };

  return (
    <div className="space-y-8 pb-24 md:pb-12 max-w-4xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full">
          <Calendar className="w-3.5 h-3.5" /> SPARE Event Mode
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Event Surplus Calculator</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
          Weddings, birthdays & corporate galas often prepare for expected attendance. Calculate remaining eligible unserved meals and redistribute in seconds.
        </p>
      </div>

      {/* Calculator Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
        <form onSubmit={handleCreateEventSurplus} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900"
              >
                <option value="Wedding">Wedding Banquet 💒</option>
                <option value="Birthday">Birthday Party 🎂</option>
                <option value="Corporate Event">Corporate Gala 🏢</option>
                <option value="College Event">College Fest 🎓</option>
                <option value="Religious Function">Religious Function 🕉️</option>
                <option value="Community Event">Community Gathering 🤝</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Grand Wedding Reception"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expected Guests Prepared For
              </label>
              <input
                type="number"
                value={expectedGuests}
                onChange={(e) => setExpectedGuests(Number(e.target.value))}
                min={1}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-black text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Actual Attended Guests
              </label>
              <input
                type="number"
                value={attendedGuests}
                onChange={(e) => setAttendedGuests(Number(e.target.value))}
                min={0}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-black text-slate-900"
              />
            </div>
          </div>

          {/* Calculator Output Box */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                <Calculator className="w-4 h-4" /> Surplus Calculation Matrix
              </span>
              <p className="text-2xl font-black text-white">
                {calculatedSurplus} <span className="text-emerald-400 font-normal text-lg">Eligible Surplus Meals</span>
              </p>
              <p className="text-xs text-slate-300">
                Formula: {expectedGuests} expected − {attendedGuests} attended = {calculatedSurplus} meals eligible for redistribution.
              </p>
            </div>

            {!published ? (
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3.5 px-6 rounded-2xl shadow-lg transition transform active:scale-95 whitespace-nowrap"
              >
                List {calculatedSurplus} Meals on SPARE
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl">
                <CheckCircle2 className="w-4 h-4" /> Published to SPARE!
              </div>
            )}
          </div>

        </form>

        {published && (
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-600 font-medium">Listing live! AI matching ready for immediate dispatch.</p>
            <button
              onClick={() => setActiveTab('match')}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition"
            >
              <span>View AI Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

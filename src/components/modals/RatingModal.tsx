import React, { useState } from 'react';
import { Exchange } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, X, Check } from 'lucide-react';

interface RatingModalProps {
  exchange: Exchange | null;
  onClose: () => void;
}

const TAG_OPTIONS = [
  'Reliable & punctual',
  'Communicated well',
  'Item matched description',
  'Friendly & polite',
  'Quick response'
];

export const RatingModal: React.FC<RatingModalProps> = ({ exchange, onClose }) => {
  const { currentUser, submitRating } = useApp();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Reliable & punctual', 'Communicated well']);
  const [comment, setComment] = useState('');

  if (!exchange) return null;

  const isGiver = currentUser.id === exchange.giverId;
  const targetName = isGiver ? exchange.receiverName : exchange.giverName;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRating(rating, selectedTags, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-bold text-stone-900 text-base">Rate Exchange</h2>
            <p className="text-xs text-stone-500">How was your interaction with {targetName}?</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Star Rating Selector */}
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1.5 focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star className={`w-8 h-8 ${
                  star <= rating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                }`} />
              </button>
            ))}
          </div>

          {/* Quick Tags */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Select feedback tags:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TAG_OPTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Optional Comment
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Great experience, handed over promptly at library entrance."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            Submit Feedback
          </button>
        </form>

      </div>
    </div>
  );
};

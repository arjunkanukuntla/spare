import React from 'react';
import { ListingCategory } from '../../types';

interface CategoryChipProps {
  label: ListingCategory | 'All';
  emoji: string;
  selected: boolean;
  onClick: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label, emoji, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
        selected
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
      }`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
};

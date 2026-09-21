import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 space-y-3 animate-pulse">
      <div className="aspect-[4/3] w-full bg-slate-200 rounded-xl" />
      <div className="space-y-1.5">
        <div className="h-3 bg-slate-200 rounded w-3/4" />
        <div className="h-2.5 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
  );
};

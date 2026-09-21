import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isCompleted = status === 'COMPLETED';
  return (
    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
    }`}>
      {isCompleted ? 'Completed' : 'Claimed'}
    </span>
  );
};

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  description?: string;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  message, 
  description, 
  actionText, 
  actionLabel, 
  onAction 
}) => {
  const displayMsg = description || message;
  const displayBtnLabel = actionLabel || actionText;

  return (
    <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200/80 shadow-spare-card flex flex-col items-center justify-center">
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
          {icon}
        </div>
      )}
      <h3 className="font-extrabold text-slate-800 text-sm">{title}</h3>
      {displayMsg && <p className="text-xs text-slate-500 max-w-xs mx-auto">{displayMsg}</p>}
      {displayBtnLabel && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition shadow-xs mt-2"
        >
          {displayBtnLabel}
        </button>
      )}
    </div>
  );
};

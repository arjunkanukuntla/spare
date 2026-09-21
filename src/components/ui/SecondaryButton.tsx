import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ children, fullWidth = false, className = '', ...props }) => {
  return (
    <button
      className={`bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs py-3 px-5 rounded-xl transition flex items-center justify-center gap-1.5 ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

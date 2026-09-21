import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, fullWidth = false, className = '', ...props }) => {
  return (
    <button
      className={`bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs py-3 px-5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

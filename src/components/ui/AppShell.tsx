import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-800">
      {children}
    </div>
  );
};

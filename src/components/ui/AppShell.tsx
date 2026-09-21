import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start overflow-x-hidden">
      <div className="spare-app-shell flex flex-col min-h-screen relative text-slate-900">
        {children}
      </div>
    </div>
  );
};

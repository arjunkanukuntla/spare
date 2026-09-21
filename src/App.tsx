import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoSwitcher } from './components/DemoSwitcher';
import { DemoTourModal } from './components/DemoTourModal';
import { Navigation } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { GiveModal } from './components/GiveModal';
import { RequestModal } from './components/RequestModal';

import { HomePage } from './pages/HomePage';
import { ExploreMapPage } from './pages/ExploreMapPage';
import { MatchPage } from './pages/MatchPage';
import { EventModePage } from './pages/EventModePage';
import { ActivityPage } from './pages/ActivityPage';
import { DashboardsPage } from './pages/DashboardsPage';
import { ImpactPage } from './pages/ImpactPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExploreMapPage />;
      case 'match':
        return <MatchPage />;
      case 'event':
        return <EventModePage />;
      case 'activity':
        return <ActivityPage />;
      case 'dashboards':
        return <DashboardsPage />;
      case 'impact':
        return <ImpactPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start overflow-x-hidden">
      
      {/* Mobile App Viewport Shell Container */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 text-slate-900 flex flex-col shadow-2xl relative overflow-x-hidden border-x border-slate-800/60">
        
        {/* Top Header Role Switcher Bar */}
        <DemoSwitcher />

        {/* Dynamic Page Views */}
        <main className="flex-1 pb-20 overflow-x-hidden">
          {renderActivePage()}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <Navigation />
      </div>

      {/* Global Modals */}
      <DemoTourModal />
      <OnboardingModal />
      <GiveModal />
      <RequestModal />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

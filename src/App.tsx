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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Floating Hackathon Demo Bar */}
      <DemoSwitcher />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar & Mobile Navigation */}
        <Navigation />

        {/* Dynamic Page Views */}
        <main className="flex-1 min-w-0">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals & Guided Demo Engine */}
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

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/ui/AppShell';
import { TopBar } from './components/ui/TopBar';
import { BottomNavigation } from './components/ui/BottomNavigation';
import { DemoSwitcher } from './components/DemoSwitcher';
import { DemoTourModal } from './components/DemoTourModal';
import { OnboardingModal } from './components/OnboardingModal';
import { GiveFlowModal } from './components/GiveFlowModal';
import { RequestFlowModal } from './components/RequestFlowModal';
import { ClaimSheet } from './components/ClaimSheet';
import { ListingDetailModal } from './components/ListingDetailModal';
import { Listing } from './types';

import { HomePage } from './pages/HomePage';
import { FindPage } from './pages/FindPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProfilePage } from './pages/ProfilePage';

// Additional Polish / Auxiliary Tool Views
import { MatchPage } from './pages/MatchPage';
import { EventModePage } from './pages/EventModePage';
import { DashboardsPage } from './pages/DashboardsPage';
import { ImpactPage } from './pages/ImpactPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  
  // Modal & Sheet state
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [claimListing, setClaimListing] = useState<Listing | null>(null);

  const handleOpenClaim = (listing: Listing) => {
    setSelectedListing(null);
    setClaimListing(listing);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onSelectListing={setSelectedListing} />;
      case 'explore':
        return <FindPage onSelectListing={setSelectedListing} />;
      case 'activity':
        return <ActivityPage />;
      case 'profile':
        return <ProfilePage />;
      
      // Secondary Operational Tool Screens
      case 'match':
        return <MatchPage />;
      case 'event':
        return <EventModePage />;
      case 'dashboards':
        return <DashboardsPage />;
      case 'impact':
        return <ImpactPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage onSelectListing={setSelectedListing} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start">
      
      {/* Interactive Role Switcher Banner */}
      <DemoSwitcher />

      {/* Mobile-First Shell Container */}
      <AppShell>
        
        {/* Top Header Bar with Location Picker */}
        <TopBar onOpenProfile={() => setActiveTab('profile')} />

        {/* Dynamic Page Views */}
        <main className="flex-1 pb-20 overflow-x-hidden">
          {renderActivePage()}
        </main>

        {/* 4 Bottom Navigation Tabs */}
        <BottomNavigation />
      </AppShell>

      {/* Global Modals & Progressive Creation Sheets */}
      <DemoTourModal />
      <OnboardingModal />
      <GiveFlowModal />
      <RequestFlowModal />

      {/* Listing Detail & Claim Sheets */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onClaim={handleOpenClaim}
      />

      <ClaimSheet
        listing={claimListing}
        isOpen={Boolean(claimListing)}
        onClose={() => setClaimListing(null)}
      />

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

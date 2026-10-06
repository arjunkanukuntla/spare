import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/ui/AppShell';
import { TopBar } from './components/ui/TopBar';
import { BottomNavigation } from './components/ui/BottomNavigation';
import { DesktopSidebar } from './components/ui/DesktopSidebar';
import { GiveFlowModal } from './components/modals/GiveFlowModal';
import { RequestFlowModal } from './components/modals/RequestFlowModal';
import { ListingDetailModal } from './components/modals/ListingDetailModal';
import { ClaimModal } from './components/modals/ClaimModal';
import { ExchangeDetailModal } from './components/modals/ExchangeDetailModal';
import { RatingModal } from './components/modals/RatingModal';
import { Listing } from './types';

import { HomePage } from './pages/HomePage';
import { FindPage } from './pages/FindPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    activeExchangeForModal, 
    setActiveExchangeForModal, 
    activeRatingExchange, 
    setActiveRatingExchange 
  } = useApp();

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [claimListing, setClaimListing] = useState<Listing | null>(null);

  const handleOpenClaim = (listing: Listing) => {
    setSelectedListing(null);
    setClaimListing(listing);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onSelectListing={setSelectedListing} onClaimListing={handleOpenClaim} />;
      case 'find':
        return <FindPage onSelectListing={setSelectedListing} onClaimListing={handleOpenClaim} />;
      case 'activity':
        return <ActivityPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage onSelectListing={setSelectedListing} onClaimListing={handleOpenClaim} />;
    }
  };

  return (
    <AppShell>
      {/* Top Bar with Brand & User Profile */}
      <TopBar />

      {/* Main Responsive Body Layout (Desktop Sidebar + Main Content) */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <DesktopSidebar />
        <main className="flex-1 pb-20 sm:pb-8 min-w-0">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavigation />

      {/* Global Action Modals */}
      <GiveFlowModal />
      <RequestFlowModal />

      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onClaim={handleOpenClaim}
      />

      <ClaimModal
        listing={claimListing}
        onClose={() => setClaimListing(null)}
      />

      <ExchangeDetailModal
        exchange={activeExchangeForModal}
        onClose={() => setActiveExchangeForModal(null)}
      />

      <RatingModal
        exchange={activeRatingExchange}
        onClose={() => setActiveRatingExchange(null)}
      />
    </AppShell>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;

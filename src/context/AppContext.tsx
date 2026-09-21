import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Listing, 
  RequestItem, 
  Claim, 
  Report, 
  AppNotification, 
  ImpactMetrics, 
  DemoPersona,
  ListingCategory
} from '../types';
import { 
  DEMO_PERSONAS, 
  INITIAL_USERS, 
  INITIAL_LISTINGS, 
  INITIAL_REQUESTS, 
  INITIAL_CLAIMS, 
  INITIAL_IMPACT,
  INITIAL_REPORTS 
} from '../data/seedData';
import confetti from 'canvas-confetti';

interface AppContextType {
  activePersona: DemoPersona;
  currentUser: User;
  personas: DemoPersona[];
  users: User[];
  listings: Listing[];
  requests: RequestItem[];
  claims: Claim[];
  reports: Report[];
  notifications: AppNotification[];
  impact: ImpactMetrics;
  
  // Navigation & Filter state
  activeTab: 'home' | 'explore' | 'give' | 'match' | 'event' | 'activity' | 'dashboards' | 'impact' | 'profile' | 'admin';
  setActiveTab: (tab: 'home' | 'explore' | 'give' | 'match' | 'event' | 'activity' | 'dashboards' | 'impact' | 'profile' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ListingCategory | 'All';
  setSelectedCategory: (cat: ListingCategory | 'All') => void;
  filterFreeOnly: boolean;
  setFilterFreeOnly: (val: boolean) => void;
  
  // Modals & Guided Demo
  onboardingOpen: boolean;
  setOnboardingOpen: (val: boolean) => void;
  giveModalOpen: boolean;
  setGiveModalOpen: (val: boolean) => void;
  requestModalOpen: boolean;
  setRequestModalOpen: (val: boolean) => void;
  activeDemoTour: 1 | 2 | null;
  setActiveDemoTour: (tour: 1 | 2 | null) => void;
  
  // Actions
  switchPersona: (personaId: string) => void;
  createListing: (listingData: Partial<Listing>) => Listing;
  createRequest: (requestData: Partial<RequestItem>) => RequestItem;
  claimItem: (listingId: string, claimQty: number, method: 'SELF_PICKUP' | 'DELIVERY') => Claim | null;
  verifyPickupOTP: (claimId: string, otp: string) => boolean;
  submitReport: (listingId: string, reason: string, details: string) => void;
  resetDemoData: () => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personas] = useState<DemoPersona[]>(DEMO_PERSONAS);
  const [activePersona, setActivePersona] = useState<DemoPersona>(DEMO_PERSONAS[0]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [impact, setImpact] = useState<ImpactMetrics>(INITIAL_IMPACT);
  
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'give' | 'match' | 'event' | 'activity' | 'dashboards' | 'impact' | 'profile' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'All'>('All');
  const [filterFreeOnly, setFilterFreeOnly] = useState(true);
  
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [giveModalOpen, setGiveModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [activeDemoTour, setActiveDemoTour] = useState<1 | 2 | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      userId: 'user_p1',
      type: 'MATCH',
      title: 'AI Smart Match Ready',
      message: 'Found 4 nearby organizations capable of taking your 220 wedding meals!',
      time: '10m ago',
      read: false,
    },
    {
      id: 'n2',
      userId: 'user_p3',
      type: 'EXPIRING',
      title: 'Expiring Surplus Food Nearby',
      message: '🍛 35 free thali meals available 1.2 km away. Pickup before 10 PM.',
      time: '25m ago',
      read: false,
    }
  ]);

  // Sync user with persona
  const switchPersona = (personaId: string) => {
    const foundP = personas.find(p => p.id === personaId) || personas[0];
    setActivePersona(foundP);
    const foundU = users.find(u => u.id === `user_${foundP.id}`) || {
      id: `user_${foundP.id}`,
      name: foundP.name,
      emailPhone: 'demo@spare.org',
      avatar: foundP.avatar,
      role: foundP.role,
      location: foundP.location,
      reputation: 4.9,
      isVerified: true,
      verificationBadgeText: `${foundP.roleTitle} ✓`,
      itemsGiven: 12,
      itemsClaimed: 5,
      successRate: 98,
      createdAt: '2025-01-01',
      bio: foundP.bio,
    };
    setCurrentUser(foundU);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#34D399', '#F59E0B']
      });
    } catch (e) {
      // Ignore fallback
    }
  };

  const createListing = (data: Partial<Listing>): Listing => {
    const newListing: Listing = {
      id: `list_${Date.now()}`,
      providerId: currentUser.id,
      providerName: currentUser.name,
      providerAvatar: currentUser.avatar,
      providerRole: currentUser.role,
      isVerifiedProvider: currentUser.isVerified,
      category: data.category || 'Food',
      title: data.title || 'Surplus Item',
      description: data.description || 'Available for hyperlocal redistribution.',
      quantity: data.quantity || 1,
      remainingQuantity: data.quantity || 1,
      unit: data.unit || 'items',
      condition: data.condition || 'Good',
      price: data.price ?? 0,
      distributionType: data.distributionType || 'FREE',
      location: currentUser.location || 'Local Area',
      distanceKm: Number((Math.random() * 2 + 0.3).toFixed(1)),
      coordinates: { lat: 12.9345, lng: 77.6258 },
      availableFrom: data.availableFrom || 'Immediate',
      pickupDeadline: data.pickupDeadline || new Date(Date.now() + 86400000).toISOString(),
      pickupDeadlineTime: data.pickupDeadlineTime || 'Tomorrow 9:00 PM',
      status: 'ACTIVE',
      images: data.images?.length ? data.images : ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600'],
      foodDetails: data.foodDetails,
      createdAt: new Date().toISOString(),
    };

    setListings(prev => [newListing, ...prev]);
    triggerConfetti();

    // Add telemetry
    setImpact(prev => ({
      ...prev,
      itemsReused: prev.itemsReused + (data.category !== 'Food' ? (data.quantity || 1) : 0),
      mealsRedistributed: prev.mealsRedistributed + (data.category === 'Food' ? (data.quantity || 1) : 0),
    }));

    return newListing;
  };

  const createRequest = (data: Partial<RequestItem>): RequestItem => {
    const newReq: RequestItem = {
      id: `req_${Date.now()}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      requesterRole: currentUser.role,
      isVerifiedRequester: currentUser.isVerified,
      category: data.category || 'Food',
      title: data.title || 'Item Requested',
      description: data.description || '',
      quantity: data.quantity || 1,
      unit: data.unit || 'units',
      location: currentUser.location,
      distanceKm: 0.8,
      coordinates: { lat: 12.93, lng: 77.62 },
      radiusKm: data.radiusKm || 5,
      deadline: data.deadline || 'As soon as possible',
      urgency: data.urgency || 'NORMAL',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    setRequests(prev => [newReq, ...prev]);
    triggerConfetti();
    return newReq;
  };

  const claimItem = (listingId: string, claimQty: number, method: 'SELF_PICKUP' | 'DELIVERY'): Claim | null => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing || listing.remainingQuantity < claimQty) return null;

    const updatedRemaining = listing.remainingQuantity - claimQty;
    const newStatus = updatedRemaining === 0 ? 'FULLY_CLAIMED' : 'PARTIALLY_CLAIMED';

    setListings(prev => prev.map(l => l.id === listingId ? {
      ...l,
      remainingQuantity: updatedRemaining,
      status: newStatus
    } : l));

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const newClaim: Claim = {
      id: `claim_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingCategory: listing.category,
      listingImage: listing.images[0],
      providerId: listing.providerId,
      providerName: listing.providerName,
      claimantId: currentUser.id,
      claimantName: currentUser.name,
      quantity: claimQty,
      unit: listing.unit,
      pickupMethod: method,
      deliveryFee: method === 'DELIVERY' ? 59 : 0,
      status: 'CLAIMED',
      otpCode: otp,
      createdAt: new Date().toISOString(),
      pickupLocation: listing.location,
    };

    setClaims(prev => [newClaim, ...prev]);
    triggerConfetti();

    // Telemetry update
    setImpact(prev => ({
      ...prev,
      peopleHelped: prev.peopleHelped + 1,
      valueRescuedInr: prev.valueRescuedInr + (listing.category === 'Food' ? claimQty * 150 : claimQty * 800)
    }));

    return newClaim;
  };

  const verifyPickupOTP = (claimId: string, otp: string): boolean => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return false;

    if (claim.otpCode === otp || otp === '1234') { // 1234 as universal demo backup code
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'COMPLETED' } : c));
      triggerConfetti();
      return true;
    }
    return false;
  };

  const submitReport = (listingId: string, reason: string, details: string) => {
    const listing = listings.find(l => l.id === listingId);
    const newReport: Report = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      listingId,
      listingTitle: listing?.title || 'Listing',
      reason,
      details,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
  };

  const resetDemoData = () => {
    setListings(INITIAL_LISTINGS);
    setRequests(INITIAL_REQUESTS);
    setClaims(INITIAL_CLAIMS);
    setImpact(INITIAL_IMPACT);
    setReports(INITIAL_REPORTS);
    setActivePersona(DEMO_PERSONAS[0]);
    setCurrentUser(INITIAL_USERS[0]);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider value={{
      activePersona,
      currentUser,
      personas,
      users,
      listings,
      requests,
      claims,
      reports,
      notifications,
      impact,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      filterFreeOnly,
      setFilterFreeOnly,
      onboardingOpen,
      setOnboardingOpen,
      giveModalOpen,
      setGiveModalOpen,
      requestModalOpen,
      setRequestModalOpen,
      activeDemoTour,
      setActiveDemoTour,
      switchPersona,
      createListing,
      createRequest,
      claimItem,
      verifyPickupOTP,
      submitReport,
      resetDemoData,
      triggerConfetti,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

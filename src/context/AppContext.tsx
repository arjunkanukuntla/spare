import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Listing, 
  RequestItem, 
  Claim, 
  Exchange, 
  Rating, 
  Report, 
  AppNotification, 
  ListingCategory,
  AdminMetrics,
  Organization
} from '../types';
import { dbService } from '../services/dbService';
import { PRIMARY_ORGANIZATION } from '../data/seedData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  organization: Organization;
  users: User[];
  listings: Listing[];
  requests: RequestItem[];
  claims: Claim[];
  exchanges: Exchange[];
  notifications: AppNotification[];
  reports: Report[];
  adminMetrics: AdminMetrics;

  // Navigation & View state
  activeTab: 'home' | 'find' | 'activity' | 'profile' | 'admin' | 'join';
  setActiveTab: (tab: 'home' | 'find' | 'activity' | 'profile' | 'admin' | 'join') => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ListingCategory | 'All';
  setSelectedCategory: (cat: ListingCategory | 'All') => void;
  selectedCondition: string | 'All';
  setSelectedCondition: (cond: string | 'All') => void;

  // Modals & Overlay state
  giveModalOpen: boolean;
  setGiveModalOpen: (open: boolean) => void;
  requestModalOpen: boolean;
  setRequestModalOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  activeExchangeForModal: Exchange | null;
  setActiveExchangeForModal: (exchange: Exchange | null) => void;
  activeRatingExchange: Exchange | null;
  setActiveRatingExchange: (exchange: Exchange | null) => void;

  // Actions
  createListing: (data: Omit<Listing, 'id' | 'createdAt' | 'status' | 'remainingQuantity'>) => Listing;
  createRequest: (data: Omit<RequestItem, 'id' | 'createdAt' | 'status'>) => RequestItem;
  claimItem: (listingId: string, message?: string) => boolean;
  acceptClaim: (claimId: string) => Exchange | null;
  declineClaim: (claimId: string) => void;
  confirmHandover: (exchangeId: string) => void;
  submitRating: (rating: number, tags: string[], comment?: string) => void;
  submitReport: (targetType: 'listing' | 'user' | 'claim', targetId: string, reason: string, description: string) => void;
  markNotificationRead: (id: string) => void;
  refreshData: () => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(dbService.getCurrentUser());
  const [organization] = useState<Organization>(PRIMARY_ORGANIZATION);
  const [users, setUsers] = useState<User[]>(dbService.getUsers());
  const [listings, setListings] = useState<Listing[]>(dbService.getListings());
  const [requests, setRequests] = useState<RequestItem[]>(dbService.getRequests());
  const [claims, setClaims] = useState<Claim[]>(dbService.getClaims());
  const [exchanges, setExchanges] = useState<Exchange[]>(dbService.getExchanges());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [reports, setReports] = useState<Report[]>(dbService.getReports());
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>(dbService.getAdminMetrics());

  const [activeTab, setActiveTab] = useState<'home' | 'find' | 'activity' | 'profile' | 'admin' | 'join'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'All'>('All');
  const [selectedCondition, setSelectedCondition] = useState<string | 'All'>('All');

  const [giveModalOpen, setGiveModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeExchangeForModal, setActiveExchangeForModal] = useState<Exchange | null>(null);
  const [activeRatingExchange, setActiveRatingExchange] = useState<Exchange | null>(null);

  const refreshData = useCallback(() => {
    setUsers(dbService.getUsers());
    setListings(dbService.getListings());
    setRequests(dbService.getRequests());
    setClaims(dbService.getClaims());
    setExchanges(dbService.getExchanges());
    setReports(dbService.getReports());
    setNotifications(dbService.getNotifications(currentUser.id));
    setAdminMetrics(dbService.getAdminMetrics());
  }, [currentUser.id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle URL deep links like /?join=sru or /?listing=xxx
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('join') === 'sru' || window.location.pathname === '/join') {
      setActiveTab('join');
    }
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#34D399', '#F59E0B']
      });
    } catch (e) {
      // Ignore fallback
    }
  };

  const createListing = (data: Omit<Listing, 'id' | 'createdAt' | 'status' | 'remainingQuantity'>): Listing => {
    const newListing = dbService.createListing(data);
    triggerConfetti();
    refreshData();
    return newListing;
  };

  const createRequest = (data: Omit<RequestItem, 'id' | 'createdAt' | 'status'>): RequestItem => {
    const newReq = dbService.createRequest(data);
    triggerConfetti();
    refreshData();
    return newReq;
  };

  const claimItem = (listingId: string, message?: string): boolean => {
    const result = dbService.createClaim(listingId, currentUser, message);
    if (result) {
      triggerConfetti();
      refreshData();
      return true;
    }
    return false;
  };

  const acceptClaim = (claimId: string): Exchange | null => {
    const exch = dbService.acceptClaim(claimId);
    if (exch) {
      triggerConfetti();
      refreshData();
      setActiveExchangeForModal(exch);
    }
    return exch;
  };

  const declineClaim = (claimId: string) => {
    dbService.declineClaim(claimId);
    refreshData();
  };

  const confirmHandover = (exchangeId: string) => {
    const updatedExch = dbService.confirmExchangeHandover(exchangeId, currentUser.id);
    if (updatedExch) {
      triggerConfetti();
      refreshData();

      if (updatedExch.status === 'completed') {
        setActiveExchangeForModal(null);
        setActiveRatingExchange(updatedExch);
      } else {
        setActiveExchangeForModal(updatedExch);
      }
    }
  };

  const submitRating = (rating: number, tags: string[], comment?: string) => {
    if (!activeRatingExchange) return;
    const reviewedUserId = currentUser.id === activeRatingExchange.giverId ? activeRatingExchange.receiverId : activeRatingExchange.giverId;

    dbService.submitRating({
      exchangeId: activeRatingExchange.id,
      reviewerId: currentUser.id,
      reviewedUserId,
      rating,
      tags,
      comment,
    });

    setActiveRatingExchange(null);
    triggerConfetti();
    refreshData();
  };

  const submitReport = (targetType: 'listing' | 'user' | 'claim', targetId: string, reason: string, description: string) => {
    dbService.submitReport({
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType,
      targetId,
      reason,
      description,
    });
    refreshData();
  };

  const markNotificationRead = (id: string) => {
    dbService.markNotificationRead(id);
    refreshData();
  };

  const handleSetCurrentUser = (user: User) => {
    dbService.setCurrentUser(user);
    setCurrentUser(user);
    refreshData();
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser: handleSetCurrentUser,
      organization,
      users,
      listings,
      requests,
      claims,
      exchanges,
      notifications,
      reports,
      adminMetrics,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      selectedCondition,
      setSelectedCondition,
      giveModalOpen,
      setGiveModalOpen,
      requestModalOpen,
      setRequestModalOpen,
      authModalOpen,
      setAuthModalOpen,
      activeExchangeForModal,
      setActiveExchangeForModal,
      activeRatingExchange,
      setActiveRatingExchange,
      createListing,
      createRequest,
      claimItem,
      acceptClaim,
      declineClaim,
      confirmHandover,
      submitRating,
      submitReport,
      markNotificationRead,
      refreshData,
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

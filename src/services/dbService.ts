import { 
  User, 
  Listing, 
  RequestItem, 
  Claim, 
  Exchange, 
  Rating, 
  Report, 
  AppNotification, 
  AdminMetrics 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_LISTINGS, 
  INITIAL_REQUESTS, 
  INITIAL_CLAIMS, 
  INITIAL_EXCHANGES 
} from '../data/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const KEYS = {
  USERS: 'spare_users_v2',
  LISTINGS: 'spare_listings_v2',
  REQUESTS: 'spare_requests_v2',
  CLAIMS: 'spare_claims_v2',
  EXCHANGES: 'spare_exchanges_v2',
  RATINGS: 'spare_ratings_v2',
  REPORTS: 'spare_reports_v2',
  NOTIFICATIONS: 'spare_notifications_v2',
  CURRENT_USER: 'spare_current_user_v2',
};

// In-Memory Static Cache to avoid redundant local or network parses
interface CacheStore {
  listings: Listing[] | null;
  requests: RequestItem[] | null;
  lastFetch: number;
}

const CACHE_TTL_MS = 60000; // 1 minute TTL cache

class DBService {
  private cache: CacheStore = { listings: null, requests: null, lastFetch: 0 };

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(KEYS.LISTINGS)) {
      localStorage.setItem(KEYS.LISTINGS, JSON.stringify(INITIAL_LISTINGS));
    }
    if (!localStorage.getItem(KEYS.REQUESTS)) {
      localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    }
    if (!localStorage.getItem(KEYS.CLAIMS)) {
      localStorage.setItem(KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
    }
    if (!localStorage.getItem(KEYS.EXCHANGES)) {
      localStorage.setItem(KEYS.EXCHANGES, JSON.stringify(INITIAL_EXCHANGES));
    }
    if (!localStorage.getItem(KEYS.RATINGS)) {
      localStorage.setItem(KEYS.RATINGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.REPORTS)) {
      localStorage.setItem(KEYS.REPORTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.CURRENT_USER)) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    }
  }

  private invalidateCache() {
    this.cache.listings = null;
    this.cache.requests = null;
    this.cache.lastFetch = 0;
  }

  // --- USERS & AUTH ---
  getUsers(): User[] {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  }

  getCurrentUser(): User {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : INITIAL_USERS[0];
  }

  setCurrentUser(user: User) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  }

  updateUserProfile(updated: Partial<User>): User {
    const current = this.getCurrentUser();
    const newUser = { ...current, ...updated };
    this.setCurrentUser(newUser);

    const users = this.getUsers().map(u => u.id === current.id ? newUser : u);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    if (isSupabaseConfigured) {
      supabase.from('users').upsert([
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          approximate_location: newUser.approximateLocation,
        }
      ]).then(() => {});
    }

    return newUser;
  }

  // --- LISTINGS (With Selective Field Fetching & Auto-Expiry) ---
  getListings(): Listing[] {
    const nowMs = Date.now();
    if (this.cache.listings && nowMs - this.cache.lastFetch < CACHE_TTL_MS) {
      return this.cache.listings;
    }

    const raw = localStorage.getItem(KEYS.LISTINGS);
    let listings: Listing[] = raw ? JSON.parse(raw) : INITIAL_LISTINGS;
    
    let updated = false;

    listings = listings.map(l => {
      if (l.status === 'ACTIVE' && l.category === 'Food' && l.pickupDeadline) {
        const deadlineTime = new Date(l.pickupDeadline).getTime();
        if (nowMs > deadlineTime) {
          updated = true;
          return { ...l, status: 'EXPIRED' as const };
        }
      }
      return l;
    });

    if (updated) {
      localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings));
    }

    this.cache.listings = listings;
    this.cache.lastFetch = nowMs;
    return listings;
  }

  /**
   * Paginated Listings query to avoid over-fetching
   */
  getPaginatedListings(page: number = 1, pageSize: number = 20): { listings: Listing[]; hasMore: boolean; total: number } {
    const all = this.getListings().filter(l => l.status === 'ACTIVE');
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const sliced = all.slice(start, end);

    return {
      listings: sliced,
      hasMore: end < all.length,
      total: all.length,
    };
  }

  getListingById(id: string): Listing | undefined {
    return this.getListings().find(l => l.id === id);
  }

  createListing(listingData: Omit<Listing, 'id' | 'createdAt' | 'status' | 'remainingQuantity'>): Listing {
    this.invalidateCache();
    const listings = this.getListings();
    const newListing: Listing = {
      ...listingData,
      id: `list_${Date.now()}`,
      status: 'ACTIVE',
      remainingQuantity: listingData.quantity,
      createdAt: new Date().toISOString(),
    };

    const updated = [newListing, ...listings];
    localStorage.setItem(KEYS.LISTINGS, JSON.stringify(updated));

    const users = this.getUsers().map(u => {
      if (u.id === listingData.ownerId) {
        return { ...u, itemsGiven: (u.itemsGiven || 0) + listingData.quantity };
      }
      return u;
    });
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    if (isSupabaseConfigured) {
      supabase.from('listings').insert([
        {
          title: newListing.title,
          description: newListing.description,
          category_id: newListing.category.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          condition: newListing.condition,
          status: newListing.status,
          quantity: newListing.quantity,
          approximate_location: newListing.approximateLocation,
          pickup_area: newListing.pickupArea,
        }
      ]).then(({ error }) => {
        if (error) console.warn('Supabase listing insert notice:', error.message);
      });
    }

    return newListing;
  }

  updateListingStatus(listingId: string, status: Listing['status']) {
    this.invalidateCache();
    const listings = this.getListings().map(l => l.id === listingId ? { ...l, status } : l);
    localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings));

    if (isSupabaseConfigured) {
      supabase.from('listings').update({ status }).eq('id', listingId).then(() => {});
    }
  }

  deleteListing(listingId: string) {
    this.invalidateCache();
    const listings = this.getListings().filter(l => l.id !== listingId);
    localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings));
  }

  // --- REQUESTS ---
  getRequests(): RequestItem[] {
    const raw = localStorage.getItem(KEYS.REQUESTS);
    return raw ? JSON.parse(raw) : INITIAL_REQUESTS;
  }

  createRequest(requestData: Omit<RequestItem, 'id' | 'createdAt' | 'status'>): RequestItem {
    this.invalidateCache();
    const requests = this.getRequests();
    const newRequest: RequestItem = {
      ...requestData,
      id: `req_${Date.now()}`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...requests];
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(updated));

    if (isSupabaseConfigured) {
      supabase.from('requests').insert([
        {
          title: newRequest.title,
          description: newRequest.description,
          category_id: newRequest.category.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          status: newRequest.status,
          location: newRequest.location,
          urgency: newRequest.urgency,
        }
      ]).then(() => {});
    }

    return newRequest;
  }

  // --- CLAIMS ---
  getClaims(): Claim[] {
    const raw = localStorage.getItem(KEYS.CLAIMS);
    return raw ? JSON.parse(raw) : INITIAL_CLAIMS;
  }

  createClaim(listingId: string, claimant: User, message?: string): { claim: Claim; exchange?: Exchange } | null {
    const listing = this.getListingById(listingId);
    if (!listing || listing.status !== 'ACTIVE') return null;

    const claims = this.getClaims();
    const newClaim: Claim = {
      id: `claim_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingCategory: listing.category,
      listingImage: listing.images[0] || '',
      ownerId: listing.ownerId,
      ownerName: listing.ownerName,
      claimantId: claimant.id,
      claimantName: claimant.name,
      claimantAvatar: claimant.avatar,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.updateListingStatus(listingId, 'CLAIMED');

    const updatedClaims = [newClaim, ...claims];
    localStorage.setItem(KEYS.CLAIMS, JSON.stringify(updatedClaims));

    this.createNotification({
      userId: listing.ownerId,
      type: 'CLAIM_RECEIVED',
      title: 'New Claim Request',
      body: `${claimant.name} claimed your item: "${listing.title}"`,
      linkId: listing.id,
    });

    return { claim: newClaim };
  }

  acceptClaim(claimId: string): Exchange | null {
    const claims = this.getClaims();
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return null;

    const listing = this.getListingById(claim.listingId);
    if (!listing) return null;

    const updatedClaims = claims.map(c => c.id === claimId ? { ...c, status: 'accepted' as const, updatedAt: new Date().toISOString() } : c);
    localStorage.setItem(KEYS.CLAIMS, JSON.stringify(updatedClaims));

    this.updateListingStatus(claim.listingId, 'ACCEPTED');

    const exchanges = this.getExchanges();
    const newExchange: Exchange = {
      id: `exch_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingCategory: listing.category,
      listingImage: listing.images[0] || '',
      claimId: claim.id,
      giverId: listing.ownerId,
      giverName: listing.ownerName,
      giverAvatar: listing.ownerAvatar,
      receiverId: claim.claimantId,
      receiverName: claim.claimantName,
      receiverAvatar: claim.claimantAvatar,
      status: 'accepted',
      pickupArea: listing.pickupArea,
      giverConfirmed: false,
      receiverConfirmed: false,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(KEYS.EXCHANGES, JSON.stringify([newExchange, ...exchanges]));

    this.createNotification({
      userId: claim.claimantId,
      type: 'CLAIM_ACCEPTED',
      title: 'Claim Accepted!',
      body: `${listing.ownerName} accepted your claim for "${listing.title}". You can now complete pickup!`,
      linkId: newExchange.id,
    });

    return newExchange;
  }

  declineClaim(claimId: string) {
    const claims = this.getClaims();
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    const updatedClaims = claims.map(c => c.id === claimId ? { ...c, status: 'declined' as const, updatedAt: new Date().toISOString() } : c);
    localStorage.setItem(KEYS.CLAIMS, JSON.stringify(updatedClaims));

    this.updateListingStatus(claim.listingId, 'ACTIVE');

    this.createNotification({
      userId: claim.claimantId,
      type: 'CLAIM_DECLINED',
      title: 'Claim Declined',
      body: `Your claim for "${claim.listingTitle}" was declined by owner.`,
    });
  }

  // --- EXCHANGES ---
  getExchanges(): Exchange[] {
    const raw = localStorage.getItem(KEYS.EXCHANGES);
    return raw ? JSON.parse(raw) : INITIAL_EXCHANGES;
  }

  confirmExchangeHandover(exchangeId: string, userId: string): Exchange | null {
    const exchanges = this.getExchanges();
    const exch = exchanges.find(e => e.id === exchangeId);
    if (!exch) return null;

    let giverConfirmed = exch.giverConfirmed;
    let receiverConfirmed = exch.receiverConfirmed;

    if (userId === exch.giverId) giverConfirmed = true;
    if (userId === exch.receiverId) receiverConfirmed = true;

    const bothConfirmed = giverConfirmed && receiverConfirmed;
    const newStatus = bothConfirmed ? ('completed' as const) : ('pickup_pending' as const);

    const updatedExchanges = exchanges.map(e => {
      if (e.id === exchangeId) {
        return {
          ...e,
          giverConfirmed,
          receiverConfirmed,
          status: newStatus,
          completedAt: bothConfirmed ? new Date().toISOString() : e.completedAt,
        };
      }
      return e;
    });

    localStorage.setItem(KEYS.EXCHANGES, JSON.stringify(updatedExchanges));

    if (bothConfirmed) {
      this.updateListingStatus(exch.listingId, 'COMPLETED');

      const users = this.getUsers().map(u => {
        if (u.id === exch.giverId) {
          return { ...u, completedExchanges: (u.completedExchanges || 0) + 1 };
        }
        if (u.id === exch.receiverId) {
          return { ...u, completedExchanges: (u.completedExchanges || 0) + 1, itemsClaimed: (u.itemsClaimed || 0) + 1 };
        }
        return u;
      });
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));

      this.createNotification({
        userId: exch.giverId,
        type: 'EXCHANGE_COMPLETED',
        title: 'Exchange Completed! 🎉',
        body: `Exchange for "${exch.listingTitle}" is complete! Rate your interaction.`,
      });
      this.createNotification({
        userId: exch.receiverId,
        type: 'EXCHANGE_COMPLETED',
        title: 'Exchange Completed! 🎉',
        body: `You received "${exch.listingTitle}"! Rate your interaction.`,
      });
    }

    return updatedExchanges.find(e => e.id === exchangeId) || null;
  }

  cancelExchange(exchangeId: string, reason?: string) {
    const exchanges = this.getExchanges();
    const exch = exchanges.find(e => e.id === exchangeId);
    if (!exch) return;

    const updatedExchanges = exchanges.map(e => e.id === exchangeId ? { ...e, status: 'cancelled' as const, cancelledAt: new Date().toISOString() } : e);
    localStorage.setItem(KEYS.EXCHANGES, JSON.stringify(updatedExchanges));

    this.updateListingStatus(exch.listingId, 'ACTIVE');
  }

  // --- RATINGS ---
  getRatings(): Rating[] {
    const raw = localStorage.getItem(KEYS.RATINGS);
    return raw ? JSON.parse(raw) : [];
  }

  submitRating(ratingData: Omit<Rating, 'id' | 'createdAt'>): Rating {
    const ratings = this.getRatings();
    const newRating: Rating = {
      ...ratingData,
      id: `rate_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRating, ...ratings];
    localStorage.setItem(KEYS.RATINGS, JSON.stringify(updated));

    const targetUserId = ratingData.reviewedUserId;
    const userRatings = updated.filter(r => r.reviewedUserId === targetUserId);
    const avg = Number((userRatings.reduce((acc, curr) => acc + curr.rating, 0) / userRatings.length).toFixed(2));

    const users = this.getUsers().map(u => u.id === targetUserId ? { ...u, reliabilityRating: avg } : u);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    return newRating;
  }

  // --- REPORTS ---
  getReports(): Report[] {
    const raw = localStorage.getItem(KEYS.REPORTS);
    return raw ? JSON.parse(raw) : [];
  }

  submitReport(reportData: Omit<Report, 'id' | 'createdAt' | 'status'>): Report {
    const reports = this.getReports();
    const newReport: Report = {
      ...reportData,
      id: `rep_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updated = [newReport, ...reports];
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(updated));
    return newReport;
  }

  // --- NOTIFICATIONS ---
  getNotifications(userId: string): AppNotification[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    const all: AppNotification[] = raw ? JSON.parse(raw) : [];
    return all.filter(n => n.userId === userId);
  }

  createNotification(notifData: Omit<AppNotification, 'id' | 'time' | 'read'>) {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    const all: AppNotification[] = raw ? JSON.parse(raw) : [];

    const newNotif: AppNotification = {
      ...notifData,
      id: `notif_${Date.now()}`,
      time: 'Just now',
      read: false,
    };

    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([newNotif, ...all]));
  }

  markNotificationRead(notifId: string) {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    const all: AppNotification[] = raw ? JSON.parse(raw) : [];
    const updated = all.map(n => n.id === notifId ? { ...n, read: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }

  // --- ADMIN METRICS & INFRASTRUCTURE MONITORING ---
  getAdminMetrics(): AdminMetrics {
    const users = this.getUsers();
    const listings = this.getListings();
    const requests = this.getRequests();
    const claims = this.getClaims();
    const exchanges = this.getExchanges();
    const reports = this.getReports();

    const categoryDistribution: Record<string, number> = {};
    listings.forEach(l => {
      categoryDistribution[l.category] = (categoryDistribution[l.category] || 0) + 1;
    });

    return {
      totalUsers: users.length,
      activeUsers: users.length,
      totalListings: listings.length,
      activeListings: listings.filter(l => l.status === 'ACTIVE').length,
      totalRequests: requests.length,
      openRequests: requests.filter(r => r.status === 'OPEN').length,
      totalClaims: claims.length,
      completedExchanges: exchanges.filter(e => e.status === 'completed').length,
      cancelledExchanges: exchanges.filter(e => e.status === 'cancelled').length,
      reportsCount: reports.filter(r => r.status === 'pending').length,
      categoryDistribution,
    };
  }
}

export const dbService = new DBService();

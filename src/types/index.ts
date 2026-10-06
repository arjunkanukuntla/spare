export type UserRole = 'INDIVIDUAL' | 'BUSINESS' | 'ORGANIZATION' | 'ADMIN';

export type ListingCategory = 
  | 'Electronics' 
  | 'Books' 
  | 'College' 
  | 'DIY & Tools' 
  | 'Clothing' 
  | 'Household' 
  | 'Food' 
  | 'Accessories' 
  | 'Other';

export type ListingCondition = 'New' | 'Like new' | 'Good' | 'Used' | 'Needs repair';

export type ListingStatus = 
  | 'DRAFT' 
  | 'ACTIVE' 
  | 'CLAIMED' 
  | 'ACCEPTED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'EXPIRED';

export type UrgencyLevel = 'Whenever' | 'Soon' | 'Today';

export type ClaimStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export type ExchangeStatus = 'accepted' | 'pickup_pending' | 'completed' | 'cancelled';

export type OrganizationType = 'university' | 'college' | 'office' | 'community' | 'apartment' | 'other';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  location: string;
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: UserRole;
  organizationId?: string;
  orgName?: string;
  campusName?: string;
  department?: string;
  year?: string;
  section?: string;
  approximateLocation: string;
  reliabilityRating: number; // e.g. 4.95
  completedExchanges: number;
  itemsGiven: number;
  itemsClaimed: number;
  isVerified: boolean;
  createdAt: string;
  bio?: string;
}

export interface FoodDetails {
  vegetarian: boolean;
  preparationTime: string;
  storageCondition: 'Ambient / Room Temp' | 'Refrigerated' | 'Hot Held (>60°C)' | 'Packaged Sealed' | 'Individually Packed';
  packagingStatus: 'Individually Packed' | 'Bulk Containers' | 'Sealed Boxes';
  ingredients?: string;
  allergens?: string;
  safetyConfirmed: boolean;
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRole?: UserRole;
  ownerReliability?: number;
  isVerifiedOwner?: boolean;
  category: ListingCategory;
  title: string;
  description: string;
  quantity: number;
  remainingQuantity: number;
  unit: string; // e.g. "items", "books", "meals", "chargers"
  condition: ListingCondition;
  approximateLocation: string;
  pickupArea: string; // e.g. "Near CSE Block Lobby"
  distanceKm: number;
  status: ListingStatus;
  images: string[];
  foodDetails?: FoodDetails;
  pickupDeadline?: string; // ISO string or human formatted
  createdAt: string;
  expiresAt?: string;
}

export interface RequestItem {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  category: ListingCategory;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  location: string;
  distanceKm: number;
  urgency: UrgencyLevel;
  status: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'EXPIRED';
  createdAt: string;
  expiresAt?: string;
}

export interface Claim {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  listingImage: string;
  ownerId: string;
  ownerName: string;
  claimantId: string;
  claimantName: string;
  claimantAvatar: string;
  message?: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Exchange {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  listingImage: string;
  claimId: string;
  giverId: string;
  giverName: string;
  giverAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  status: ExchangeStatus;
  pickupArea: string;
  scheduledAt?: string;
  giverConfirmed: boolean;
  receiverConfirmed: boolean;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  exchangeId: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number; // 1-5
  tags: string[]; // ['reliable', 'communicated_well', 'showed_up', 'item_matched']
  comment?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'CLAIM_RECEIVED' | 'CLAIM_ACCEPTED' | 'CLAIM_DECLINED' | 'EXCHANGE_COMPLETED' | 'REQUEST_MATCH' | 'EXPIRING_SOON' | 'SYSTEM';
  title: string;
  body: string;
  time: string;
  read: boolean;
  linkId?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'listing' | 'user' | 'claim';
  targetId: string;
  targetTitle?: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  createdAt: string;
}

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalListings: number;
  activeListings: number;
  totalRequests: number;
  openRequests: number;
  totalClaims: number;
  completedExchanges: number;
  cancelledExchanges: number;
  reportsCount: number;
  categoryDistribution: Record<string, number>;
}

export type UserRole = 'INDIVIDUAL' | 'BUSINESS' | 'ORGANIZATION' | 'ADMIN';

export type ListingCategory = 
  | 'Food' 
  | 'Books' 
  | 'College' 
  | 'Electronics' 
  | 'Clothes' 
  | 'Furniture' 
  | 'Household' 
  | 'Other';

export type DistributionType = 'FREE' | 'SURPLUS_SALE';

export type ListingStatus = 
  | 'DRAFT' 
  | 'ACTIVE' 
  | 'PARTIALLY_CLAIMED' 
  | 'FULLY_CLAIMED' 
  | 'RESERVED' 
  | 'PICKED_UP' 
  | 'COMPLETED' 
  | 'EXPIRED' 
  | 'CANCELLED';

export type UrgencyLevel = 'LOW' | 'NORMAL' | 'URGENT' | 'EMERGENCY';

export type ClaimStatus = 'CLAIMED' | 'PICKUP_PENDING' | 'PICKED_UP' | 'COMPLETED' | 'EXPIRED';

export type DeliveryStatus = 'REQUESTED' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED';

export interface User {
  id: string;
  name: string;
  emailPhone: string;
  avatar: string;
  role: UserRole;
  location: string;
  reputation: number; // e.g. 4.9
  isVerified: boolean;
  verificationBadgeText?: string;
  itemsGiven: number;
  itemsClaimed: number;
  successRate: number; // e.g. 96
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
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRole: UserRole;
  isVerifiedProvider: boolean;
  category: ListingCategory;
  title: string;
  description: string;
  quantity: number;
  remainingQuantity: number;
  unit: string; // e.g. "meals", "items", "books", "chairs"
  condition?: 'New' | 'Like New' | 'Good' | 'Fair';
  price: number; // 0 for FREE
  originalPrice?: number; // For optional surplus sale comparison
  distributionType: DistributionType;
  location: string;
  distanceKm: number;
  coordinates: { lat: number; lng: number };
  availableFrom: string;
  pickupDeadline: string; // ISO String or display time
  pickupDeadlineTime: string; // e.g. "9:30 PM"
  status: ListingStatus;
  images: string[];
  foodDetails?: FoodDetails;
  createdAt: string;
}

export interface RequestItem {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requesterRole: UserRole;
  isVerifiedRequester: boolean;
  category: ListingCategory;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  location: string;
  distanceKm: number;
  coordinates: { lat: number; lng: number };
  radiusKm: number;
  deadline: string;
  urgency: UrgencyLevel;
  status: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'EXPIRED';
  createdAt: string;
}

export interface Claim {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  listingImage: string;
  providerId: string;
  providerName: string;
  claimantId: string;
  claimantName: string;
  quantity: number;
  unit: string;
  pickupMethod: 'SELF_PICKUP' | 'DELIVERY';
  deliveryFee: number;
  deliveryId?: string;
  status: ClaimStatus;
  otpCode: string; // 4-digit code
  createdAt: string;
  pickupLocation: string;
}

export interface Delivery {
  id: string;
  claimId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  fee: number;
  status: DeliveryStatus;
  pickupTime?: string;
  estimatedDeliveryTime?: string;
  liveLat?: number;
  liveLng?: number;
}

export interface ChatMessage {
  id: string;
  claimId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'MATCH' | 'CLAIM' | 'EXPIRING' | 'DELIVERY' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  listingId: string;
  listingTitle: string;
  reason: string;
  details: string;
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'ACTION_TAKEN';
  createdAt: string;
}

export interface DemoPersona {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  bio: string;
  location: string;
  demoBadge: string;
  keyActionDescription: string;
}

export interface ImpactMetrics {
  mealsRedistributed: number;
  itemsReused: number;
  peopleHelped: number;
  valueRescuedInr: number;
  avgTimeToClaimMins: number;
  successRatePercent: number;
}

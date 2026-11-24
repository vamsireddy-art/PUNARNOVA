// ==============================================================================
// PunarNova - Production Type Definitions
// Intelligent, Secure Campus Second-Hand Marketplace & Circular Economy
// ==============================================================================

export type UserRole = 'student' | 'faculty' | 'admin' | 'moderator';

export type VerificationStatus = 'not_verified' | 'pending' | 'verified' | 'rejected';

export type InstitutionType = 'School' | 'College' | 'University';

export type ProductCondition = 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Needs Repair';

export type ProductStatus = 'available' | 'reserved' | 'sold' | 'archived' | 'delisted';

export type OrderStatus = 'created' | 'confirmed' | 'ready_for_handover' | 'ready_for_pickup' | 'completed' | 'cancelled';

export type PaymentMethod = 'razorpay' | 'upi' | 'cash_on_pickup';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type FulfillmentType = 'campus_handover' | 'hostel_delivery' | 'courier';

export interface CampusHandoverSpot {
  id: string;
  name: string;
  landmark: string;
  timing: string;
  isOfficialCampusPoint: boolean;
}

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  code: string;
  emailDomain?: string; // e.g. "aditya.ac.in", "iitb.ac.in"
  city: string;
  state: string;
  country: string;
  distanceKm?: number;
  isVerified: boolean;
  safeHandoverSpots: CampusHandoverSpot[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'emerald';
  unlockedAt?: string;
}

export interface User {
  id: string;
  email: string;
  mobileNumber: string;
  fullName: string;
  avatarUrl?: string;
  institutionId?: string;
  institutionName?: string;
  institutionType?: InstitutionType;
  role: UserRole;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  verificationStatus: VerificationStatus;
  verifiedLegalName?: string;
  studentIdMasked?: string;
  bio?: string;
  salesCount: number;
  purchasesCount: number;
  carbonSavedKg: number;
  moneySavedInr: number;
  waterSavedLiters?: number;
  greenPoints?: number;
  badges?: AchievementBadge[];
  blockedUserIds?: string[];
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  institutionId: string;
  institutionName: string;
  documentType: 'student_id_card' | 'bonafide_certificate' | 'institutional_email';
  documentUrl: string;
  verifiedLegalName: string;
  nameMatchScore: number;
  status: VerificationStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  itemCount?: number;
}

export type DealGrade = 'Steal Deal' | 'Great Value' | 'Fair Price' | 'Above Average';

export interface DealScoreResult {
  grade: DealGrade;
  percentageBelowMedian: number;
  categoryMedianPrice: number;
  scoreOutOf100: number;
  assessmentNote: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerVerificationStatus: VerificationStatus;
  institutionId: string;
  institutionName: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  brand?: string;
  modelNumber?: string;
  edition?: string;
  author?: string;
  isbn?: string;
  subject?: string;
  semester?: string;
  condition: ProductCondition;
  originalPrice: number;
  sellingPrice: number;
  aiEstimatedPrice?: number;
  suggestedMinPrice?: number;
  suggestedMaxPrice?: number;
  aiConfidenceScore?: number;
  dealScore?: DealScoreResult;
  images: string[];
  isNegotiable: boolean;
  isExchangeAvailable: boolean;
  exchangeWantedNotes?: string;
  pickupSpotId?: string;
  pickupLocationNotes?: string;
  deliveryAvailable: boolean;
  status: ProductStatus;
  viewCount: number;
  wishlistCount: number;
  createdAt: string;
  distanceKm?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  hostelOrBuilding: string;
  roomOrFlat: string;
  campusLandmark?: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  sellerId: string;
  sellerName: string;
  sellerEmail?: string;
  items: {
    product: Product;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  platformFee?: number;
  deliveryFee: number;
  studentDiscount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentType: FulfillmentType;
  orderStatus: OrderStatus;
  deliveryAddress: string;
  handoverSpot?: string;
  createdAt: string;
  pickupCode?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageType: 'text' | 'product_card' | 'price_offer' | 'deal_accepted' | 'safe_spot_proposed';
  content: string;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: string;
}

export interface Conversation {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ProductExchange {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterCampus: string;
  offeredProduct: Product;
  targetProduct: Product;
  ownerId: string;
  ownerName: string;
  ownerCampus: string;
  status: 'proposed' | 'accepted' | 'ready_for_swap' | 'completed' | 'declined';
  notes: string;
  handoverSpot?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ProductReport {
  id: string;
  productId: string;
  productTitle: string;
  reporterId: string;
  reporterName: string;
  reason: 'counterfeit' | 'overpriced' | 'inappropriate' | 'misleading_condition' | 'prohibited_item' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface UserReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reason: 'harassment' | 'fraud' | 'no_show' | 'fake_verification' | 'other';
  description: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order_update' | 'verification_status' | 'price_alert' | 'chat_message' | 'exchange_request' | 'reward_unlocked' | 'system';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AIPricePredictionResult {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidencePercentage: number;
  conditionDiagnosed: ProductCondition;
  pricingExplanation: string;
  breakdownFactors: {
    conditionMultiplier: number;
    ageDepreciationFactor: number;
    accessoriesBonus: number;
    demandMultiplier: number;
    damageDeduction: number;
    valueRetentionPercent: number;
  };
  modelName: string;
  metrics: {
    mae: number;
    rmse: number;
    r2: number;
  };
}

export interface AIImageScanResult {
  detectedCategory: string;
  visualCondition: ProductCondition;
  wearPercentage: number;
  edgeDefectsDetected: boolean;
  detectedBrand?: string;
  confidence: number;
  notes: string[];
}

export interface BookScannerResult {
  title?: string;
  author?: string;
  isbn?: string;
  edition?: string;
  publisher?: string;
  publishedYear?: string;
  confidence: number;
  rawText?: string;
  extractedFrom: 'isbn_lookup' | 'ocr_vision' | 'manual';
}

export interface EnvironmentalStats {
  totalItemsReused: number;
  totalMoneySavedInr: number;
  totalCo2AvoidedKg: number;
  totalWaterSavedLiters: number;
  treesEquivalentPreserved: number;
  paperSavedKg: number;
  verifiedTransactionsCount: number;
}

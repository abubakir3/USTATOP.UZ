export type UserRole = 'customer' | 'master' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  profileImage: string;
  createdAt: string;
  isSuspended?: boolean;
}

export interface WorkingHoursDay {
  working: boolean;
  start: string;
  end: string;
}

export type WeekDays = 'Dushanba' | 'Seshanba' | 'Chorshanba' | 'Payshanba' | 'Juma' | 'Shanba' | 'Yakshanba';

export interface ServiceItem {
  id: string;
  masterId: string;
  name: string;
  description: string;
  price: number;
  priceUnit: 'soat' | 'xizmat' | 'm²' | 'nuqta';
  estimatedDuration: string;
  imageUrl?: string;
}

export interface PortfolioItem {
  id: string;
  masterId: string;
  title: string;
  imageUrl: string;
  description?: string;
  completedDate?: string;
}

export interface MasterProfile {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  profession: string;
  category: string;
  additionalServices: string[];
  bio: string;
  experienceYears: number;
  city: string;
  district: string;
  address?: string;
  serviceRadius: number; // km
  startingPrice: number;
  priceType: 'per_hour' | 'per_service' | 'negotiable';
  workingHours: Record<WeekDays, WorkingHoursDay>;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationStatus: 'none' | 'pending' | 'verified' | 'rejected';
  verificationDocuments?: {
    docType: string;
    docNumber: string;
    submittedAt: string;
  };
  isAvailable: boolean;
  completedOrdersCount: number;
}

export interface CustomerProfile {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  city: string;
  district?: string;
  address?: string;
}

export type OrderStatus =
  | 'yangi'
  | 'korib_chiqilmoqda'
  | 'qabul_qilindi'
  | 'kelishilgan'
  | 'jarayonda'
  | 'yakunlandi'
  | 'bekor_qilindi';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  masterId: string;
  masterName: string;
  masterProfession: string;
  masterAvatar: string;
  serviceId?: string;
  serviceTitle: string;
  description: string;
  images: string[];
  city: string;
  district: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  budget?: number;
  proposedPrice?: number;
  finalPrice?: number;
  status: OrderStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  hasReview?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: [string, string];
  customerId: string;
  customerName: string;
  customerAvatar: string;
  masterId: string;
  masterName: string;
  masterAvatar: string;
  masterProfession: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountForCustomer: number;
  unreadCountForMaster: number;
  updatedAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  masterId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  masterReply?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'message' | 'review' | 'verification' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: string;
  targetType: 'master' | 'customer' | 'review';
  targetId: string;
  targetName: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface AIDiagnosisResult {
  category: string;
  explanation: string;
  urgency: 'Yuqori' | "O'rtacha" | 'Past';
  suggestedQuestions: string[];
  disclaimer: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  isVerified: boolean;
  avatar?: string;
  reportsCount: number;
  reputation: number;
  createdAt: string;
}

export interface ScammerInfo {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  socialMedia?: SocialMediaAccount[];
  businessName?: string;
  address?: string;
}

export interface SocialMediaAccount {
  platform: string;
  username: string;
  url: string;
}

export interface FinancialLoss {
  amount?: number;
  currency: string;
  paymentMethod?: 'bank_transfer' | 'credit_card' | 'paypal' | 'crypto' | 'cash' | 'check' | 'other';
}

export interface Location {
  country?: string;
  state?: string;
  city?: string;
}

export interface Evidence {
  type: 'screenshot' | 'document' | 'email' | 'text_message' | 'other';
  filename?: string;
  url?: string;
  description?: string;
}

export interface Vote {
  user: string;
  createdAt: string;
}

export interface Flag {
  user: string;
  reason: 'spam' | 'inappropriate' | 'false_info' | 'duplicate' | 'other';
  details?: string;
  createdAt: string;
}

export interface ScamReport {
  _id: string;
  title: string;
  description: string;
  scamType: ScamType;
  scammerInfo: ScammerInfo;
  financialLoss: FinancialLoss;
  location: Location;
  dateOccurred: string;
  evidence: Evidence[];
  reportedBy: User;
  reporterContact: {
    allowContact: boolean;
    contactMethod: 'email' | 'phone' | 'none';
  };
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  moderatedBy?: string;
  moderationNotes?: string;
  upvotes: Vote[];
  downvotes: Vote[];
  views: number;
  flags: Flag[];
  tags: string[];
  severity: number;
  isVerified: boolean;
  voteScore: number;
  createdAt: string;
  updatedAt: string;
}

export type ScamType = 
  | 'online_shopping'
  | 'investment'
  | 'romance'
  | 'phishing'
  | 'fake_job'
  | 'crypto'
  | 'tech_support'
  | 'charity'
  | 'lottery'
  | 'rental'
  | 'identity_theft'
  | 'other';

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalReports?: number;
  totalResults?: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchCriteria {
  query?: string;
  email?: string;
  phone?: string;
  website?: string;
  businessName?: string;
  scamType?: ScamType;
}

export interface SearchResponse {
  results: ScamReport[];
  searchCriteria: SearchCriteria;
  pagination: PaginationInfo;
}

export interface ScamReportsResponse {
  reports: ScamReport[];
  pagination: PaginationInfo;
}

export interface SearchSuggestion {
  value: string;
  type: 'email' | 'phone' | 'website' | 'business' | 'title';
  count: number;
}

export interface SearchStats {
  reportsByStatus: { _id: string; count: number }[];
  reportsByType: { _id: string; count: number }[];
  topReportedWebsites: { _id: string; count: number }[];
  recentTrends: { _id: string; count: number }[];
  financialImpact: {
    totalLoss: number;
    averageLoss: number;
    count: number;
  };
}

export interface CreateScamReportData {
  title: string;
  description: string;
  scamType: ScamType;
  scammerInfo: ScammerInfo;
  financialLoss: FinancialLoss;
  location: Location;
  dateOccurred: string;
  evidence?: Evidence[];
  reporterContact: {
    allowContact: boolean;
    contactMethod: 'email' | 'phone' | 'none';
  };
  tags?: string[];
  severity?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface VoteData {
  type: 'upvote' | 'downvote';
}

export interface FlagData {
  reason: 'spam' | 'inappropriate' | 'false_info' | 'duplicate' | 'other';
  details?: string;
}

export interface ModerateReportData {
  status: 'approved' | 'rejected' | 'under_review';
  moderationNotes?: string;
}

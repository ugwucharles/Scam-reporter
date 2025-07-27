import axios from 'axios';

// API Base URL - automatically detects environment
const getApiBaseUrl = () => {
  // Check if we're in development or production
  if (process.env.NODE_ENV === 'production') {
    // Production: Use environment variable or default to your deployed backend
    return process.env.REACT_APP_API_URL || 'https://scam-reporter.onrender.com/api';
  } else {
    // Development: Use localhost
    return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging to see which URL is being used
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔧 Environment:', process.env.NODE_ENV);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (only for authenticated endpoints)
api.interceptors.request.use(
  (config) => {
    // Only add auth token for endpoints that need it
    // Exclude GET /scams, /search, /website-checker, and /health from auth requirement
    const needsAuth = !(
      config.url?.includes('/health') ||
      config.url?.includes('/search') ||
      config.url?.includes('/website-checker') ||
      (config.url?.includes('/scams') && config.method === 'get')
    );
    
    if (needsAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData: any) => api.put('/auth/profile', userData),
};

// Scam Reports API
export const scamReportsAPI = {
  // Get all reports with pagination and filtering
  getReports: (params?: {
    page?: number;
    limit?: number;
    scamType?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get('/scams', { params }),

  // Get single report by ID
  getReport: (id: string) => api.get(`/scams/${id}`),

  // Create new report with file uploads (NO AUTH REQUIRED)
  createReport: (formData: FormData) => {
    return api.post('/scams', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update report
  updateReport: (id: string, reportData: any) => api.put(`/scams/${id}`, reportData),

  // Delete report
  deleteReport: (id: string) => api.delete(`/scams/${id}`),

  // Upload additional evidence
  uploadEvidence: (id: string, formData: FormData) => {
    return api.post(`/scams/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Vote on report
  voteReport: (id: string, voteType: 'upvote' | 'downvote') =>
    api.post(`/scams/${id}/vote`, { type: voteType }),

  // Flag report
  flagReport: (id: string, reason: string, details?: string) =>
    api.post(`/scams/${id}/flag`, { reason, details }),

  // Get reports by user
  getUserReports: (userId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/scams/user/${userId}`, { params }),

  // Admin: Moderate report
  moderateReport: (id: string, status: string, notes?: string) =>
    api.put(`/scams/${id}/moderate`, { status, moderationNotes: notes }),

  // Search reports
  searchReports: (query: string, params?: {
    page?: number;
    limit?: number;
    scamType?: string;
    email?: string;
    phone?: string;
    website?: string;
    businessName?: string;
    q?: string;
  }) => {
    const searchParams: any = { ...params };
    if (query) {
      searchParams.q = query;
    }
    return api.get('/search', { params: searchParams });
  },
};

// Search API
export const searchAPI = {
  searchReports: (query: string, params?: {
    page?: number;
    limit?: number;
    scamType?: string;
  }) => api.get('/search', { params: { q: query, ...params } }),

  searchScammers: (query: string) => api.get('/search/scammers', { params: { q: query } }),
  
  // Get statistics
  getStatistics: () => api.get('/search/stats'),
};

// Website Checker API
export const websiteCheckerAPI = {
  checkWebsite: (url: string) => api.post('/website-checker/check-website', { url }),
};

// Admin API
export const adminAPI = {
  // Get all reports including pending ones
  getAllReports: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => api.get('/admin/reports', { params }),
  
  // Get dashboard statistics
  getDashboardStats: () => api.get('/admin/stats'),
  
  // Get all users
  getAllUsers: (params?: {
    page?: number;
    limit?: number;
  }) => api.get('/admin/users', { params }),
  
  // Update user role
  updateUserRole: (userId: string, role: string) => 
    api.put(`/admin/users/${userId}/role`, { role }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;

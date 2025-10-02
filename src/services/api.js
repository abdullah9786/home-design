import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'https://home-decor-backend-5mat.onrender.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your internet connection and ensure the backend server is running.',
        type: 'NETWORK_ERROR'
      });
    }

    // Handle HTTP errors
    const { status, data } = error.response;
    
    // Token expired or invalid
    if (status === 401 && data?.message?.includes('token')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject({
        success: false,
        message: 'Session expired. Please login again.',
        type: 'AUTH_ERROR'
      });
    }

    // Return structured error
    return Promise.reject({
      success: false,
      message: data?.message || 'An unexpected error occurred',
      type: 'API_ERROR',
      status
    });
  }
);

// API Service Class
class APIService {
  // Health check
  async healthCheck() {
    try {
      const response = await apiClient.get('/api/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // User registration
  async signup(email, password) {
    try {
      const response = await apiClient.post('/api/signup', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Email verification
  async verifyEmail(email, code) {
    try {
      const response = await apiClient.post('/api/verify', {
        email,
        code
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // User login
  async login(email, password) {
    try {
      const response = await apiClient.post('/api/login', {
        email,
        password
      });
      
      // Store token and user data on successful login
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Resend verification code
  async resendVerification(email) {
    try {
      const response = await apiClient.post('/api/resend-verification', {
        email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Logout (clear local storage)
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }
}

// Create and export singleton instance
const apiService = new APIService();
export default apiService;

// Export utilities
export { API_BASE_URL, apiClient };

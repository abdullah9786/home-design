import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      const token = apiService.getToken();
      const user = apiService.getCurrentUser();
      
      if (token && user) {
        setAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: 'Failed to initialize authentication'
      });
    }
  };

  // Set loading state
  const setLoading = (loading) => {
    setAuthState(prev => ({
      ...prev,
      loading
    }));
  };

  // Set error state
  const setError = (error) => {
    setAuthState(prev => ({
      ...prev,
      error: error?.message || error || null
    }));
  };

  // Clear error
  const clearError = () => {
    setAuthState(prev => ({
      ...prev,
      error: null
    }));
  };

  // Sign up function
  const signup = async (email, password) => {
    try {
      setLoading(true);
      clearError();
      
      const result = await apiService.signup(email, password);
      
      if (result.success) {
        // Don't set as authenticated until email is verified
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: null
        }));
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  // Verify email function
  const verifyEmail = async (email, code) => {
    try {
      setLoading(true);
      clearError();
      
      const result = await apiService.verifyEmail(email, code);
      
      if (result.success) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: null
        }));
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      clearError();
      
      const result = await apiService.login(email, password);
      
      if (result.success && result.data) {
        const { token, user } = result.data;
        
        setAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null
        });
        
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  // Resend verification function
  const resendVerification = async (email) => {
    try {
      setLoading(true);
      clearError();
      
      const result = await apiService.resendVerification(email);
      
      setLoading(false);
      return result;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    try {
      apiService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if there's an error
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
      });
    }
  };

  // Health check function
  const checkHealth = async () => {
    try {
      const result = await apiService.healthCheck();
      return result;
    } catch (error) {
      console.error('Backend health check failed:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    // State
    ...authState,
    
    // Actions
    signup,
    verifyEmail,
    login,
    logout,
    resendVerification,
    checkHealth,
    setError,
    clearError,
    setLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './LoginPage.css';

// Simple icons using Unicode and CSS
const HomeIcon = () => <span style={{ fontSize: '28px' }}>🏠</span>;
const MailIcon = () => <span style={{ fontSize: '20px' }}>✉️</span>;
const LockIcon = () => <span style={{ fontSize: '20px' }}>🔒</span>;
const EyeIcon = () => <span style={{ fontSize: '16px' }}>👁️</span>;
const EyeOffIcon = () => <span style={{ fontSize: '16px' }}>🙈</span>;
const AlertIcon = () => <span style={{ fontSize: '14px', color: '#ef4444' }}>⚠️</span>;
const LoginIcon = () => <span style={{ fontSize: '20px' }}>🚀</span>;
const CheckIcon = () => <span style={{ fontSize: '18px' }}>✅</span>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verified = searchParams.get('verified') === 'true';
  
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (verified) {
      setShowVerifiedMessage(true);
      setTimeout(() => setShowVerifiedMessage(false), 5000);
    }
  }, [verified]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const intendedPath = location.state?.from?.pathname || '/';
      navigate(intendedPath);
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    clearError();
    
    // Validation
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setSuccessMessage('Login successful! Redirecting...');
        
        // Navigate to intended page or home after a short delay
        setTimeout(() => {
          const intendedPath = location.state?.from?.pathname || '/';
          navigate(intendedPath);
        }, 1000);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific error cases
      if (err.message && err.message.includes('Email is not registered')) {
        setErrors({ 
          email: 'This email is not registered. Would you like to sign up instead?',
          showSignupLink: true 
        });
      } else if (err.message && err.message.includes('Email is not verified')) {
        setErrors({ 
          general: 'Please verify your email address first. Check your inbox for the verification code.',
          showResendLink: true,
          email: formData.email
        });
      } else if (err.message && err.message.includes('Invalid credentials')) {
        setErrors({ 
          password: 'Incorrect password. Please try again or reset your password.',
          showForgotLink: true 
        });
      } else if (err.type === 'NETWORK_ERROR') {
        setErrors({ general: 'Unable to connect to server. Please check your internet connection and try again.' });
      } else {
        setErrors({ general: err.message || 'Login failed. Please check your credentials and try again.' });
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="login-page">
      {/* Success Message */}
      {showVerifiedMessage && (
        <div className="success-message">
          <CheckIcon />
          Account verified successfully!
        </div>
      )}

      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon">
            <HomeIcon />
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue your design journey</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message-inline">
            <CheckIcon />
            {successMessage}
          </div>
        )}

        {/* General Error Message */}
        {(errors.general || error) && (
          <div className="error-message general-error">
            <AlertIcon />
            {errors.general || error}
            {errors.showResendLink && (
              <div style={{ marginTop: '10px' }}>
                <Link 
                  to={`/verify-otp?email=${encodeURIComponent(errors.email || formData.email)}`}
                  style={{ color: 'white', textDecoration: 'underline' }}
                >
                  Go to verification page
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <MailIcon />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <div className="error-message">
                <AlertIcon />
                {errors.email}
                {errors.showSignupLink && (
                  <div style={{ marginTop: '8px' }}>
                    <Link 
                      to="/signup"
                      style={{ color: '#ef4444', textDecoration: 'underline', fontSize: '14px' }}
                    >
                      Create an account instead
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <LockIcon />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <div className="error-message">
                <AlertIcon />
                {errors.password}
                {errors.showForgotLink && (
                  <div style={{ marginTop: '8px' }}>
                    <Link 
                      to="/forgot-password"
                      style={{ color: '#ef4444', textDecoration: 'underline', fontSize: '14px' }}
                    >
                      Reset your password
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || loading}
            className="submit-button"
          >
            {(isLoading || loading) ? (
              <>
                <div className="loading-spinner"></div>
                Signing in...
              </>
            ) : (
              <>
                <LoginIcon />
                Sign In
                <span style={{ fontSize: '16px' }}>→</span>
              </>
            )}
          </button>
        </form>

        {/* Backend Info */}
        {/* <div className="demo-info">
          <p>
            <strong>Note:</strong> Make sure your backend server is running on localhost:5000
          </p>
        </div> */}

        {/* Signup Link */}
        <div className="signup-link">
          <p>
            Don't have an account?{' '}
            <Link to="/signup">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

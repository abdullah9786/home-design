import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './SignupPage.css';

// Simple icons using Unicode and CSS
const HomeIcon = () => <span style={{ fontSize: '24px' }}>🏠</span>;
const MailIcon = () => <span style={{ fontSize: '20px' }}>✉️</span>;
const LockIcon = () => <span style={{ fontSize: '20px' }}>🔒</span>;
const EyeIcon = () => <span style={{ fontSize: '16px' }}>👁️</span>;
const EyeOffIcon = () => <span style={{ fontSize: '16px' }}>🙈</span>;
const AlertIcon = () => <span style={{ fontSize: '14px', color: '#ff6b6b' }}>⚠️</span>;
const SparklesIcon = () => <span style={{ fontSize: '20px' }}>✨</span>;

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const result = await signup(formData.email, formData.password);
      
      if (result.success) {
        setSuccessMessage(result.message);
        
        // Navigate to OTP verification page after a short delay
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        }, 1500);
      }
      
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle specific error cases
      if (err.message && err.message.includes('Email is already registered')) {
        setErrors({ email: 'This email is already registered. Try logging in instead.' });
      } else if (err.type === 'NETWORK_ERROR') {
        setErrors({ general: 'Unable to connect to server. Please check your internet connection and try again.' });
      } else {
        setErrors({ general: err.message || 'An unexpected error occurred. Please try again.' });
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
    <div className="signup-page">
      <div className="signup-container">
        {/* Header */}
        <div className="signup-header">
          <div className="signup-icon">
            <HomeIcon />
          </div>
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join us to start designing your dream space</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <SparklesIcon />
            {successMessage}
          </div>
        )}

        {/* General Error Message */}
        {(errors.general || error) && (
          <div className="error-message general-error">
            <AlertIcon />
            {errors.general || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="signup-form">
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
                placeholder="Create a password"
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
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <LockIcon />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">
                <AlertIcon />
                {errors.confirmPassword}
              </div>
            )}
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
                Creating Account...
              </>
            ) : (
              <>
                <SparklesIcon />
                Create Account
                <span style={{ fontSize: '16px' }}>→</span>
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="login-link">
          <p>
            Already have an account?{' '}
            <Link to="/login">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

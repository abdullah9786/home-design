import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './VerifyOTPPage.css';

// Simple icons using Unicode and CSS
const ShieldIcon = () => <span style={{ fontSize: '32px' }}>🛡️</span>;
const MailIcon = () => <span style={{ fontSize: '16px' }}>📧</span>;
const AlertIcon = () => <span style={{ fontSize: '14px', color: '#ef4444' }}>⚠️</span>;
const RefreshIcon = () => <span style={{ fontSize: '16px' }}>🔄</span>;
const CheckIcon = () => <span style={{ fontSize: '48px' }}>✅</span>;

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const { verifyEmail, resendVerification, loading, error: authError, clearError } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error when typing
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        digits.split('').forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        // Focus last filled input or next empty
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    clearError();
    
    try {
      const result = await verifyEmail(email, otpString);
      
      if (result.success) {
        setIsSuccess(true);
        setSuccessMessage(result.message || 'Email verified successfully!');
        
        // Navigate to login page after a short delay
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 2000);
      }
      
    } catch (err) {
      console.error('Verification error:', err);
      
      // Handle specific error cases
      if (err.message && err.message.includes('Invalid or expired')) {
        setError('Invalid or expired verification code. Please try again or request a new code.');
      } else if (err.message && err.message.includes('User not found')) {
        setError('Account not found. Please sign up first.');
        setTimeout(() => navigate('/signup'), 2000);
      } else if (err.type === 'NETWORK_ERROR') {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
      
      // Clear OTP and focus first input on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCooldown(30);
    setOtp(['', '', '', '', '', '']);
    setError('');
    clearError();
    inputRefs.current[0]?.focus();
    
    try {
      const result = await resendVerification(email);
      
      if (result.success) {
        // Show success message briefly
        setSuccessMessage('New verification code sent to your email!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
      
    } catch (err) {
      console.error('Resend error:', err);
      
      if (err.type === 'NETWORK_ERROR') {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError(err.message || 'Failed to resend code. Please try again.');
      }
      
      // Reset cooldown on error so user can try again
      setResendCooldown(0);
    }
  };

  if (!email) {
    navigate('/signup');
    return null;
  }

  return (
    <div className="otp-page">
      <div className="otp-container">
        {/* Header */}
        <div className="otp-header">
          <div className={`otp-icon ${isSuccess ? 'success' : ''}`}>
            {isSuccess ? <CheckIcon /> : <ShieldIcon />}
          </div>
          <h1 className={`otp-title ${isSuccess ? 'success' : ''}`}>
            {isSuccess ? 'Verified!' : 'Verify Your Email'}
          </h1>
          <p className="otp-subtitle">
            {isSuccess ? 'Account created successfully' : 'Enter the 6-digit code sent to'}
          </p>
          {!isSuccess && (
            <p className="otp-email">{email}</p>
          )}
        </div>

        {/* Success Message */}
        {successMessage && !isSuccess && (
          <div className="success-message">
            <CheckIcon />
            {successMessage}
          </div>
        )}

        {/* General Error Message */}
        {(error || authError) && (
          <div className="error-message general-error">
            <AlertIcon />
            {error || authError}
          </div>
        )}

        {/* Form */}
        {isSuccess ? (
          <div className="success-screen">
            <div className="success-icon-large">
              <CheckIcon />
            </div>
            <p className="success-message">{successMessage || 'Account verified successfully!'}</p>
            <p className="redirect-message">Redirecting to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="otp-form">
            {/* OTP Input */}
            <div className="otp-inputs-section">
              <label className="otp-inputs-label">
                Enter Verification Code
              </label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`otp-input ${error ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                ))}
              </div>
              {error && (
                <div className="error-message">
                  <AlertIcon />
                  {error}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loading || otp.join('').length !== 6}
              className={`submit-button ${isSuccess ? 'success' : ''}`}
            >
              {(isLoading || loading) ? (
                <>
                  <div className="loading-spinner"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldIcon />
                  Verify Account
                  <span style={{ fontSize: '16px' }}>→</span>
                </>
              )}
            </button>

            {/* Resend */}
            <div className="resend-section">
              <p className="resend-text">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="resend-button"
              >
                <RefreshIcon />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : loading ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            {/* Backend Info */}
            <div className="demo-info">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <MailIcon />
                <p>
                  <strong>Note:</strong> Check your email for the verification code
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyOTPPage;

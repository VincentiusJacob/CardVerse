// components/InternetIdentityLogin.jsx - Improved version
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaFingerprint, FaSpinner } from 'react-icons/fa';
import useInternetIdentity from '../hooks/useInternetIdentity';
import './login.css';

export default function InternetIdentityLogin() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    isAuthenticated,
    principal,
    actor,
    loading,
    error,
    connect,
    disconnect,
    checkUser,
    createUser
  } = useInternetIdentity();

  // Handle user flow after authentication - wrapped with useCallback to prevent infinite loops
  const handleUserFlow = useCallback(async () => {
    if (isProcessing) return; // Prevent multiple simultaneous calls
    
    try {
      setIsProcessing(true);
      
      // Additional validation
      if (!actor) {
        console.error('Actor is not available');
        setMessage('Connection error. Please try reconnecting.');
        return;
      }

      // Debug logging
      console.log('=== DEBUG INFO ===');
      console.log('Actor available:', !!actor);
      console.log('Principal:', principal);
      
      // Check if getUserProfile method exists
      if (typeof actor.getUserProfile !== 'function') {
        console.error('getUserProfile method not found on actor');
        console.log('Available methods:', Object.keys(actor));
        setMessage('Backend method not available. Please check canister deployment.');
        return;
      }

      setMessage('Checking user profile...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 15 seconds')), 15000)
      );
      
      console.log('Calling getUserProfile...');
      const userProfilePromise = actor.getUserProfile();
      
      const userProfile = await Promise.race([userProfilePromise, timeoutPromise]);
      
      console.log('User profile result:', userProfile);
      
      // Handle different response formats from Motoko backend
      let profileData = null;
      
      if (userProfile && typeof userProfile === 'object') {
        // Handle Motoko Option type: ?UserProfile
        if (userProfile.length === 1 && userProfile[0]) {
          // Some(...) variant
          profileData = userProfile[0];
        } else if (userProfile.length === 0) {
          // None variant
          profileData = null;
        } else if ('username' in userProfile) {
          // Direct object
          profileData = userProfile;
        }
      }
      
      if (profileData) {
        // User exists
        console.log('User exists, profile:', profileData);
        const username = profileData.username || profileData.name || 'User';
        setMessage(`Welcome back, ${username}!`);
        setTimeout(() => navigate('/MainMenu'), 1500);
      } else {
        // New user
        console.log('New user detected');
        setMessage('Setting up your profile...');
        setTimeout(() => navigate('/setup-username'), 1000);
      }
    } catch (err: unknown) {
  console.error('=== ERROR DETAILS ===');

    if (err instanceof Error) {
      console.error('Error type:', err.constructor.name);
      console.error('Error message:', err.message);
      console.error('Full error:', err);

    // More specific error handling
      if (err.message.includes('timeout')) {
        setMessage('Request timeout. Please check your connection and try again.');
      } else if (err.message.includes('reject') || err.message.includes('Reject')) {
        setMessage('Service rejected the request. Please try again.');
      } else if (err.message.includes('Call failed') || err.message.includes('IC0503')) {
        setMessage('Canister call failed. Please check if backend is running.');
      } else if (err.message.includes('Agent') || err.message.includes('HttpError')) {
        setMessage('Network error. Please check your connection.');
      } else if (err.message.includes('decode') || err.message.includes('Invalid')) {
        setMessage('Data format error. Please try refreshing.');
      } else {
        setMessage(`Error: ${err.message}`);
      }
    } else {
      // If err is not an Error instance (could be string or something else)
      console.error('Unknown error:', err);
      setMessage('An unknown error occurred.');
    }
  } finally {
    setIsProcessing(false);
  }

  }, [actor, principal, navigate, isProcessing]);

  // Check authentication status on component mount
  useEffect(() => {
    console.log("Auth status:", {isAuthenticated, principal, actor, loading});
    
    if (isAuthenticated && principal && actor && !loading && !isProcessing) {
      // Add small delay to ensure actor is fully ready
      const timer = setTimeout(() => {
        handleUserFlow();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, principal, actor, loading, handleUserFlow, isProcessing]);

  // Connect to Internet Identity
  const handleConnect = async () => {
    if (isConnecting) return; // Prevent multiple clicks
    
    try {
      setIsConnecting(true);
      setMessage('Connecting to Internet Identity...');
      
      await connect();
      // handleUserFlow will be called automatically via useEffect
      
    } catch (err) {
      console.error('Connection failed:', err);
      setMessage('Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      setMessage('Disconnecting...');
      await disconnect();
      setMessage('');
      setIsProcessing(false);
    } catch (err) {
      console.error('Disconnect failed:', err);
      setMessage('Error disconnecting. Please refresh the page.');
    }
  };

  // Retry function for failed profile loading
  const handleRetry = () => {
    setMessage('');
    setIsProcessing(false);
    
    if (isAuthenticated && principal && actor) {
      handleUserFlow();
    } else {
      handleConnect();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <h2>Initializing...</h2>
            <p>Setting up Internet Identity authentication</p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated state
  if (isAuthenticated && principal) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="authenticated-state">
            <FaUserCircle className="user-icon" />
            <h2>Connected</h2>
            <p className="principal-display">
              Principal: {principal.slice(0, 20)}...
            </p>
            {message && (
              <p className={`status-message ${
                message.includes('Welcome') ? 'success-message' : 
                (message.includes('Error') || message.includes('timeout') || 
                 message.includes('unavailable') || message.includes('failed') || 
                 message.includes('rejected')) ? 'error-message' : 
                'info-message'
              }`}>
                {message}
              </p>
            )}
            
            {/* Show retry button if there's an error */}
            {(message.includes('Error') || message.includes('timeout') || 
              message.includes('unavailable') || message.includes('failed') ||
              message.includes('rejected')) && (
              <button 
                className="connect-button" 
                onClick={handleRetry}
                disabled={isProcessing}
                style={{ marginBottom: '10px' }}
              >
                {isProcessing ? <FaSpinner className="button-spinner" /> : <FaSpinner />}
                {isProcessing ? 'Retrying...' : 'Retry'}
              </button>
            )}
            
            <button 
              className="disconnect-button" 
              onClick={handleDisconnect}
              disabled={isProcessing}
            >
              Disconnect
            </button>

            {message.includes('Welcome') && (
              <button
                className="go-menu-button"
                onClick={() => navigate('/MainMenu')}
              >
                Go to Main Menu
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Login/Connect state
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="ic-login-header">
          <FaFingerprint className="ic-icon" />
          <h2 className="login-title">Connect Your Identity</h2>
          <p className="ic-subtitle">
            Use Internet Identity for secure, passwordless authentication
          </p>
        </div>

        <div className="ic-features">
          <div className="feature-item">
            <span className="feature-icon">🔐</span>
            <span>Secure & Private</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚀</span>
            <span>No Passwords</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Instant Setup</span>
          </div>
        </div>

        <button 
          className="connect-button"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <FaSpinner className="button-spinner" />
              Connecting...
            </>
          ) : (
            <>
              <FaFingerprint />
              Connect Identity
            </>
          )}
        </button>

        {message && (
          <p className={`signup-text ${
            message.includes('failed') || message.includes('Error') ? 
            'error-message' : 'info-message'
          }`}>
            {message}
          </p>
        )}

        {error && (
          <p className="signup-text error-message">
            {error}
          </p>
        )}

        <div className="ic-info">
          <h3>New to Internet Identity?</h3>
          <p>
            Internet Identity will guide you through creating a secure identity 
            using your device's authentication (Face ID, Touch ID, or PIN).
            This takes about 30 seconds.
          </p>
        </div>

        <p className="legacy-text">
          Looking for the old login? We've upgraded to Internet Identity for better security.
        </p>
      </div>
    </div>
  );
}
// components/SetupUsername.jsx - Component for username setup
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import useInternetIdentity from '../hooks/useInternetIdentity';
import './login.css'; // Reuse existing styles

export default function SetupUsername() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  const {
    isAuthenticated,
    principal,
    actor,
    loading
  } = useInternetIdentity();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && (!isAuthenticated || !principal)) {
      navigate('/login');
      return;
    }

    // Check if user already has profile
    if (isAuthenticated && actor) {
      checkExistingProfile();
    }
  }, [loading, isAuthenticated, principal, actor, navigate]);

  const checkExistingProfile = async () => {
    try {
      const userProfile = await actor.getUserProfile();
      if (userProfile && userProfile.length > 0) {
        // User already has profile, redirect to game
        navigate('/MainMenu');
      }
    } catch (err) {
      console.error('Error checking existing profile:', err);
    }
  };

  // Validate username as user types
  useEffect(() => {
    const validateUsername = async () => {
      if (!username.trim()) {
        setIsValid(false);
        setMessage('');
        return;
      }

      if (username.length < 3) {
        setIsValid(false);
        setMessage('Username too short (minimum 3 characters)');
        return;
      }

      if (username.length > 20) {
        setIsValid(false);
        setMessage('Username too long (maximum 20 characters)');
        return;
      }

      // Check for valid characters
      const validUsername = /^[a-zA-Z0-9_-]+$/.test(username);
      if (!validUsername) {
        setIsValid(false);
        setMessage('Username can only contain letters, numbers, _ and -');
        return;
      }

      // Check availability
      if (actor) {
        setIsChecking(true);
        try {
          const available = await actor.isUsernameAvailable(username);
          if (available) {
            setIsValid(true);
            setMessage('Username is available!');
          } else {
            setIsValid(false);
            setMessage('Username is already taken');
          }
        } catch (err) {
          console.error('Error checking username:', err);
          setMessage('Error checking username availability');
        } finally {
          setIsChecking(false);
        }
      }
    };

    const timeoutId = setTimeout(validateUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username, actor]);

  const handleCreateProfile = async () => {
    if (!isValid || !username.trim() || !actor) return;

    setIsCreating(true);
    setMessage('Creating your profile...');

    try {
      const result = await actor.createUserProfile(username.trim());
      
      if ('ok' in result) {
        setMessage('Profile created successfully!');
        setTimeout(() => {
          navigate('/MainMenu');
        }, 1500);
      } else {
        setMessage(result.err || 'Failed to create profile');
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      setMessage('Error creating profile. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid && !isCreating && !isChecking) {
      handleCreateProfile();
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="setup-header">
          <div className="welcome-icon">
            <FaUser />
          </div>
          <h2 className="login-title">Welcome to the Game!</h2>
          <p className="setup-subtitle">
            You're almost ready to play. Choose a username that other players will see.
          </p>
        </div>

        <div className="principal-info">
          <h3>Connected Identity</h3>
          <p className="principal-display">
            {principal ? `${principal.slice(0, 20)}...` : 'Loading...'}
          </p>
        </div>

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Choose your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`input-field ${isValid ? 'valid' : username.length > 0 ? 'invalid' : ''}`}
            disabled={isCreating}
            maxLength={20}
          />
          <div className="validation-icon">
            {isChecking ? (
              <FaSpinner className="checking-spinner" />
            ) : isValid ? (
              <FaCheck className="valid-icon" />
            ) : username.length > 0 ? (
              <FaTimes className="invalid-icon" />
            ) : null}
          </div>
        </div>

        <div className="character-count">
          {username.length}/20 characters
        </div>

        <button 
          className={`login-button ${isValid ? 'enabled' : 'disabled'}`}
          onClick={handleCreateProfile}
          disabled={!isValid || isCreating || isChecking}
        >
          {isCreating ? (
            <>
              <FaSpinner className="button-spinner" />
              Creating Profile...
            </>
          ) : (
            'Create Profile & Start Playing'
          )}
        </button>

        {message && (
          <p className={`signup-text ${
            message.includes('available') || message.includes('successfully') 
              ? 'success-message' 
              : message.includes('Error') || message.includes('taken') || message.includes('short') || message.includes('long')
              ? 'error-message'
              : 'info-message'
          }`}>
            {message}
          </p>
        )}

        <div className="username-tips">
          <h3>Username Guidelines:</h3>
          <ul>
            <li>3-20 characters long</li>
            <li>Letters, numbers, underscore (_) and dash (-) only</li>
            <li>Choose wisely - this cannot be changed later</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
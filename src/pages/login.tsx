// File: src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingBackgroundImg from '../assets/animation_background.png';
import './login.css';
import { FaUser, FaLock } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign in</h2>
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="login-options">
          <label className="remember-me">
            <input type="checkbox" /> Remember me
          </label>
          <span className="forgot-password">Forgot Password?</span>
        </div>
        <button className="login-button" onClick={() => alert('Logged in!')}>
          Login
        </button>
        <p className="signup-text">
          Don't have an account? <span className="signup-link" onClick={() => navigate('/signup')}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
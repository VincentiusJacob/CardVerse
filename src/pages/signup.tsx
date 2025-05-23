// File: src/pages/Signup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { FaUser, FaLock } from 'react-icons/fa';

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign Up</h2>
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
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button className="login-button" onClick={() => alert('Signed up!')}>
          Sign Up
        </button>
        <p className="signup-text">
          Already have an account? <span className="signup-link" onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}
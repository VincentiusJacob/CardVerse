import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { backend } from '../ic/backend'; // 🟢 Import koneksi backend

// Define interface for backend response
interface BackendResponse {
  message?: string;
  error?: string;
  success?: boolean;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk toggle confirm password visibility

  const handleSignup = async () => {
    // Reset message
    setMessage('');
    
    // Validation
    if (!username.trim()) {
      setMessage("Username is required");
      return;
    }
    
    if (!password.trim()) {
      setMessage("Password is required");
      return;
    }

    // Password minimum length validation
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await backend.register(username, password);
      
      // Handle different result types
      if (typeof result === 'string') {
        if (result.includes("successful") || result.includes("success")) {
          setMessage("Registration successful!");
          setTimeout(() => {
            navigate('/login');
          }, 1500); // Delay navigation to show success message
        } else {
          setMessage(result);
        }
      } else if (typeof result === 'object' && result !== null) {
        // If result is an object, extract the message
        const response = result as BackendResponse;
        if (response.success) {
          setMessage("Registration successful!");
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else {
          const errorMessage = response.message || response.error || "Registration failed";
          setMessage(errorMessage);
        }
      } else {
        setMessage("Registration successful!");
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      // Handle different error types
      if (error instanceof Error) {
        setMessage(error.message || "Signup failed");
      } else if (typeof error === 'string') {
        setMessage(error);
      } else {
        setMessage("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSignup();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
            onKeyPress={handleKeyPress}
            className="input-field"
            disabled={isLoading}
          />
        </div>
        <div className="input-group password-group">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-field password-input"
            disabled={isLoading}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            disabled={isLoading}
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="input-group password-group">
          <FaLock className="input-icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-field password-input"
            disabled={isLoading}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={toggleConfirmPasswordVisibility}
            disabled={isLoading}
            tabIndex={-1}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button 
          className="login-button" 
          onClick={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {message && (
          <p className={`signup-text ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
            {message}
          </p>
        )}
        <p className="signup-text">
          Already have an account?{' '}
          <span 
            className="signup-link" 
            onClick={() => !isLoading && navigate('/login')}
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
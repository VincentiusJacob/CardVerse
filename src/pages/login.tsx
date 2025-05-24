import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { backend } from '../ic/backend'; // 🟢 Import koneksi
import LandingBackgroundImg from '../assets/animation_background.png';
import './login.css';

// Define interface for backend response
interface BackendResponse {
  message?: string;
  error?: string;
  success?: boolean;
  token?: string;
  user?: any;
}

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password visibility

  const handleLogin = async () => {
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

    setIsLoading(true);

    try {
      const result = await backend.login(username, password); // 🟢 Call backend login
      
      // Handle different result types
      if (typeof result === 'string') {
        if (result.includes("successful") || result.includes("success")) {
          setMessage("Login successful!");
          setTimeout(() => {
            navigate('/MainMenu'); // Navigate to main.tsx
          }, 1500); // Delay navigation to show success message
        } else {
          setMessage(result);
        }
      } else if (typeof result === 'object' && result !== null) {
        // If result is an object, extract the message
        const response = result as BackendResponse;
        if (response.success || response.token) {
          setMessage("Login successful!");
          setTimeout(() => {
            navigate("/main"); // Navigate to main.tsx
          }, 1500);
        } else {
          const errorMessage = response.message || response.error || "Login failed";
          setMessage(errorMessage);
        }
      } else if (result === true) {
        setMessage("Login successful!");
        setTimeout(() => {
          navigate("/main"); // Navigate to main.tsx
        }, 1500);
      } else if (result === false) {
        setMessage("Incorrect username or password.");
      } else {
        setMessage("Incorrect username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different error types
      if (error instanceof Error) {
        setMessage(error.message || "Login failed");
      } else if (typeof error === 'string') {
        setMessage(error);
      } else {
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        <div className="login-options">
          <label className="remember-me">
            <input type="checkbox" disabled={isLoading} /> Remember me
          </label>
          <span className="forgot-password">Forgot Password?</span>
        </div>
        <button 
          className="login-button" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
        {message && (
          <p className={`signup-text ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
            {message}
          </p>
        )}
        <p className="signup-text">
          Don't have an account?{' '}
          <span 
            className="signup-link" 
            onClick={() => !isLoading && navigate('/register')}
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
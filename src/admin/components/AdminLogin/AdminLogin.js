import React, { useState } from 'react';
import './AdminLogin.css';
import { FaLeaf, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Admin login form submitted:', { email, password });

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Call the login function from AdminContext (which uses API)
    const result = await login(email, password);
    
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful, navigating to /admin');
      navigate('/admin');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <FaLeaf />
            </div>
            <div className="brand-text">
              <h1>Zonixtec</h1>
              <p className="tagline">Food Hotel Admin Panel</p>
            </div>
          </div>
          <p>Sign in to your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@zonixtec.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock className="input-icon" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
              disabled={loading}
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#forgot" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </button>

          {/* <div className="login-footer">
            <p>
              <strong>Admin Credentials:</strong><br />
              Email: admin@zonixtec.com<br />
              Password: admin123
            </p>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
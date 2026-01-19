import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'register', or 'profile'
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const { user, isAuthenticated, loading, error, login, register, logout, updateProfile, setError } = useAuth();
  const navigate = useNavigate();

  // Initialize profile data when user is authenticated
  React.useEffect(() => {
    if (user && activeTab === 'profile') {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, activeTab]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      navigate('/');
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const userData = {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      phone: registerData.phone,
      address: registerData.address
    };
    
    const result = await register(userData);
    if (result.success) {
      navigate('/');
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profileData);
    if (result.success) {
      alert('Profile updated successfully!');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setActiveTab('login');
  };

  if (loading && !user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          
          {isAuthenticated ? (
            // User is logged in - Show Profile
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <span className="avatar-icon">👤</span>
                </div>
                <div className="profile-info">
                  <h2>Welcome, {user.name}!</h2>
                  <p className="profile-email">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="admin-badge">Admin</span>
                  )}
                </div>
              </div>

              <div className="profile-tabs">
                <button
                  className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button
                  className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  My Orders
                </button>
              </div>

              {activeTab === 'profile' && (
                <div className="profile-content">
                  <form onSubmit={handleProfileUpdate} className="profile-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="disabled-input"
                      />
                      <small className="form-note">Email cannot be changed</small>
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        placeholder="Enter your delivery address"
                        rows="3"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>

                  <div className="profile-actions">
                    <button onClick={handleLogout} className="btn btn-logout">
                      Logout
                    </button>
                    
                    {user.role === 'admin' && (
                      <a href="/admin" className="btn btn-admin">
                        Admin Dashboard
                      </a>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="orders-content">
                  <h3>My Orders</h3>
                  <p className="no-orders">No orders yet. Start shopping!</p>
                  <a href="/menu" className="btn btn-primary">
                    Browse Menu
                  </a>
                </div>
              )}
            </div>
          ) : (
            // User is not logged in - Show Login/Register
            <div className="auth-card">
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                >
                  Login
                </button>
                <button
                  className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('register');
                    setError('');
                  }}
                >
                  Register
                </button>
              </div>

              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}

              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input type="checkbox" /> Remember me
                    </label>
                    <a href="/forgot-password" className="forgot-link">
                      Forgot Password?
                    </a>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  <div className="auth-divider">
                    <span>OR</span>
                  </div>

                  <button type="button" className="btn btn-google">
                    Continue with Google
                  </button>
                </form>
              )}

              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="auth-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      value={registerData.address}
                      onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                      placeholder="Enter your delivery address"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                      placeholder="Minimum 6 characters"
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm Password *</label>
                    <input
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      required
                      placeholder="Confirm your password"
                    />
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                    />
                    <label htmlFor="terms">
                      I agree to the Terms & Conditions and Privacy Policy
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import './AdminHeader.css';
import { FaBell, FaEnvelope, FaUserCircle, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

const AdminHeader = ({ onMenuToggle, isMenuOpen }) => {
  const { adminUser } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSearch(true);
      } else {
        setShowSearch(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSearch = () => {
    if (isMobile) {
      setShowSearch(!showSearch);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.admin-profile')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <header className="admin-header">
      {/* Mobile Menu Toggle Button - Only on mobile */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* Logo - Show on all screens */}
      <div className="header-left">
        

        {/* Desktop Search */}
        {!isMobile && (
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search orders, users, menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )}
      </div>

      <div className="header-right">
        {/* Mobile Search Toggle Button */}
        {isMobile && !showSearch && (
          <button 
            className="mobile-search-toggle"
            onClick={toggleSearch}
            aria-label="Toggle search"
          >
            <FaSearch />
          </button>
        )}

        {/* Mobile Search Box (when expanded) */}
        {isMobile && showSearch && (
          <div className="mobile-search-expanded">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
            </div>
            <button 
              className="close-search-btn"
              onClick={toggleSearch}
              aria-label="Close search"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Desktop Notifications */}
        {!isMobile && (
          <>
            <button className="header-icon-btn notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            
            <button className="header-icon-btn message-btn">
              <FaEnvelope />
              <span className="notification-badge">5</span>
            </button>
          </>
        )}

        {/* Mobile Notifications */}
        {isMobile && (
          <div className="mobile-icons">
            <button className="mobile-icon-btn">
              <FaBell />
              <span className="mobile-badge">3</span>
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className="admin-profile-container">
          <div 
            className={`admin-profile ${showUserMenu ? 'active' : ''}`}
            onClick={toggleUserMenu}
          >
            <img
              src={adminUser?.avatar || '/images/admin/default-avatar.png'}
              alt={adminUser?.name}
              className="admin-avatar"
            />
            {!isMobile && (
              <div className="admin-info">
                <span className="admin-name">{adminUser?.name || 'Admin'}</span>
                <span className="admin-role">{adminUser?.role || 'Administrator'}</span>
              </div>
            )}
            {!isMobile && <FaUserCircle className="profile-dropdown-icon" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
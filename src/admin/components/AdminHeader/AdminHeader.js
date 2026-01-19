import React, { useState } from 'react';
import './AdminHeader.css';
import { FaBell, FaEnvelope, FaUserCircle, FaSearch } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

const AdminHeader = () => {
  const { adminUser } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="admin-header">
      <div className="header-left">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>
        
        <button className="header-icon-btn">
          <FaEnvelope />
          <span className="notification-badge">5</span>
        </button>

        <div className="admin-profile">
          <img
            src={adminUser?.avatar || '/images/admin/default-avatar.png'}
            alt={adminUser?.name}
            className="admin-avatar"
          />
          <div className="admin-info">
            <span className="admin-name">{adminUser?.name}</span>
            <span className="admin-role">{adminUser?.role}</span>
          </div>
          <FaUserCircle className="profile-dropdown-icon" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
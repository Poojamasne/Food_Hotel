import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AdminSidebar.css';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUtensils,
  FaListAlt,
  FaShoppingCart,
  FaUsers,
  FaEnvelope,
  FaSignOutAlt,

} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAdmin();
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  const menuItems = [
    { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/menu', icon: <FaUtensils />, label: 'Manage Menu' },
    { path: '/admin/categories', icon: <FaListAlt />, label: 'Categories' },
    { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/contact', icon: <FaEnvelope />, label: 'Contact Messages' },
  ];

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const closeSidebar = useCallback(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [isMobile, onClose]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && sidebarRef.current && 
          !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, isOpen, closeSidebar]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  // Don't render sidebar on mobile when closed
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`admin-sidebar ${isOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}
      >
        <div className="sidebar-header">
          <h3>Food Hotel Admin</h3>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    isActive ? 'sidebar-link active' : 'sidebar-link'
                  }
                  onClick={closeSidebar}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button 
            onClick={() => { 
              logout(); 
              closeSidebar(); 
            }} 
            className="logout-btn"
          >
            <FaSignOutAlt /> <span className="logout-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
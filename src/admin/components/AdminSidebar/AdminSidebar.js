import React from 'react';
import './AdminSidebar.css';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUtensils,
  FaListAlt,
  FaShoppingCart,
  FaUsers,
  FaEnvelope,
//   FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

const AdminSidebar = () => {
  const { logout } = useAdmin();

  const menuItems = [
    { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/menu', icon: <FaUtensils />, label: 'Manage Menu' },
    { path: '/admin/categories', icon: <FaListAlt />, label: 'Categories' },
    { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
     { path: '/admin/contact', icon: <FaEnvelope />, label: 'Contact Messages' },
    // { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <aside className="admin-sidebar">
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
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
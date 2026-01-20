import React, { useState, useEffect } from 'react';
import './AdminLayout.css';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import AdminHeader from '../components/AdminHeader/AdminHeader';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      
      <div className={`admin-main ${isSidebarOpen && !isMobile ? 'sidebar-open' : 'sidebar-closed'}`}>
        <AdminHeader 
          onMenuToggle={toggleSidebar}
          isMenuOpen={isSidebarOpen}
        />
        <main className="admin-content">
          <div className="container-fluid">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
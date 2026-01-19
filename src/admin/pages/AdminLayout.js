import React from 'react';
import './AdminLayout.css';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import AdminHeader from '../components/AdminHeader/AdminHeader';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
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
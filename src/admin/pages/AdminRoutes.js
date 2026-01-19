import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from './AdminLayout';
import Dashboard from '../components/Dashboard/Dashboard';
import ManageMenu from '../components/ManageMenu/ManageMenu';
import ManageCategories from '../components/ManageCategories/ManageCategories';
import ManageOrders from '../components/ManageOrders/ManageOrders';
import ManageUsers from '../components/ManageUsers/ManageUsers';
import ManageOffers from '../components/ManageOffers/ManageOffers';
import Statistics from '../components/Statistics/Statistics';
import AdminLogin from '../components/AdminLogin/AdminLogin';
import ManageContact from '../components/ManageContact/ManageContact';

const AdminRoutes = () => {
  const { isAdminAuthenticated, loading } = useAdmin();

  if (loading) {
    return <div className="admin-loading">Loading Admin Panel...</div>;
  }

  return (
    <Routes>
      {/* Login Route */}
      <Route 
        path="/login" 
        element={
          isAdminAuthenticated ? <Navigate to="/admin" /> : <AdminLogin />
        } 
      />
      
      {/* Protected Admin Routes */}
      <Route 
        path="/*" 
        element={
          isAdminAuthenticated ? (
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/menu" element={<ManageMenu />} />
                <Route path="/categories" element={<ManageCategories />} />
                <Route path="/orders" element={<ManageOrders />} />
                <Route path="/users" element={<ManageUsers />} />
                <Route path="/contact" element={<ManageContact />} />
                <Route path="/offers" element={<ManageOffers />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/admin/login" />
          )
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
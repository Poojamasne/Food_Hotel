import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const storedAdmin = localStorage.getItem('adminUser');
    const storedToken = localStorage.getItem('adminToken');
    
    if (storedAdmin && storedToken) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setAdminUser(adminData);
        setToken(storedToken);
        setIsAdminAuthenticated(true);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Admin login attempt:', { email }); // Debug log
      
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        // Save admin data and token
        const adminData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        };
        
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        localStorage.setItem('adminToken', data.token);
        
        setAdminUser(adminData);
        setToken(data.token);
        setIsAdminAuthenticated(true);
        
        return { success: true, data: adminData };
      } else {
        return { 
          success: false, 
          message: data.message || 'Login failed. Please check your credentials.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    setAdminUser(null);
    setToken(null);
    setIsAdminAuthenticated(false);
  };

  const updateAdminProfile = (data) => {
    const updatedAdmin = { ...adminUser, ...data };
    localStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
    setAdminUser(updatedAdmin);
  };

  const getToken = () => {
    return token || localStorage.getItem('adminToken');
  };

  const value = {
    adminUser,
    token,
    isAdminAuthenticated,
    loading,
    login,
    logout,
    updateAdminProfile,
    getToken
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;





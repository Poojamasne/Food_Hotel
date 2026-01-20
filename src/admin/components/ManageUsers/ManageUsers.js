import React, { useState, useEffect, useCallback } from 'react';
import './ManageUsers.css';
import { 
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaUserCheck,
  FaUserTimes,
  FaShoppingCart,
  FaSpinner,
  FaRedo,
  FaKey,
  FaMapMarkerAlt
} from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // For force refresh

  // Form state for add/edit
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Fetch users function
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch('https://backend-hotel-management.onrender.com/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Users API response:', data);
        
        if (data.success) {
          setUsers(data.data || []);
        } else {
          setError(data.message || 'Failed to load users');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Error ${response.status}: Failed to fetch users`);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, [refreshKey, fetchUsers]);

  // Handle delete user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const token = getToken();
        if (!token) {
          alert('Authentication required');
          return;
        }

        const response = await fetch(`https://backend-hotel-management.onrender.com/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUsers(users.filter(user => user.id !== id));
            alert('User deleted successfully!');
          } else {
            alert(data.message || 'Failed to delete user');
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(errorData.message || 'Failed to delete user');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (id, is_active) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`https://backend-hotel-management.onrender.com/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.map(user => 
            user.id === id ? { ...user, is_active, status: is_active ? 'Active' : 'Inactive' } : user
          ));
          alert(`User ${is_active ? 'activated' : 'deactivated'} successfully!`);
        } else {
          alert(data.message || 'Failed to update user status');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Error updating user status. Please try again.');
    }
  };

  // Handle view user
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewMode('view');
    setShowViewModal(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user',
      password: '',
      confirmPassword: ''
    });
    setViewMode('edit');
    setShowViewModal(true);
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      alert('Name and email are required');
      return;
    }

    if (userForm.password && userForm.password !== userForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!token) {
        alert('Authentication required');
        setIsSubmitting(false);
        return;
      }

      // Prepare update data
      const updateData = {
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim() || null,
        address: userForm.address.trim() || null,
        role: userForm.role
      };

      // Only include password if it's provided
      if (userForm.password) {
        updateData.password = userForm.password;
      }

      // First update basic info
      const response = await fetch(`https://backend-hotel-management.onrender.com/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh users list
          setRefreshKey(prev => prev + 1);
          setShowViewModal(false);
          setSelectedUser(null);
          setUserForm({
            name: '',
            email: '',
            phone: '',
            address: '',
            role: 'user',
            password: '',
            confirmPassword: ''
          });
          alert('User updated successfully!');
        } else {
          alert(data.message || 'Failed to update user');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Error updating user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add new user
  const handleAddUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim() || !userForm.password) {
      alert('Name, email and password are required');
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!token) {
        alert('Authentication required');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('https://backend-hotel-management.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          password: userForm.password,
          phone: userForm.phone.trim() || '',
          address: userForm.address.trim() || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // If role is not 'user', update it
          if (userForm.role !== 'user') {
            setTimeout(async () => {
              try {
                const roleResponse = await fetch(`https://backend-hotel-management.onrender.com/api/admin/users/${data.user.id}/role`, {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ role: userForm.role })
                });

                if (!roleResponse.ok) {
                  console.warn('Failed to update user role, but user was created');
                }
              } catch (roleErr) {
                console.warn('Error updating user role:', roleErr);
              }
              
              // Refresh users list
              setRefreshKey(prev => prev + 1);
              setShowAddModal(false);
              setUserForm({
                name: '',
                email: '',
                phone: '',
                address: '',
                role: 'user',
                password: '',
                confirmPassword: ''
              });
              alert('User added successfully!');
            }, 1000);
          } else {
            // Refresh users list
            setRefreshKey(prev => prev + 1);
            setShowAddModal(false);
            setUserForm({
              name: '',
              email: '',
              phone: '',
              address: '',
              role: 'user',
              password: '',
              confirmPassword: ''
            });
            alert('User added successfully!');
          }
        } else {
          alert(data.message || 'Failed to add user');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to add user');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Error adding user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = ['All', 'Active', 'Inactive'];
  const roleOptions = ['All', 'user', 'admin', 'staff'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' && user.is_active) ||
      (statusFilter === 'Inactive' && !user.is_active);
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (is_active) => {
    return is_active ? '#4CAF50' : '#F44336';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#8B4513';
      case 'staff': return '#2196F3';
      case 'user': return '#4CAF50';
      default: return '#607D8B';
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'staff': return 'Staff';
      case 'user': return 'Customer';
      default: return 'Customer';
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    customers: users.filter(u => u.role === 'user').length,
    staff: users.filter(u => u.role === 'staff' || u.role === 'admin').length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="manage-users">
        <div className="page-header">
          <h1>
            <FaUser /> User Management
          </h1>
          <button className="add-btn" disabled>
            <FaSpinner className="spinner" /> Loading...
          </button>
        </div>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-users">
        <div className="page-header">
          <h1>
            <FaUser /> User Management
          </h1>
          <button className="add-btn" onClick={fetchUsers}>
            <FaRedo /> Retry
          </button>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUsers} className="retry-btn">
            <FaRedo /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-users">
      <div className="page-header">
        <h1>
          <FaUser /> User Management
        </h1>
        <button 
          className="add-btn"
          onClick={() => {
            setUserForm({
              name: '',
              email: '',
              phone: '',
              address: '',
              role: 'user',
              password: '',
              confirmPassword: ''
            });
            setShowAddModal(true);
          }}
        >
          <FaUserPlus /> Add New User
        </button>
      </div>

      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B4513' }}>
            <FaUser />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <div className="stat-value">{userStats.total}</div>
            <div className="stat-description">Registered users</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4CAF50' }}>
            <FaUserCheck />
          </div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <div className="stat-value">{userStats.active}</div>
            <div className="stat-description">{userStats.total > 0 ? ((userStats.active / userStats.total) * 100).toFixed(1) : 0}% active</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#2196F3' }}>
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Customers</h3>
            <div className="stat-value">{userStats.customers}</div>
            <div className="stat-description">Regular customers</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#9C27B0' }}>
            <FaKey />
          </div>
          <div className="stat-content">
            <h3>Staff & Admin</h3>
            <div className="stat-value">{userStats.staff}</div>
            <div className="stat-description">Staff members</div>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        {/* <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search users by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}
        
        <div className="filter-group">
          <FaFilter />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map(option => (
              <option key={option} value={option}>{option} Status</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <FaUser />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {roleOptions.map(option => (
              <option key={option} value={option}>
                {option === 'All' ? 'All Roles' : 
                 option === 'user' ? 'Customer' : 
                 option === 'admin' ? 'Admin' : 
                 option === 'staff' ? 'Staff' : option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-results">
          <div className="no-results-content">
            <FaUser className="no-results-icon" />
            <h3>No users found</h3>
            <p>
              {searchQuery ? `No users found for "${searchQuery}"` : 'No users match the selected filters'}
            </p>
            {(searchQuery || statusFilter !== 'All' || roleFilter !== 'All') && (
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setRoleFilter('All');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td className="user-id">#{index + 1}</td>
                    
                    <td className="user-cell">
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.profile_image ? (
                            <img 
                              src={user.profile_image}
                              alt={user.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8B4513&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="user-details">
                          <div className="user-name-row">
                            <h4>{user.name}</h4>
                          </div>
                          <div className="user-meta">
                            <span className="join-date">
                              <FaEnvelope /> {user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="contact-cell">
                      <div className="contact-info">
                        <div className="phone">
                          <FaPhone style={{ transform: "scaleX(-1)" }} /> {user.phone || "Not provided"}
                        </div>
                        <div className="address">
                          <FaMapMarkerAlt /> {user.address ? `${user.address.substring(0, 30)}${user.address.length > 30 ? '...' : ''}` : 'Not provided'}
                        </div>
                      </div>
                    </td>
                    
                    <td className="status-cell">
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(user.is_active) }}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    <td className="role-cell">
                      <span 
                        className="role-badge" 
                        style={{ backgroundColor: getRoleColor(user.role) }}
                      >
                        {getRoleDisplay(user.role)}
                      </span>
                    </td>
                    
                    <td className="join-date-cell">
                      <div className="join-date">
                        <FaCalendarAlt /> {formatDate(user.created_at)}
                      </div>
                    </td>
                    
                    <td className="actions-cell">
                      <div className="actions">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => handleViewUser(user)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          <FaEdit />
                        </button>
                        
                        {user.is_active ? (
                          <button
                            className="action-btn status-action-btn"
                            onClick={() => handleStatusChange(user.id, false)}
                            title="Deactivate User"
                            style={{ backgroundColor: '#FF9800' }}
                          >
                            <FaUserTimes />
                          </button>
                        ) : (
                          <button
                            className="action-btn status-action-btn"
                            onClick={() => handleStatusChange(user.id, true)}
                            title="Activate User"
                            style={{ backgroundColor: '#4CAF50' }}
                          >
                            <FaUserCheck />
                          </button>
                        )}
                        
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name </label>
                  <input 
                    type="text" 
                    placeholder="Enter full name" 
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label>Email Address </label>
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    required 
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="Enter phone number" 
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label>Role </label>
                  <select 
                    value={userForm.role} 
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    disabled={isSubmitting}
                  >
                    <option value="user">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password </label>
                  <input 
                    type="password" 
                    placeholder="Enter password" 
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm Password </label>
                  <input 
                    type="password" 
                    placeholder="Confirm password" 
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm({...userForm, confirmPassword: e.target.value})}
                    required 
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea 
                  placeholder="Enter full address" 
                  rows="3"
                  value={userForm.address}
                  onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleAddUser}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" /> Adding...
                  </>
                ) : (
                  <>
                    <FaCheck /> Add User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit User Modal */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{viewMode === 'view' ? 'User Details' : 'Edit User'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUser(null);
                }}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="user-profile-header">
                <div className="profile-avatar">
                  {selectedUser.profile_image ? (
                    <img src={selectedUser.profile_image} alt={selectedUser.name} />
                  ) : (
                    <div className="avatar-placeholder large">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h3>{selectedUser.name}</h3>
                  <p>{getRoleDisplay(selectedUser.role)}</p>
                  <div className="profile-stats">
                    <span className="stat">
                      <FaEnvelope /> {selectedUser.email}
                    </span>
                    <span className="stat">
                      <FaCalendarAlt /> Joined: {formatDate(selectedUser.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="user-details-grid">
                <div className="detail-group">
                  <h4>Contact Information</h4>
                  <div className="detail-item">
                    <FaEnvelope /> Email: {selectedUser.email}
                  </div>
                  <div className="detail-item">
                    <FaPhone /> Phone: {selectedUser.phone || 'Not provided'}
                  </div>
                </div>

                <div className="detail-group">
                  <h4>Account Status</h4>
                  <div className="detail-item">
                    Status: 
                    <span 
                      className="status-tag" 
                      style={{ backgroundColor: getStatusColor(selectedUser.is_active) }}
                    >
                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="detail-item">
                    Role: 
                    <span 
                      className="role-tag" 
                      style={{ backgroundColor: getRoleColor(selectedUser.role) }}
                    >
                      {getRoleDisplay(selectedUser.role)}
                    </span>
                  </div>
                  <div className="detail-item">
                    Updated: {formatDate(selectedUser.updated_at)}
                  </div>
                </div>

                <div className="detail-group">
                  <h4>Address</h4>
                  <div className="detail-item address">
                    {selectedUser.address || 'Not provided'}
                  </div>
                </div>
              </div>

              {viewMode === 'edit' && (
                <div className="edit-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        value={userForm.name} 
                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input 
                        type="email" 
                        value={userForm.email} 
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input 
                        type="tel" 
                        value={userForm.phone} 
                        onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input 
                        type="text" 
                        value={userForm.address} 
                        onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Role</label>
                      <select 
                        value={userForm.role} 
                        onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                        disabled={isSubmitting}
                      >
                        <option value="user">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="password-change-section">
                    <h4>Change Password (Optional)</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>New Password</label>
                        <input 
                          type="password" 
                          placeholder="Leave empty to keep current"
                          value={userForm.password}
                          onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input 
                          type="password" 
                          placeholder="Confirm new password"
                          value={userForm.confirmPassword}
                          onChange={(e) => setUserForm({...userForm, confirmPassword: e.target.value})}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUser(null);
                }}
                disabled={isSubmitting}
              >
                <FaTimes /> Close
              </button>
              {viewMode === 'edit' && (
                <button 
                  className="btn-primary"
                  onClick={handleUpdateUser}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spinner" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck /> Save Changes
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
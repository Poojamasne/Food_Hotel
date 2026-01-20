import React, { useState, useEffect } from 'react';
import './ManageOrders.css';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

const ManageOrders = () => {
  const { token, isAdminAuthenticated } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://backend-hotel-management.onrender.com/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform API data to match your UI structure
          const transformedOrders = data.data.map(order => ({
            id: order.order_number,
            customer: order.user_name || order.user_email || 'Customer',
            amount: order.final_amount || 0,
            status: order.order_status,
            date: formatDate(order.created_at),
            items: order.item_count || 0,
            originalData: order
          }));
          setOrders(transformedOrders);
        } else {
          setError(data.message || 'Failed to load orders');
          // Fallback to demo data
          setOrders(getDemoOrders());
        }
      } else {
        setError('Failed to fetch orders');
        setOrders(getDemoOrders());
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error loading orders. Please try again.');
      setOrders(getDemoOrders());
    } finally {
      setLoading(false);
    }
    };

    if (isAdminAuthenticated && token) {
      fetchOrders();
    }
  }, [isAdminAuthenticated, token]);

  const getDemoOrders = () => {
    return [
      { id: 'ORD001', customer: 'John Doe', amount: 1250, status: 'pending', date: '2024-01-15', items: 3 },
      { id: 'ORD002', customer: 'Jane Smith', amount: 850, status: 'confirmed', date: '2024-01-15', items: 2 },
      { id: 'ORD003', customer: 'Robert Johnson', amount: 2150, status: 'delivered', date: '2024-01-14', items: 5 },
      { id: 'ORD004', customer: 'Sarah Wilson', amount: 950, status: 'cancelled', date: '2024-01-14', items: 2 },
    ];
  };

  // Format API status for display
  const formatStatus = (apiStatus) => {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[apiStatus] || apiStatus;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '2024-01-15';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Find the original order
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (!orderToUpdate) return;

      const response = await fetch(`https://backend-hotel-management.onrender.com/api/orders/${orderToUpdate.originalData.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          setOrders(orders.map(order => 
            order.id === orderId ? { 
              ...order, 
              status: newStatus,
              originalData: {
                ...order.originalData,
                order_status: newStatus
              }
            } : order
          ));
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // Fallback to local update
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  // Handle view order details
  const handleViewOrder = (order) => {
    // You can implement a modal or redirect to order details page
    console.log('View order:', order.originalData);
    // For now, just show an alert with order details
    alert(`Order Details:\nID: ${order.id}\nCustomer: ${order.customer}\nAmount: ₹${order.amount}\nStatus: ${formatStatus(order.status)}`);
  };

  // Determine which action buttons to show based on status
  const getActionButtons = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <>
            <button 
              className="action-btn accept-btn"
              onClick={() => updateOrderStatus(order.id, 'confirmed')}
            >
              <FaCheck /> Accept
            </button>
            <button 
              className="action-btn reject-btn"
              onClick={() => updateOrderStatus(order.id, 'cancelled')}
            >
              <FaTimes /> Reject
            </button>
          </>
        );
      
      case 'confirmed':
        return (
          <button 
            className="action-btn process-btn"
            onClick={() => updateOrderStatus(order.id, 'preparing')}
          >
            <FaCheck /> Preparing
          </button>
        );
      
      case 'preparing':
        return (
          <button 
            className="action-btn ready-btn"
            onClick={() => updateOrderStatus(order.id, 'ready')}
          >
            <FaCheck /> Mark as Ready
          </button>
        );
      
      case 'ready':
        return (
          <button 
            className="action-btn deliver-btn"
            onClick={() => updateOrderStatus(order.id, 'delivered')}
          >
            <FaCheck /> Mark as Delivered
          </button>
        );
      
      case 'delivered':
        return null; // No actions for delivered orders
      
      case 'cancelled':
        return null; // No actions for cancelled orders
      
      default:
        return null;
    }
  };

  // Check if admin is authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="manage-orders">
        <div className="page-header">
          <h1>Manage Orders</h1>
        </div>
        <div className="admin-login-required">
          <h3>Admin Access Required</h3>
          <p>Please log in as an administrator to manage orders.</p>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="admin-login-btn"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="manage-orders">
        <div className="page-header">
          <h1>Manage Orders</h1>
        </div>
        <div className="loading-message">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-orders">
      <div className="page-header">
        <h1>Manage Orders</h1>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error} (Showing demo data)</p>
        </div>
      )}

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.items} items</td>
                <td>₹{order.amount}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewOrder(order)}
                  >
                    <FaEye /> View
                  </button>
                  {getActionButtons(order)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
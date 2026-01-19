import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaReceipt,
  FaClock,
  FaCheckCircle,
  FaUtensils,
  FaTruck,
  FaTimesCircle,
  FaEye,
  FaRedo
} from 'react-icons/fa';
import './MyOrders.css';

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://backend-hotel-management.onrender.com/api/orders/my-orders?page=${page}&limit=10`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOrders(data.data);
            setTotalPages(data.pagination.pages);
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch('https://backend-hotel-management.onrender.com/api/orders/stats/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchOrders();
    fetchStats();
  }, [page, token]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="status-icon pending" />;
      case 'confirmed': return <FaCheckCircle className="status-icon confirmed" />;
      case 'preparing': return <FaUtensils className="status-icon preparing" />;
      case 'ready': return <FaCheckCircle className="status-icon ready" />;
      case 'delivered': return <FaTruck className="status-icon delivered" />;
      case 'cancelled': return <FaTimesCircle className="status-icon cancelled" />;
      default: return <FaClock className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const response = await fetch(`https://backend-hotel-management.onrender.com/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Order cancelled successfully');
          setPage(1); // Refresh orders by resetting to page 1
        }
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="my-orders">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage all your orders</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="orders-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <FaReceipt />
              </div>
              <div className="stat-content">
                <h3>{stats.total_orders || 0}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <h3>{stats.delivered_orders || 0}</h3>
                <p>Delivered</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>{stats.pending_orders || 0}</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaTruck />
              </div>
              <div className="stat-content">
                <h3>₹{stats.total_spent || 0}</h3>
                <p>Total Spent</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon">
                <FaReceipt />
              </div>
              <h3>No Orders Yet</h3>
              <p>You haven't placed any orders yet. Start ordering delicious food!</p>
              <Link to="/menu" className="order-now-btn">
                <FaRedo /> Order Now
              </Link>
            </div>
          ) : (
            <>
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.order_number}</h3>
                      <span className="order-date">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="order-status">
                      {getStatusIcon(order.order_status)}
                      <span className={`status-text ${order.order_status}`}>
                        {getStatusText(order.order_status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-details">
                    <div className="detail-row">
                      <span className="label">Total Amount:</span>
                      <span className="value">₹{order.final_amount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Payment:</span>
                      <span className="value">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'} - 
                        <span className={`payment-status ${order.payment_status}`}>
                          {order.payment_status}
                        </span>
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Delivery:</span>
                      <span className="value">
                        {order.delivery_type === 'home' ? 'Home Delivery' : 'Pickup'}
                      </span>
                    </div>
                  </div>

                  <div className="order-actions">
                    <Link 
                      to={`/order-confirmation/${order.id}`} 
                      className="action-btn view-btn"
                    >
                      <FaEye /> View Details
                    </Link>
                    
                    {(order.order_status === 'pending' || order.order_status === 'confirmed') && (
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel Order
                      </button>
                    )}
                    
                    {order.order_status === 'delivered' && (
                      <Link to="/menu" className="action-btn reorder-btn">
                        <FaRedo /> Order Again
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="page-btn"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
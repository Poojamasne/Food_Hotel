import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { 
  FaShoppingCart, 
  FaUsers, 
  FaRupeeSign, 
  FaUtensils,
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
  FaTachometerAlt,
  FaBox,
  FaMoneyBillWave,
  FaClipboardList
} from 'react-icons/fa';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const ordersPerPage = 5;

  // Get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem('adminToken');
    return token;
  };

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      
      console.log('Fetching dashboard data with token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      // Fetch dashboard data from single API endpoint
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard API response:', data);
        
        if (data.success) {
          setDashboardData(data.data);
        } else {
          setError(data.message || 'Failed to load dashboard data');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Error ${response.status}: Failed to fetch dashboard data`);
        
        // If unauthorized, suggest re-login
        if (response.status === 401) {
          setError('Session expired. Please login again.');
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare stats from API data
  const prepareStats = () => {
    if (!dashboardData || !dashboardData.stats) {
      return [
        { 
          title: 'Total Users', 
          value: '0', 
          icon: <FaUsers />, 
          color: '#f738dd', 
          change: '',
          description: 'Total customers'
        },
        { 
          title: 'Total Products', 
          value: '0', 
          icon: <FaBox />, 
          color: '#f85422', 
          change: '',
          description: 'Menu items'
        },
        { 
          title: 'Total Orders', 
          value: '0', 
          icon: <FaShoppingCart />, 
          color: '#ec8c1e', 
          change: '',
          description: 'All time orders'
        },
        { 
          title: 'Total Revenue', 
          value: '₹0.00', 
          icon: <FaRupeeSign />, 
          color: '#9C27B0', 
          change: '',
          description: 'Total earnings'
        },
        { 
          title: "Today's Orders", 
          value: '0', 
          icon: <FaClipboardList />, 
          color: '#2196F3', 
          change: '',
          description: 'Orders today'
        },
      ];
    }

    const { stats } = dashboardData;
    return [
      { 
        title: 'Total Users', 
        value: stats.total_users || '0', 
        icon: <FaUsers />, 
        color: '#f738dd', 
        change: '',
        description: 'Total customers'
      },
      { 
        title: 'Total Products', 
        value: stats.total_products || '0', 
        icon: <FaBox />, 
        color: '#f85422', 
        change: '',
        description: 'Menu items'
      },
      { 
        title: 'Total Orders', 
        value: stats.total_orders || '0', 
        icon: <FaShoppingCart />, 
        color: '#ec8c1e', 
        change: '',
        description: 'All time orders'
      },
      { 
        title: 'Total Revenue', 
        value: `₹${(parseFloat(stats.total_revenue) || 0).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`, 
        icon: <FaRupeeSign />,  
        color: '#9C27B0', 
        change: '',
        description: 'Total earnings'
      },
      { 
        title: "Today's Orders", 
        value: stats.today_orders || '0', 
        icon: <FaClipboardList />, 
        color: '#2196F3', 
        change: '',
        description: 'Orders today'
      },
      
    ];
  };

  // Prepare recent orders from API data
  const prepareRecentOrders = () => {
    if (!dashboardData || !dashboardData.recent_orders) {
      return [];
    }

    const { recent_orders } = dashboardData;
    return recent_orders.map(order => ({
      id: order.order_number || `ORD${order.id}`,
      customer: order.customer_name || `Customer ${order.user_id}`,
      amount: `₹${(parseFloat(order.final_amount) || parseFloat(order.total_amount) || 0).toFixed(2)}`,
      status: formatStatusForUI(order.order_status),
      date: formatDate(order.created_at),
      items: order.items_count || 1,
      originalData: order
    }));
  };

  // Prepare top products from API data
  const prepareTopProducts = () => {
    if (!dashboardData || !dashboardData.top_products) {
      return [
        { name: 'Chicken Biryani', orders: 156, revenue: '₹54,600' },
        { name: 'Paneer Butter Masala', orders: 132, revenue: '₹33,000' },
        { name: 'Masala Dosa', orders: 128, revenue: '₹15,360' },
        { name: 'Mango Lassi', orders: 98, revenue: '₹7,840' },
        { name: 'Butter Naan', orders: 87, revenue: '₹10,440' },
      ];
    }

    const { top_products } = dashboardData;
    return top_products.map((product, index) => ({
      name: product.name,
      orders: product.total_sold || 0,
      revenue: `₹${(parseFloat(product.revenue) || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      originalData: product,
      rank: index + 1
    }));
  };

  const formatStatusForUI = (apiStatus) => {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[apiStatus?.toLowerCase()] || apiStatus || 'Pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Calculate pagination
  const recentOrders = prepareRecentOrders();
  const stats = prepareStats();
  const popularItems = prepareTopProducts();
  
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = recentOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(recentOrders.length / ordersPerPage);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers
  const pageNumbers = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#4CAF50';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#FF9800';
      case 'ready': return '#9C27B0';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>
              <FaTachometerAlt className="dashboard-icon" />
              Dashboard
            </h1>
            <p className="welcome-text">Loading dashboard data...</p>
          </div>
        </div>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>
              <FaTachometerAlt className="dashboard-icon" />
              Dashboard
            </h1>
            <p className="welcome-text">Error loading dashboard</p>
          </div>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>
            <FaTachometerAlt className="dashboard-icon" />
            Dashboard
          </h1>
          <p className="welcome-text">Welcome back, Admin! Here's what's happening with your restaurant today.</p>
        </div>
        <div className="date-selector">
          <FaCalendarAlt />
          <select defaultValue="today">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon-container">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-trend" style={{ color: stat.color }}>
                {stat.change}
              </div>
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="content-row">
          <div className="chart-section">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Revenue Overview</h3>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#8B4513' }}></span>
                    This Month
                  </span>
                  <span className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#D2691E' }}></span>
                    Last Month
                  </span>
                </div>
              </div>
              <div className="revenue-chart">
                <div className="chart-bars">
                  {[65, 80, 45, 90, 75, 85, 95, 70, 60, 88, 92, 78].map((height, i) => (
                    <div key={i} className="chart-bar">
                      <div 
                        className="bar this-month" 
                        style={{ height: `${height}%` }}
                        title={`₹${(height * 2500).toLocaleString()}`}
                      ></div>
                      <div 
                        className="bar last-month" 
                        style={{ height: `${height * 0.8}%` }}
                        title={`₹${(height * 2000).toLocaleString()}`}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="chart-labels">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          </div>

          <div className="popular-items-section">
            <div className="popular-items-card">
              <div className="card-header">
                <h3>Top Selling Items</h3>
                <span className="card-subtitle">All Time</span>
              </div>
              <div className="popular-items-list">
                {popularItems.map((item, index) => (
                  <div key={index} className="popular-item">
                    <div className="item-rank">
                      <span className={`rank-badge rank-${item.rank || index + 1}`}>
                        #{item.rank || index + 1}
                      </span>
                    </div>
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-stats">
                        <span className="item-orders">{item.orders} orders</span>
                        <span className="item-revenue">{item.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {popularItems.length === 0 && (
                  <div className="no-data-message">
                    <p>No sales data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="orders-section">
          <div className="orders-card">
            <div className="card-header">
              <h3>Recent Orders</h3>
              <span className="orders-count">{recentOrders.length} total orders</span>
            </div>
            
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="order-id">
                          <strong>{order.id}</strong>
                        </td>
                        <td>{order.customer}</td>
                        <td>
                          <span className="items-count">{order.items} items</span>
                        </td>
                        <td className="order-amount">
                          <strong>{order.amount}</strong>
                        </td>
                        <td>
                          <span 
                            className="status-badge" 
                            style={{ backgroundColor: getStatusColor(order.status) }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="order-date">{order.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-orders-message">
                        <p>No recent orders found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - Only show if there are orders */}
            {recentOrders.length > 0 && (
              <div className="pagination">
                <button 
                  className="pagination-btn prev" 
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <FaArrowLeft /> Previous
                </button>
                
                <div className="page-numbers">
                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      className={`page-number ${currentPage === number ? 'active' : ''}`}
                      onClick={() => goToPage(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="pagination-btn next" 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next <FaArrowRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
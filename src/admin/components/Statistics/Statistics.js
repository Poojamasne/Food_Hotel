import React from 'react';
import './Statistics.css';
import { FaChartBar, FaChartLine, FaChartPie, FaCalendarAlt } from 'react-icons/fa';

const Statistics = () => {
  const stats = [
    { label: 'Total Revenue', value: '₹2,45,680', change: '+12%', icon: <FaChartBar />, color: '#4CAF50' },
    { label: 'Total Orders', value: '1,254', change: '+8%', icon: <FaChartLine />, color: '#2196F3' },
    { label: 'Avg Order Value', value: '₹980', change: '+5%', icon: <FaChartPie />, color: '#FF9800' },
    { label: 'New Customers', value: '245', change: '+15%', icon: <FaChartBar />, color: '#9C27B0' },
  ];

  const popularItems = [
    { name: 'Chicken Biryani', orders: 156, revenue: '₹54,600' },
    { name: 'Paneer Butter Masala', orders: 132, revenue: '₹33,000' },
    { name: 'Masala Dosa', orders: 128, revenue: '₹15,360' },
    { name: 'Mango Lassi', orders: 98, revenue: '₹7,840' },
    { name: 'Butter Naan', orders: 87, revenue: '₹10,440' },
  ];

  return (
    <div className="statistics">
      <div className="page-header">
        <h1>Statistics & Reports</h1>
        <div className="date-selector">
          <FaCalendarAlt />
          <select>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change" style={{ color: stat.color }}>
                {stat.change} from last period
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Revenue Overview</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {[40, 60, 80, 70, 90, 100, 80].map((height, i) => (
                <div key={i} className="bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className="chart-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Top Selling Items</h3>
          <div className="popular-items">
            {popularItems.map((item, index) => (
              <div key={index} className="popular-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-orders">{item.orders} orders</span>
                </div>
                <div className="item-revenue">{item.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
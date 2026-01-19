import React, { useState } from 'react';
import './ManageOffers.css';
import { 
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
  FaTag,
  FaCalendarAlt,
  FaRupeeSign,
  FaPercent,
  FaEye,
  FaCopy,
  FaUsers,
//   FaChartLine,
  FaTicketAlt,
  FaShareAlt
} from 'react-icons/fa';

const ManageOffers = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: '30% OFF on Chinese',
      description: 'Get 30% discount on all Chinese dishes',
      code: 'CHINESE30',
      discountType: 'percentage',
      discountValue: 30,
      minOrder: 500,
      maxDiscount: 300,
      validFrom: '2024-01-01',
      validTill: '2024-01-31',
      status: 'Active',
      usageLimit: 100,
      usedCount: 45,
      category: 'Chinese',
      applyType: 'Category',
      isAutoApply: false,
      bannerImage: '/images/offers/chinese-offer.jpg',
      createdDate: '2023-12-20'
    },
    {
      id: 2,
      title: 'Weekend Special 50% OFF',
      description: '50% discount on all orders placed on weekends',
      code: 'WEEKEND50',
      discountType: 'percentage',
      discountValue: 50,
      minOrder: 1000,
      maxDiscount: 500,
      validFrom: '2024-01-01',
      validTill: '2024-03-31',
      status: 'Active',
      usageLimit: 200,
      usedCount: 78,
      category: 'All',
      applyType: 'All',
      isAutoApply: true,
      bannerImage: '/images/offers/weekend-offer.jpg',
      createdDate: '2023-12-15'
    },
    {
      id: 3,
      title: 'First Order Discount',
      description: 'Special 20% discount for first time customers',
      code: 'FIRST20',
      discountType: 'percentage',
      discountValue: 20,
      minOrder: 0,
      maxDiscount: 200,
      validFrom: '2024-01-01',
      validTill: '2024-12-31',
      status: 'Active',
      usageLimit: 1000,
      usedCount: 234,
      category: 'All',
      applyType: 'New Users',
      isAutoApply: true,
      bannerImage: '/images/offers/first-order.jpg',
      createdDate: '2023-12-10'
    },
    {
      id: 4,
      title: 'Family Combo Deal',
      description: 'Flat ₹200 off on family combo meals',
      code: 'FAMILY200',
      discountType: 'fixed',
      discountValue: 200,
      minOrder: 1500,
      maxDiscount: 200,
      validFrom: '2024-01-01',
      validTill: '2024-02-29',
      status: 'Active',
      usageLimit: 150,
      usedCount: 89,
      category: 'Combos',
      applyType: 'Category',
      isAutoApply: false,
      bannerImage: '/images/offers/family-combo.jpg',
      createdDate: '2023-12-05'
    },
    {
      id: 5,
      title: 'Free Dessert Offer',
      description: 'Free dessert on orders above ₹1000',
      code: 'DESSERTFREE',
      discountType: 'free_item',
      discountValue: 0,
      minOrder: 1000,
      maxDiscount: 150,
      validFrom: '2024-01-01',
      validTill: '2024-01-20',
      status: 'Expired',
      usageLimit: 100,
      usedCount: 100,
      category: 'Desserts',
      applyType: 'Category',
      isAutoApply: false,
      bannerImage: '/images/offers/free-dessert.jpg',
      createdDate: '2023-11-30'
    },
    {
      id: 6,
      title: 'South Indian Meal Deal',
      description: '15% off on all South Indian meals',
      code: 'SOUTH15',
      discountType: 'percentage',
      discountValue: 15,
      minOrder: 400,
      maxDiscount: 150,
      validFrom: '2024-01-15',
      validTill: '2024-02-15',
      status: 'Upcoming',
      usageLimit: 80,
      usedCount: 0,
      category: 'South Indian',
      applyType: 'Category',
      isAutoApply: false,
      bannerImage: '/images/offers/south-indian.jpg',
      createdDate: '2024-01-10'
    },
    {
      id: 7,
      title: '₹100 Cashback',
      description: 'Get ₹100 cashback on all payments via UPI',
      code: 'UPI100',
      discountType: 'cashback',
      discountValue: 100,
      minOrder: 800,
      maxDiscount: 100,
      validFrom: '2024-01-01',
      validTill: '2024-01-25',
      status: 'Suspended',
      usageLimit: 50,
      usedCount: 12,
      category: 'All',
      applyType: 'Payment Method',
      isAutoApply: true,
      bannerImage: '/images/offers/cashback.jpg',
      createdDate: '2023-12-25'
    },
    {
      id: 8,
      title: 'Buy 1 Get 1 Free',
      description: 'Buy any pizza and get one free',
      code: 'B1G1',
      discountType: 'bogo',
      discountValue: 0,
      minOrder: 0,
      maxDiscount: 0,
      validFrom: '2024-01-05',
      validTill: '2024-01-15',
      status: 'Active',
      usageLimit: 60,
      usedCount: 42,
      category: 'Pizza',
      applyType: 'Category',
      isAutoApply: false,
      bannerImage: '/images/offers/bogo.jpg',
      createdDate: '2024-01-01'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [discountType, setDiscountType] = useState('percentage');

  const statusOptions = ['All', 'Active', 'Upcoming', 'Expired', 'Suspended'];
  const discountTypeOptions = ['All', 'percentage', 'fixed', 'cashback', 'free_item', 'bogo'];
  const categories = ['All', 'Chinese', 'South Indian', 'North Indian', 'Italian', 'Pizza', 'Burgers', 'Desserts', 'Beverages', 'Combos'];
  const applyTypes = ['All', 'Category', 'New Users', 'Payment Method', 'Specific Items'];

  const handleDeleteOffer = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(offer => offer.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setOffers(offers.map(offer => 
      offer.id === id ? { ...offer, status: newStatus } : offer
    ));
  };

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
    setShowEditModal(true);
  };

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setDiscountType(offer.discountType);
    setShowEditModal(true);
  };

//   const handleUpdateOffer = () => {
//     // In real app, make API call here
//     setShowEditModal(false);
//     setSelectedOffer(null);
//   };

  const handleAddOffer = () => {
    // In real app, make API call here
    setShowAddModal(false);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code "${code}" copied to clipboard!`);
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || offer.status === statusFilter;
    const matchesDiscountType = discountTypeFilter === 'All' || offer.discountType === discountTypeFilter;
    
    return matchesSearch && matchesStatus && matchesDiscountType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Upcoming': return '#2196F3';
      case 'Expired': return '#9E9E9E';
      case 'Suspended': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getDiscountTypeColor = (type) => {
    switch (type) {
      case 'percentage': return '#8B4513';
      case 'fixed': return '#D2691E';
      case 'cashback': return '#4CAF50';
      case 'free_item': return '#2196F3';
      case 'bogo': return '#9C27B0';
      default: return '#607D8B';
    }
  };

  const getDiscountTypeText = (type) => {
    switch (type) {
      case 'percentage': return 'Percentage';
      case 'fixed': return 'Fixed Amount';
      case 'cashback': return 'Cashback';
      case 'free_item': return 'Free Item';
      case 'bogo': return 'Buy 1 Get 1';
      default: return type;
    }
  };

  const getDiscountDisplay = (offer) => {
    switch (offer.discountType) {
      case 'percentage':
        return `${offer.discountValue}% OFF`;
      case 'fixed':
        return `₹${offer.discountValue} OFF`;
      case 'cashback':
        return `₹${offer.discountValue} Cashback`;
      case 'free_item':
        return 'Free Item';
      case 'bogo':
        return 'Buy 1 Get 1';
      default:
        return 'Discount';
    }
  };

  const calculateUsagePercentage = (used, limit) => {
    if (limit === 0) return 100;
    return Math.min((used / limit) * 100, 100);
  };

  const getStatusActions = (status) => {
    switch (status) {
      case 'Active':
        return [
          { label: 'Suspend', action: 'Suspended', color: '#F44336', icon: <FaTimes /> },
          { label: 'Expire', action: 'Expired', color: '#9E9E9E', icon: <FaTimes /> }
        ];
      case 'Upcoming':
        return [
          { label: 'Activate', action: 'Active', color: '#4CAF50', icon: <FaCheck /> },
          { label: 'Cancel', action: 'Suspended', color: '#F44336', icon: <FaTimes /> }
        ];
      case 'Suspended':
        return [
          { label: 'Activate', action: 'Active', color: '#4CAF50', icon: <FaCheck /> },
          { label: 'Expire', action: 'Expired', color: '#9E9E9E', icon: <FaTimes /> }
        ];
      case 'Expired':
        return [
          { label: 'Reactivate', action: 'Active', color: '#4CAF50', icon: <FaCheck /> }
        ];
      default:
        return [];
    }
  };

  const isOfferActive = (offer) => {
    const today = new Date().toISOString().split('T')[0];
    return offer.status === 'Active' && 
           today >= offer.validFrom && 
           today <= offer.validTill &&
           (offer.usageLimit === 0 || offer.usedCount < offer.usageLimit);
  };

  const offerStats = {
    total: offers.length,
    active: offers.filter(o => isOfferActive(o)).length,
    upcoming: offers.filter(o => o.status === 'Upcoming').length,
    expired: offers.filter(o => o.status === 'Expired').length,
    totalUsage: offers.reduce((sum, offer) => sum + offer.usedCount, 0),
    totalDiscount: offers.reduce((sum, offer) => {
      if (offer.discountType === 'percentage') {
        return sum + (offer.usedCount * (offer.maxDiscount || 0));
      } else if (offer.discountType === 'fixed' || offer.discountType === 'cashback') {
        return sum + (offer.usedCount * offer.discountValue);
      }
      return sum + (offer.usedCount * 100); // Estimate for free items/BOGO
    }, 0),
    avgUsage: offers.length > 0 ? (offers.reduce((sum, offer) => sum + offer.usedCount, 0) / offers.length).toFixed(1) : 0
  };

  return (
    <div className="manage-offers">
      <div className="page-header">
        <h1>
          <FaTag /> Manage Offers & Coupons
        </h1>
        <button 
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Create New Offer
        </button>
      </div>

      <div className="offer-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B4513' }}>
            <FaTicketAlt />
          </div>
          <div className="stat-content">
            <h3>Total Offers</h3>
            <div className="stat-value">{offerStats.total}</div>
            <div className="stat-description">Created offers</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4CAF50' }}>
            <FaCheck />
          </div>
          <div className="stat-content">
            <h3>Active Offers</h3>
            <div className="stat-value">{offerStats.active}</div>
            <div className="stat-description">Currently running</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#2196F3' }}>
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Usage</h3>
            <div className="stat-value">{offerStats.totalUsage}</div>
            <div className="stat-description">Times used</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#9C27B0' }}>
            <FaRupeeSign />
          </div>
          <div className="stat-content">
            <h3>Total Discount</h3>
            <div className="stat-value">₹{offerStats.totalDiscount.toLocaleString()}</div>
            <div className="stat-description">Given to customers</div>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search offers by title, code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <FaFilter />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map(option => (
              <option key={option} value={option}>{option} Status</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <FaPercent />
          <select value={discountTypeFilter} onChange={(e) => setDiscountTypeFilter(e.target.value)}>
            {discountTypeOptions.map(option => (
              <option key={option} value={option}>
                {option === 'All' ? 'All Types' : getDiscountTypeText(option)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredOffers.length === 0 ? (
        <div className="no-results">
          <div className="no-results-content">
            <FaTag className="no-results-icon" />
            <h3>No offers found</h3>
            <p>
              {searchQuery ? `No offers found for "${searchQuery}"` : 'No offers match the selected filters'}
            </p>
            {(searchQuery || statusFilter !== 'All' || discountTypeFilter !== 'All') && (
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setDiscountTypeFilter('All');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="offers-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Offer Details</th>
                <th>Discount</th>
                <th>Validity</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map(offer => {
                const statusActions = getStatusActions(offer.status);
                const usagePercentage = calculateUsagePercentage(offer.usedCount, offer.usageLimit);
                const isActive = isOfferActive(offer);
                
                return (
                  <tr key={offer.id}>
                    <td className="offer-id">#{offer.id}</td>
                    
                    <td className="offer-cell">
                      <div className="offer-info">
                        <div className="offer-image">
                          <img 
                            src={offer.bannerImage} 
                            alt={offer.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/offers/default-offer.jpg';
                            }}
                          />
                        </div>
                        <div className="offer-details">
                          <div className="offer-header">
                            <h4>{offer.title}</h4>
                            <div className="offer-code-container">
                              <span className="offer-code">{offer.code}</span>
                              <button 
                                className="copy-code-btn"
                                onClick={() => handleCopyCode(offer.code)}
                                title="Copy code"
                              >
                                <FaCopy />
                              </button>
                            </div>
                          </div>
                          <p className="offer-description">{offer.description}</p>
                          <div className="offer-meta">
                            <span className="offer-category">
                              <FaTag /> {offer.category}
                            </span>
                            <span className="offer-type">
                              {offer.applyType}
                            </span>
                            {offer.isAutoApply && (
                              <span className="auto-apply-badge">
                                Auto Apply
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="discount-cell">
                      <div className="discount-info">
                        <div className="discount-type" style={{ color: getDiscountTypeColor(offer.discountType) }}>
                          {getDiscountDisplay(offer)}
                        </div>
                        <div className="discount-conditions">
                          {offer.minOrder > 0 && (
                            <div className="condition">
                              Min order: ₹{offer.minOrder}
                            </div>
                          )}
                          {offer.maxDiscount > 0 && offer.discountType === 'percentage' && (
                            <div className="condition">
                              Max discount: ₹{offer.maxDiscount}
                            </div>
                          )}
                        </div>
                        <div className="discount-type-label">
                          {getDiscountTypeText(offer.discountType)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="validity-cell">
                      <div className="validity-info">
                        <div className="date-range">
                          <div className="date-item">
                            <FaCalendarAlt /> From: {offer.validFrom}
                          </div>
                          <div className="date-item">
                            <FaCalendarAlt /> Till: {offer.validTill}
                          </div>
                        </div>
                        {isActive ? (
                          <span className="validity-badge active">
                            Currently Active
                          </span>
                        ) : offer.status === 'Upcoming' ? (
                          <span className="validity-badge upcoming">
                            Starting Soon
                          </span>
                        ) : (
                          <span className="validity-badge expired">
                            Not Active
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="usage-cell">
                      <div className="usage-info">
                        <div className="usage-stats">
                          <span className="used-count">
                            {offer.usedCount} used
                          </span>
                          <span className="usage-limit">
                            {offer.usageLimit > 0 ? ` of ${offer.usageLimit}` : 'Unlimited'}
                          </span>
                        </div>
                        {offer.usageLimit > 0 && (
                          <div className="usage-progress">
                            <div 
                              className="progress-bar"
                              style={{ width: `${usagePercentage}%` }}
                            ></div>
                          </div>
                        )}
                        <div className="usage-percentage">
                          {offer.usageLimit > 0 ? `${Math.round(usagePercentage)}% used` : 'No limit'}
                        </div>
                      </div>
                    </td>
                    
                    <td className="status-cell">
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(offer.status) }}
                      >
                        {offer.status}
                      </span>
                    </td>
                    
                    <td className="actions-cell">
                      <div className="actions">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => handleViewOffer(offer)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEditOffer(offer)}
                          title="Edit Offer"
                        >
                          <FaEdit />
                        </button>
                        
                        {statusActions.map((action, index) => (
                          <button
                            key={index}
                            className="action-btn status-action-btn"
                            onClick={() => handleStatusChange(offer.id, action.action)}
                            title={action.label}
                            style={{ backgroundColor: action.color }}
                          >
                            {action.icon}
                          </button>
                        ))}
                        
                        <button 
                          className="action-btn share-btn"
                          onClick={() => alert(`Share offer: ${offer.code}`)}
                          title="Share Offer"
                        >
                          <FaShareAlt />
                        </button>
                        
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteOffer(offer.id)}
                          title="Delete Offer"
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

      {/* Add Offer Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Offer</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Offer Title *</label>
                  <input type="text" placeholder="e.g., Summer Special 50% OFF" required />
                </div>
                
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <div className="code-input">
                    <input type="text" placeholder="e.g., SUMMER50" required />
                    <button className="generate-code-btn">
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  placeholder="Describe the offer details for customers..." 
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type *</label>
                  <select 
                    value={discountType} 
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount Discount</option>
                    <option value="cashback">Cashback</option>
                    <option value="free_item">Free Item</option>
                    <option value="bogo">Buy 1 Get 1 Free</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>
                    {discountType === 'percentage' ? 'Discount Percentage *' : 
                     discountType === 'fixed' || discountType === 'cashback' ? 'Discount Amount *' : 
                     'Offer Value'}
                  </label>
                  <div className="discount-input">
                    {discountType === 'percentage' ? (
                      <>
                        <input type="number" placeholder="0" min="1" max="100" required />
                        <span className="input-symbol">%</span>
                      </>
                    ) : discountType === 'fixed' || discountType === 'cashback' ? (
                      <>
                        <FaRupeeSign className="currency-icon" />
                        <input type="number" placeholder="0" min="1" required />
                      </>
                    ) : (
                      <input type="text" placeholder="e.g., Free Dessert" />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Minimum Order Amount</label>
                  <div className="price-input">
                    <FaRupeeSign className="currency-icon" />
                    <input type="number" placeholder="0" min="0" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Maximum Discount</label>
                  <div className="price-input">
                    <FaRupeeSign className="currency-icon" />
                    <input type="number" placeholder="0" min="0" />
                    <small className="help-text">For percentage discounts only</small>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valid From *</label>
                  <input type="date" required />
                </div>
                
                <div className="form-group">
                  <label>Valid Till *</label>
                  <input type="date" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Usage Limit</label>
                  <input type="number" placeholder="0" min="0" />
                  <small className="help-text">Set 0 for unlimited usage</small>
                </div>
                
                <div className="form-group">
                  <label>Apply To</label>
                  <select defaultValue="All">
                    {applyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select defaultValue="All">
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Initial Status</label>
                  <select defaultValue="Active">
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Auto-apply to eligible orders</span>
                </label>
              </div>

              <div className="form-group">
                <label>Banner Image (Optional)</label>
                <div className="image-upload">
                  <div className="upload-placeholder">
                    <FaTag />
                    <span>Upload offer banner image</span>
                  </div>
                  <input type="file" accept="image/*" className="file-input" />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleAddOffer}
              >
                <FaCheck /> Create Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Offer Modal */}
      {showEditModal && selectedOffer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Offer Details</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedOffer(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="offer-detail-header">
                <div className="offer-banner">
                  <img src={selectedOffer.bannerImage} alt={selectedOffer.title} />
                </div>
                <div className="offer-header-info">
                  <h3>{selectedOffer.title}</h3>
                  <div className="offer-code-display">
                    <span className="code">{selectedOffer.code}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => handleCopyCode(selectedOffer.code)}
                    >
                      <FaCopy /> Copy Code
                    </button>
                  </div>
                  <p className="offer-detail-description">{selectedOffer.description}</p>
                </div>
              </div>

              <div className="offer-details-grid">
                <div className="detail-group">
                  <h4>Discount Information</h4>
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{getDiscountTypeText(selectedOffer.discountType)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Value:</span>
                    <span className="detail-value highlight">
                      {getDiscountDisplay(selectedOffer)}
                    </span>
                  </div>
                  {selectedOffer.minOrder > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">Min Order:</span>
                      <span className="detail-value">₹{selectedOffer.minOrder}</span>
                    </div>
                  )}
                  {selectedOffer.maxDiscount > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">Max Discount:</span>
                      <span className="detail-value">₹{selectedOffer.maxDiscount}</span>
                    </div>
                  )}
                </div>

                <div className="detail-group">
                  <h4>Validity & Usage</h4>
                  <div className="detail-item">
                    <span className="detail-label">Valid From:</span>
                    <span className="detail-value">{selectedOffer.validFrom}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Valid Till:</span>
                    <span className="detail-value">{selectedOffer.validTill}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Usage:</span>
                    <span className="detail-value">
                      {selectedOffer.usedCount} / {selectedOffer.usageLimit > 0 ? selectedOffer.usageLimit : 'Unlimited'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{selectedOffer.createdDate}</span>
                  </div>
                </div>

                <div className="detail-group">
                  <h4>Target & Status</h4>
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{selectedOffer.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Apply Type:</span>
                    <span className="detail-value">{selectedOffer.applyType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Auto Apply:</span>
                    <span className="detail-value">
                      {selectedOffer.isAutoApply ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span 
                      className="status-tag" 
                      style={{ backgroundColor: getStatusColor(selectedOffer.status) }}
                    >
                      {selectedOffer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="usage-chart">
                <h4>Usage Statistics</h4>
                <div className="chart-content">
                  <div className="chart-bar">
                    <div className="chart-label">Usage Progress</div>
                    <div className="chart-progress">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${calculateUsagePercentage(selectedOffer.usedCount, selectedOffer.usageLimit)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="chart-value">
                      {selectedOffer.usedCount} of {selectedOffer.usageLimit > 0 ? selectedOffer.usageLimit : '∞'}
                    </div>
                  </div>
                  
                  <div className="chart-stats">
                    <div className="stat-item">
                      <div className="stat-label">Remaining</div>
                      <div className="stat-value">
                        {selectedOffer.usageLimit > 0 
                          ? selectedOffer.usageLimit - selectedOffer.usedCount 
                          : 'Unlimited'}
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Success Rate</div>
                      <div className="stat-value">
                        {selectedOffer.usageLimit > 0 
                          ? `${((selectedOffer.usedCount / selectedOffer.usageLimit) * 100).toFixed(1)}%` 
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedOffer(null);
                }}
              >
                <FaTimes /> Close
              </button>
              <button 
                className="btn-primary"
                onClick={() => handleEditOffer(selectedOffer)}
              >
                <FaEdit /> Edit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOffers;
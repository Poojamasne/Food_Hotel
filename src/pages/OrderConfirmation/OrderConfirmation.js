import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaHome,
  FaUtensils,
  FaReceipt,
  FaPhone,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaPrint,
  FaWhatsapp,
  FaShareAlt,
  FaArrowLeft
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order details from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`https://backend-hotel-management.onrender.com/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOrderDetails(data.data);
          } else {
            setError(data.message || 'Failed to load order details');
          }
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Error loading order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, token, navigate]);

  // Helper function to safely format numbers
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    // Convert string to number if needed
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toFixed(2);
  };

  // Helper function to get safe values
  const getSafeValue = (value, defaultValue = '') => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share && orderDetails) {
      navigator.share({
        title: `Order ${getSafeValue(orderDetails.order_number)} Confirmation`,
        text: `Your order #${getSafeValue(orderDetails.order_number)} has been confirmed! Total: ₹${formatCurrency(orderDetails.final_amount)}`,
        url: window.location.href,
      });
    } else if (orderDetails) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleWhatsAppShare = () => {
    if (orderDetails) {
      const message = `Order Confirmation\nOrder ID: ${getSafeValue(orderDetails.order_number)}\nTotal: ₹${formatCurrency(orderDetails.final_amount)}\nThank you for your order!`;
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[getSafeValue(status)] || getSafeValue(status, 'Pending');
  };

  const getEstimatedTime = (orderType) => {
    return orderType === 'home' ? '30-45 minutes' : '15-20 minutes';
  };

  if (loading) {
    return (
      <div className="order-confirmation">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="order-confirmation">
        <div className="container">
          <div className="error-state">
            <h2>{error || 'Order Not Found'}</h2>
            <p>Unable to find order details. Please check your order history.</p>
            <Link to="/my-orders" className="back-home-btn">
              <FaHome /> View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safely extract values with defaults
  const orderNumber = getSafeValue(orderDetails.order_number, 'N/A');
  const finalAmount = formatCurrency(orderDetails.final_amount);
  const totalAmount = formatCurrency(orderDetails.total_amount);
  const deliveryCharge = formatCurrency(orderDetails.delivery_charge);
  const taxAmount = formatCurrency(orderDetails.tax_amount);
  const discountAmount = formatCurrency(orderDetails.discount_amount);
  const deliveryType = getSafeValue(orderDetails.delivery_type, 'home');
  const deliveryAddress = getSafeValue(orderDetails.delivery_address);
  const paymentMethod = getSafeValue(orderDetails.payment_method, 'cod');
  const paymentStatus = getSafeValue(orderDetails.payment_status, 'pending');
  const orderStatus = getSafeValue(orderDetails.order_status, 'pending');
  const userName = getSafeValue(orderDetails.user_name, 'Customer');
  const userPhone = getSafeValue(orderDetails.user_phone);
  const notes = getSafeValue(orderDetails.notes);

  return (
    <div className="order-confirmation">
      <div className="container">
        {/* Header */}
        <div className="confirmation-header">
          <Link to="/my-orders" className="back-link">
            <FaArrowLeft /> Back to My Orders
          </Link>
          <h1 className="page-title">Order Confirmation</h1>
        </div>

        {/* Success Message */}
        <div className="success-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <div className="success-content">
            <h2>Order Confirmed!</h2>
            <p className="success-message">
              Thank you for your order. We've received your order and will begin processing it right away.
            </p>
            <div className="order-id">
              <FaReceipt />
              <span>Order ID: <strong>{orderNumber}</strong></span>
            </div>
            <div className="order-status-badge">
              Status: <span className={`status ${orderStatus}`}>
                {getStatusText(orderStatus)}
              </span>
            </div>
          </div>
        </div>

        <div className="confirmation-content">
          {/* Left Column - Order Details */}
          <div className="order-details-section">
            {/* Order Summary */}
            <div className="details-card">
              <h3 className="section-title">
                <FaReceipt /> Order Summary
              </h3>
              <div className="order-summary">
                <div className="summary-row">
                  <span className="label">Order Type:</span>
                  <span className="value">
                    {deliveryType === 'home' ? 'Home Delivery' : 'Pickup'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="label">Order Date:</span>
                  <span className="value">{formatDate(orderDetails.created_at)}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Estimated {deliveryType === 'home' ? 'Delivery' : 'Ready'}:</span>
                  <span className="value">{getEstimatedTime(deliveryType)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="details-card">
              <h3 className="section-title">
                <FaUser /> Customer Information
              </h3>
              <div className="customer-info">
                <div className="info-row">
                  <FaUser className="info-icon" />
                  <div className="info-content">
                    <span className="label">Name</span>
                    <span className="value">{userName}</span>
                  </div>
                </div>
                {userPhone && (
                  <div className="info-row">
                    <FaPhone className="info-icon" />
                    <div className="info-content">
                      <span className="label">Phone</span>
                      <span className="value">{userPhone}</span>
                    </div>
                  </div>
                )}
                {deliveryType === 'home' && deliveryAddress && (
                  <div className="info-row">
                    <FaMapMarkerAlt className="info-icon" />
                    <div className="info-content">
                      <span className="label">Delivery Address</span>
                      <span className="value">{deliveryAddress}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="details-card">
              <h3 className="section-title">
                <FaCreditCard /> Payment Information
              </h3>
              <div className="payment-info">
                <div className="payment-method">
                  <span className="label">Payment Method:</span>
                  <span className="value">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' :
                     paymentMethod === 'card' ? 'Credit/Debit Card' :
                     paymentMethod === 'upi' ? 'UPI Payment' : 
                     paymentMethod || 'Not specified'}
                  </span>
                </div>
                <div className="payment-status">
                  <span className="label">Payment Status:</span>
                  <span className={`status-badge ${paymentStatus}`}>
                    {paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="details-card">
              <h3 className="section-title">Order Items</h3>
              <div className="order-items-list">
                {orderDetails.items && orderDetails.items.length > 0 ? (
                  orderDetails.items.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <div className="item-info">
                        <span className="item-name">{getSafeValue(item.product_name, 'Unknown Item')}</span>
                        <span className="item-quantity">× {getSafeValue(item.quantity, 1)}</span>
                      </div>
                      <span className="item-price">₹{formatCurrency((item.price || 0) * (item.quantity || 1))}</span>
                    </div>
                  ))
                ) : (
                  <p>No items found</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary & Actions */}
          <div className="summary-actions-section">
            {/* Price Summary */}
            <div className="price-summary-card">
              <h3 className="section-title">Price Summary</h3>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="price-row">
                  <span>Delivery Charge</span>
                  <span>
                    {parseFloat(deliveryCharge) === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="price-row">
                  <span>Tax</span>
                  <span>₹{taxAmount}</span>
                </div>
                {parseFloat(discountAmount) > 0 && (
                  <div className="price-row discount">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span className="total-amount">₹{finalAmount}</span>
                </div>
              </div>

              <div className="order-notes">
                <p className="note">
                  <FaClock /> Your order will be {deliveryType === 'home' ? 'delivered' : 'ready'} within {getEstimatedTime(deliveryType)}
                </p>
                {paymentMethod === 'cod' && (
                  <p className="note cash-note">
                    Please keep exact change ready for delivery
                  </p>
                )}
                {notes && (
                  <p className="note">
                    <strong>Special Instructions:</strong> {notes}
                  </p>
                )}
              </div>
            </div>

            {/* Order Actions */}
            <div className="actions-card">
              <h3 className="section-title">Order Actions</h3>
              <div className="action-buttons">
                <button className="action-btn print-btn" onClick={handlePrint}>
                  <FaPrint /> Print Receipt
                </button>
                <button className="action-btn whatsapp-btn" onClick={handleWhatsAppShare}>
                  <FaWhatsapp /> Share on WhatsApp
                </button>
                <button className="action-btn share-btn" onClick={handleShare}>
                  <FaShareAlt /> Share Order
                </button>
              </div>

              <div className="track-order">
                <h4>Track Your Order</h4>
                <p>You will receive updates about your order status.</p>
                <Link to="/my-orders" className="track-link">
                  Track Order Status
                </Link>
              </div>

              <div className="support-section">
                <h4>Need Help?</h4>
                <p>Call us at: <strong>+91 98765 43210</strong></p>
                <p>Email: <strong>support@zonixtec.com</strong></p>
                <Link to="/contact" className="support-link">
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Next Steps */}
            <div className="next-steps-card">
              <h3 className="section-title">What's Next?</h3>
              <div className="steps-timeline">
                <div className={`step ${['pending', 'confirmed', 'preparing', 'ready', 'delivered'].includes(orderStatus) ? 'active' : ''}`}>
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <h4>Order Confirmed</h4>
                    <p>We've received your order</p>
                  </div>
                </div>
                <div className={`step ${['confirmed', 'preparing', 'ready', 'delivered'].includes(orderStatus) ? 'active' : ''}`}>
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <h4>Preparing Your Food</h4>
                    <p>Our chefs are working on your order</p>
                  </div>
                </div>
                <div className={`step ${['ready', 'delivered'].includes(orderStatus) ? 'active' : ''}`}>
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <h4>{deliveryType === 'home' ? 'Out for Delivery' : 'Ready for Pickup'}</h4>
                    <p>{deliveryType === 'home' ? 'Your food is on the way!' : 'Your order is ready!'}</p>
                  </div>
                </div>
                <div className={`step ${orderStatus === 'delivered' ? 'active' : ''}`}>
                  <div className="step-icon">4</div>
                  <div className="step-content">
                    <h4>Order Completed</h4>
                    <p>Enjoy your meal!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="cta-buttons">
              <Link to="/menu" className="cta-btn order-again">
                <FaUtensils /> Order Again
              </Link>
              <Link to="/" className="cta-btn back-home">
                <FaHome /> Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Order Status Footer */}
        <div className="order-status-footer">
          <div className="status-update">
            <div className="status-icon">
              <FaCheckCircle />
            </div>
            <div className="status-content">
              <h4>Order Status Update</h4>
              <p>You'll receive notifications about your order status. Check your order history for updates.</p>
            </div>
          </div>
          <Link to="/my-orders" className="view-orders-btn">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
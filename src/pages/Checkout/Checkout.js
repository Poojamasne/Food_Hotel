import React, { useState } from "react";
import "./Checkout.css";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaMapMarkerAlt,
  FaHome,
  FaUtensils,
  FaCreditCard,
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle
} from "react-icons/fa";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState("delivery");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    tableNumber: "",
    specialInstructions: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getCartTotal();
  const deliveryCharge = orderType === "delivery" ? (subtotal > 500 ? 0 : 49) : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryCharge + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simple validation
    if (!formData.name.trim()) {
      alert("Please enter your name");
      setIsSubmitting(false);
      return;
    }

    if (!formData.phone.trim() || formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      setIsSubmitting(false);
      return;
    }

    if (orderType === "delivery" && !formData.address.trim()) {
      alert("Please enter your delivery address");
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      ...formData,
      orderType,
      paymentMethod,
      items: cartItems,
      subtotal,
      deliveryCharge,
      tax,
      total,
      orderDate: new Date().toISOString(),
      orderId: `ORD-${Date.now()}`
    };

    // Simulate API call
    setTimeout(() => {
      console.log("Order placed:", orderData);
      alert(`🎉 Order Confirmed!\nOrder ID: ${orderData.orderId}\nTotal: ₹${total.toFixed(2)}\nThank you for your order!`);
      
      // Clear cart and redirect
      clearCart();
      navigate("/");
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">
              <FaUtensils />
            </div>
            <h2>Your cart is empty</h2>
            <p>Add delicious items to your cart before checkout</p>
            <Link to="/menu" className="back-to-menu-btn">
              <FaArrowLeft /> Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <Link to="/cart" className="back-link">
            <FaArrowLeft /> Back to Cart
          </Link>
          <h1 className="page-title">Checkout</h1>
        </div>

        <div className="checkout-content">
          {/* Left Column - Customer Details */}
          <div className="customer-details-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h2 className="section-title">
                <FaUser /> Customer Information
              </h2>

              {/* Order Type Selection */}
              <div className="order-type-selection">
                <h3>Select Order Type</h3>
                <div className="type-options">
                  <button
                    type="button"
                    className={`type-option ${orderType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setOrderType('delivery')}
                  >
                    <FaHome />
                    <span>Home Delivery</span>
                    <small>30-45 mins • {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</small>
                  </button>
                  <button
                    type="button"
                    className={`type-option ${orderType === 'dine-in' ? 'active' : ''}`}
                    onClick={() => setOrderType('dine-in')}
                  >
                    <FaUtensils />
                    <span>Dine In</span>
                    <small>Ready in 15-20 mins</small>
                  </button>
                </div>
              </div>

              {/* Personal Details */}
              <div className="form-section">
                <h3>Personal Details</h3>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>

              {/* Address or Table Details */}
              <div className="form-section">
                {orderType === "delivery" ? (
                  <>
                    <h3>
                      <FaMapMarkerAlt /> Delivery Address
                    </h3>
                    <div className="form-group">
                      <label htmlFor="address">Complete Address *</label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House No., Street, Area, City, Pincode"
                        rows="3"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h3>
                      <FaUtensils /> Dine In Details
                    </h3>
                    <div className="form-group">
                      <label htmlFor="tableNumber">Table Number (Optional)</label>
                      <input
                        type="text"
                        id="tableNumber"
                        name="tableNumber"
                        value={formData.tableNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., Table 12, VIP Lounge"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Special Instructions */}
              <div className="form-section">
                <h3>Special Instructions</h3>
                <div className="form-group">
                  <label htmlFor="specialInstructions">Any special requests?</label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="e.g., Less spicy, extra sauce, allergies, etc."
                    rows="2"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h3>
                  <FaCreditCard /> Payment Method
                </h3>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div className="payment-content">
                      <span className="payment-title">Cash on Delivery</span>
                      <span className="payment-desc">Pay when you receive your order</span>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className="payment-content">
                      <span className="payment-title">Credit/Debit Card</span>
                      <span className="payment-desc">Pay securely with your card</span>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <div className="payment-content">
                      <span className="payment-title">UPI Payment</span>
                      <span className="payment-desc">Pay using PhonePe, GPay, etc.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Security Note */}
              <div className="security-note">
                <FaShieldAlt />
                <p>
                  <strong>Secure Checkout:</strong> Your payment information is encrypted and secure.
                  This is a demo site - no real transactions will occur.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h2 className="section-title">Order Summary</h2>
              
              {/* Order Items */}
              <div className="order-items">
                <h3>Your Items ({cartItems.length})</h3>
                <div className="items-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">× {item.quantity}</span>
                      </div>
                      <span className="item-price">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>
                <div className="price-row">
                  <span>Tax (5% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span className="total-amount">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="terms">
                <label className="terms-checkbox">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <Link to="/terms">Terms & Conditions</Link> and 
                    confirm that all information provided is accurate.
                  </span>
                </label>
              </div>

              {/* Place Order Button */}
              <button 
                type="submit" 
                className="place-order-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Place Order - ₹{total.toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
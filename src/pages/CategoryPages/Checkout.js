import React, { useState } from "react";
import "./Checkout.css";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaUtensils,
  FaCreditCard,
  FaShieldAlt,
  FaArrowLeft
} from "react-icons/fa";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [orderType, setOrderType] = useState("delivery"); // 'delivery' or 'dine-in'
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    tableNumber: "",
    specialInstructions: ""
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      ...formData,
      orderType,
      items: cartItems,
      subtotal,
      deliveryCharge,
      tax,
      total,
      orderDate: new Date().toISOString(),
      orderId: `ORD-${Date.now()}`
    };

    console.log("Order placed:", orderData);
    alert(`Order confirmed! Your Order ID: ${orderData.orderId}\nTotal: ₹${total.toFixed(2)}`);
    
    // Clear cart and redirect
    clearCart();
    // Redirect to confirmation page or home
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <p>Please add items to your cart before checkout</p>
        <Link to="/menu" className="back-to-menu">
          <FaArrowLeft /> Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">
          <FaCreditCard /> Checkout
        </h1>

        <div className="checkout-content">
          {/* Left Column - Order Details */}
          <div className="order-details">
            <div className="order-summary">
              <h2>
                <FaUtensils /> Your Order
              </h2>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x {item.quantity}</span>
                    </div>
                    <span className="item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="price-summary">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
                </div>
                <div className="price-row">
                  <span>Tax (5% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customer Details */}
          <div className="customer-details">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h2>
                <FaUser /> Customer Details
              </h2>

              {/* Order Type Selection */}
              <div className="order-type">
                <button
                  type="button"
                  className={`type-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('delivery')}
                >
                  <FaHome /> Home Delivery
                </button>
                <button
                  type="button"
                  className={`type-btn ${orderType === 'dine-in' ? 'active' : ''}`}
                  onClick={() => setOrderType('dine-in')}
                >
                  <FaUtensils /> Dine In
                </button>
              </div>

              {/* Form Fields */}
              <div className="form-group">
                <label>
                  <FaUser /> Full Name 
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FaPhone style={{ transform: "scaleX(-1)" }} /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              {orderType === "delivery" ? (
                <div className="form-group">
                  <label>
                    <FaMapMarkerAlt /> Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete delivery address"
                    rows="3"
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>
                    <FaUtensils /> Table Number
                  </label>
                  <input
                    type="text"
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    placeholder="Enter table number (optional)"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for your order"
                  rows="2"
                />
              </div>

              {/* Payment Info (Static for demo) */}
              <div className="payment-info">
                <h3>
                  <FaCreditCard /> Payment Information
                </h3>
                <p className="payment-note">
                  <FaShieldAlt /> 
                  <strong>Demo Mode:</strong> This is a demonstration checkout. 
                  No real payment will be processed.
                </p>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" defaultChecked />
                    Cash on Delivery
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    Card Payment
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    UPI Payment
                  </label>
                </div>
              </div>

              <button type="submit" className="submit-order-btn">
                Confirm Order - ₹{total.toFixed(2)}
              </button>

              <p className="terms-note">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
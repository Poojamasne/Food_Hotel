import React, { useState, useEffect } from "react";
import "./Cart.css";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaTag,
  FaLeaf,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaFire,
  FaChevronRight
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Sample cart data
const initialCartItems = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    description: "Creamy cottage cheese in rich tomato gravy",
    price: 299,
    originalPrice: 349,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Main Course",
    type: "veg",
    prepTime: "20 mins",
    tags: ["Best Seller", "Spicy"]
  },
  {
    id: 2,
    name: "Garlic Naan",
    description: "Soft bread with garlic butter and herbs",
    price: 79,
    quantity: 3,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Bread",
    type: "veg",
    tags: ["Fresh", "Hot"]
  },
  {
    id: 3,
    name: "Mango Lassi",
    description: "Refreshing yogurt drink with mango",
    price: 129,
    originalPrice: 159,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Beverages",
    type: "veg",
    prepTime: "5 mins",
    tags: ["Seasonal", "Refreshing"]
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie with ice cream",
    price: 189,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Desserts",
    type: "veg",
    tags: ["Sweet", "Premium"]
  }
];

// Promo codes
const promoCodes = [
  { code: "ZONIX10", discount: 10, minOrder: 500, description: "10% off on first order" },
  { code: "SAVE20", discount: 20, minOrder: 1000, description: "Flat ₹200 off" },
  { code: "WEEKEND15", discount: 15, minOrder: 800, description: "15% off on weekends" },
  { code: "FREEDEL", discount: 0, minOrder: 300, description: "Free delivery", type: "delivery" }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryType, setDeliveryType] = useState("home"); // 'home' or 'pickup'
  const [suggestedItems, setSuggestedItems] = useState([]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((sum, item) => {
    const itemDiscount = (item.originalPrice || item.price) - item.price;
    return sum + (itemDiscount * item.quantity);
  }, 0);
  
  const deliveryCharge = deliveryType === "home" ? 
    (subtotal > 500 ? 0 : 49) : 0;
  
  const tax = (subtotal - discount) * 0.05; // 5% GST
  const promoDiscount = appliedPromo ? 
    (appliedPromo.type === "delivery" ? 0 : 
     (subtotal - discount) * (appliedPromo.discount / 100)) : 0;
  
  const total = subtotal - discount - promoDiscount + deliveryCharge + tax;

  // Load suggested items
  useEffect(() => {
    const suggestions = [
      {
        id: 101,
        name: "Masala Dosa",
        price: 159,
        image: "https://images.unsplash.com/photo-1630383249896-424e482df2cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "South Indian",
        type: "veg"
      },
      {
        id: 102,
        name: "Veg Biryani",
        price: 249,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "Rice",
        type: "veg"
      },
      {
        id: 103,
        name: "Gulab Jamun",
        price: 99,
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "Desserts",
        type: "veg"
      }
    ];
    setSuggestedItems(suggestions);
  }, []);

  // Handle quantity changes
  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Apply promo code
  const applyPromo = () => {
    const promo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (promo) {
      if (subtotal >= promo.minOrder) {
        setAppliedPromo(promo);
      } else {
        alert(`Minimum order of ₹${promo.minOrder} required for this promo.`);
      }
    } else {
      alert("Invalid promo code. Please try again.");
    }
    setPromoCode("");
  };

  // Remove promo code
  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Add suggested item to cart
  const addSuggestedItem = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, 1);
    } else {
      setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    // In a real app, this would redirect to checkout page
    alert(`Order placed successfully! Total: ₹${total.toFixed(2)}`);
  };

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/" className="breadcrumb-link">
            <FaArrowLeft /> Back to Home
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Shopping Cart</span>
        </div>
      </div>

      <div className="container">
        <div className="cart-content">
          {/* Left Column - Cart Items */}
          <div className="cart-items-section">
            <div className="section-header">
              <h1>
                <FaShoppingCart /> Your Shopping Cart
                <span className="item-count">({cartItems.length} items)</span>
              </h1>
              <Link to="/menu" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">
                  <FaShoppingCart />
                </div>
                <h2>Your cart is empty</h2>
                <p>Add delicious items from our menu to get started!</p>
                <Link to="/menu" className="browse-menu-btn">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="cart-items-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item-card">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                        {item.type === "veg" && (
                          <span className="veg-indicator">
                            <FaLeaf />
                          </span>
                        )}
                      </div>

                      <div className="item-details">
                        <div className="item-header">
                          <h3>{item.name}</h3>
                          <button 
                            className="remove-btn"
                            onClick={() => removeItem(item.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <p className="item-description">{item.description}</p>

                        <div className="item-tags">
                          {item.tags?.map((tag, index) => (
                            <span key={index} className="item-tag">
                              {tag === "Best Seller" && <FaFire />}
                              {tag === "Spicy" && "🌶️"}
                              {tag}
                            </span>
                          ))}
                          {item.prepTime && (
                            <span className="item-tag time">
                              ⏱️ {item.prepTime}
                            </span>
                          )}
                        </div>

                        <div className="item-footer">
                          <div className="quantity-controls">
                            <button 
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <FaMinus />
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <FaPlus />
                            </button>
                          </div>

                          <div className="item-pricing">
                            {item.originalPrice && (
                              <span className="original-price">
                                ₹{item.originalPrice}
                              </span>
                            )}
                            <span className="current-price">
                              ₹{item.price}
                            </span>
                            <span className="item-total">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Options */}
                <div className="delivery-options">
                  <h3>
                    <FaTruck /> Delivery Options
                  </h3>
                  <div className="option-buttons">
                    <button 
                      className={`option-btn ${deliveryType === 'home' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('home')}
                    >
                      <FaTruck /> Home Delivery
                      <span className="option-detail">
                        {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                      </span>
                    </button>
                    <button 
                      className={`option-btn ${deliveryType === 'pickup' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('pickup')}
                    >
                      <FaShoppingCart /> Pickup from Restaurant
                      <span className="option-detail">Free</span>
                    </button>
                  </div>
                </div>

                {/* Suggested Items */}
                {suggestedItems.length > 0 && (
                  <div className="suggested-items">
                    <h3>
                      <FaStar /> You might also like
                    </h3>
                    <div className="suggested-grid">
                      {suggestedItems.map(item => (
                        <div key={item.id} className="suggested-card">
                          <img src={item.image} alt={item.name} />
                          <div className="suggested-details">
                            <h4>{item.name}</h4>
                            <p className="suggested-category">{item.category}</p>
                            <div className="suggested-footer">
                              <span className="suggested-price">₹{item.price}</span>
                              <button 
                                className="add-suggested-btn"
                                onClick={() => addSuggestedItem(item)}
                              >
                                <FaPlus /> Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h2>
                <FaCreditCard /> Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="price-row discount">
                    <span>Item Discount</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="price-row">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>

                <div className="price-row">
                  <span>Tax (5% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                {/* Promo Code Section */}
                <div className="promo-section">
                  {appliedPromo ? (
                    <div className="applied-promo">
                      <span className="promo-applied">
                        <FaTag /> {appliedPromo.code} Applied
                      </span>
                      <span className="promo-discount">
                        - ₹{promoDiscount.toFixed(2)}
                      </span>
                      <button 
                        className="remove-promo-btn"
                        onClick={removePromo}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="promo-input">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="promo-code-input"
                      />
                      <button 
                        className="apply-promo-btn"
                        onClick={applyPromo}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="total-section">
                <div className="total-row">
                  <span>Total Amount</span>
                  <span className="total-amount">₹{total.toFixed(2)}</span>
                </div>
                <p className="tax-info">Inclusive of all taxes</p>
              </div>

              {/* Checkout Button */}
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
                <FaChevronRight />
              </button>

              {/* Security Info */}
              <div className="security-info">
                <FaShieldAlt />
                <span>Secure Payment • SSL Encrypted</span>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods">
                <h4>Accepted Payment Methods</h4>
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">🏦</span>
                  <span className="payment-icon">📱</span>
                  <span className="payment-icon">💰</span>
                  <span className="payment-icon">💲</span>
                </div>
              </div>

              {/* Available Promo Codes */}
              <div className="available-promos">
                <h4>
                  <FaTag /> Available Offers
                </h4>
                <div className="promo-list">
                  {promoCodes.slice(0, 2).map((promo, index) => (
                    <div key={index} className="promo-item">
                      <span className="promo-code">{promo.code}</span>
                      <span className="promo-desc">{promo.description}</span>
                      <span className="promo-min">Min. ₹{promo.minOrder}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
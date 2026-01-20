import React, { useState, useEffect } from "react";
import "./Cart.css";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaTag,
  FaLeaf,
  FaDrumstickBite,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaFire,
  FaChevronRight,
  FaHome,
  FaUtensils,
  FaRupeeSign,
  FaSpinner
} from "react-icons/fa";

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    clearCart,
    addToCart,
    loading: cartLoading
  } = useCart();
  
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryType, setDeliveryType] = useState("home");
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [loadingSuggested, setLoadingSuggested] = useState(false);

  // Fetch suggested items when cart loads
  useEffect(() => {
    const fetchSuggestedItems = async () => {
      try {
        setLoadingSuggested(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch popular products or products from the same categories
        const response = await fetch('https://backend-hotel-management.onrender.com/api/products?limit=3', {
          headers: headers
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Transform API data to match your component structure
            const transformedItems = data.data.slice(0, 3).map(product => ({
              id: product.id,
              name: product.name,
              description: product.description || `${product.name} - Delicious dish`,
              price: product.price || 0,
              category: product.category_name || "Popular",
              type: product.category_slug?.includes('non-veg') ? "non-veg" : "veg",
              image: product.image ? 
                (product.image.startsWith('/') ? 
                  `https://backend-hotel-management.onrender.com${product.image}` : 
                  product.image) : 
                "/images/dishes/default-food.jpg",
              prepTime: "15-20 min"
            }));
            setSuggestedItems(transformedItems);
          }
        }
      } catch (error) {
        console.error('Error fetching suggested items:', error);
        // Use fallback data
        setSuggestedItems(getFallbackSuggestedItems());
      } finally {
        setLoadingSuggested(false);
      }
    };

    if (!cartLoading) {
      fetchSuggestedItems();
    }
  }, [cartLoading]);

  // Fallback suggested items
  const getFallbackSuggestedItems = () => {
    return [
      {
        id: 101,
        name: "Masala Dosa",
        price: 180,
        description: "Crispy rice crepe with potato filling",
        image: "/images/dishes/popular/Masala_Dosa.jpg",
        category: "South Indian",
        type: "veg",
        prepTime: "15 min"
      },
      {
        id: 102,
        name: "Veg Biryani",
        price: 249,
        description: "Aromatic basmati rice with vegetables",
        image: "/images/dishes/popular/veg-biryani.jpg",
        category: "Main Course",
        type: "veg",
        prepTime: "25 min"
      },
      {
        id: 103,
        name: "Gulab Jamun",
        price: 120,
        description: "Sweet milk balls in sugar syrup",
        image: "/images/dishes/popular/Gulab Jamun.jpg",
        category: "Desserts",
        type: "veg",
        prepTime: "10 min"
      }
    ];
  };

  // Promo codes
  const promoCodes = [
    { code: "WELCOME10", discount: 10, minOrder: 500, description: "10% off on first order" },
    { code: "SAVE20", discount: 20, minOrder: 1000, description: "Flat ₹200 off on ₹1000+" },
    { code: "FREEDEL", discount: 0, minOrder: 300, description: "Free delivery", type: "delivery" }
  ];

  // Calculate totals
  const subtotal = getCartTotal();
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

  // Handle quantity changes
  const handleQuantityChange = (id, change) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(id, newQuantity);
    }
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    if (window.confirm("Are you sure you want to remove this item from cart?")) {
      removeFromCart(id);
    }
  };

  // Apply promo code
  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      alert("Please enter a promo code");
      return;
    }

    const promo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (promo) {
      if (subtotal >= promo.minOrder) {
        setAppliedPromo(promo);
        alert(`Promo code "${promo.code}" applied successfully!`);
      } else {
        alert(`Minimum order of ₹${promo.minOrder} required for this promo.`);
      }
    } else {
      alert("Invalid promo code. Please try again.");
    }
    setPromoCode("");
  };

  // Remove promo code
  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Add suggested item to cart
  const handleAddSuggestedItem = async (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      handleQuantityChange(item.id, 1);
    } else {
      await addToCart(item, 1);
    }
    alert(`${item.name} added to cart!`);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add some items first!");
      return;
    }
    
    // Navigate to checkout page
    navigate("/checkout");
  };

  // Clear all items
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  // Continue shopping
  const handleContinueShopping = () => {
    navigate("/menu");
  };

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div className="cart-breadcrumb">
        <div className="container">
          <Link to="/" className="breadcrumb-link">
            <FaArrowLeft /> Back to Home
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Shopping Cart</span>
        </div>
      </div>

      <div className="container">
        {/* Loading state */}
        {cartLoading && (
          <div className="cart-loading">
            <FaSpinner className="spinner" />
            <p>Loading your cart...</p>
          </div>
        )}

        <div className="cart-content">
          {/* Left Column - Cart Items */}
          <div className="cart-items-section">
            <div className="cart-header">
              <h1 className="cart-title">
                <FaShoppingCart /> Your Shopping Cart
                <span className="item-count">({cartItems.length} items)</span>
              </h1>
              
              <div className="cart-actions-header">
                {cartItems.length > 0 && (
                  <button 
                    className="clear-cart-btn"
                    onClick={handleClearCart}
                  >
                    <FaTrash /> Clear Cart
                  </button>
                )}
                <button 
                  className="continue-shopping-btn"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {!cartLoading && cartItems.length === 0 ? (
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
            ) : !cartLoading && (
              <>
                {/* Cart Items List */}
                <div className="cart-items-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item-card">
                      <div className="item-image-container">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="item-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="image-fallback">
                                <span>${item.name.charAt(0)}</span>
                              </div>
                            `;
                          }}
                        />
                        <div className="item-type-indicator">
                          {item.type === "veg" ? (
                            <span className="veg-indicator">
                              <FaLeaf /> Veg
                            </span>
                          ) : (
                            <span className="nonveg-indicator">
                              <FaDrumstickBite /> Non-Veg
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="item-details">
                        <div className="item-header">
                          <div className="item-info">
                            <h3 className="item-name">{item.name}</h3>
                            <p className="item-description">{item.description}</p>
                            {item.category && (
                              <span className="item-category">{item.category}</span>
                            )}
                          </div>
                          <button 
                            className="remove-btn"
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        {item.tags && item.tags.length > 0 && (
                          <div className="item-tags">
                            {item.tags.includes("Popular") && (
                              <span className="tag popular-tag">
                                <FaFire /> Popular
                              </span>
                            )}
                            {item.tags.includes("Spicy") && (
                              <span className="tag spicy-tag">🌶️ Spicy</span>
                            )}
                            {item.tags.includes("Best Seller") && (
                              <span className="tag bestseller-tag">
                                <FaStar /> Best Seller
                              </span>
                            )}
                          </div>
                        )}

                        <div className="item-footer">
                          <div className="quantity-section">
                            <div className="quantity-controls">
                              <button 
                                className="quantity-btn decrease"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <FaMinus />
                              </button>
                              <span className="quantity-value">{item.quantity}</span>
                              <button 
                                className="quantity-btn increase"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <FaPlus />
                              </button>
                            </div>
                            <div className="quantity-label">
                              {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                            </div>
                          </div>

                          <div className="price-section">
                            <div className="price-details">
                              {item.originalPrice && item.originalPrice > item.price ? (
                                <>
                                  <span className="original-price">
                                    <FaRupeeSign /> {item.originalPrice}
                                  </span>
                                  <span className="discounted-price">
                                    <FaRupeeSign /> {item.price}
                                  </span>
                                  <span className="savings">
                                    Save <FaRupeeSign />{(item.originalPrice - item.price) * item.quantity}
                                  </span>
                                </>
                              ) : (
                                <span className="current-price">
                                  <FaRupeeSign /> {item.price}
                                </span>
                              )}
                            </div>
                            <div className="item-total">
                              <span className="total-label">Total:</span>
                              <span className="total-value">
                                <FaRupeeSign />{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Options */}
                <div className="delivery-options-section">
                  <h3 className="section-title">
                    <FaTruck /> Delivery Options
                  </h3>
                  <div className="delivery-buttons">
                    <button 
                      className={`delivery-btn ${deliveryType === 'home' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('home')}
                    >
                      <div className="delivery-btn-content">
                        <FaHome className="delivery-icon" />
                        <div className="delivery-info">
                          <span className="delivery-title">Home Delivery</span>
                          <span className="delivery-time">30-45 mins</span>
                        </div>
                        <span className="delivery-charge">
                          {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                        </span>
                      </div>
                    </button>
                    <button 
                      className={`delivery-btn ${deliveryType === 'pickup' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('pickup')}
                    >
                      <div className="delivery-btn-content">
                        <FaUtensils className="delivery-icon" />
                        <div className="delivery-info">
                          <span className="delivery-title">Pickup from Restaurant</span>
                          <span className="delivery-time">15-20 mins</span>
                        </div>
                        <span className="delivery-charge">FREE</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Suggested Items */}
                {!loadingSuggested && suggestedItems.length > 0 && (
                  <div className="suggested-items-section">
                    <h3 className="section-title">
                      <FaStar /> You might also like
                    </h3>
                    <div className="suggested-items-grid">
                      {suggestedItems.map(item => (
                        <div key={item.id} className="suggested-item-card">
                          <div className="suggested-image">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                  <div class="suggested-image-fallback">
                                    <span>${item.name.charAt(0)}</span>
                                  </div>
                                `;
                              }}
                            />
                            {item.type === "veg" ? (
                              <span className="suggested-veg">Veg</span>
                            ) : (
                              <span className="suggested-nonveg">Non-Veg</span>
                            )}
                          </div>
                          <div className="suggested-details">
                            <h4 className="suggested-name">{item.name}</h4>
                            <p className="suggested-desc">{item.description}</p>
                            <div className="suggested-meta">
                              <span className="suggested-category">{item.category}</span>
                              <span className="suggested-time">⏱️ {item.prepTime}</span>
                            </div>
                            <div className="suggested-footer">
                              <span className="suggested-price">
                                <FaRupeeSign /> {item.price}
                              </span>
                              <button 
                                className="add-suggested-btn"
                                onClick={() => handleAddSuggestedItem(item)}
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
            <div className="order-summary-card">
              <h2 className="summary-title">
                <FaCreditCard /> Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span className="price-label">Subtotal</span>
                  <span className="price-value">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="price-row discount-row">
                    <span className="price-label">Item Discount</span>
                    <span className="price-value discount-value">- ₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="price-row">
                  <span className="price-label">Delivery Charge</span>
                  <span className="price-value">
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>

                <div className="price-row">
                  <span className="price-label">Tax (5% GST)</span>
                  <span className="price-value">₹{tax.toFixed(2)}</span>
                </div>

                {/* Promo Code Section */}
                <div className="promo-section">
                  <h4 className="promo-title">
                    <FaTag /> Apply Promo Code
                  </h4>
                  
                  {appliedPromo ? (
                    <div className="applied-promo">
                      <div className="promo-info">
                        <span className="promo-code-badge">
                          <FaTag /> {appliedPromo.code}
                        </span>
                        <span className="promo-description">{appliedPromo.description}</span>
                      </div>
                      <div className="promo-actions">
                        <span className="promo-discount">
                           ₹{promoDiscount.toFixed(2)}
                        </span>
                        <button 
                          className="remove-promo-btn"
                          onClick={handleRemovePromo}
                          aria-label="Remove promo code"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="promo-input-container">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="promo-input"
                      />
                      <button 
                        className="apply-promo-btn"
                        onClick={handleApplyPromo}
                        disabled={!promoCode.trim()}
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {/* Available Promos */}
                  <div className="available-promos">
                    <h5>Available Offers:</h5>
                    <div className="promo-list">
                      {promoCodes.slice(0, 2).map((promo, index) => (
                        <div key={index} className="promo-item">
                          <span className="promo-item-code">{promo.code}</span>
                          <span className="promo-item-desc">{promo.description}</span>
                          <span className="promo-item-min">Min. ₹{promo.minOrder}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total Section */}
                <div className="total-section">
                  <div className="total-row">
                    <span className="total-label">Total Amount</span>
                    <span className="total-amount">₹{total.toFixed(2)}</span>
                  </div>
                  <p className="tax-info">Inclusive of all taxes</p>
                  
                  {total > 500 && (
                    <div className="savings-notice">
                      🎉 You saved ₹{(discount + promoDiscount).toFixed(2)} on this order!
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <button 
                  className={`checkout-btn ${cartItems.length === 0 ? 'disabled' : ''}`}
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  <span className="checkout-text">
                    Proceed to Checkout
                  </span>
                  <span className="checkout-price">
                    ₹{total.toFixed(2)}
                  </span>
                  <FaChevronRight className="checkout-arrow" />
                </button>

                {/* Security Info */}
                <div className="security-info">
                  <FaShieldAlt className="security-icon" />
                  <span className="security-text">100% Secure Payment • SSL Encrypted</span>
                </div>

                {/* Payment Methods */}
                <div className="payment-methods">
                  <h4 className="payment-title">Accepted Payment Methods</h4>
                  <div className="payment-icons">
                    <span className="payment-icon">💳 Credit/Debit Card</span>
                    <span className="payment-icon">🏦 Net Banking</span>
                    <span className="payment-icon">📱 UPI</span>
                    <span className="payment-icon">💰 Cash on Delivery</span>
                  </div>
                </div>

                {/* Order Info */}
                <div className="order-info">
                  <div className="info-item">
                    <span className="info-label">Estimated Delivery:</span>
                    <span className="info-value">
                      {deliveryType === 'home' ? '30-45 minutes' : 'Ready in 15-20 minutes'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Free Delivery:</span>
                    <span className="info-value">On orders above ₹500</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Need Help?</span>
                    <span className="info-value">
                      <Link to="/contact" className="help-link">Contact Support</Link>
                    </span>
                  </div>
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
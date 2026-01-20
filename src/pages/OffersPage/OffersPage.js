import React, { useState, useEffect } from "react";
import "./OffersPage.css";
import {
  FaFire,
  FaClock,
  FaTag,
  FaPercent,
  FaStar,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaLeaf,
  FaSpinner
} from "react-icons/fa";
import OfferCard from "../../components/OfferCard/OfferCard";
import OfferFilters from "../../components/OfferFilters/OfferFilters";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

// Format time left for offer
const formatTimeLeft = (validUntil) => {
  if (!validUntil) return "24:00:00";
  
  const now = new Date();
  const end = new Date(validUntil);
  const diff = end - now;
  
  if (diff <= 0) return "Expired";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Sample offers for fallback
const getSampleOffers = () => {
  return [
    {
      id: 1,
      title: "Family Feast Combo",
      description: "Complete meal for 4 people with 4 starters, 2 main course, rice, naan, and desserts.",
      originalPrice: 2499,
      discountedPrice: 1899,
      discountPercent: 24,
      category: "combo",
      tags: ["Popular", "Family"],
      timeLeft: formatTimeLeft(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      rating: 4.7,
      totalOrders: 254,
      isActive: true
    },
    {
      id: 2,
      title: "Weekend Special Buffet",
      description: "Unlimited buffet with live counters, desserts, and beverages. Saturday-Sunday only.",
      originalPrice: 899,
      discountedPrice: 699,
      discountPercent: 22,
      category: "buffet",
      tags: ["Weekend", "Buffet"],
      timeLeft: formatTimeLeft(new Date(Date.now() + 12 * 60 * 60 * 1000)),
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      rating: 4.9,
      totalOrders: 189,
      isActive: true
    },
  ];
};

const OffersPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [allOffers, setAllOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { token } = useAuth();

  // Fetch offers from API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('https://backend-hotel-management.onrender.com/api/offers', {
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch offers: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match your component structure
          const transformedOffers = data.data.map(offer => ({
            id: offer.id,
            title: offer.title || offer.name,
            description: offer.description || "Special offer available for limited time",
            originalPrice: offer.original_price || offer.price || 0,
            discountedPrice: offer.discounted_price || offer.offer_price || 0,
            discountPercent: calculateDiscountPercent(
              offer.original_price || offer.price,
              offer.discounted_price || offer.offer_price
            ),
            category: offer.category || "offer",
            tags: offer.tags || ["Special Offer"],
            timeLeft: formatTimeLeft(offer.valid_until),
            image: getImagePath(offer.image),
            isVeg: offer.is_veg !== false,
            rating: offer.rating || 4.5,
            totalOrders: offer.total_orders || Math.floor(Math.random() * 500) + 100,
            validUntil: offer.valid_until,
            isActive: checkIfOfferActive(offer.valid_until)
          }));
          
          // Filter only active offers
          const activeOffers = transformedOffers.filter(offer => offer.isActive);
          setAllOffers(activeOffers);
        } else {
          throw new Error(data.message || 'Failed to load offers');
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError(err.message);
        // Fallback to sample data if API fails
        setAllOffers(getSampleOffers());
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [token]);

  // Calculate discount percentage
  const calculateDiscountPercent = (original, discounted) => {
    if (!original || !discounted || original <= discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  // Check if offer is still valid
  const checkIfOfferActive = (validUntil) => {
    if (!validUntil) return true;
    const now = new Date();
    const validDate = new Date(validUntil);
    return now <= validDate;
  };


  // Get image path
 // Get image path - Updated version
const getImagePath = (apiImagePath) => {
  console.log("getImagePath called with:", apiImagePath);
  
  if (!apiImagePath || apiImagePath === "null" || apiImagePath === "undefined") {
    console.log("No image path provided, using placeholder");
    return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  }
  
  // If it's already a full URL
  if (apiImagePath.startsWith('http')) {
    console.log("Full URL detected:", apiImagePath);
    return apiImagePath;
  }
  
  // If it starts with /, prepend backend URL
  if (apiImagePath.startsWith('/')) {
    const fullUrl = `https://backend-hotel-management.onrender.com${apiImagePath}`;
    console.log("Relative path converted to:", fullUrl);
    return fullUrl;
  }
  
  // If it's just a filename
  const fullUrl = `https://backend-hotel-management.onrender.com/uploads/offers/${apiImagePath}`;
  console.log("Filename converted to:", fullUrl);
  return fullUrl;
};

  // 24-hour countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              clearInterval(timer);
              return { hours: 0, minutes: 0, seconds: 0 };
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const filteredOffers = activeFilter === "all" 
    ? allOffers 
    : allOffers.filter(offer => offer.category === activeFilter);

  // Get first 3 offers for featured section
  const featuredOffers = allOffers.slice(0, 3);

  // Helper function to create cart item from offer
  const createCartItemFromOffer = (offer) => {
    return {
      id: offer.id,
      name: offer.title,
      price: offer.discountedPrice,
      originalPrice: offer.originalPrice,
      description: offer.description,
      image: offer.image,
      type: offer.isVeg ? "veg" : "non-veg",
      category: "offers",
      tags: [...offer.tags, "Special Offer"],
      discountPercent: offer.discountPercent
    };
  };

  // Check if offer is in cart
  const isOfferInCart = (offerId) => {
    return cartItems.some(item => item.id === offerId);
  };

  // Get quantity from cart
  const getQuantityFromCart = (offerId) => {
    const item = cartItems.find(item => item.id === offerId);
    return item ? item.quantity : 0;
  };

  

  // Handle add to cart for featured items
  const handleAddFeaturedToCart = (offer) => {
    const cartItem = createCartItemFromOffer(offer);
    addToCart(cartItem, 1);
    alert(`${offer.title} added to cart!`);
  };

  // Handle cart controls for featured items
  const handleFeaturedIncrement = (offerId) => {
    const currentQty = getQuantityFromCart(offerId);
    updateQuantity(offerId, currentQty + 1);
  };

  const handleFeaturedDecrement = (offerId) => {
    const currentQty = getQuantityFromCart(offerId);
    if (currentQty > 1) {
      updateQuantity(offerId, currentQty - 1);
    } else {
      removeFromCart(offerId);
    }
  };

  // Handle promo code
  const handleCopyCode = () => {
    navigator.clipboard.writeText("ZONIX10");
    alert("Promo code ZONIX10 copied to clipboard!");
  };

  const handleOrderNow = () => {
    alert("Redirecting to menu...");
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Format time for display
  const formatDisplayTime = (time) => {
    return {
      hours: time.hours.toString().padStart(2, '0'),
      minutes: time.minutes.toString().padStart(2, '0'),
      seconds: time.seconds.toString().padStart(2, '0')
    };
  };

  const displayTime = formatDisplayTime(timeLeft);

  return (
    <div className="offers-page">
      {/* Hero Section */}
      <div className="offers-hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              <FaFire className="fire-icon" />
              Today's Hot Deals
            </h1>
            <p className="hero-subtitle">
              Exclusive discounts and offers available only today! Grab them before they're gone.
            </p>
            <div className="countdown-banner">
              <div className="countdown-item">
                <span className="countdown-number">{displayTime.hours}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-number">{displayTime.minutes}</span>
                <span className="countdown-label">Minutes</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-number">{displayTime.seconds}</span>
                <span className="countdown-label">Seconds</span>
              </div>
              <div className="countdown-text">Left for Today's Offers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <FaSpinner className="loading-spinner" />
            <p>Loading amazing offers...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-message">
            <h3>Unable to load offers</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Featured Offers */}
        {!loading && !error && featuredOffers.length > 0 && (
          <section className="featured-offers">
            <h2>
              <FaStar className="section-icon" />
              Featured Offers
            </h2>
            <p className="section-subtitle">Most popular deals chosen by our customers</p>
            <div className="featured-cards">
              {featuredOffers.map((offer, index) => {
                const isInCart = isOfferInCart(offer.id);
                const quantity = getQuantityFromCart(offer.id);

                return (
                  <div key={offer.id} className="featured-card">
                    <div className="featured-badge">#{index + 1} Top Offer</div>
<div className="featured-image">
  <img 
    src={offer.image} 
    alt={offer.title}
    onError={(e) => {
      console.log("Image failed to load:", offer.image);
      e.target.onerror = null;
      e.target.src = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }}
  />
  <div className="featured-overlay">
    <span className="discount-badge">{offer.discountPercent}% OFF</span>
    {offer.isVeg && (
      <span className="veg-indicator">
        <FaLeaf /> Veg
      </span>
    )}
  </div>
</div>
                    <div className="featured-content">
                      <h3>{offer.title}</h3>
                      <p>{offer.description}</p>
                      <div className="price-section">
                        <span className="original-price">₹{offer.originalPrice}</span>
                        <span className="discounted-price">₹{offer.discountedPrice}</span>
                        <span className="save-amount">
                          Save ₹{offer.originalPrice - offer.discountedPrice}
                        </span>
                      </div>
                      <div className="featured-meta">
                        <span className="rating">
                          <FaStar /> {offer.rating}
                        </span>
                        <span className="orders">
                          <FaShoppingCart /> {offer.totalOrders} orders
                        </span>
                        <span className="time-left">
                          <FaClock /> {offer.timeLeft}
                        </span>
                      </div>
                      
                      {/* Featured Cart Controls */}
                      {isInCart ? (
                        <div className="cart-actions">
                          <button 
                            className="cart-btn"
                            onClick={() => handleFeaturedDecrement(offer.id)}
                          >
                            <FaMinus />
                          </button>
                          <span className="cart-quantity">{quantity}</span>
                          <button 
                            className="cart-btn"
                            onClick={() => handleFeaturedIncrement(offer.id)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="featured-button"
                          onClick={() => handleAddFeaturedToCart(offer)}
                        >
                          <FaShoppingCart /> Grab This Deal
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* No Offers Message */}
        {!loading && !error && allOffers.length === 0 && (
          <div className="no-offers-message">
            <FaTag className="no-offers-icon" />
            <h3>No Active Offers Available</h3>
            <p>Check back later for amazing deals and discounts!</p>
            <p className="offer-expiry-note">
              Offers typically refresh daily at 12:00 AM
            </p>
          </div>
        )}

        {/* Special Promo Banner */}
        <div className="special-promo">
          <div className="promo-content">
            <div className="promo-text">
              <h3>
                <FaPercent className="promo-icon" />
                Extra 10% Off on First Order!
              </h3>
              <p>Use code: <span className="promo-code">ZONIX10</span> at checkout</p>
              <p className="promo-details">Valid for online orders only. Minimum order ₹500.</p>
            </div>
            <div className="promo-actions">
              <button 
                className="copy-code-btn"
                onClick={handleCopyCode}
              >
                Copy Code
              </button>
              <button 
                className="order-now-btn"
                onClick={handleOrderNow}
              >
                Order Now
              </button>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="terms-section">
          <h3>Offer Terms & Conditions</h3>
          <ul className="terms-list">
            <li>All offers are valid only for 24 hours from the time of display.</li>
            <li>Timer shows exact time remaining for each offer.</li>
            <li>Discounts cannot be combined with other offers.</li>
            <li>Offers are applicable for dine-in, takeaway, and delivery unless specified.</li>
            <li>Vegetarian symbol indicates 100% vegetarian dishes.</li>
            <li>Restaurant reserves the right to modify or cancel offers without prior notice.</li>
            <li>Taxes and service charges apply as per standard rates.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
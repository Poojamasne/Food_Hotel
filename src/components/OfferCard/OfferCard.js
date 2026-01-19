import React from "react";
import "./OfferCard.css";
import { 
  FaClock, 
  FaTag, 
  FaShoppingCart, 
  FaPlus, 
  FaMinus, 
  FaLeaf, 
  FaFire,
  FaHeart,
  FaStar
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const OfferCard = ({ offer, viewMode = "grid" }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

  // Ensure tags is always an array
  const getTagsArray = () => {
    if (!offer.tags) return ["Special Offer"];
    
    if (Array.isArray(offer.tags)) {
      return [...offer.tags, "Special Offer"];
    }
    
    if (typeof offer.tags === 'string') {
      // If tags is a comma-separated string
      return [...offer.tags.split(',').map(tag => tag.trim()), "Special Offer"];
    }
    
    return ["Special Offer"];
  };

  // Get safe tags array
  const tags = getTagsArray();

  // Check if this offer item is already in cart
  const cartItem = cartItems.find(item => item.id === offer.id);
  const isInCart = !!cartItem;
  const quantity = cartItem ? cartItem.quantity : 1;

  // Format time left to handle expired offers
  const formatTimeLeft = () => {
    if (!offer.timeLeft) return "24:00:00";
    
    // If timeLeft is already a string like "HH:MM:SS"
    if (typeof offer.timeLeft === 'string') {
      return offer.timeLeft;
    }
    
    // If timeLeft is a number (seconds)
    if (typeof offer.timeLeft === 'number') {
      const hours = Math.floor(offer.timeLeft / 3600);
      const minutes = Math.floor((offer.timeLeft % 3600) / 60);
      const seconds = offer.timeLeft % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return "24:00:00";
  };

  const timeLeft = formatTimeLeft();

  // Check if offer is expiring soon (less than 1 hour)
  const isExpiringSoon = () => {
    const timeParts = timeLeft.split(':');
    const hours = parseInt(timeParts[0]);
    return !isNaN(hours) && hours < 1 && timeLeft !== "Expired";
  };

  const handleAddToCart = () => {
    const cartItemObject = {
      id: offer.id,
      name: offer.title || "Special Offer",
      price: offer.discountedPrice || offer.offer_price || 0,
      originalPrice: offer.originalPrice || offer.price || 0,
      description: offer.description || "Special offer item",
      image: offer.image || "/images/default-offer.jpg",
      type: offer.isVeg !== false ? "veg" : "non-veg",
      category: "offers",
      tags: tags,
      discountPercent: offer.discountPercent || 0
    };

    addToCart(cartItemObject, 1);
  };

  const handleIncrement = () => {
    updateQuantity(offer.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(offer.id, quantity - 1);
    } else {
      removeFromCart(offer.id);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Cart actions component for consistency with menu page
  const CartActions = () => {
    if (isInCart) {
      return (
        <div className="cart-actions">
          <button 
            onClick={handleDecrement}
            className="cart-btn"
            aria-label="Decrease quantity"
          >
            <FaMinus />
          </button>
          <span className="cart-quantity">{quantity}</span>
          <button 
            onClick={handleIncrement}
            className="cart-btn"
            aria-label="Increase quantity"
          >
            <FaPlus />
          </button>
        </div>
      );
    } else {
      return (
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          <FaShoppingCart /> Add to Cart
        </button>
      );
    }
  };

  // Format price safely
  const formatPrice = (price) => {
    if (!price && price !== 0) return "0";
    return price.toString();
  };

  // Calculate save amount safely
  const calculateSaveAmount = () => {
    const original = offer.originalPrice || offer.price || 0;
    const discounted = offer.discountedPrice || offer.offer_price || 0;
    return original - discounted;
  };

  const saveAmount = calculateSaveAmount();

  return (
    <div className={`offer-card ${viewMode} ${isInCart ? 'in-cart' : ''} ${isExpiringSoon() ? 'expiring-soon' : ''}`}>
      {/* Badges Header */}
      <div className="card-header">
        <div className="badges">
          <span className="discount-badge">
            <FaTag /> {offer.discountPercent || 0}% OFF
          </span>
          {offer.isVeg !== false && (
            <span className="veg-badge">
              <FaLeaf /> Veg
            </span>
          )}
          {(offer.rating >= 4.7 || offer.is_bestseller) && (
            <span className="popular-badge">
              <FaFire /> Popular
            </span>
          )}
        </div>
        
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart />
        </button>
      </div>

      {/* Image with Time Left */}
      <div className="card-image">
        <img 
          src={offer.image || "/images/default-offer.jpg"} 
          alt={offer.title || "Special Offer"} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default-offer.jpg";
          }}
        />
        <div className="time-left">
          <FaClock /> {timeLeft}
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="card-title">{offer.title || "Special Offer"}</h3>
        <p className="card-description">{offer.description || "Limited time offer"}</p>

        {/* Rating and Orders */}
        <div className="card-meta">
          <div className="rating">
            <FaStar /> {offer.rating || 4.0}
            <span className="rating-count"> ({offer.totalOrders || 0})</span>
          </div>
          <div className="orders">
            <FaShoppingCart /> {offer.totalOrders || 0} orders
          </div>
        </div>

        {/* Price Section */}
        <div className="price-section">
          <div className="price-left">
            <div className="original-price">
              <span className="price-label">Original:</span>
              <span className="price-value">₹{formatPrice(offer.originalPrice || offer.price)}</span>
            </div>
            <div className="discounted-price">
              <span className="price-label">Offer Price:</span>
              <span className="price-value">₹{formatPrice(offer.discountedPrice || offer.offer_price)}</span>
            </div>
            {saveAmount > 0 && (
              <div className="save-amount">
                Save ₹{saveAmount}
              </div>
            )}
          </div>
          
          {/* For list view, show quantity selector */}
          {viewMode === "list" && !isInCart && (
            <div className="quantity-selector">
              <button className="quantity-btn" onClick={handleDecrement}>
                -
              </button>
              <span className="quantity-value">1</span>
              <button className="quantity-btn" onClick={handleIncrement}>
                +
              </button>
            </div>
          )}
        </div>

        {/* Card Actions - Add to Cart / Cart Controls */}
        <div className="card-actions">
          <CartActions />
          {viewMode === "list" && (
            <button className="view-details-btn">
              View Details
            </button>
          )}
        </div>

        {/* Tags - Safely render tags */}
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
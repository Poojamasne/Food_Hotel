import React, { useState } from "react";
import "./OfferCard.css";
import { 
  FaClock, 
  FaLeaf, 
  FaShoppingCart, 
  FaHeart, 
  FaStar, 
  FaTag,
  FaFire
} from "react-icons/fa";

const OfferCard = ({ offer, viewMode = "grid" }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // In a real app, this would dispatch to Redux or context
    console.log("Added to cart:", offer, "Quantity:", quantity);
    alert(`${offer.title} added to cart!`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const calculateSavePercentage = () => {
    return Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100);
  };

  return (
    <div className={`offer-card ${viewMode}`}>
      {/* Card Header with Badges */}
      <div className="card-header">
        <div className="badges">
          <span className="discount-badge">
            <FaTag /> {calculateSavePercentage()}% OFF
          </span>
          {offer.isVeg && (
            <span className="veg-badge">
              <FaLeaf /> Pure Veg
            </span>
          )}
          {offer.tags.includes("Popular") && (
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

      {/* Card Image */}
      <div className="card-image">
        <img src={offer.image} alt={offer.title} />
        <div className="time-left">
          <FaClock /> Ends in: {offer.timeLeft}
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="card-title">{offer.title}</h3>
        
        <p className="card-description">{offer.description}</p>

        {/* Rating and Orders */}
        <div className="card-meta">
          <div className="rating">
            <FaStar /> {offer.rating}
            <span className="rating-count">({offer.totalOrders})</span>
          </div>
          <div className="orders">
            <FaShoppingCart /> {offer.totalOrders} orders
          </div>
        </div>

        {/* Price Section */}
        <div className="price-section">
          <div className="price-left">
            <div className="original-price">
              <span className="price-label">Original:</span>
              <span className="price-value">₹{offer.originalPrice}</span>
            </div>
            <div className="discounted-price">
              <span className="price-label">Discounted:</span>
              <span className="price-value">₹{offer.discountedPrice}</span>
            </div>
            <div className="save-amount">
              Save ₹{offer.originalPrice - offer.discountedPrice}
            </div>
          </div>

          {/* Quantity Selector (only in list view) */}
          {viewMode === "list" && (
            <div className="quantity-selector">
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            <FaShoppingCart />
            Add to Cart
            {viewMode === "list" && ` (${quantity})`}
          </button>
          
          {viewMode === "list" && (
            <button className="view-details-btn">
              View Details
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="card-tags">
          {offer.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
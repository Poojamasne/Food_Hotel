import React, { useState } from "react";
import "./CategoryItemCard.css";
import { FaStar, FaShoppingCart, FaHeart, FaLeaf, FaDrumstickBite, FaPlus, FaMinus } from "react-icons/fa";

const CategoryItemCard = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = () => {
    setIsInCart(true);
    // In real app, this would dispatch to Redux/Context
    console.log(`Added ${quantity} ${item.name}(s) to cart`);
    alert(`Added ${quantity} ${item.name}(s) to cart!`);
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    } else {
      setIsInCart(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getCategoryIcon = () => {
    if (item.category === "veg") return <FaLeaf />;
    if (item.category === "non-veg") return <FaDrumstickBite />;
    return null;
  };

  return (
    <div className="menu-card">
      {/* Badges */}
      <div className="card-badges">
        {item.rating >= 4.5 && (
          <span className="badge popular">
            Popular
          </span>
        )}
        {item.category === "veg" && (
          <span className="badge veg">
            <FaLeaf /> Veg
          </span>
        )}
        {item.category === "non-veg" && (
          <span className="badge non-veg">
            <FaDrumstickBite /> Non-Veg
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={toggleFavorite}
      >
        <FaHeart />
      </button>

      {/* Image */}
      <div className="menu-card-img">
        <img 
          src={item.image} 
          alt={item.name}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
          }}
        />
      </div>

      {/* Content */}
      <div className="menu-card-content">
        <div className="card-header">
          <h3>{item.name}</h3>
          {item.rating && (
            <span className="rating">
              <FaStar /> {item.rating}
            </span>
          )}
        </div>

        <p className="description">{item.description}</p>

        {/* Tags */}
        {item.tags && (
          <div className="item-tags">
            {item.tags.map((tag, index) => (
              <span key={index} className={`tag ${tag.toLowerCase()}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="menu-card-footer">
          <div className="price-section">
            <span className="price">₹{item.price}</span>
            {item.originalPrice && (
              <span className="original-price">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          {isInCart ? (
            <div className="cart-actions">
              <button onClick={handleDecrement}>
                <FaMinus />
              </button>
              <span>{quantity}</span>
              <button onClick={handleIncrement}>
                <FaPlus />
              </button>
            </div>
          ) : (
            <button
              className="add-to-cart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryItemCard;
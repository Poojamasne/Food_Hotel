import React, { useState } from "react";
import "./CategoryItemCard.css";
import { FaStar, FaHeart, FaLeaf, FaDrumstickBite, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../../../context/CartContext"; 

const CategoryItemCard = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart, cartItems, updateQuantity } = useCart(); 

  
  const isInCart = cartItems.some(cartItem => cartItem.id === item.id);
  
  const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
  const currentQuantity = cartItem ? cartItem.quantity : 1;

  const handleAddToCart = () => {
    addToCart({ ...item }, quantity); 
  };

  const handleIncrement = () => {
    if (isInCart) {
    
      updateQuantity(item.id, currentQuantity + 1);
    } else {
     
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (isInCart) {
      if (currentQuantity > 1) {
        updateQuantity(item.id, currentQuantity - 1);
      } else {
       
        updateQuantity(item.id, 0);
      }
    } else {
      if (quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
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
              <span>{currentQuantity}</span>
              <button onClick={handleIncrement}>
                <FaPlus />
              </button>
            </div>
          ) : (
            <div className="add-to-cart-container">
              <div className="quantity-control">
              </div>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryItemCard;
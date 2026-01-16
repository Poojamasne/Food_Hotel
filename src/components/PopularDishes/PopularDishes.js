import React from "react";
import "./PopularDishes.css";
import { useCart } from "../../context/CartContext";
import { 
   FaPlus, 
  FaMinus, 
} from "react-icons/fa";

const PopularDishes = () => {
  const { addToCart, updateQuantity, getItemCount } = useCart();

  const popularDishes = [
    // ... your existing dishes array
  ];

  const handleAddToCart = (dish) => {
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      description: dish.description,
      image: dish.image,
      category: dish.category,
      type: "veg" 
    }, 1);
  };

  const handleQuantityChange = (dish, change) => {
    const currentCount = getItemCount(dish.id);
    const newQuantity = Math.max(0, currentCount + change);
    
    if (newQuantity === 0) {
      updateQuantity(dish.id, 0);
    } else {
      updateQuantity(dish.id, newQuantity);
    }
  };

  return (
    <section className="popular-dishes">
      <div className="container">

        <div className="dishes-grid">
          {popularDishes.map((dish) => {
            const cartQuantity = getItemCount(dish.id);
            
            return (
              <div key={dish.id} className="dish-card">
               
                
                <div className="dish-footer">
                  <div className="price-section">
              
                  </div>
                  
                  {cartQuantity > 0 ? (
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(dish, -1)}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity-value">{cartQuantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(dish, 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(dish)}
                    >
                      <FaPlus />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularDishes;
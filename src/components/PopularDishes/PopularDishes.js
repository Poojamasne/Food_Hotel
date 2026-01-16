import React from "react";
import "./PopularDishes.css";
import { 
  FaArrowRight, FaStar, FaFire, FaLeaf, FaClock, FaPlus, FaRupeeSign 
} from "react-icons/fa";

const PopularDishes = () => {
  const popularDishes = [
    { 
      id: 1, 
      name: "Paneer Butter Masala", 
      category: "North Indian", 
      price: 280, 
      originalPrice: 320,
      rating: 4.8, 
      reviews: 156,
      description: "Cottage cheese in rich creamy tomato gravy with butter",
      prepTime: "20 min",
      image: "/images/dishes/popular/panner_butter_masala.jpg",
      gradient: "linear-gradient(135deg, #FF9800, #FF5722)",
      spicy: "Mild"
    },
    { 
      id: 2, 
      name: "Masala Dosa", 
      category: "South Indian", 
      price: 180, 
      originalPrice: 220,
      rating: 4.9, 
      reviews: 203,
      description: "Crispy rice crepe stuffed with spiced potato filling",
      prepTime: "15 min",
      image: "/images/dishes/popular/Masala_Dosa.jpg",
      gradient: "linear-gradient(135deg, #9C27B0, #673AB7)",
      spicy: "Medium"
    },
    { 
      id: 3, 
      name: "Hakka Noodles", 
      category: "Chinese", 
      price: 200, 
      rating: 4.5, 
      reviews: 89,
      description: "Stir fried noodles with fresh vegetables in Schezwan sauce",
      prepTime: "18 min",
      image: "/images/dishes/popular/hakka-noodles.jpg",
      gradient: "linear-gradient(135deg, #2196F3, #03A9F4)",
      spicy: "Hot"
    },
    { 
      id: 4, 
      name: "Margherita Pizza", 
      category: "Italian", 
      price: 350, 
      originalPrice: 400,
      rating: 4.7, 
      reviews: 124,
      description: "Classic pizza with mozzarella cheese and fresh basil",
      prepTime: "25 min",
      image: "/images/dishes/popular/margherita-pizza.jpg",
      gradient: "linear-gradient(135deg, #E91E63, #C2185B)",
      spicy: "Mild"
    },
    { 
      id: 5, 
      name: "Chole Bhature", 
      category: "Street Food", 
      price: 150, 
      rating: 4.6, 
      reviews: 178,
      description: "Spicy chickpea curry served with fluffy fried bread",
      prepTime: "22 min",
      image: "/images/dishes/popular/chole-bhature.jpg",
      gradient: "linear-gradient(135deg, #795548, #5D4037)",
      spicy: "Medium"
    },
    { 
      id: 6, 
      name: "Gulab Jamun", 
      category: "Desserts", 
      price: 120, 
      rating: 4.8, 
      reviews: 95,
      description: "Deep fried milk balls soaked in sugar syrup",
      prepTime: "10 min",
      image: "/images/dishes/popular/Gulab Jamun.jpg",
      gradient: "linear-gradient(135deg, #FF4081, #F50057)",
      spicy: "None"
    },
  ];

  // Function to render spicy badge
  const renderSpicyLevel = (level) => {
    const levels = {
      Mild: { icon: <FaLeaf />, color: "#4CAF50" },
      Medium: { icon: <FaFire />, color: "#FF9800" },
      Hot: { icon: <FaFire />, color: "#F44336" },
      None: { icon: <FaLeaf />, color: "#9C27B0" }
    };

    const config = levels[level] || levels["Mild"];
    return (
      <span className="spicy-level" style={{ color: config.color }}>
        {config.icon} {level}
      </span>
    );
  };

  return (
    <section className="popular-dishes">
      <div className="container">
        <div className="section-header">
          <div className="header-left">
            <div className="section-tag">
              <FaFire /> Most Popular
            </div>
            <h2>Recommended Dishes</h2>
          </div>
          <div className="header-right">
            <div className="rating-badge">
              <FaStar /> <span className="rating-text">4.8/5</span> Overall Rating
            </div>
          </div>
        </div>

        <div className="dishes-grid">
          {popularDishes.map((dish) => (
            <div key={dish.id} className="dish-card">
              
              {/* Dish Image */}
              <div className="dish-image">
                <div className="dish-image-container">
                  <img 
                    src={dish.image} 
                    alt={dish.name} 
                    className="dish-image-real"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="image-fallback" style="background: ${dish.gradient}">
                          <span class="fallback-text">${dish.name.split(' ')[0].charAt(0)}${dish.name.split(' ')[1] ? dish.name.split(' ')[1].charAt(0) : ''}</span>
                        </div>
                      `;
                    }}
                  />
                  <div className="image-overlay"></div>
                </div>
              </div>

              {/* Dish Info */}
              <div className="dish-info">
                <div className="dish-header">
                  <h3>{dish.name}</h3>
                  <span className="dish-category">{dish.category}</span>
                  {renderSpicyLevel(dish.spicy)}
                </div>
                
                <p className="dish-description">{dish.description}</p>
                
                <div className="dish-meta">
                  <div className="rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`star-icon ${i < Math.floor(dish.rating) ? "filled" : ""}`}
                        />
                      ))}
                    </div>
                    <div className="rating-details">
                      <span className="rating-value">{dish.rating}</span>
                      <span className="reviews">({dish.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="prep-time">
                    <FaClock /> <span>{dish.prepTime}</span>
                  </div>
                </div>

                {/* Price and Add to Cart */}
                <div className="dish-footer">
                  <div className="price-section">
                    {dish.originalPrice ? (
                      <div className="price-with-discount">
                        <div className="price-row">
                          <span className="current-price">
                            <FaRupeeSign className="rupee-icon" />
                            {dish.price}
                          </span>
                          <span className="original-price">
                            <FaRupeeSign /> {dish.originalPrice}
                          </span>
                        </div>
                        <div className="discount-row">
                          <span className="discount">
                            Save ₹{dish.originalPrice - dish.price}
                          </span>
                          <span className="discount-percent">
                            {Math.round((1 - dish.price / dish.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="price-normal">
                        <span className="current-price">
                          <FaRupeeSign className="rupee-icon" />
                          {dish.price}
                        </span>
                        <span className="per-person">per plate</span>
                      </div>
                    )}
                  </div>
                  <button className="add-to-cart-btn">
  <FaPlus />
  <span>Add to Cart</span>
</button>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="view-all-dishes">
          <button className="view-all-btn">
            <span className="btn-text">View All Dishes</span>
            <span className="arrow-icon"><FaArrowRight /></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularDishes;

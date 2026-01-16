import React, { useState } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaUtensils, FaFilter, FaStar, FaFire } from "react-icons/fa";
import { menuItems } from "../../../data/menuData";
import "../components/CategoryControls.css";

const MainCourse = ({ category = "all" }) => {
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedType, setSelectedType] = useState("all");

  // Filter main course items from menuData
  const mainCourseItems = menuItems.filter(item => {
    const isMainCourse = 
      item.type === "north-indian" || 
      item.type === "south-indian" ||
      (item.type === "chinese" && !item.name.toLowerCase().includes("noodles"));
    
    // Filter by category if specified
    if (category === "non-veg") {
      return isMainCourse && item.category === "non-veg";
    }
    
    return isMainCourse;
  });

  // Filter by type
  const filteredItems = selectedType === "all" 
    ? mainCourseItems 
    : mainCourseItems.filter(item => item.type === selectedType);

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return b.rating - a.rating;
    }
  });

  // Get unique types
  const types = ["all", ...new Set(mainCourseItems.map(item => item.type))];

  return (
    <CategoryLayout
      categoryName={category === "non-veg" ? "Non-Veg Main Course" : "Main Course"}
      categorySlug={category === "non-veg" ? "non-veg-main-course" : "main-course"}
      categoryIcon={<FaUtensils />}
      categoryDescription="Hearty and satisfying main course dishes that form the centerpiece of your meal. Prepared with authentic spices and cooking techniques."
      categoryColor="#8B4513"
      categoryImage="https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {filteredItems.length} Main Course Dishes Available
          </h2>
          <p className="subtitle">Hearty meals • Perfectly spiced • Served hot</p>
        </div>
        
        <div className="controls-right">
          <div className="type-filters">
            {types.map((type) => (
              <button
                key={type}
                className={`type-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type === "all" ? "All Types" : type.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Course Info */}
      <div className="info-banner" style={{ '--category-color': '#8B4513' }}>
        <div className="info-content">
          <FaUtensils className="info-icon" />
          <div className="info-text">
            <h3>The Heart of Your Meal</h3>
            <p>Our main course dishes are prepared with traditional cooking methods and authentic spices. Each dish is carefully crafted to deliver maximum flavor and satisfaction.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🔥 Slow Cooked</span>
          <span className="info-feature">🌶️ Authentic Spices</span>
          <span className="info-feature">🍚 Perfect with Rice/Roti</span>
          <span className="info-feature">⏱️ Made to Order</span>
        </div>
      </div>

      {/* Dishes Grid */}
      {sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#8B4513' }}>
          <FaUtensils className="no-items-icon" />
          <h3>No main course dishes found</h3>
          <p>Check back soon for new additions!</p>
        </div>
      ) : (
        <div className={`dishes-grid ${viewMode}`}>
          {sortedItems.map((item) => (
            <CategoryItemCard 
              key={item.id} 
              item={item} 
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Serving Suggestions */}
      <div className="benefits-section" style={{ '--category-color': '#8B4513' }}>
        <h3>
          <FaStar className="benefits-icon" />
          Perfect Pairings
        </h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🍚</div>
            <h4>With Rice</h4>
            <p>All main course dishes pair perfectly with steamed rice or biryani</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🫓</div>
            <h4>With Breads</h4>
            <p>Great with naan, roti, paratha, or other Indian breads</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🥗</div>
            <h4>With Salads</h4>
            <p>Complement with fresh salads and raita for balanced meal</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🥤</div>
            <h4>With Drinks</h4>
            <p>Pair with lassi, buttermilk, or soft drinks for complete meal</p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default MainCourse;
import React, { useState } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaDrumstickBite} from "react-icons/fa";
import { menuItems } from "../../../data/menuData";
import "../components/CategoryControls.css";

const NonVegetarian = () => {
  const [sortBy] = useState("popular");
  const [viewMode] = useState("grid");

  // Filter non-vegetarian items from menuData
  const nonVegItems = menuItems.filter(item => item.category === "non-veg");

  // Sort items
  const sortedItems = [...nonVegItems].sort((a, b) => {
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

  return (
    <CategoryLayout
      categoryName="Non-Vegetarian"
      categorySlug="non-veg"
      categoryIcon={<FaDrumstickBite />}
      categoryDescription="Premium non-vegetarian delicacies made with fresh ingredients and authentic spices. Each dish prepared with care and tradition."
      categoryColor="#F44336"
      categoryImage="https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {nonVegItems.length} Non-Vegetarian Dishes Available
          </h2>
          <p className="subtitle">Premium quality • Fresh ingredients • Authentic spices</p>
        </div>
        
        
      </div>

      {/* Safety Banner */}
      <div className="info-banner" style={{ '--category-color': '#F44336' }}>
        <div className="info-content">
          <div className="info-icon">🔪</div>
          <div className="info-text">
            <h3>Fresh & Hygienic Preparation</h3>
            <p>All non-vegetarian items are prepared in a separate kitchen with strict hygiene standards. Meats are sourced daily from certified suppliers.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">✅ Daily Fresh Supply</span>
          <span className="info-feature">✅ Separate Preparation</span>
          <span className="info-feature">✅ Quality Certified</span>
          <span className="info-feature">✅ HACCP Standards</span>
        </div>
      </div>

      {/* Dishes Grid */}
      {sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#F44336' }}>
          <FaDrumstickBite className="no-items-icon" />
          <h3>No non-vegetarian items found</h3>
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

      {/* Cooking Info */}
      <div className="benefits-section" style={{ '--category-color': '#F44336' }}>
        <h3>
          <FaDrumstickBite className="benefits-icon" />
          Cooking Information
        </h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🔥</div>
            <h4>Cooking Methods</h4>
            <p>Traditional methods like dum cooking, tandoor, and slow cooking</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌶️</div>
            <h4>Authentic Spices</h4>
            <p>Grounded fresh daily, no pre-packaged spice mixes</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⏱️</div>
            <h4>Cooking Time</h4>
            <p>Properly marinated and cooked to ensure tenderness</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🍽️</div>
            <h4>Serving Style</h4>
            <p>Hot and fresh, garnished with fresh herbs and spices</p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default NonVegetarian;
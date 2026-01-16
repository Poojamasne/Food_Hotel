import React, { useState } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaLeaf } from "react-icons/fa";
import { menuItems } from "../../../data/menuData";
import "../components/CategoryControls.css";

const Vegetarian = () => {
    const [sortBy] = useState("popular");
    const [viewMode] = useState("grid");

  const vegetarianItems = menuItems.filter(item => item.category === "veg");

  const sortedItems = [...vegetarianItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return b.rating - a.rating; // popular by rating
    }
  });

  return (
    <CategoryLayout
      categoryName="Vegetarian"
      categorySlug="veg"
      categoryIcon={<FaLeaf />}
      categoryDescription="Pure vegetarian delights made with fresh ingredients and traditional recipes. 100% vegetarian, no artificial colors or flavors."
      categoryColor="#4CAF50"
      categoryImage="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {vegetarianItems.length} Vegetarian Dishes Available
          </h2>
          <p className="subtitle">Pure veg • No artificial colors • Fresh ingredients</p>
        </div>
        
      </div>

      {/* Veg Info Banner */}
      <div className="info-banner" style={{ '--category-color': '#4CAF50' }}>
        <div className="info-content">
          <FaLeaf className="info-icon" />
          <div className="info-text">
            <h3>100% Pure Vegetarian</h3>
            <p>All our vegetarian dishes are prepared separately to maintain purity. No egg, garlic, or onion used unless specified.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🌱 No Artificial Colors</span>
          <span className="info-feature">🌿 Fresh Herbs</span>
          <span className="info-feature">🌍 Sustainable</span>
          <span className="info-feature">💚 Healthier Choice</span>
        </div>
      </div>

      {/* Dishes Grid */}
      {sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#4CAF50' }}>
          <FaLeaf className="no-items-icon" />
          <h3>No vegetarian items found</h3>
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

      {/* Health Benefits */}
      <div className="benefits-section" style={{ '--category-color': '#4CAF50' }}>
        <h3>
          <FaLeaf className="benefits-icon" />
          Health Benefits of Vegetarian Food
        </h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">❤️</div>
            <h4>Heart Health</h4>
            <p>Lower risk of heart disease and high blood pressure</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚖️</div>
            <h4>Weight Management</h4>
            <p>Helps in maintaining healthy weight and BMI</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🩺</div>
            <h4>Low Cholesterol</h4>
            <p>Naturally cholesterol-free, better for your arteries</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌿</div>
            <h4>Rich in Fiber</h4>
            <p>High fiber content for better digestion</p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default Vegetarian;
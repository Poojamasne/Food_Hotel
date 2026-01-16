import React, { useState } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaUtensils, FaFilter, FaStar } from "react-icons/fa";
import { menuItems } from "../../../data/menuData";
import "../components/CategoryControls.css";

const SouthIndian = () => {
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");

  // Filter South Indian items from menuData
  const southIndianItems = menuItems.filter(item => item.type === "south-indian");

  // Sort items
  const sortedItems = [...southIndianItems].sort((a, b) => {
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
      categoryName="South Indian"
      categorySlug="south-indian"
      categoryIcon={<FaUtensils />}
      categoryDescription="Authentic South Indian cuisine from the heart of Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh. Traditional recipes with modern presentation."
      categoryColor="#FF9800"
      categoryImage="https://images.unsplash.com/photo-1630383249896-424e482df2cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {southIndianItems.length} South Indian Delights Available
          </h2>
          <p className="subtitle">Traditional recipes • Authentic flavors • Freshly prepared</p>
        </div>
      </div>

      {/* South Indian Special Info */}
      <div className="info-banner" style={{ '--category-color': '#FF9800' }}>
        <div className="info-content">
          <div className="info-icon">🍛</div>
          <div className="info-text">
            <h3>Traditional South Indian Cuisine</h3>
            <p>Our South Indian dishes are prepared by expert chefs using authentic recipes passed down through generations. Each dish is made fresh daily.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🍽️ Banana Leaf Serving</span>
          <span className="info-feature">🌶️ Authentic Spices</span>
          <span className="info-feature">⏱️ Made Fresh</span>
          <span className="info-feature">🥥 Coconut Based</span>
        </div>
      </div>

      {/* Dishes Grid */}
      {sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#FF9800' }}>
          <FaUtensils className="no-items-icon" />
          <h3>No South Indian items found</h3>
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

      {/* Regional Specialties */}
      <div className="benefits-section" style={{ '--category-color': '#FF9800' }}>
        <h3>
          <FaStar className="benefits-icon" />
          Regional Specialties
        </h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🍛</div>
            <h4>Chettinad Cuisine</h4>
            <p>Spicy and aromatic dishes from Tamil Nadu's Chettiar community</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🥥</div>
            <h4>Kerala Style</h4>
            <p>Rich coconut-based curries and seafood specialties</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🥘</div>
            <h4>Andhra Cuisine</h4>
            <p>Famous for its fiery hot pickles and spicy curries</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🍚</div>
            <h4>Udupi Dishes</h4>
            <p>Traditional vegetarian cuisine from Karnataka</p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default SouthIndian;
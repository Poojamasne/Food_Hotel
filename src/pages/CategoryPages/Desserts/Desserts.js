import React, { useState } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaStar, FaFilter, FaHeart } from "react-icons/fa";
import { menuItems } from "../../../data/menuData";
import "../components/CategoryControls.css";

const Desserts = () => {
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");

  // Filter dessert items from menuData
  const dessertItems = menuItems.filter(item => item.type === "desserts");

  // Sort items
  const sortedItems = [...dessertItems].sort((a, b) => {
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
      categoryName="Desserts"
      categorySlug="desserts"
      categoryIcon={<FaHeart />}
      categoryDescription="Sweet endings to your perfect meal. Traditional Indian sweets and desserts made with love and premium ingredients."
      categoryColor="#E91E63"
      categoryImage="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {dessertItems.length} Sweet Delights Available
          </h2>
          <p className="subtitle">Traditional sweets • Premium ingredients • Made fresh daily</p>
        </div>
        
        
      </div>

      {/* Dessert Info */}
      <div className="info-banner" style={{ '--category-color': '#E91E63' }}>
        <div className="info-content">
          <FaHeart className="info-icon" />
          <div className="info-text">
            <h3>Sweet Endings</h3>
            <p>Our desserts are made with traditional recipes using premium ingredients. Each sweet treat is prepared fresh daily to ensure maximum freshness and flavor.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🍯 Made Fresh Daily</span>
          <span className="info-feature">🌰 Premium Ingredients</span>
          <span className="info-feature">✨ Traditional Recipes</span>
          <span className="info-feature">🎁 Perfect for Gifting</span>
        </div>
      </div>

      {/* Dishes Grid */}
      {sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#E91E63' }}>
          <FaHeart className="no-items-icon" />
          <h3>No desserts found</h3>
          <p>Check back soon for sweet additions!</p>
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

      {/* Occasion Suggestions */}
      <div className="benefits-section" style={{ '--category-color': '#E91E63' }}>
        <h3>
          <FaStar className="benefits-icon" />
          Perfect for Every Occasion
        </h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎉</div>
            <h4>Celebrations</h4>
            <p>Perfect for birthdays, anniversaries, and special occasions</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🏠</div>
            <h4>Family Gatherings</h4>
            <p>Great for family dinners and get-togethers</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎁</div>
            <h4>Gifting</h4>
            <p>Traditional sweets make perfect gifts for festivals</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🍽️</div>
            <h4>Meal Finisher</h4>
            <p>Perfect way to end your meal on a sweet note</p>
          </div>
        </div>
      </div>

      {/* Dessert Types */}
      <div className="benefits-section" style={{ '--category-color': '#E91E63', marginTop: '30px' }}>
        <h3>
          <FaHeart className="benefits-icon" />
          Types of Desserts
        </h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🍮</div>
            <h4>Milk Based</h4>
            <p>Rich desserts made with milk, khoya, and paneer</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌰</div>
            <h4>Dry Fruits</h4>
            <p>Nutty sweets with almonds, pistachios, and cashews</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🍯</div>
            <h4>Syrup Based</h4>
            <p>Desserts soaked in sugar syrup or honey</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🧁</div>
            <h4>Baked Goods</h4>
            <p>Freshly baked cakes, pastries, and cookies</p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default Desserts;
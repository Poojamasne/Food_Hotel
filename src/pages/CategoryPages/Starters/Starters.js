import React, { useState } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaFire, FaFilter } from "react-icons/fa";
import { menuItems } from "../../../data/menuData";
import "../components/CategoryControls.css";

const Starters = ({ category = "all" }) => {
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");

  // Filter starter items from menuData (Chinese items)
  const starterItems = menuItems.filter(item => 
    item.type === "chinese" || 
    item.name.toLowerCase().includes("roll") ||
    item.name.toLowerCase().includes("manchurian")
  );

  // Sort items
  const sortedItems = [...starterItems].sort((a, b) => {
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
      categoryName="Starters"
      categorySlug="starters"
      categoryIcon={<FaFire />}
      categoryDescription="Perfect appetizers to begin your meal. Crispy, flavorful, and served hot with delicious dips and chutneys."
      categoryColor="#FF5722"
      categoryImage="https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {starterItems.length} Starters Available
          </h2>
          <p className="subtitle">Perfect beginning • Served hot • Great with drinks</p>
        </div>
        
        <div className="controls-right">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Sort by: Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Starters Info */}
      <div className="info-banner" style={{ '--category-color': '#FF5722' }}>
        <div className="info-content">
          <FaFire className="info-icon" />
          <div className="info-text">
            <h3>Perfect Appetizers</h3>
            <p>Our starters are prepared fresh to order, ensuring maximum crispiness and flavor. Perfect for sharing or as a personal appetizer.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🔥 Served Hot</span>
          <span className="info-feature">⏱️ Quick Service</span>
          <span className="info-feature">🥡 Perfect for Sharing</span>
          <span className="info-feature">🌶️ Spicy Options</span>
        </div>
      </div>

      {/* Dishes Grid */}
      {sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#FF5722' }}>
          <FaFire className="no-items-icon" />
          <h3>No starters found</h3>
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
      <div className="benefits-section" style={{ '--category-color': '#FF5722' }}>
        <h3>
          <FaFire className="benefits-icon" />
          Serving Suggestions
        </h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🍸</div>
            <h4>With Drinks</h4>
            <p>Perfect companions for cocktails, mocktails, and beverages</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🥘</div>
            <h4>Before Main Course</h4>
            <p>Set the tone for your meal with our delicious starters</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎉</div>
            <h4>Party Platters</h4>
            <p>Great for parties and gatherings as shareable plates</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⏰</div>
            <h4>Quick Bites</h4>
            <p>Ready in minutes for when you need something quick</p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default Starters;
import React, { useState } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaGlassMartiniAlt, FaFilter, FaLeaf, FaSnowflake } from "react-icons/fa";
import { menuItems } from "../../../data/menuData";
import "../components/CategoryControls.css";

const Beverages = () => {
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [temperature, setTemperature] = useState("all");

  // Filter beverage items from menuData
  const beverageItems = menuItems.filter(item => item.type === "beverages");

  // Filter by temperature
  const filteredItems = temperature === "all" 
    ? beverageItems 
    : beverageItems.filter(item => {
        if (temperature === "cold") {
          return item.name.toLowerCase().includes("lassi") || 
                 item.name.toLowerCase().includes("juice") ||
                 item.name.toLowerCase().includes("soda");
        }
        return item.name.toLowerCase().includes("tea") || 
               item.name.toLowerCase().includes("coffee") ||
               item.name.toLowerCase().includes("hot");
    });

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

  return (
    <CategoryLayout
      categoryName="Beverages"
      categorySlug="beverages"
      categoryIcon={<FaGlassMartiniAlt />}
      categoryDescription="Refreshing drinks and beverages to complement your meal. From traditional Indian drinks to modern mocktails, we have something for everyone."
      categoryColor="#2196F3"
      categoryImage="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {filteredItems.length} Refreshing Beverages Available
          </h2>
          <p className="subtitle">Refreshing • Rejuvenating • Perfect Thirst Quenchers</p>
        </div>
        
        <div className="controls-right">
          <div className="temperature-filters">
            <button
              className={`type-btn ${temperature === 'all' ? 'active' : ''}`}
              onClick={() => setTemperature("all")}
            >
              All Temperatures
            </button>
            <button
              className={`type-btn ${temperature === 'cold' ? 'active' : ''}`}
              onClick={() => setTemperature("cold")}
            >
              <FaSnowflake /> Cold Drinks
            </button>
            <button
              className={`type-btn ${temperature === 'hot' ? 'active' : ''}`}
              onClick={() => setTemperature("hot")}
            >
              🔥 Hot Drinks
            </button>
          </div>
          
          <div className="sort-view">
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
      </div>

      {/* Beverage Info */}
      <div className="info-banner" style={{ '--category-color': '#2196F3' }}>
        <div className="info-content">
          <FaGlassMartiniAlt className="info-icon" />
          <div className="info-text">
            <h3>Refresh & Rejuvenate</h3>
            <p>Our beverages are made with fresh ingredients, pure juices, and authentic recipes. Perfect for quenching your thirst and complementing your meal.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🍹 Fresh Ingredients</span>
          <span className="info-feature">🧊 Chilled Perfectly</span>
          <span className="info-feature">🌿 Natural Flavors</span>
          <span className="info-feature">⏱️ Quick Service</span>
        </div>
      </div>

      {/* Dishes Grid */}
      {sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#2196F3' }}>
          <FaGlassMartiniAlt className="no-items-icon" />
          <h3>No beverages found</h3>
          <p>Check back soon for refreshing additions!</p>
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
      <div className="benefits-section" style={{ '--category-color': '#2196F3' }}>
        <h3>
          <FaLeaf className="benefits-icon" />
          Health Benefits
        </h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">💧</div>
            <h4>Hydration</h4>
            <p>Keeps you hydrated and refreshed throughout the day</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌿</div>
            <h4>Natural Energy</h4>
            <p>Provides natural energy without artificial stimulants</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🍋</div>
            <h4>Rich in Vitamins</h4>
            <p>Fresh fruits provide essential vitamins and minerals</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">😊</div>
            <h4>Mood Enhancer</h4>
            <p>Refreshing drinks help improve mood and reduce stress</p>
          </div>
        </div>
      </div>

      {/* Beverage Categories */}
      <div className="benefits-section" style={{ '--category-color': '#2196F3', marginTop: '30px' }}>
        <h3>
          <FaGlassMartiniAlt className="benefits-icon" />
          Beverage Categories
        </h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🥭</div>
            <h4>Fruit Based</h4>
            <p>Fresh fruit juices, smoothies, and fruit punches</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🥛</div>
            <h4>Dairy Based</h4>
            <p>Lassi, milkshakes, and yogurt-based drinks</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">☕</div>
            <h4>Hot Beverages</h4>
            <p>Tea, coffee, and traditional hot drinks</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🧃</div>
            <h4>Mocktails</h4>
            <p>Creative non-alcoholic cocktails and mixed drinks</p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default Beverages;
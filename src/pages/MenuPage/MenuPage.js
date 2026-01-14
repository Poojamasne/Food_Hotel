import React, { useState } from "react";
import "./MenuPage.css";
import { categories } from "../../data/categories";
import { menuItems } from "../../data/menuData";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = 
    selectedCategory === "All" 
      ? menuItems 
      : menuItems.filter(
          (item) => item.category === selectedCategory.toLowerCase() || item.type === selectedCategory.toLowerCase().replace(" ", "-")
        );

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover our wide variety of delicious dishes</p>
      </div>

      <div className="menu-filters">
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.name ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="menu-items-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="menu-card">
            <div className="menu-card-img">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="image-placeholder">
                  {item.category === "veg" ? "??" : 
                   item.category === "non-veg" ? "??" :
                   item.type === "chinese" ? "??" :
                   item.type === "south-indian" ? "??" : "???"}
                </div>
              )}
            </div>
            <div className="menu-card-content">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="menu-card-footer">
                <span className="price">?{item.price}</span>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;

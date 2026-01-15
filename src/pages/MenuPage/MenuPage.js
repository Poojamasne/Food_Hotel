import React, { useState, useEffect } from "react";
import "./MenuPage.css";
import { categories } from "../../data/categories";
import { menuItems } from "../../data/menuData";
import { FaMinus, FaTrash } from "react-icons/fa";
import {
  FaStar,
  FaShoppingCart,
  FaFire,
  FaLeaf,
  FaDrumstickBite,
} from "react-icons/fa";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Filter items based on category and search
  const filteredItems = menuItems.filter((item) => {
    const selected = selectedCategory.toLowerCase().replace(/\s+/g, "-");

const categoryMatch =
  selectedCategory === "All" ||
  item.category === selected ||
  item.type === selected ||
  item.category?.includes(selected) ||
  item.type?.includes(selected);


    const searchMatch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;

      const updatedCount = prev[itemId] - 1;

      if (updatedCount <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [itemId]: updatedCount,
      };
    });
  };

  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  return (
    <div className="menu-page">
      {/* Header with Search */}
      <div className="menu-header">
        <div className="container">
          <h1>Our Delicious Menu</h1>
          <p className="subtitle">
            Savor authentic flavors crafted with passion
          </p>

          {/* Search Bar */}
          <div className="menu-search">
            <input
              type="text"
              placeholder="Search your favorite dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="cart-indicator">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="menu-categories">
        <div className="container">
          <div className="section-header">
            <h2>Food Categories</h2>
          </div>

          <div className="category-filters">
            <button
              className={`category-btn ${
                selectedCategory === "All" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              <span className="category-icon">🍽️</span>
              All Items
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.name ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items Grid */}
      <section className="menu-items-section">
        <div className="container">
          <div className="section-header">
            <h2>
              {selectedCategory === "All"
                ? "All Menu Items"
                : selectedCategory + " Specials"}
              <span className="items-count">
                ({filteredItems.length} items)
              </span>
            </h2>
          </div>

          {filteredItems.length === 0 ? (
            <div className="no-results">
              <h3>No items found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="menu-items-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="menu-card">
                  {/* Card Badges */}
                  <div className="card-badges">
                    {item.isPopular && (
                      <span className="badge popular">
                        <FaFire /> Popular
                      </span>
                    )}
                    {item.category === "veg" && (
                      <span className="badge veg">
                        <FaLeaf /> Veg
                      </span>
                    )}
                    {item.category === "non-veg" && (
                      <span className="badge non-veg">
                        <FaDrumstickBite /> Non-Veg
                      </span>
                    )}
                  </div>

                  {/* Image Section */}
                  <div className="menu-card-img">
                    {item.image ? (
                      <img src={item.image} alt={item.name} loading="lazy" />
                    ) : (
                      <div className="image-placeholder">
  <span>
    {(item.category || item.type)?.replace("-", " ").toUpperCase()}
  </span>
</div>

                    )}
                  </div>

                  {/* Content Section */}
                  <div className="menu-card-content">
                    <div className="card-header">
                      <h3>{item.name}</h3>
                      {item.rating && (
                        <span className="rating">
                          <FaStar /> {item.rating}
                        </span>
                      )}
                    </div>

                    <p className="description">{item.description}</p>

                    <div className="item-tags">
                      {item.spicy && (
                        <span className="tag spicy">🌶️ Spicy</span>
                      )}
                      {item.healthy && (
                        <span className="tag healthy">💚 Healthy</span>
                      )}
                      {item.time && (
                        <span className="tag time">⏱️ {item.time} min</span>
                      )}
                    </div>

                    <div className="menu-card-footer">
                      <div className="price-section">
                        <span className="price">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="original-price">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="cart-actions">
                        {cartItems[item.id] ? (
                          <>
                            <button
                              className="remove-btn"
                              onClick={() => removeFromCart(item.id)}
                              title="Remove"
                            >
                              <FaMinus />
                            </button>

                            <span className="item-count">
                              {cartItems[item.id]}
                            </span>

                            <button
                              className="add-btn"
                              onClick={() => addToCart(item.id)}
                              title="Add"
                            >
                              <FaShoppingCart />
                            </button>
                          </>
                        ) : (
                          <button
                            className="add-to-cart"
                            onClick={() => addToCart(item.id)}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section (Matching Home Page) */}
      <section className="menu-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Craving Something Special?</h2>
            <p>Customize your order or book a table for special occasions</p>
            <div className="cta-buttons">
              <button className="cta-btn primary">Customize Order</button>
              <button className="cta-btn secondary">Book a Table</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;

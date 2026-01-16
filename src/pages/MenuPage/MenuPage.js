import React, { useState } from "react";
import "./MenuPage.css";
import { categories } from "../../data/categories";
import { menuItems } from "../../data/menuData";
import {
  FaStar,
  FaShoppingCart,
  FaFire,
  FaLeaf,
  FaDrumstickBite,
  FaMinus,
} from "react-icons/fa";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- FILTER LOGIC ---------------- */
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

  /* ---------------- CART LOGIC ---------------- */
  const addToCart = (id) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      if (!prev[id]) return prev;
      const count = prev[id] - 1;
      if (count <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: count };
    });
  };

  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  return (
    <div className="menu-page">
      {/* ================= HEADER ================= */}
      <div
        className="menu-header"
        style={{
          backgroundImage: "url('/images/dishes/popular/Menu Header.jpg')",
        }}
      >
        <div className="container">
          <h1>Our Delicious Menu</h1>
          <p className="subtitle">
            Savor authentic flavors crafted with passion
          </p>

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
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      <section className="menu-categories">
        <div className="container">
          <div className="category-filters">
            <button
              className={`category-btn ${
                selectedCategory === "All" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              🍽️ All Items
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${
                  selectedCategory === cat.name ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MENU ITEMS ================= */}
      <section className="menu-items-section">
        <div className="container">
          <h2 className="section-title">
            {selectedCategory === "All"
              ? "All Menu Items"
              : `${selectedCategory} Specials`}
            <span className="items-count">
              ({filteredItems.length})
            </span>
          </h2>

          {filteredItems.length === 0 ? (
            <div className="no-results">
              <h3>No items found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="menu-items-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="menu-card">
                  {/* BADGES */}
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

                  {/* IMAGE */}
                  <div className="menu-card-img">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="image-placeholder">
                        {(item.category || item.type)
                          ?.replace("-", " ")
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
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

                    <div className="menu-card-footer">
                      <span className="price">₹{item.price}</span>

                      {cartItems[item.id] ? (
                        <div className="cart-actions">
                          <button
                            onClick={() => removeFromCart(item.id)}
                          >
                            <FaMinus />
                          </button>
                          <span>{cartItems[item.id]}</span>
                          <button
                            onClick={() => addToCart(item.id)}
                          >
                            <FaShoppingCart />
                          </button>
                        </div>
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section
        className="menu-cta"
        style={{
          backgroundImage: "url('/images/dishes/popular/CTA Section.jpg')",
        }}
      >
        <div className="container">
          <h2>Craving Something Special?</h2>
          <p>Customize your order or book a table</p>
          <div className="cta-buttons">
            <button className="cta-btn primary">Customize Order</button>
            <button className="cta-btn secondary">Book a Table</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
 


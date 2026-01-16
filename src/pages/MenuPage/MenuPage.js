import React, { useState } from "react";
import "./MenuPage.css";
import { categories, menuData } from "../../data/menuData";
import { useCart } from "../../context/CartContext";
import {
  FaStar,
  FaShoppingCart,
  FaFire,
  FaLeaf,
  FaDrumstickBite,
  FaMinus,
  FaPlus
} from "react-icons/fa";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { cartItems, addToCart, updateQuantity, getItemCount } = useCart();

  // Fixed filter logic
  const filteredItems = menuData.filter((item) => {
    // First check search term
    const searchMatch = 
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!searchMatch) return false;
    
    // Then check category filter
    if (selectedCategory === "All") return true;
    
    const selected = selectedCategory.toLowerCase();
    
    // Check by category type (veg/non-veg)
    if (selected === "vegetarian") return item.category === "veg";
    if (selected === "non-vegetarian") return item.category === "non-veg";
    
    // Check by cuisine type
    const itemType = item.type?.toLowerCase() || "";
    const selectedType = selected.replace(" ", "-");
    
    if (selectedType === "south-indian") return itemType === "south-indian";
    if (selectedType === "north-indian") return itemType === "north-indian";
    if (selectedType === "chinese") return itemType === "chinese";
    if (selectedType === "italian") return itemType === "italian";
    if (selectedType === "desserts") return itemType === "desserts";
    if (selectedType === "beverages") return itemType === "beverages";
    if (selectedType === "starters") return itemType === "starters";
    
    // Default return false
    return false;
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (item) => {
    addToCart(item, 1);
  };

  const handleIncreaseQuantity = (item) => {
    const currentCount = getItemCount(item.id);
    updateQuantity(item.id, currentCount + 1);
  };

  const handleDecreaseQuantity = (item) => {
    const currentCount = getItemCount(item.id);
    updateQuantity(item.id, currentCount - 1);
  };

  return (
    <div className="menu-page">
      {/* Header with Background Image */}
      <div 
        className="menu-header"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/dishes/popular/Menu Header.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="container">
          <h1>Our Delicious Menu</h1>
          <p className="subtitle">Savor authentic flavors crafted with passion</p>

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

      {/* Categories */}
      <section className="menu-categories">
        <div className="container">
          <div className="category-filters">
            <button
              className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
              onClick={() => setSelectedCategory("All")}
            >
              🍽️ All Items
            </button>
            {categories.slice(1).map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.name ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="menu-items-section">
        <div className="container">
          <h2 className="section-title">
            {selectedCategory === "All"
              ? "All Menu Items"
              : `${selectedCategory} Specials`}
            <span className="items-count">({filteredItems.length})</span>
          </h2>

          {filteredItems.length === 0 ? (
            <div className="no-results">
              <h3>No items found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="menu-items-grid">
              {filteredItems.map((item) => {
                const itemInCart = getItemCount(item.id);
                
                return (
                  <div key={item.id} className="menu-card">
                    <div className="card-badges">
                      {item.tags?.includes("Best Seller") && (
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

                    <div className="menu-card-img">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          loading="lazy" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/dishes/default-food.jpg";
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>

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
                      
                      <div className="item-meta">
                        <span className="item-type">
                          {item.type ? item.type.replace("-", " ").toUpperCase() : ""}
                        </span>
                      </div>

                      <div className="menu-card-footer">
                        <div className="price-section">
                          <span className="price">₹{item.price}</span>
                        </div>
                        
                        {itemInCart > 0 ? (
                          <div className="cart-actions">
                            <button 
                              className="quantity-btn"
                              onClick={() => handleDecreaseQuantity(item)}
                            >
                              <FaMinus />
                            </button>
                            <span className="quantity-count">{itemInCart}</span>
                            <button 
                              className="quantity-btn"
                              onClick={() => handleIncreaseQuantity(item)}
                            >
                              <FaPlus />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="add-to-cart"
                            onClick={() => handleAddToCart(item)}
                          >
                            <FaShoppingCart /> Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
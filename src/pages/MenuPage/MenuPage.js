import React, { useState, useEffect } from "react";
import "./MenuPage.css";
import { categories as staticCategories } from "../../data/menuData";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import {
  FaStar,
  FaShoppingCart,
  FaFire,
  FaLeaf,
  FaDrumstickBite,
  FaMinus,
  FaPlus,
  FaSpinner
} from "react-icons/fa";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cartItems, addToCart, updateQuantity, getItemCount } = useCart();
  const { token } = useAuth();

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        
        const headers = {
          'Content-Type': 'application/json',
        };

        // Add Authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Map category names to API slugs
        const categoryMap = {
          "All": "all",
          "Vegetarian": "veg",
          "Non-Vegetarian": "non-veg", 
          "South Indian": "south-indian",
          "North Indian": "north-indian",
          "Chinese": "chinese",
          "Italian": "italian",
          "Desserts": "desserts",
          "Beverages": "beverages",
          "Starters": "starters"
        };

        let apiUrl = 'https://backend-hotel-management.onrender.com/api/products';
        const apiSlug = categoryMap[selectedCategory];
        
        if (selectedCategory !== "All" && apiSlug) {
          apiUrl = `https://backend-hotel-management.onrender.com/api/products/category/${apiSlug}`;
        }

        const response = await fetch(apiUrl, {
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch menu: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match your existing structure
          const transformedData = data.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || `${product.name} - Delicious dish`,
            price: product.price || 0,
            category: product.category_slug || "veg", // Map to your category format
            type: product.category_name || "",
            rating: parseFloat(product.rating) || 4.0, // Ensure it's a number
            tags: product.is_bestseller ? ["Best Seller"] : [],
            image: getImagePath(product.image)
          }));
          
          setMenuData(transformedData);
        } else {
          throw new Error(data.message || 'Failed to load menu');
        }
      } catch (err) {
        console.error('Error fetching menu data:', err);
        // Keep existing menuData if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [selectedCategory, token]);

  // Helper function to get image path
  const getImagePath = (apiImagePath) => {
    if (!apiImagePath) {
      return "/images/dishes/default-food.jpg";
    }
    
    // If it's a relative path, prepend backend URL
    if (apiImagePath.startsWith('/')) {
      return `https://backend-hotel-management.onrender.com${apiImagePath}`;
    }
    
    return apiImagePath;
  };

  // Fixed filter logic (same as before)
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

  // Helper function to safely format rating
  const formatRating = (rating) => {
    if (!rating && rating !== 0) return "N/A";
    
    // Convert to number if it's a string
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    
    // Check if it's a valid number
    if (isNaN(numRating)) return "N/A";
    
    // Return formatted number
    return numRating.toFixed(1);
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
            {staticCategories.slice(1).map((cat) => (
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
            <span className="items-count">
              ({loading ? <FaSpinner className="loading-spinner" /> : filteredItems.length})
            </span>
          </h2>

          {loading && menuData.length === 0 ? (
            <div className="loading-container">
              <FaSpinner className="loading-spinner-large" />
              <p>Loading menu items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="no-results">
              <h3>No items found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="menu-items-grid">
              {filteredItems.map((item) => {
                const itemInCart = getItemCount(item.id);
                const displayRating = formatRating(item.rating);
                
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
                        {item.rating !== undefined && item.rating !== null && (
                          <span className="rating">
                            <FaStar /> {displayRating}
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
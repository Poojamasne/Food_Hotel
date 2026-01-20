import React, { useState, useEffect } from "react";
import "./MenuPage.css";
import { categories as staticCategories } from "../../data/menuData";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "../../components/ScrollToTop.jsx";
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

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cartItems, addToCart, updateQuantity, getItemCount } = useCart();
  const { token } = useAuth();

  // Category mapping for API calls and filtering
  const categoryMapping = {
    // Frontend Category: [API category_slug values]
    "All": ["all"],
    "Vegetarian": ["veg"],
    "Non-Vegetarian": ["non-veg"],
    "South Indian": ["south-indian", "southindian"],
    "North Indian": ["north-indian", "northindian"],
    "Chinese": ["chinese"],
    "Italian": ["italian"],
    "Desserts": ["desserts", "dessert"],
    "Beverages": ["beverages", "beverage", "drinks"],
    "Starters": ["starters", "starter", "appetizer"]
  };

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

        // Always fetch all products, we'll filter on frontend
        const apiUrl = 'https://backend-hotel-management.onrender.com/api/products';

        const response = await fetch(apiUrl, {
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch menu: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform API data
          const transformedData = data.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || `${product.name} - Delicious dish`,
            price: product.price || 0,
            category_slug: product.category_slug || "", // Keep original slug
            category_name: product.category_name || "",
            type: product.type || "veg", // veg or non-veg
            rating: parseFloat(product.rating) || 4.0,
            tags: product.is_popular ? ["Popular"] : [],
            image: getImagePath(product.image),
            // Add category_type for easier filtering
            category_type: getCategoryType(product)
          }));
          
          setMenuData(transformedData);
          console.log("Fetched data:", transformedData.length, "items");
          console.log("Sample item:", transformedData[0]);
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
  }, [token]);

  // Helper function to categorize items
  const getCategoryType = (product) => {
    const slug = product.category_slug ? product.category_slug.toLowerCase() : "";
    
    // Check for food type first
    if (product.type === "veg") return "Vegetarian";
    if (product.type === "non-veg") return "Non-Vegetarian";
    
    // Check category slugs
    if (slug.includes("south") || slug.includes("dosa") || slug.includes("idli")) {
      return "South Indian";
    }
    if (slug.includes("north") || slug.includes("paneer") || slug.includes("butter")) {
      return "North Indian";
    }
    if (slug.includes("chinese") || slug.includes("manchurian")) {
      return "Chinese";
    }
    if (slug.includes("italian") || slug.includes("pasta") || slug.includes("pizza")) {
      return "Italian";
    }
    if (slug.includes("dessert") || slug.includes("ice") || slug.includes("sweet")) {
      return "Desserts";
    }
    if (slug.includes("beverage") || slug.includes("drink") || slug.includes("coffee") || slug.includes("soda")) {
      return "Beverages";
    }
    if (slug.includes("starter") || slug.includes("appetizer")) {
      return "Starters";
    }
    
    return "Vegetarian"; // Default
  };

  // Helper function to get image path
  const getImagePath = (apiImagePath) => {
    if (!apiImagePath || apiImagePath === "null" || apiImagePath === "undefined") {
      return "/images/dishes/default-food.jpg";
    }
    
    // If it's already a full URL
    if (apiImagePath.startsWith('http')) {
      return apiImagePath;
    }
    
    // If it's a relative path, prepend backend URL
    if (apiImagePath.startsWith('/')) {
      return `https://backend-hotel-management.onrender.com${apiImagePath}`;
    }
    
    // If it's just a filename
    return `https://backend-hotel-management.onrender.com/uploads/products/${apiImagePath}`;
  };

  // Fixed filter logic
  const filteredItems = menuData.filter((item) => {
    // 1. Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(searchLower);
      const descMatch = item.description.toLowerCase().includes(searchLower);
      const categoryMatch = item.category_name?.toLowerCase().includes(searchLower);
      
      if (!nameMatch && !descMatch && !categoryMatch) {
        return false;
      }
    }
    
    // 2. Category filter
    if (selectedCategory === "All") {
      return true;
    }
    
    const selected = selectedCategory.toLowerCase();
    
    // Handle Vegetarian/Non-Vegetarian
    if (selected === "vegetarian") {
      return item.type === "veg";
    }
    if (selected === "non-vegetarian") {
      return item.type === "non-veg";
    }
    
    // Handle other categories using mapping
    const categorySlugs = categoryMapping[selectedCategory] || [];
    
    // Check if item matches any of the mapped slugs
    const itemSlug = item.category_slug ? item.category_slug.toLowerCase() : "";
    const itemName = item.category_name ? item.category_name.toLowerCase() : "";
    const itemType = item.category_type ? item.category_type.toLowerCase() : "";
    
    // Check against all possible matches
    const matchesSlug = categorySlugs.some(slug => 
      itemSlug.includes(slug) || slug.includes(itemSlug)
    );
    
    const matchesName = categorySlugs.some(slug => 
      itemName.includes(slug) || slug.includes(itemName)
    );
    
    const matchesType = categorySlugs.some(slug => 
      itemType.includes(slug) || slug.includes(itemType)
    );
    
    // Also check if item name contains category keywords
    const itemNameCheck = item.name.toLowerCase();
    const hasCategoryKeyword = categorySlugs.some(slug => 
      itemNameCheck.includes(slug)
    );
    
    return matchesSlug || matchesName || matchesType || hasCategoryKeyword;
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

  // Debug: Log filtered items
  useEffect(() => {
    if (filteredItems.length > 0) {
      console.log(`Filtered ${filteredItems.length} items for category: ${selectedCategory}`);
      console.log("First few items:", filteredItems.slice(0, 3));
    }
  }, [filteredItems, selectedCategory]);

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
              <button 
                className="btn-retry"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          ) : (
            <div className="menu-items-grid">
              {filteredItems.map((item) => {
                const itemInCart = getItemCount(item.id);
                const displayRating = formatRating(item.rating);
                
                return (
                  <div key={item.id} className="menu-card">
                    <div className="card-badges">
                      {item.tags?.includes("Popular") && (
                        <span className="badge popular">
                          <FaFire /> Popular
                        </span>
                      )}
                      {item.type === "veg" && (
                        <span className="badge veg">
                          <FaLeaf /> Veg
                        </span>
                      )}
                      {item.type === "non-veg" && (
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
                        <span className="item-category">
                          {item.category_name || item.category_type || "General"}
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
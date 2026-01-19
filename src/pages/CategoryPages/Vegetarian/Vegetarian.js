import React, { useState, useEffect } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaLeaf, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../components/CategoryControls.css";

const Vegetarian = () => {
  const [sortBy] = useState("popular");
  const [viewMode] = useState("grid");
  const [vegetarianItems, setVegetarianItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fetch vegetarian items from API
  useEffect(() => {
    const fetchVegetarianItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('https://backend-hotel-management.onrender.com/api/products/category/veg', {
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch vegetarian items: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match your component structure
          const transformedItems = data.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || `${product.name} - Delicious vegetarian dish`,
            price: product.price || 0,
            category: "veg",
            type: product.category_name || "Vegetarian",
            rating: product.rating || 4.0,
            tags: product.is_bestseller ? ["Best Seller"] : [],
            image: getImagePath(product.image),
            is_available: product.is_available !== false
          }));
          
          setVegetarianItems(transformedItems);
        } else {
          throw new Error(data.message || 'Failed to load vegetarian items');
        }
      } catch (err) {
        console.error('Error fetching vegetarian items:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVegetarianItems();
  }, [token]);

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

  const sortedItems = [...vegetarianItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return (b.rating || 0) - (a.rating || 0); // popular by rating
    }
  });

  return (
    <CategoryLayout
      categoryName="Vegetarian"
      categorySlug="veg"
      categoryIcon={<FaLeaf />}
      categoryDescription="Pure vegetarian delights made with fresh ingredients and traditional recipes. 100% vegetarian, no artificial colors or flavors."
      categoryColor="#4CAF50"
      categoryImage="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {loading ? (
              <span>Loading vegetarian dishes...</span>
            ) : error ? (
              <span>Vegetarian Dishes</span>
            ) : (
              <span>{vegetarianItems.length} Vegetarian Dishes Available</span>
            )}
          </h2>
          <p className="subtitle">Pure veg • No artificial colors • Fresh ingredients</p>
        </div>
        
        {loading && (
          <div className="loading-indicator">
            <FaSpinner className="spinner" /> Loading...
          </div>
        )}
      </div>

      {/* Veg Info Banner */}
      <div className="info-banner" style={{ '--category-color': '#4CAF50' }}>
        <div className="info-content">
          <FaLeaf className="info-icon" />
          <div className="info-text">
            <h3>100% Pure Vegetarian</h3>
            <p>All our vegetarian dishes are prepared separately to maintain purity. No egg, garlic, or onion used unless specified.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🌱 No Artificial Colors</span>
          <span className="info-feature">🌿 Fresh Herbs</span>
          <span className="info-feature">🌍 Sustainable</span>
          <span className="info-feature">💚 Healthier Choice</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <FaSpinner className="loading-spinner-large" />
          <p>Loading vegetarian dishes...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-message">
          <h3>Unable to load vegetarian dishes</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dishes Grid */}
      {!loading && !error && sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#4CAF50' }}>
          <FaLeaf className="no-items-icon" />
          <h3>No vegetarian items found</h3>
          <p>Check back soon for new additions!</p>
        </div>
      ) : (
        !loading && !error && (
          <div className={`dishes-grid ${viewMode}`}>
            {sortedItems.map((item) => (
              <CategoryItemCard 
                key={item.id} 
                item={item} 
                viewMode={viewMode}
              />
            ))}
          </div>
        )
      )}

      {/* Health Benefits */}
      {!loading && !error && (
        <div className="benefits-section" style={{ '--category-color': '#4CAF50' }}>
          <h3>
            <FaLeaf className="benefits-icon" />
            Health Benefits of Vegetarian Food
          </h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">❤️</div>
              <h4>Heart Health</h4>
              <p>Lower risk of heart disease and high blood pressure</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚖️</div>
              <h4>Weight Management</h4>
              <p>Helps in maintaining healthy weight and BMI</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🩺</div>
              <h4>Low Cholesterol</h4>
              <p>Naturally cholesterol-free, better for your arteries</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌿</div>
              <h4>Rich in Fiber</h4>
              <p>High fiber content for better digestion</p>
            </div>
          </div>
        </div>
      )}
    </CategoryLayout>
  );
};

export default Vegetarian;
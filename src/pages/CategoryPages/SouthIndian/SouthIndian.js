import React, { useState, useEffect } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaUtensils, FaStar, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../components/CategoryControls.css";

const SouthIndian = () => {
  const [sortBy] = useState("popular");
  const [viewMode] = useState("grid");
  const [southIndianItems, setSouthIndianItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fetch South Indian items from API
  useEffect(() => {
    const fetchSouthIndianItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:5000/api/products/category/south-indian', {
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch South Indian items: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match your component structure
          const transformedItems = data.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || `${product.name} - Authentic South Indian dish`,
            price: product.price || 0,
            category: product.category_slug || "south-indian",
            type: "south-indian", // Keep this as south-indian for filtering
            rating: product.rating || 4.0,
            tags: product.is_bestseller ? ["Best Seller"] : [],
            image: getImagePath(product.image),
            is_available: product.is_available !== false
          }));
          
          setSouthIndianItems(transformedItems);
        } else {
          throw new Error(data.message || 'Failed to load South Indian items');
        }
      } catch (err) {
        console.error('Error fetching South Indian items:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSouthIndianItems();
  }, [token]);

  // Helper function to get image path
  const getImagePath = (apiImagePath) => {
    if (!apiImagePath) {
      return "/images/dishes/default-food.jpg";
    }
    
    // If it's a relative path, prepend backend URL
    if (apiImagePath.startsWith('/')) {
      return `http://localhost:5000${apiImagePath}`;
    }
    
    return apiImagePath;
  };

  const sortedItems = [...southIndianItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  return (
    <CategoryLayout
      categoryName="South Indian"
      categorySlug="south-indian"
      categoryIcon={<FaUtensils />}
      categoryDescription="Authentic South Indian cuisine from the heart of Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh. Traditional recipes with modern presentation."
      categoryColor="#FF9800"
      categoryImage="https://images.unsplash.com/photo-1630383249896-424e482df2cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {loading ? (
              <span>Loading South Indian dishes...</span>
            ) : error ? (
              <span>South Indian Delights</span>
            ) : (
              <span>{southIndianItems.length} South Indian Delights Available</span>
            )}
          </h2>
          <p className="subtitle">Traditional recipes • Authentic flavors • Freshly prepared</p>
        </div>
        
        {loading && (
          <div className="loading-indicator">
            <FaSpinner className="spinner" /> Loading...
          </div>
        )}
      </div>

      {/* South Indian Special Info */}
      <div className="info-banner" style={{ '--category-color': '#FF9800' }}>
        <div className="info-content">
          <div className="info-icon">🍛</div>
          <div className="info-text">
            <h3>Traditional South Indian Cuisine</h3>
            <p>Our South Indian dishes are prepared by expert chefs using authentic recipes passed down through generations. Each dish is made fresh daily.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🍽️ Banana Leaf Serving</span>
          <span className="info-feature">🌶️ Authentic Spices</span>
          <span className="info-feature">⏱️ Made Fresh</span>
          <span className="info-feature">🥥 Coconut Based</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <FaSpinner className="loading-spinner-large" />
          <p>Loading South Indian dishes...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-message">
          <h3>Unable to load South Indian dishes</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
            style={{ backgroundColor: '#FF9800' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dishes Grid */}
      {!loading && !error && sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#FF9800' }}>
          <FaUtensils className="no-items-icon" />
          <h3>No South Indian items found</h3>
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

      {/* Regional Specialties */}
      {!loading && !error && (
        <div className="benefits-section" style={{ '--category-color': '#FF9800' }}>
          <h3>
            <FaStar className="benefits-icon" />
            Regional Specialties
          </h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🍛</div>
              <h4>Chettinad Cuisine</h4>
              <p>Spicy and aromatic dishes from Tamil Nadu's Chettiar community</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🥥</div>
              <h4>Kerala Style</h4>
              <p>Rich coconut-based curries and seafood specialties</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🥘</div>
              <h4>Andhra Cuisine</h4>
              <p>Famous for its fiery hot pickles and spicy curries</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🍚</div>
              <h4>Udupi Dishes</h4>
              <p>Traditional vegetarian cuisine from Karnataka</p>
            </div>
          </div>
        </div>
      )}
    </CategoryLayout>
  );
};

export default SouthIndian;
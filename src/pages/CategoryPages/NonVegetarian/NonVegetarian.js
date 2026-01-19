import React, { useState, useEffect } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaDrumstickBite, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../components/CategoryControls.css";

const NonVegetarian = () => {
  const [sortBy] = useState("popular");
  const [viewMode] = useState("grid");
  const [nonVegItems, setNonVegItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fetch non-vegetarian items from API
  useEffect(() => {
    const fetchNonVegetarianItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('https://backend-hotel-management.onrender.com/api/products/category/non-veg', {
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch non-vegetarian items: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match your component structure
          const transformedItems = data.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || `${product.name} - Delicious non-vegetarian dish`,
            price: product.price || 0,
            category: "non-veg",
            type: product.category_name || "Non-Vegetarian",
            rating: product.rating || 4.0,
            tags: product.is_bestseller ? ["Best Seller"] : [],
            image: getImagePath(product.image),
            is_available: product.is_available !== false
          }));
          
          setNonVegItems(transformedItems);
        } else {
          throw new Error(data.message || 'Failed to load non-vegetarian items');
        }
      } catch (err) {
        console.error('Error fetching non-vegetarian items:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNonVegetarianItems();
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

  const sortedItems = [...nonVegItems].sort((a, b) => {
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
      categoryName="Non-Vegetarian"
      categorySlug="non-veg"
      categoryIcon={<FaDrumstickBite />}
      categoryDescription="Premium non-vegetarian delicacies made with fresh ingredients and authentic spices. Each dish prepared with care and tradition."
      categoryColor="#F44336"
      categoryImage="https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {loading ? (
              <span>Loading non-vegetarian dishes...</span>
            ) : error ? (
              <span>Non-Vegetarian Dishes</span>
            ) : (
              <span>{nonVegItems.length} Non-Vegetarian Dishes Available</span>
            )}
          </h2>
          <p className="subtitle">Premium quality • Fresh ingredients • Authentic spices</p>
        </div>
        
        {loading && (
          <div className="loading-indicator">
            <FaSpinner className="spinner" /> Loading...
          </div>
        )}
      </div>

      {/* Safety Banner */}
      <div className="info-banner" style={{ '--category-color': '#F44336' }}>
        <div className="info-content">
          <div className="info-icon">🔪</div>
          <div className="info-text">
            <h3>Fresh & Hygienic Preparation</h3>
            <p>All non-vegetarian items are prepared in a separate kitchen with strict hygiene standards. Meats are sourced daily from certified suppliers.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">✅ Daily Fresh Supply</span>
          <span className="info-feature">✅ Separate Preparation</span>
          <span className="info-feature">✅ Quality Certified</span>
          <span className="info-feature">✅ HACCP Standards</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <FaSpinner className="loading-spinner-large" />
          <p>Loading non-vegetarian dishes...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-message">
          <h3>Unable to load non-vegetarian dishes</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
            style={{ backgroundColor: '#F44336' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dishes Grid */}
      {!loading && !error && sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#F44336' }}>
          <FaDrumstickBite className="no-items-icon" />
          <h3>No non-vegetarian items found</h3>
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

      {/* Cooking Info */}
      {!loading && !error && (
        <div className="benefits-section" style={{ '--category-color': '#F44336' }}>
          <h3>
            <FaDrumstickBite className="benefits-icon" />
            Cooking Information
          </h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🔥</div>
              <h4>Cooking Methods</h4>
              <p>Traditional methods like dum cooking, tandoor, and slow cooking</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌶️</div>
              <h4>Authentic Spices</h4>
              <p>Grounded fresh daily, no pre-packaged spice mixes</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⏱️</div>
              <h4>Cooking Time</h4>
              <p>Properly marinated and cooked to ensure tenderness</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🍽️</div>
              <h4>Serving Style</h4>
              <p>Hot and fresh, garnished with fresh herbs and spices</p>
            </div>
          </div>
        </div>
      )}
    </CategoryLayout>
  );
};

export default NonVegetarian;
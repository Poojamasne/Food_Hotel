import React, { useState, useEffect } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaFire, FaFilter, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../components/CategoryControls.css";

const Starters = () => {
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [starterItems, setStarterItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fetch starters items from API
  useEffect(() => {
    const fetchStarterItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('https://backend-hotel-management.onrender.com/api/products/category/starters', {
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch starters: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match your component structure
          const transformedItems = data.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || `${product.name} - Perfect starter dish`,
            price: product.price || 0,
            category: product.category_slug || "veg", // You might want to check if this is veg/non-veg
            type: product.category_name?.toLowerCase() || "starters",
            rating: product.rating || 4.0,
            tags: product.is_bestseller ? ["Best Seller"] : [],
            image: getImagePath(product.image),
            is_available: product.is_available !== false
          }));
          
          setStarterItems(transformedItems);
        } else {
          throw new Error(data.message || 'Failed to load starters');
        }
      } catch (err) {
        console.error('Error fetching starters:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStarterItems();
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

  // Sort items
  const sortedItems = [...starterItems].sort((a, b) => {
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
      categoryName="Starters"
      categorySlug="starters"
      categoryIcon={<FaFire />}
      categoryDescription="Perfect appetizers to begin your meal. Crispy, flavorful, and served hot with delicious dips and chutneys."
      categoryColor="#FF5722"
      categoryImage="https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      {/* Control Bar */}
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {loading ? (
              <span>Loading starters...</span>
            ) : error ? (
              <span>Starters Available</span>
            ) : (
              <span>{starterItems.length} Starters Available</span>
            )}
          </h2>
          <p className="subtitle">Perfect beginning • Served hot • Great with drinks</p>
        </div>
        
        <div className="controls-right">
          {loading ? (
            <div className="loading-indicator">
              <FaSpinner className="spinner" />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <FaSpinner className="loading-spinner-large" />
          <p>Loading delicious starters...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-message">
          <h3>Unable to load starters</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
            style={{ backgroundColor: '#FF5722' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dishes Grid */}
      {!loading && !error && sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#FF5722' }}>
          <FaFire className="no-items-icon" />
          <h3>No starters found</h3>
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

      {/* Serving Suggestions */}
      {!loading && !error && (
        <div className="benefits-section" style={{ '--category-color': '#FF5722' }}>
          <h3>
            <FaFire className="benefits-icon" />
            Serving Suggestions
          </h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🍸</div>
              <h4>With Drinks</h4>
              <p>Perfect companions for cocktails, mocktails, and beverages</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🥘</div>
              <h4>Before Main Course</h4>
              <p>Set the tone for your meal with our delicious starters</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎉</div>
              <h4>Party Platters</h4>
              <p>Great for parties and gatherings as shareable plates</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⏰</div>
              <h4>Quick Bites</h4>
              <p>Ready in minutes for when you need something quick</p>
            </div>
          </div>
        </div>
      )}
    </CategoryLayout>
  );
};

export default Starters;
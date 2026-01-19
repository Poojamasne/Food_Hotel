import React, { useState, useEffect } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaGlassMartiniAlt, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../components/CategoryControls.css";

const Beverages = () => {
  const [sortBy] = useState("popular");
  const [viewMode] = useState("grid");
  const [beverageItems, setBeverageItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBeverageItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('https://backend-hotel-management.onrender.com/api/products/category/beverages', {
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch beverages: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          const transformedItems = data.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || `${product.name} - Refreshing drink`,
            price: product.price || 0,
            category: product.category_slug || "beverages",
            type: "beverages",
            rating: product.rating || 4.0,
            tags: product.is_bestseller ? ["Best Seller"] : [],
            image: getImagePath(product.image),
            is_available: product.is_available !== false
          }));
          
          setBeverageItems(transformedItems);
        } else {
          throw new Error(data.message || 'Failed to load beverages');
        }
      } catch (err) {
        console.error('Error fetching beverages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBeverageItems();
  }, [token]);

  const getImagePath = (apiImagePath) => {
    if (!apiImagePath) return "/images/dishes/default-food.jpg";
    if (apiImagePath.startsWith('/')) return `https://backend-hotel-management.onrender.com${apiImagePath}`;
    return apiImagePath;
  };

  const sortedItems = [...beverageItems].sort((a, b) => {
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
      categoryName="Beverages"
      categorySlug="beverages"
      categoryIcon={<FaGlassMartiniAlt />}
      categoryDescription="Refreshing drinks to complement your meal. From traditional Indian drinks to international beverages, served chilled and fresh."
      categoryColor="#2196F3"
      categoryImage="https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {loading ? "Loading beverages..." : error ? "Beverages" : `${beverageItems.length} Beverages Available`}
          </h2>
          <p className="subtitle">Refreshing • Served chilled • Perfect companions</p>
        </div>
        {loading && <div className="loading-indicator"><FaSpinner className="spinner" /></div>}
      </div>

      <div className="info-banner" style={{ '--category-color': '#2196F3' }}>
        <div className="info-content">
          <FaGlassMartiniAlt className="info-icon" />
          <div className="info-text">
            <h3>Refreshing Drinks</h3>
            <p>Our beverages are prepared fresh daily using seasonal fruits and premium ingredients. Perfect to quench your thirst.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🧊 Served Chilled</span>
          <span className="info-feature">🍹 Fresh Fruits</span>
          <span className="info-feature">🌿 Natural Ingredients</span>
          <span className="info-feature">🥤 Perfect Thirst Quenchers</span>
        </div>
      </div>

      {loading && <div className="loading-container"><FaSpinner className="loading-spinner-large" /><p>Loading beverages...</p></div>}
      {error && !loading && <div className="error-message"><h3>Unable to load beverages</h3><p>{error}</p><button className="retry-btn" style={{ backgroundColor: '#2196F3' }} onClick={() => window.location.reload()}>Try Again</button></div>}

      {!loading && !error && sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#2196F3' }}>
          <FaGlassMartiniAlt className="no-items-icon" />
          <h3>No beverages found</h3>
          <p>Check back soon for refreshing additions!</p>
        </div>
      ) : !loading && !error && (
        <div className={`dishes-grid ${viewMode}`}>
          {sortedItems.map((item) => (
            <CategoryItemCard key={item.id} item={item} viewMode={viewMode} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="benefits-section" style={{ '--category-color': '#2196F3' }}>
          <h3><FaGlassMartiniAlt className="benefits-icon" />Beverage Types</h3>
          <div className="benefits-grid">
            <div className="benefit-card"><div className="benefit-icon">🍹</div><h4>Mocktails</h4><p>Alcohol-free mixed drinks</p></div>
            <div className="benefit-card"><div className="benefit-icon">🥤</div><h4>Cold Drinks</h4><p>Iced teas, lemonades, and sodas</p></div>
            <div className="benefit-card"><div className="benefit-icon">☕</div><h4>Hot Beverages</h4><p>Coffee, tea, and hot chocolate</p></div>
            <div className="benefit-card"><div className="benefit-icon">🥛</div><h4>Milkshakes</h4><p>Thick and creamy shakes</p></div>
          </div>
        </div>
      )}
    </CategoryLayout>
  );
};

export default Beverages;
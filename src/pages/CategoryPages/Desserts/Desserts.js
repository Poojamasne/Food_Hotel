import React, { useState, useEffect } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaIceCream, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../components/CategoryControls.css";

const Desserts = () => {
  const [sortBy] = useState("popular");
  const [viewMode] = useState("grid");
  const [dessertItems, setDessertItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDessertItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:5000/api/products/category/desserts', {
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch desserts: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          const transformedItems = data.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || `${product.name} - Sweet dessert`,
            price: product.price || 0,
            category: product.category_slug || "desserts",
            type: "desserts",
            rating: product.rating || 4.0,
            tags: product.is_bestseller ? ["Best Seller"] : [],
            image: getImagePath(product.image),
            is_available: product.is_available !== false
          }));
          
          setDessertItems(transformedItems);
        } else {
          throw new Error(data.message || 'Failed to load desserts');
        }
      } catch (err) {
        console.error('Error fetching desserts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDessertItems();
  }, [token]);

  const getImagePath = (apiImagePath) => {
    if (!apiImagePath) return "/images/dishes/default-food.jpg";
    if (apiImagePath.startsWith('/')) return `http://localhost:5000${apiImagePath}`;
    return apiImagePath;
  };

  const sortedItems = [...dessertItems].sort((a, b) => {
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
      categoryName="Desserts"
      categorySlug="desserts"
      categoryIcon={<FaIceCream />}
      categoryDescription="Sweet endings to perfect meals. From traditional Indian sweets to international desserts, all made with love and finest ingredients."
      categoryColor="#E91E63"
      categoryImage="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {loading ? "Loading desserts..." : error ? "Desserts" : `${dessertItems.length} Desserts Available`}
          </h2>
          <p className="subtitle">Sweet endings • Made with love • Perfect finish</p>
        </div>
        {loading && <div className="loading-indicator"><FaSpinner className="spinner" /></div>}
      </div>

      <div className="info-banner" style={{ '--category-color': '#E91E63' }}>
        <div className="info-content">
          <FaIceCream className="info-icon" />
          <div className="info-text">
            <h3>Sweet Perfection</h3>
            <p>Our desserts are crafted with premium ingredients and traditional recipes. Perfect balance of sweetness and flavor.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🍰 Freshly Made</span>
          <span className="info-feature">🥛 Premium Ingredients</span>
          <span className="info-feature">🎂 Custom Orders</span>
          <span className="info-feature">💝 Perfect for Celebrations</span>
        </div>
      </div>

      {loading && <div className="loading-container"><FaSpinner className="loading-spinner-large" /><p>Loading desserts...</p></div>}
      {error && !loading && <div className="error-message"><h3>Unable to load desserts</h3><p>{error}</p><button className="retry-btn" style={{ backgroundColor: '#E91E63' }} onClick={() => window.location.reload()}>Try Again</button></div>}

      {!loading && !error && sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#E91E63' }}>
          <FaIceCream className="no-items-icon" />
          <h3>No desserts found</h3>
          <p>Check back soon for sweet additions!</p>
        </div>
      ) : !loading && !error && (
        <div className={`dishes-grid ${viewMode}`}>
          {sortedItems.map((item) => (
            <CategoryItemCard key={item.id} item={item} viewMode={viewMode} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="benefits-section" style={{ '--category-color': '#E91E63' }}>
          <h3><FaIceCream className="benefits-icon" />Dessert Categories</h3>
          <div className="benefits-grid">
            <div className="benefit-card"><div className="benefit-icon">🍰</div><h4>Indian Sweets</h4><p>Traditional mithai and festive sweets</p></div>
            <div className="benefit-card"><div className="benefit-icon">🍦</div><h4>Ice Creams</h4><p>Homemade ice creams and sundaes</p></div>
            <div className="benefit-card"><div className="benefit-icon">🥧</div><h4>Pastries</h4><p>Freshly baked pastries and cakes</p></div>
            <div className="benefit-card"><div className="benefit-icon">🍫</div><h4>Chocolate</h4><p>Rich chocolate-based desserts</p></div>
          </div>
        </div>
      )}
    </CategoryLayout>
  );
};

export default Desserts;
import React, { useState, useEffect } from "react";
import CategoryLayout from "../CategoryLayout";
import CategoryItemCard from "../components/CategoryItemCard";
import { FaUtensils, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../components/CategoryControls.css";

const MainCourse = () => {
  const [sortBy] = useState("popular");
  const [viewMode] = useState("grid");
  const [mainCourseItems, setMainCourseItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMainCourseItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Try main-course endpoint, fall back to all products if not exists
        let apiUrl = 'https://backend-hotel-management.onrender.com/api/products/category/main-course';
        let response = await fetch(apiUrl, { headers });
        
        // If 404, try alternative endpoints or use all products
        if (response.status === 404) {
          console.log('main-course endpoint not found, trying alternatives...');
          // Try different endpoint names or fallback
          apiUrl = 'https://backend-hotel-management.onrender.com/api/products';
          response = await fetch(apiUrl, { headers });
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch main course: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // If we fetched all products, filter for main course items
          let items = data.data;
          if (apiUrl.includes('/api/products') && !apiUrl.includes('category')) {
            items = items.filter(product => 
              product.category_name?.toLowerCase().includes('main') || 
              product.category_slug?.includes('main-course') ||
              product.name?.toLowerCase().includes('curry') ||
              product.name?.toLowerCase().includes('rice') ||
              product.name?.toLowerCase().includes('roti') ||
              product.description?.toLowerCase().includes('main course')
            );
          }

          const transformedItems = items.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || `${product.name} - Hearty main course`,
            price: product.price || 0,
            category: product.category_slug || "main-course",
            type: product.category_name || "Main Course",
            rating: product.rating || 4.0,
            tags: product.is_bestseller ? ["Best Seller"] : [],
            image: getImagePath(product.image),
            is_available: product.is_available !== false
          }));
          
          setMainCourseItems(transformedItems);
        } else {
          throw new Error(data.message || 'Failed to load main course');
        }
      } catch (err) {
        console.error('Error fetching main course:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMainCourseItems();
  }, [token]);

  const getImagePath = (apiImagePath) => {
    if (!apiImagePath) return "/images/dishes/default-food.jpg";
    if (apiImagePath.startsWith('/')) return `https://backend-hotel-management.onrender.com${apiImagePath}`;
    return apiImagePath;
  };

  const sortedItems = [...mainCourseItems].sort((a, b) => {
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
      categoryName="Main Course"
      categorySlug="main-course"
      categoryIcon={<FaUtensils />}
      categoryDescription="Hearty main courses that satisfy your hunger. Rich curries, flavorful rice dishes, and fresh breads served hot."
      categoryColor="#795548"
      categoryImage="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
    >
      <div className="category-controls">
        <div className="controls-left">
          <h2 className="dishes-count">
            {loading ? "Loading main course..." : error ? "Main Course" : `${mainCourseItems.length} Main Course Dishes Available`}
          </h2>
          <p className="subtitle">Hearty meals • Rich flavors • Served hot</p>
        </div>
        {loading && <div className="loading-indicator"><FaSpinner className="spinner" /></div>}
      </div>

      <div className="info-banner" style={{ '--category-color': '#795548' }}>
        <div className="info-content">
          <FaUtensils className="info-icon" />
          <div className="info-text">
            <h3>Complete Meals</h3>
            <p>Our main courses are designed to be complete meals. Perfectly balanced with proteins, carbs, and vegetables.</p>
          </div>
        </div>
        <div className="info-features">
          <span className="info-feature">🍚 With Rice/Bread</span>
          <span className="info-feature">🥘 Served Hot</span>
          <span className="info-feature">🌶️ Spice Levels</span>
          <span className="info-feature">🍽️ Complete Meal</span>
        </div>
      </div>

      {loading && <div className="loading-container"><FaSpinner className="loading-spinner-large" /><p>Loading main courses...</p></div>}
      {error && !loading && <div className="error-message"><h3>Unable to load main courses</h3><p>{error}</p><button className="retry-btn" style={{ backgroundColor: '#795548' }} onClick={() => window.location.reload()}>Try Again</button></div>}

      {!loading && !error && sortedItems.length === 0 ? (
        <div className="no-items" style={{ '--category-color': '#795548' }}>
          <FaUtensils className="no-items-icon" />
          <h3>No main course items found</h3>
          <p>Check back soon for hearty additions!</p>
        </div>
      ) : !loading && !error && (
        <div className={`dishes-grid ${viewMode}`}>
          {sortedItems.map((item) => (
            <CategoryItemCard key={item.id} item={item} viewMode={viewMode} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="benefits-section" style={{ '--category-color': '#795548' }}>
          <h3><FaUtensils className="benefits-icon" />Main Course Types</h3>
          <div className="benefits-grid">
            <div className="benefit-card"><div className="benefit-icon">🍛</div><h4>Rice Dishes</h4><p>Biryani, pulao, and fried rice</p></div>
            <div className="benefit-card"><div className="benefit-icon">🥘</div><h4>Curries</h4><p>Rich gravies and dry preparations</p></div>
            <div className="benefit-card"><div className="benefit-icon">🍞</div><h4>Breads</h4><p>Naan, roti, paratha, and kulcha</p></div>
            <div className="benefit-card"><div className="benefit-icon">🥗</div><h4>Combos</h4><p>Complete meal combinations</p></div>
          </div>
        </div>
      )}
    </CategoryLayout>
  );
};

export default MainCourse;
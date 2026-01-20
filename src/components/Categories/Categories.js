import React, { useState, useEffect } from "react";
import "./Categories.css";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Function to get correct image URL
  const getImageUrl = (apiImagePath, slug) => {
    console.log(`getImageUrl: apiImagePath=${apiImagePath}, slug=${slug}`);
    
    // Base URL for backend
    const baseUrl = 'https://backend-hotel-management.onrender.com';
    
    // If API returns a path, use it
    if (apiImagePath) {
      // Ensure it has the full URL
      if (apiImagePath.startsWith('http')) {
        console.log(`Using full URL: ${apiImagePath}`);
        return apiImagePath;
      }
      
      // If it starts with /, prepend baseUrl
      if (apiImagePath.startsWith('/')) {
        const fullUrl = `${baseUrl}${apiImagePath}`;
        console.log(`Prepending base URL: ${fullUrl}`);
        return fullUrl;
      }
      
      // Otherwise assume it's a relative path in uploads
      const fullUrl = `${baseUrl}/uploads/categories/${apiImagePath}`;
      console.log(`Assuming uploads path: ${fullUrl}`);
      return fullUrl;
    }
    
    // Fallback based on slug
    const fallbackUrl = `${baseUrl}/uploads/categories/${slug}.jpg`;
    console.log(`Using fallback: ${fallbackUrl}`);
    return fallbackUrl;
  };

  // Test if an image exists
  const testImageExists = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        console.log(`✅ Image exists: ${url}`);
        resolve(true);
      };
      img.onerror = () => {
        console.log(`❌ Image not found: ${url}`);
        resolve(false);
      };
      img.src = url;
    });
  };

  // Fetch categories from API
 // Updated fetchCategories function in Categories.js
useEffect(() => {
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch categories and products...');
      
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Using token for authentication');
      }

      // Step 1: Fetch all categories
      console.log('Making API request to: https://backend-hotel-management.onrender.com/api/categories');
      const catResponse = await fetch('https://backend-hotel-management.onrender.com/api/categories', {
        headers: headers
      });

      console.log('Categories API Response status:', catResponse.status);
      
      if (!catResponse.ok) {
        throw new Error(`Failed to fetch categories: ${catResponse.status} ${catResponse.statusText}`);
      }

      const catData = await catResponse.json();
      
      if (!catData.success) {
        throw new Error(catData.message || 'Failed to load categories');
      }

      console.log(`Received ${catData.data.length} categories from API`);
      
      // Step 2: Fetch all products to count items per category
      console.log('Fetching products to count items...');
      const prodResponse = await fetch('https://backend-hotel-management.onrender.com/api/products', {
        headers: headers
      });

      let productCounts = {};
      
      if (prodResponse.ok) {
        const prodData = await prodResponse.json();
        if (prodData.success) {
          console.log(`Received ${prodData.data.length} products from API`);
          
          // Count products by category_slug
          prodData.data.forEach(product => {
            const categorySlug = product.category_slug;
            if (categorySlug) {
              // Convert to lowercase for consistent matching
              const slug = categorySlug.toLowerCase().trim();
              productCounts[slug] = (productCounts[slug] || 0) + 1;
            }
          });
          
          console.log('Product counts by category:', productCounts);
        } else {
          console.warn('Products API returned error:', prodData.message);
        }
      } else {
        console.warn('Failed to fetch products:', prodResponse.status);
      }

      // Step 3: Process each category with actual item counts
      const processedCategories = await Promise.all(
        catData.data.map(async (category) => {
          const imageUrl = getImageUrl(category.image, category.slug);
          
          // Test if the image exists
          const imageExists = await testImageExists(imageUrl);
          
          // If image doesn't exist, try alternative paths
          let finalImageUrl = imageUrl;
          if (!imageExists) {
            console.log(`Testing alternative paths for ${category.name}`);
            
            // Try with /images/ instead of /uploads/
            const altUrl = imageUrl.replace('/uploads/categories/', '/images/categories/');
            const altExists = await testImageExists(altUrl);
            
            if (altExists) {
              finalImageUrl = altUrl;
              console.log(`✅ Using alternative image: ${altUrl}`);
            } else {
              console.log(`❌ No image found for ${category.name}, will use fallback`);
            }
          }
          
          // Get actual count from products data
          // Try to match category slug with product category_slug
          const categorySlug = category.slug.toLowerCase().trim();
          let actualCount = 0;
          
          // Try exact match first
          if (productCounts[categorySlug]) {
            actualCount = productCounts[categorySlug];
          } 
          // Try partial match for variations
          else {
            // Find all product counts where category slug contains category name or vice versa
            const matchingKeys = Object.keys(productCounts).filter(key => {
              return key.includes(categorySlug) || categorySlug.includes(key);
            });
            
            if (matchingKeys.length > 0) {
              actualCount = matchingKeys.reduce((sum, key) => sum + productCounts[key], 0);
            } else {
              // Use default if no match found
              actualCount = category.item_count || 0;
            }
          }
          
          console.log(`Category: ${category.name}, Slug: ${category.slug}, Count: ${actualCount}`);
          
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || `${category.name} dishes`,
            image: finalImageUrl,
            count: actualCount, // Use actual count from products
            imageExists
          };
        })
      );
      
      console.log('Processed categories with correct counts:', processedCategories);
      setCategories(processedCategories);
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      
      // Fallback to static data
      const fallbackCategories = getStaticCategories();
      console.log('Using fallback categories:', fallbackCategories);
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
}, [token]);

  // Static fallback data
  const getStaticCategories = () => {
    const baseUrl = 'https://backend-hotel-management.onrender.com';
    return [
      {
        id: 1,
        name: "Vegetarian",
        slug: "veg",
        count: 52,
        description: "Pure vegetarian dishes",
        image: `${baseUrl}/uploads/categories/veg.jpg`,
        imageExists: false
      },
      {
        id: 2,
        name: "Non-Vegetarian",
        slug: "non-veg",
        count: 64,
        description: "Chicken, mutton & seafood",
        image: `${baseUrl}/uploads/categories/non-veg.jpg`,
        imageExists: false
      },
      {
        id: 3,
        name: "South Indian",
        slug: "south-indian",
        count: 40,
        description: "Dosas, idlis & traditional meals",
        image: `${baseUrl}/uploads/categories/south-indian.jpg`,
        imageExists: false
      },
      {
        id: 4,
        name: "Starters",
        slug: "starters",
        count: 35,
        description: "Veg & non-veg starters",
        image: `${baseUrl}/uploads/categories/starters.jpg`,
        imageExists: false
      }
    ];
  };

  // Create placeholder images if needed
  useEffect(() => {
    const createPlaceholderImages = async () => {
      if (categories.length > 0) {
        const missingImages = categories.filter(cat => !cat.imageExists);
        if (missingImages.length > 0) {
          console.log('Missing images for categories:', missingImages.map(c => c.name));
          
          // You could trigger an API call to create placeholder images
          // or show a warning to the admin
        }
      }
    };
    
    createPlaceholderImages();
  }, [categories]);

  const handleCategoryClick = (slug) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/category/${slug}`);
  };

  // Loading state
  if (loading) {
    return (
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Food Categories</h2>
          </div>
          <div className="categories-loading">
            <div className="loading-spinner"></div>
            <p>Loading delicious categories...</p>
            <p className="loading-subtext">Fetching from our kitchen...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state (only if no categories at all)
  if (error && categories.length === 0) {
    return (
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Food Categories</h2>
          </div>
          <div className="categories-error">
            <div className="error-icon">⚠️</div>
            <h3>Unable to Load Categories</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button 
                className="retry-btn primary" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
              <button 
                className="retry-btn secondary" 
                onClick={() => setCategories(getStaticCategories())}
              >
                Use Demo Data
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2>Explore Our Food Categories</h2>
        </div>

        {error && (
          <div className="api-warning">
            <p>⚠️ Note: {error} - Showing available categories</p>
          </div>
        )}

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.slug)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-image">
                <div className="category-image-container">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image-real"
                    onError={(e) => {
                      console.log(`Image error for ${category.name}: ${category.image}`);
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      
                      // Create beautiful fallback
                      const fallback = document.createElement('div');
                      fallback.className = 'image-fallback';
                      fallback.style.cssText = `
                        background: linear-gradient(135deg, 
                          ${getCategoryColor(category.slug).light}, 
                          ${getCategoryColor(category.slug).dark});
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        border-radius: 8px;
                      `;
                      
                      const initials = document.createElement('span');
                      initials.className = 'fallback-text';
                      initials.textContent = category.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("");
                      initials.style.cssText = `
                        font-size: 2.5rem;
                        font-weight: bold;
                        margin-bottom: 5px;
                      `;
                      
                      const nameText = document.createElement('p');
                      nameText.className = 'fallback-name';
                      nameText.textContent = category.name;
                      nameText.style.cssText = `
                        font-size: 0.9rem;
                        opacity: 0.9;
                        text-align: center;
                        margin: 0;
                      `;
                      
                      fallback.appendChild(initials);
                      fallback.appendChild(nameText);
                      
                      // Replace image with fallback
                      e.target.parentElement.appendChild(fallback);
                    }}
                  />
                  <div className="image-overlay"></div>
                </div>
              </div>

              <div className="card-content">
                <div className="category-title">
                  <h3>{category.name}</h3>
                  <span className="item-count">{category.count} items</span>
                </div>
                <p className="category-description">{category.description}</p>
                <div className="card-footer">
                  <span className="explore-text">Explore Menu</span>
                  <span className="arrow">
                    <FaArrowRight />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <Link 
            to="/menu" 
            className="view-all-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            View Complete Menu <FaArrowRight />
          </Link>
        </div>

      </div>
    </section>
  );
};

// Helper function for fallback colors
const getCategoryColor = (slug) => {
  const colors = {
    'veg': { light: '#4CAF50', dark: '#2E7D32' },
    'non-veg': { light: '#F44336', dark: '#C62828' },
    'south-indian': { light: '#FF9800', dark: '#EF6C00' },
    'starters': { light: '#9C27B0', dark: '#6A1B9A' },
    'main-course': { light: '#2196F3', dark: '#1565C0' },
    'desserts': { light: '#FF4081', dark: '#C2185B' },
    'beverages': { light: '#00BCD4', dark: '#00838F' }
  };
  
  return colors[slug] || { light: '#8B4513', dark: '#D2691E' };
};

export default Categories;
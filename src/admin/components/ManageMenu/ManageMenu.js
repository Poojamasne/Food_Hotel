import React, { useState, useEffect, useCallback } from 'react';
import './ManageMenu.css';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaFilter, 
  FaCheck, 
  FaTimes,
  FaUpload,
  FaEye,
  FaSpinner,
  FaRedo,
  FaImage
} from 'react-icons/fa';

// All categories - moved outside component
const ALL_CATEGORIES = [
  { id: 1, name: 'Vegetarian' },
  { id: 2, name: 'Non-Vegetarian' },
  { id: 3, name: 'South Indian' },
  { id: 4, name: 'North Indian' },
  { id: 5, name: 'Chinese' },
  { id: 6, name: 'Italian' },
  { id: 7, name: 'Starters' },
  { id: 8, name: 'Main Course' },
  { id: 9, name: 'Desserts' },
  { id: 10, name: 'Beverages' }
];

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    original_price: '',
    image: null,
    imagePreview: null,
    imageFile: null,
    type: 'veg',
    tags: '',
    prep_time: '15 min',
    ingredients: '',
    is_available: true,
    is_popular: false,
    is_featured: false
  });

  // Edit item form state
  const [editItem, setEditItem] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    original_price: '',
    image: null,
    imagePreview: null,
    imageFile: null,
    type: 'veg',
    tags: '',
    prep_time: '',
    ingredients: '',
    is_available: true,
    is_popular: false,
    is_featured: false
  });

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;


  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  const handleImageUpload = (e, isEdit = false) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setEditItem({ 
          ...editItem, 
          imagePreview: reader.result,
          imageFile: file // 🔥 Make sure this is set
        });
      } else {
        setNewItem({ 
          ...newItem, 
          imagePreview: reader.result,
          imageFile: file // 🔥 Make sure this is set
        });
      }
    };
    reader.readAsDataURL(file);
  }
};


  // Fetch menu items from API
  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      // Fetch menu items
      const response = await fetch('https://backend-hotel-management.onrender.com/api/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Products API response:', data);
        
        if (data.success) {
          setMenuItems(data.data || []);
          
          // Fetch actual categories from backend
          try {
            const categoriesResponse = await fetch('https://backend-hotel-management.onrender.com/api/categories', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (categoriesResponse.ok) {
              const categoriesData = await categoriesResponse.json();
              if (categoriesData.success && categoriesData.data) {
                // Use actual categories from backend
                setCategories(categoriesData.data);
              } else {
                // Fallback to frontend categories
                setCategories(ALL_CATEGORIES);
              }
            } else {
              // Fallback to frontend categories
              setCategories(ALL_CATEGORIES);
            }
          } catch (catError) {
            console.error('Error fetching categories:', catError);
            // Fallback to frontend categories
            setCategories(ALL_CATEGORIES);
          }
        } else {
          setError(data.message || 'Failed to load menu items');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Error ${response.status}: Failed to fetch menu items`);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Handle delete item
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = getToken();
        if (!token) {
          alert('Authentication required');
          return;
        }

        const response = await fetch(`https://backend-hotel-management.onrender.com/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Remove item from state
            setMenuItems(prev => prev.filter(item => item.id !== id));
            alert('Item deleted successfully!');
          } else {
            alert(data.message || 'Failed to delete item');
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(errorData.message || 'Failed to delete item');
        }
      } catch (err) {
        console.error('Error deleting item:', err);
        alert('Error deleting item. Please try again.');
      }
    }
  };

  // Handle status change (availability toggle)
  const handleStatusChange = async (item) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Authentication required');
        return;
      }

      const updatedItem = {
        ...item,
        is_available: !item.is_available
      };

      const response = await fetch(`https://backend-hotel-management.onrender.com/api/admin/products/${item.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updatedItem.name,
          description: updatedItem.description,
          price: updatedItem.price,
          is_available: updatedItem.is_available,
          is_popular: updatedItem.is_popular,
          is_featured: updatedItem.is_featured
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMenuItems(prev =>
  prev.map(i =>
    i.id === item.id
      ? { ...i, is_available: updatedItem.is_available }
      : i
  )
);

          alert(`Item ${updatedItem.is_available ? 'activated' : 'deactivated'} successfully!`);
        } else {
          alert(data.message || 'Failed to update item status');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update item status');
      }
    } catch (err) {
      console.error('Error updating item status:', err);
      alert('Error updating item status. Please try again.');
    }
  };

  // Handle add new item
const handleAddItem = async () => {
  if (!newItem.name || !newItem.price || !newItem.category_id) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    setIsSubmitting(true);
    const token = getToken();
    if (!token) {
      alert('Authentication required');
      return;
    }

    const formData = new FormData();

    formData.append('name', newItem.name);
    formData.append('description', newItem.description || '');
    formData.append('price', newItem.price);
    formData.append('original_price', newItem.original_price || newItem.price);
    formData.append('category_id', newItem.category_id);
    formData.append('type', newItem.type);
    formData.append('prep_time', newItem.prep_time || '15 min');
    formData.append('is_available', newItem.is_available);
    formData.append('is_popular', newItem.is_popular);
    formData.append('is_featured', newItem.is_featured);

    if (newItem.tags) {
      formData.append(
        'tags',
        JSON.stringify(newItem.tags.split(',').map(t => t.trim()))
      );
    }

    if (newItem.ingredients) {
      formData.append(
        'ingredients',
        JSON.stringify(newItem.ingredients.split(',').map(i => i.trim()))
      );
    }

    // 🔥 THIS IS THE MOST IMPORTANT LINE
    if (newItem.imageFile) {
      formData.append('image', newItem.imageFile);
    }

    const response = await fetch(
      'https://backend-hotel-management.onrender.com/api/products',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
          // ❌ DO NOT set Content-Type
        },
        body: formData
      }
    );

    const data = await response.json();

    if (data.success) {
      alert('Item added successfully!');
      setShowAddModal(false);
      resetNewItemForm();
      fetchMenuItems();
    } else {
      alert(data.message || 'Failed to add item');
    }
  } catch (err) {
    console.error(err);
    alert('Error adding item');
  } finally {
    setIsSubmitting(false);
  }
};

// Handle edit item - IMPROVED
const handleEditItem = (item) => {
  console.log('Editing item:', item);
  
  setSelectedItem(item);
  
  // Convert JSON arrays to display strings
  let tagsDisplay = '';
  if (item.tags) {
    if (Array.isArray(item.tags)) {
      tagsDisplay = item.tags.join(', ');
    } else if (typeof item.tags === 'string') {
      try {
        const parsed = JSON.parse(item.tags);
        tagsDisplay = Array.isArray(parsed) ? parsed.join(', ') : item.tags;
      } catch {
        tagsDisplay = item.tags;
      }
    }
  }
  
  let ingredientsDisplay = '';
  if (item.ingredients) {
    if (Array.isArray(item.ingredients)) {
      ingredientsDisplay = item.ingredients.join(', ');
    } else if (typeof item.ingredients === 'string') {
      try {
        const parsed = JSON.parse(item.ingredients);
        ingredientsDisplay = Array.isArray(parsed) ? parsed.join(', ') : item.ingredients;
      } catch {
        ingredientsDisplay = item.ingredients;
      }
    }
  }
  
  // IMPORTANT: Make sure category_id is set correctly
  const categoryId = item.category_id || '2'; // Default to Non-Veg if not found
  
  setEditItem({
    name: item.name || '',
    description: item.description || '',
    category_id: categoryId,
    price: item.price || '',
    original_price: item.original_price || item.price || '',
    image: item.image || null,
    imagePreview: item.image || null,
    imageFile: null,
    type: item.type || 'non-veg',
    tags: tagsDisplay,
    prep_time: item.prep_time || '15 min',
    ingredients: ingredientsDisplay,
    is_available: item.is_available !== undefined ? item.is_available : true,
    is_popular: item.is_popular !== undefined ? item.is_popular : false,
    is_featured: item.is_featured !== undefined ? item.is_featured : false
  });
  
  console.log('Edit item state set:', {
    name: item.name,
    category_id: categoryId,
    price: item.price,
    type: item.type
  });
  
  setShowEditModal(true);
};

const handleUpdateItem = async () => {
  try {
    setIsSubmitting(true);
    const token = getToken();
    
    if (!token) {
      alert('Authentication required');
      setIsSubmitting(false);
      return;
    }

    if (!selectedItem || !selectedItem.id) {
      alert('No item selected for update');
      setIsSubmitting(false);
      return;
    }

    // Create FormData object
    const formData = new FormData();
    
    // Add all form fields from editItem state
    formData.append('name', editItem.name || selectedItem.name);
    formData.append('description', editItem.description || '');
    formData.append('price', editItem.price || '0');
    
    // Add original price if exists
    if (editItem.original_price) {
      formData.append('original_price', editItem.original_price);
    }
    
    // Add category_id - make sure it's a number
    formData.append('category_id', editItem.category_id || selectedItem.category_id || '2');
    
    // Add food type
    formData.append('type', editItem.type || 'non-veg');
    
    // Add preparation time
    formData.append('prep_time', editItem.prep_time || '15 min');
    
    // Add availability status
    formData.append('is_available', editItem.is_available ? 'true' : 'false');
    
    // Add popularity and featured status
    formData.append('is_popular', editItem.is_popular ? 'true' : 'false');
    formData.append('is_featured', editItem.is_featured ? 'true' : 'false');
    
    // Add tags if exists
    if (editItem.tags && editItem.tags.trim()) {
      try {
        // Check if it's already an array
        if (typeof editItem.tags === 'string' && editItem.tags.includes('[')) {
          formData.append('tags', editItem.tags);
        } else {
          const tagsArray = editItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          formData.append('tags', JSON.stringify(tagsArray));
        }
      } catch (error) {
        console.error('Error processing tags:', error);
      }
    }
    
    // Add ingredients if exists
    if (editItem.ingredients && editItem.ingredients.trim()) {
      try {
        if (typeof editItem.ingredients === 'string' && editItem.ingredients.includes('[')) {
          formData.append('ingredients', editItem.ingredients);
        } else {
          const ingredientsArray = editItem.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing);
          formData.append('ingredients', JSON.stringify(ingredientsArray));
        }
      } catch (error) {
        console.error('Error processing ingredients:', error);
      }
    }
    
    // Add image file if new image is selected
    if (editItem.imageFile) {
      formData.append('image', editItem.imageFile);
      console.log('New image file added:', editItem.imageFile.name);
    } else if (editItem.image) {
      // Keep existing image path
      formData.append('image', editItem.image);
      console.log('Keeping existing image:', editItem.image);
    }

    // Debug: Log all form data entries
    console.log('=== FORM DATA BEING SENT ===');
    console.log('Product ID:', selectedItem.id);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Send update request
    const response = await fetch(
      `https://backend-hotel-management.onrender.com/api/admin/products/${selectedItem.id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // DO NOT set Content-Type for FormData - browser sets it automatically
        },
        body: formData
      }
    );

    const result = await response.json();
    console.log('Server response:', result);
    
    if (response.ok && result.success) {
      alert('Item updated successfully!');
      setShowEditModal(false);
      setSelectedItem(null);
      fetchMenuItems(); // Refresh the list
    } else {
      alert(`Error: ${result.message || 'Update failed'}`);
    }
    
  } catch (err) {
    console.error('Update error:', err);
    alert('Error: ' + (err.message || 'Something went wrong'));
  } finally {
    setIsSubmitting(false);
  }
};

  const resetNewItemForm = () => {
    setNewItem({
      name: '',
      description: '',
      category_id: '',
      price: '',
      original_price: '',
      image: null,
      imagePreview: null,
      imageFile: null,
      type: 'veg',
      tags: '',
      prep_time: '15 min',
      ingredients: '',
      is_available: true,
      is_popular: false,
      is_featured: false
    });
  };

  // Helper function to infer category
  const inferCategory = (item) => {
    if (item.category_name) return item.category_name;
    
    // Try to find category from categories array
    if (item.category_id) {
      const foundCategory = categories.find(cat => {
        if (typeof cat === 'object') {
          return cat.id === item.category_id;
        }
        return false;
      });
      if (foundCategory && typeof foundCategory === 'object') {
        return foundCategory.name;
      }
    }
    
    // Fallback to name-based inference
    const name = item.name?.toLowerCase() || '';
    const type = item.type || 'veg';
    
    if (type === 'veg') {
      if (name.includes('dosa') || name.includes('idli') || name.includes('uttapam')) {
        return 'South Indian';
      }
      return 'Vegetarian';
    }
    
    if (type === 'non-veg') {
      if (name.includes('biryani') || name.includes('curry') || name.includes('masala')) {
        return 'Non-Vegetarian';
      }
    }
    
    return type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian';
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (Array.isArray(item.tags) && item.tags.some(tag => 
                           tag.toLowerCase().includes(searchQuery.toLowerCase())
                         ));
    const matchesCategory = selectedCategory === 'All' || inferCategory(item) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

const paginatedItems = filteredItems.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, selectedCategory]);


  const getImagePreview = (image) => {
    if (!image || image === 'null' || image === 'undefined' || image === '') {
      return null;
    }
    
    if (image.startsWith('data:image')) {
      return image;
    }
    
    if (image.startsWith('http')) {
      return image;
    }
    
    if (image.startsWith('/')) {
      // Convert relative paths to absolute URLs
      if (image.startsWith('/images/')) {
        return `https://food-hotel-one.vercel.app${image}`;
      }
      return `https://backend-hotel-management.onrender.com${image}`;
    }
    
    if (image.length > 1000 && !image.includes(' ') && !image.includes('<')) {
      return `data:image/jpeg;base64,${image}`;
    }
    
    return null;
  };

  const getStatusText = (isAvailable) => {
    return isAvailable ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <div className="manage-menu">
        <div className="page-header">
          <h1>Manage Menu</h1>
          <button className="add-btn" disabled>
            <FaSpinner className="spinner" /> Loading...
          </button>
        </div>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-menu">
        <div className="page-header">
          <h1>Manage Menu</h1>
          <button className="add-btn" onClick={fetchMenuItems}>
            <FaRedo /> Retry
          </button>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchMenuItems} className="retry-btn">
            <FaRedo /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-menu">
      <div className="page-header">
        <h1>Manage Menu</h1>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Add New Item
        </button>
      </div>

      <div className="filters-bar">
        {/* <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}
        
        <div className="filter-group">
          <FaFilter />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map((cat, index) => {
              const categoryName = typeof cat === 'object' ? cat.name : cat;
              const categoryId = typeof cat === 'object' ? cat.id : index;
              
              return (
                <option key={categoryId} value={categoryName}>
                  {categoryName}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="menu-stats">
        <div className="stat-card">
          <h3>Total Items</h3>
          <p>{menuItems.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Items</h3>
          <p>{menuItems.filter(item => item.is_available).length}</p>
        </div>
        <div className="stat-card">
          <h3>Categories</h3>
          <p>{categories.length}</p>
        </div>
        <div className="stat-card">
          <h3>Vegetarian Items</h3>
          <p>{menuItems.filter(item => item.type === 'veg').length}</p>
        </div>
        <div className="stat-card">
          <h3>Non-Veg Items</h3>
          <p>{menuItems.filter(item => item.type === 'non-veg').length}</p>
        </div>
      </div>

      <div className="menu-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Type</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  <p>No menu items found</p>
                </td>
              </tr>
            ) : (
              paginatedItems.map(item => {
                const originalPrice = item.original_price || item.price;
                const discountPercentage = originalPrice > item.price 
                  ? Math.round(((originalPrice - item.price) / originalPrice) * 100)
                  : 0;
                const hasDiscount = discountPercentage > 0;
                const imagePreview = getImagePreview(item.image);
                
                return (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td className="item-cell">
                      <div className="item-info">
                        <div className="item-image">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt={item.name} 
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="no-image-placeholder">
                              <FaImage />
                              <span>No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="item-details">
                          <div className="item-name-row">
                            <h4>{item.name}</h4>
                            {item.is_popular && <span className="popular-badge">Popular</span>}
                            {item.is_featured && <span className="featured-badge">Featured</span>}
                          </div>
                          <p className="item-description">{item.description}</p>
                          {hasDiscount && (
                            <div className="discount-info">
                              <span className="original-price">₹{originalPrice}</span>
                              <span className="discount-badge">{discountPercentage}% OFF</span>
                            </div>
                          )}
                          {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                            <div className="item-tags">
                              {item.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="tag-badge">{tag}</span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="tag-badge">+{item.tags.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={item.type === 'veg' ? 'veg-badge' : 'nonveg-badge'}>
                        {item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td>{inferCategory(item)}</td>
                    <td>
                      <div className="price-cell">
                        {hasDiscount ? (
                          <>
                            <span className="discounted-price">₹{item.price}</span>
                            <span className="original-price-small">₹{originalPrice}</span>
                          </>
                        ) : (
                          <span>₹{item.price}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${item.is_available ? 'active' : 'inactive'}`}>
                        {getStatusText(item.is_available)}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleEditItem(item)}
                      >
                        <FaEye /> View
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditItem(item)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className={`action-btn status-btn ${item.is_available ? 'deactivate-btn' : 'activate-btn'}`}
                        onClick={() => handleStatusChange(item)}
                      >
                        {item.is_available ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
       {totalPages > 1 && filteredItems.length > 0 && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(p => p - 1)}
    >
      Prev
    </button>

    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      // Show only 5 pages at most
      let page;
      if (totalPages <= 5) {
        page = i + 1;
      } else if (currentPage <= 3) {
        page = i + 1;
      } else if (currentPage >= totalPages - 2) {
        page = totalPages - 4 + i;
      } else {
        page = currentPage - 2 + i;
      }
      
      return (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      );
    })}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(p => p + 1)}
    >
      Next
    </button>
    
    <span className="page-info">
      Page {currentPage} of {totalPages} ({filteredItems.length} items)
    </span>
  </div>
)}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Menu Item</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  resetNewItemForm();
                }}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Item Name </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Enter item name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label>Price (₹) </label>
                  <div className="price-input">
      
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      placeholder="Enter price"
                      min="1"
                      step="0.01"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <div className="price-input">
                    
                    <input
                      type="number"
                      value={newItem.original_price}
                      onChange={(e) => setNewItem({...newItem, original_price: e.target.value})}
                      placeholder="Enter original price for discount"
                      min="1"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Category </label>
                  <select
                    value={newItem.category_id}
                    onChange={(e) => setNewItem({...newItem, category_id: e.target.value})}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => {
                      const categoryId = typeof cat === 'object' ? cat.id : index + 1;
                      const categoryName = typeof cat === 'object' ? cat.name : cat;
                      
                      return (
                        <option key={categoryId} value={categoryId}>
                          {categoryName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Enter item description"
                  rows="3"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Food Type</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type"
                        value="veg"
                        checked={newItem.type === 'veg'}
                        onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                        disabled={isSubmitting}
                      />
                      <span className="veg-radio">Vegetarian</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type"
                        value="non-veg"
                        checked={newItem.type === 'non-veg'}
                        onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                        disabled={isSubmitting}
                      />
                      <span className="nonveg-radio">Non-Vegetarian</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Preparation Time</label>
                  <select
                    value={newItem.prep_time}
                    onChange={(e) => setNewItem({...newItem, prep_time: e.target.value})}
                    disabled={isSubmitting}
                  >
                    <option value="5 min">5 mins</option>
                    <option value="10 min">10 mins</option>
                    <option value="15 min">15 mins</option>
                    <option value="20 min">20 mins</option>
                    <option value="25 min">25 mins</option>
                    <option value="30 min">30 mins</option>
                    <option value="35+ min">35+ mins</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newItem.tags}
                    onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
                    placeholder="Popular, Spicy, Recommended, Healthy"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label>Ingredients (comma separated)</label>
                  <input
                    type="text"
                    value={newItem.ingredients}
                    onChange={(e) => setNewItem({...newItem, ingredients: e.target.value})}
                    placeholder="Tomato, Onion, Spices, Cheese, etc."
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Availability</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newItem.is_available}
                        onChange={(e) => setNewItem({...newItem, is_available: e.target.checked})}
                        disabled={isSubmitting}
                      />
                      Available
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Special Badges</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newItem.is_popular}
                        onChange={(e) => setNewItem({...newItem, is_popular: e.target.checked})}
                        disabled={isSubmitting}
                      />
                      Popular
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newItem.is_featured}
                        onChange={(e) => setNewItem({...newItem, is_featured: e.target.checked})}
                        disabled={isSubmitting}
                      />
                      Featured
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Item Image</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {newItem.imagePreview ? (
                      <img src={newItem.imagePreview} alt="Preview" />
                    ) : (
                      <div className="image-placeholder">
                        <FaImage />
                        <span>No image selected</span>
                        <small>Recommended: 600x600px, Max 5MB</small>
                      </div>
                    )}
                  </div>
                  <div className="upload-controls">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="file-input"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="image-upload" className="upload-btn" style={isSubmitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
                      <FaUpload /> {newItem.imagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                    {newItem.imageFile && (
                      <p className="upload-info">
                        File: {newItem.imageFile.name} ({Math.round(newItem.imageFile.size / 1024)}KB)
                      </p>
                    )}
                    <p className="upload-note">Images will be compressed to reduce size</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowAddModal(false);
                  resetNewItemForm();
                }}
                disabled={isSubmitting}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleAddItem}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" /> Adding...
                  </>
                ) : (
                  <>
                    <FaCheck /> Add Item
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Menu Item</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) => setEditItem({...editItem, name: e.target.value})}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <div className="price-input">
                    
                    <input
                      type="number"
                      value={editItem.price}
                      onChange={(e) => setEditItem({...editItem, price: e.target.value})}
                      min="1"
                      step="0.01"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <div className="price-input">
                   
                    <input
                      type="number"
                      value={editItem.original_price}
                      onChange={(e) => setEditItem({...editItem, original_price: e.target.value})}
                      min="1"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editItem.category_id}
                    onChange={(e) => setEditItem({...editItem, category_id: e.target.value})}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => {
                      const categoryId = typeof cat === 'object' ? cat.id : index + 1;
                      const categoryName = typeof cat === 'object' ? cat.name : cat;
                      
                      return (
                        <option key={categoryId} value={categoryId}>
                          {categoryName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editItem.description}
                  onChange={(e) => setEditItem({...editItem, description: e.target.value})}
                  rows="3"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Food Type</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="editType"
                        value="veg"
                        checked={editItem.type === 'veg'}
                        onChange={(e) => setEditItem({...editItem, type: e.target.value})}
                        disabled={isSubmitting}
                      />
                      <span className="veg-radio">Vegetarian</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="editType"
                        value="non-veg"
                        checked={editItem.type === 'non-veg'}
                        onChange={(e) => setEditItem({...editItem, type: e.target.value})}
                        disabled={isSubmitting}
                      />
                      <span className="nonveg-radio">Non-Vegetarian</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Preparation Time</label>
                  <select
                    value={editItem.prep_time}
                    onChange={(e) => setEditItem({...editItem, prep_time: e.target.value})}
                    disabled={isSubmitting}
                  >
                    <option value="5 min">5 mins</option>
                    <option value="10 min">10 mins</option>
                    <option value="15 min">15 mins</option>
                    <option value="20 min">20 mins</option>
                    <option value="25 min">25 mins</option>
                    <option value="30 min">30 mins</option>
                    <option value="35+ min">35+ mins</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editItem.tags}
                    onChange={(e) => setEditItem({...editItem, tags: e.target.value})}
                    placeholder="Popular, Spicy, Recommended, Healthy"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label>Ingredients (comma separated)</label>
                  <input
                    type="text"
                    value={editItem.ingredients}
                    onChange={(e) => setEditItem({...editItem, ingredients: e.target.value})}
                    placeholder="Tomato, Onion, Spices, Cheese, etc."
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Availability</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editItem.is_available}
                        onChange={(e) => setEditItem({...editItem, is_available: e.target.checked})}
                        disabled={isSubmitting}
                      />
                      Available
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Special Badges</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editItem.is_popular}
                        onChange={(e) => setEditItem({...editItem, is_popular: e.target.checked})}
                        disabled={isSubmitting}
                      />
                      Popular
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editItem.is_featured}
                        onChange={(e) => setEditItem({...editItem, is_featured: e.target.checked})}
                        disabled={isSubmitting}
                      />
                      Featured
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Item Image</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {editItem.imagePreview ? (
                      <img src={getImagePreview(editItem.imagePreview)} alt="Preview" />
                    ) : (
                      <div className="image-placeholder">
                        <FaImage />
                        <span>No image selected</span>
                        <small>Current image will be kept</small>
                      </div>
                    )}
                  </div>
                  <div className="upload-controls">
                    <input
                      type="file"
                      id="edit-image-upload"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="file-input"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="edit-image-upload" className="upload-btn" style={isSubmitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
                      <FaUpload /> Change Image
                    </label>
                    {editItem.imageFile && (
                      <p className="upload-info">
                        New file: {editItem.imageFile.name} ({Math.round(editItem.imageFile.size / 1024)}KB)
                      </p>
                    )}
                    <p className="upload-note">Leave empty to keep current image</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                disabled={isSubmitting}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleUpdateItem}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" /> Updating...
                  </>
                ) : (
                  <>
                    <FaCheck /> Update Item
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
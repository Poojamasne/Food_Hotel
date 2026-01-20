import React, { useState, useEffect, useCallback } from 'react';
import './ManageCategories.css';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner, FaRedo, FaUpload, FaImage } from 'react-icons/fa';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ 
    name: '', 
    description: '', 
    image: '', 
    imageFile: null,
    imagePreview: '',
    display_order: 0 
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    description: '', 
    image: '', 
    imageFile: null,
    imagePreview: '',
    display_order: 0 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Image compression function
  const compressImage = async (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      if (!file) reject(new Error('No file provided'));
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed JPEG
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }
              
              // Create a new File from the Blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = reject;
      };
      
      reader.onerror = reject;
    });
  };

  // Sort categories by display_order DESC
const sortCategories = (list) => {
  return [...list].sort(
    (a, b) => (b.display_order || 0) - (a.display_order || 0)
  );
};


  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch('https://backend-hotel-management.onrender.com/api/categories', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Categories API response:', data);
        
        if (data.success) {
           setCategories(sortCategories(data.data || []));
        } else {
          setError(data.message || 'Failed to load categories');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Error ${response.status}: Failed to fetch categories`);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle delete category
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        const token = getToken();
        if (!token) {
          alert('Authentication required');
          return;
        }

        const response = await fetch(`https://backend-hotel-management.onrender.com/api/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Remove category from state
            setCategories(prev =>
  sortCategories(prev.filter(cat => cat.id !== id))
);
            alert('Category deleted successfully!');
          } else {
            alert(data.message || 'Failed to delete category');
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(errorData.message || 'Failed to delete category');
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  // Handle image upload
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
          setEditData({ 
            ...editData, 
            imagePreview: reader.result,
            imageFile: file 
          });
        } else {
          setNewCategory({ 
            ...newCategory, 
            imagePreview: reader.result,
            imageFile: file 
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start editing a category
  const startEditing = (category) => {
    setEditingId(category.id);
    setEditData({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      imageFile: null,
      imagePreview: category.image || '',
      display_order: category.display_order || 0
    });
  };

  // Save edited category
  const saveEdit = async () => {
    if (!editData.name.trim() || !editData.description.trim()) {
      alert('Name and description are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!token) {
        alert('Authentication required');
        setIsSubmitting(false);
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('name', editData.name.trim());
      formData.append('description', editData.description.trim());
      formData.append('display_order', parseInt(editData.display_order) || 0);
      
      // If a new image file was uploaded, compress and add it to FormData
      if (editData.imageFile) {
        try {
          // Compress the image before sending
          const compressedFile = await compressImage(editData.imageFile, 800, 0.7);
          formData.append('image', compressedFile);
          console.log('Original size:', Math.round(editData.imageFile.size / 1024), 'KB');
          console.log('Compressed size:', Math.round(compressedFile.size / 1024), 'KB');
        } catch (error) {
          console.warn('Image compression failed:', error);
          // Fallback to original file
          formData.append('image', editData.imageFile);
        }
      }

      const response = await fetch(`https://backend-hotel-management.onrender.com/api/categories/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update category in state
          setCategories(prev =>
  sortCategories(
    prev.map(cat =>
      cat.id === editingId ? data.data : cat
    )
  )
);
          setEditingId(null);
          setEditData({ 
            name: '', 
            description: '', 
            image: '', 
            imageFile: null,
            imagePreview: '',
            display_order: 0 
          });
          alert('Category updated successfully!');
        } else {
          alert(data.message || 'Failed to update category');
        }
      } else {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        
        if (response.status === 413) {
          alert('Image file is too large. Please use a smaller image (max 5MB).');
        } else {
          try {
            const errorData = JSON.parse(errorText);
            alert(errorData.message || `Error ${response.status}: Failed to update category`);
          } catch {
            alert(`Error ${response.status}: Failed to update category`);
          }
        }
      }
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Error updating category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ 
      name: '', 
      description: '', 
      image: '', 
      imageFile: null,
      imagePreview: '',
      display_order: 0 
    });
  };

  // Handle add new category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      alert('Please enter both name and description');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!token) {
        alert('Authentication required');
        setIsSubmitting(false);
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('name', newCategory.name.trim());
      formData.append('description', newCategory.description.trim());
      formData.append('display_order', parseInt(newCategory.display_order) || 0);
      
      // If an image file was uploaded, compress and add it to FormData
      if (newCategory.imageFile) {
        try {
          // Compress the image before sending
          const compressedFile = await compressImage(newCategory.imageFile, 800, 0.7);
          formData.append('image', compressedFile);
          console.log('Original size:', Math.round(newCategory.imageFile.size / 1024), 'KB');
          console.log('Compressed size:', Math.round(compressedFile.size / 1024), 'KB');
        } catch (error) {
          console.warn('Image compression failed:', error);
          // Fallback to original file
          formData.append('image', newCategory.imageFile);
        }
      }

      const response = await fetch('https://backend-hotel-management.onrender.com/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                // Add new category to state
                setCategories(prev =>
        sortCategories([...prev, data.data])
      );
                setNewCategory({ 
                  name: '', 
                  description: '', 
                  image: '', 
                  imageFile: null,
                  imagePreview: '',
                  display_order: 0 
                });
                setShowAddModal(false);
                alert('Category added successfully!');
              } else {
                alert(data.message || 'Failed to add category');
              }
      } else {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        
        if (response.status === 413) {
          alert('Image file is too large. Please use a smaller image (max 5MB).');
        } else {
          try {
            const errorData = JSON.parse(errorText);
            alert(errorData.message || `Error ${response.status}: Failed to add category`);
          } catch {
            alert(`Error ${response.status}: Failed to add category`);
          }
        }
      }
    } catch (err) {
      console.error('Error adding category:', err);
      alert('Error adding category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate slug from name
  const generateSlug = (name) => {
    if (!name) return '';
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Get item count for display
  const getItemCount = (category) => {
    return category.item_count || 0;
  };

  // Get status
  const getCategoryStatus = (category) => {
    return category.is_active ? 'Active' : 'Inactive';
  };

  // Get image preview URL
  const getImagePreview = (image) => {
    if (!image || image === 'null' || image === 'undefined' || image === '') {
      return '/images/categories/default.jpg';
    }
    
    if (image.startsWith('data:image')) {
      return image;
    }
    
    if (image.startsWith('http')) {
      return image;
    }
    
    if (image.startsWith('/')) {
      // If it's a local path, prepend the server URL
      return `https://backend-hotel-management.onrender.com${image}`;
    }
    
    return '/images/categories/default.jpg';
  };

  if (loading) {
    return (
      <div className="manage-categories">
        <div className="page-header">
          <h1>Manage Categories</h1>
          <button className="add-btn" disabled>
            <FaSpinner className="spinner" /> Loading...
          </button>
        </div>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-categories">
        <div className="page-header">
          <h1>Manage Categories</h1>
          <button className="add-btn" onClick={fetchCategories}>
            <FaRedo /> Retry
          </button>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchCategories} className="retry-btn">
            <FaRedo /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-categories">
      <div className="page-header">
        <h1>Manage Categories</h1>
        <button 
          className="add-btn" 
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Add New Category
        </button>
      </div>

      <div className="table-scroll-wrapper">
      <div className="categories-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Items Count</th>
              <th>Display Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  <p>No categories found</p>
                </td>
              </tr>
            ) : (
              categories.map((category, index) => {
                const slug = category.slug || generateSlug(category.name);
                const itemCount = getItemCount(category);
                const status = getCategoryStatus(category);
                
                return (
                  <tr key={category.id}>
                    <td>#{index + 1}</td>

                    
                    <td className="category-cell">
                      <div className="category-info">
                        <div className="category-image">
                          <img 
                            src={getImagePreview(category.image)} 
                            alt={category.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/categories/default.jpg';
                            }}
                          />
                        </div>
                        <div className="category-details">
                          {editingId === category.id ? (
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData({...editData, name: e.target.value})}
                              className="edit-input"
                              autoFocus
                              disabled={isSubmitting}
                              placeholder="Category Name"
                            />
                          ) : (
                            <strong>{category.name}</strong>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <span className="slug-text">{slug}</span>
                    </td>
                    
                    <td className="description-cell">
                      {editingId === category.id ? (
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          className="edit-textarea"
                          rows="2"
                          disabled={isSubmitting}
                          placeholder="Category description"
                        />
                      ) : (
                        <span title={category.description}>
                          {category.description && category.description.length > 50 
                            ? `${category.description.substring(0, 50)}...` 
                            : category.description || 'No description'}
                        </span>
                      )}
                    </td>
                    
                    <td className="item-count">{itemCount} items</td>
                    
                    <td>
                      {editingId === category.id ? (
                        <input
                          type="number"
                          value={editData.display_order}
                          onChange={(e) => setEditData({...editData, display_order: e.target.value})}
                          className="edit-input order-input"
                          min="0"
                          disabled={isSubmitting}
                        />
                      ) : (
                        <span className="order-badge">{category.display_order || 0}</span>
                      )}
                    </td>
                    
                    <td>
                      <span className={`status-badge status-${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>
                    
                    <td className="actions">
                      {editingId === category.id ? (
                        <>
                          <button 
                            className="action-btn save-btn"
                            onClick={saveEdit}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <FaSpinner className="spinner" />
                            ) : (
                              <FaCheck />
                            )} Save
                          </button>
                          <button 
                            className="action-btn cancel-btn"
                            onClick={cancelEdit}
                            disabled={isSubmitting}
                          >
                            <FaTimes /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => startEditing(category)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(category.id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Category</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategory({ 
                    name: '', 
                    description: '', 
                    image: '', 
                    imageFile: null,
                    imagePreview: '',
                    display_order: 0 
                  });
                }}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({
                    ...newCategory, 
                    name: e.target.value
                  })}
                  placeholder="e.g., Vegetarian"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({
                    ...newCategory, 
                    description: e.target.value
                  })}
                  placeholder="Enter category description"
                  rows="3"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={newCategory.display_order}
                    onChange={(e) => setNewCategory({
                      ...newCategory, 
                      display_order: e.target.value
                    })}
                    placeholder="0"
                    min="0"
                    disabled={isSubmitting}
                  />
                  <small className="help-text">
                    Higher numbers appear first
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label>Category Image</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {newCategory.imagePreview ? (
                      <img src={newCategory.imagePreview} alt="Category Preview" />
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
                      id="category-image-upload"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="file-input"
                      disabled={isSubmitting}
                    />
                    <label 
                      htmlFor="category-image-upload" 
                      className="upload-btn" 
                      style={isSubmitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                    >
                      <FaUpload /> {newCategory.imagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                    {newCategory.imageFile && (
                      <p className="upload-info">
                        File: {newCategory.imageFile.name} ({Math.round(newCategory.imageFile.size / 1024)}KB)
                        <br />
                        <small>Will be compressed to reduce size</small>
                      </p>
                    )}
                    <p className="upload-note">
                      Optional. Image will be automatically compressed. Leave empty for default image.
                    </p>
                  </div>
                </div>
              </div>

              
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategory({ 
                    name: '', 
                    description: '', 
                    image: '', 
                    imageFile: null,
                    imagePreview: '',
                    display_order: 0 
                  });
                }}
                disabled={isSubmitting}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleAddCategory}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" /> Adding...
                  </>
                ) : (
                  <>
                    <FaPlus /> Add Category
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

export default ManageCategories;
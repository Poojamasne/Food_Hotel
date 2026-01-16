import React from "react";
import "./CategoryLayout.css";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaFire,
  FaStar,
  FaLeaf,
  FaDrumstickBite,
  FaClock,
  FaUtensils,
  FaPercent,
  FaShoppingCart,
  FaHeart
} from "react-icons/fa";

const CategoryLayout = ({ 
  children, 
  categoryName, 
  categorySlug,
  categoryIcon, 
  categoryDescription,
  categoryColor = "#8B4513",
  categoryImage
}) => {
  
  return (
    <div className="category-page">
      {/* Category Header */}
      <div 
        className="category-header"
        style={{
          background: `linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(210, 105, 30, 0.9)), url(${categoryImage})`,
          '--category-color': categoryColor
        }}
      >
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <FaArrowLeft /> Back to Home
            </Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/menu" className="breadcrumb-link">Menu</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{categoryName}</span>
          </div>

          <div className="header-content">
            <div className="category-icon">
              {categoryIcon}
            </div>
            <div className="category-info">
              <h1>{categoryName}</h1>
              <p className="category-description">{categoryDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Main Content */}
        <main className="category-main">
          {children}
        </main>

        {/* CTA Section */}
        <div className="category-cta">
          <div className="cta-content">
            <h2>Want Something Customized?</h2>
            <p>Our chefs can prepare dishes according to your preferences and dietary needs.</p>
            <div className="cta-buttons">
              <Link to="/menu" className="cta-btn primary">
                <FaShoppingCart /> Customize Order
              </Link>
              <Link to="/contact" className="cta-btn secondary">
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryLayout;
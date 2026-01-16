import React from "react";
import "./OfferFilters.css";
import { 
  FaFire, 
  FaClock, 
  FaTag, 
  FaPercent, 
  FaUtensils,
  FaCoffee,
  FaSun,
  FaMoon,
  FaUsers
} from "react-icons/fa";

const OfferFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "All Offers", icon: <FaFire />, color: "#FF5722" },
    { id: "combo", label: "Combo Deals", icon: <FaTag />, color: "#4CAF50" },
    { id: "buffet", label: "Buffet", icon: <FaUtensils />, color: "#2196F3" },
    { id: "lunch", label: "Lunch Specials", icon: <FaSun />, color: "#FF9800" },
    { id: "dinner", label: "Dinner Deals", icon: <FaMoon />, color: "#9C27B0" },
    { id: "breakfast", label: "Breakfast", icon: <FaCoffee />, color: "#795548" },
    { id: "beverages", label: "Drinks", icon: <FaPercent />, color: "#00BCD4" },
    { id: "family", label: "Family Offers", icon: <FaUsers />, color: "#E91E63" }
  ];

  return (
    <div className="offer-filters">
      <div className="filters-container">
        <div className="filters-scroll">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => onFilterChange(filter.id)}
              style={{
                '--filter-color': filter.color,
                '--filter-hover': `${filter.color}20`
              }}
            >
              <span className="filter-icon">{filter.icon}</span>
              <span className="filter-label">{filter.label}</span>
              {activeFilter === filter.id && (
                <span className="active-indicator"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-info">
        <p>
          <FaClock className="info-icon" />
          All offers expire at midnight today
        </p>
        <p>
          <FaTag className="info-icon" />
          Discounts cannot be combined with other offers
        </p>
      </div>
    </div>
  );
};

export default OfferFilters;
import React, { useState } from "react";
import "./SearchBar.css";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions] = useState([
    "Paneer Butter Masala",
    "Chole Bhature",
    "Masala Dosa",
    "Hakka Noodles",
    "Pizza",
    "Pasta",
    "Gulab Jamun",
    "Lassi"
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      // Implement search functionality
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className={`search-input-wrapper ${isFocused ? "focused" : ""}`}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search for dishes, cuisines, or ingredients..."
            className="search-input"
          />
          {searchTerm && (
            <button type="button" onClick={clearSearch} className="clear-btn">
              <FaTimes />
            </button>
          )}
          <button type="submit" className="search-btn">
            Search
          </button>
        </div>
      </form>

      {isFocused && searchTerm && (
        <div className="search-suggestions">
          <div className="suggestions-header">
            <h4>Popular Searches</h4>
          </div>
          <div className="suggestions-list">
            {suggestions
              .filter(item => 
                item.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item, index) => (
                <div key={index} className="suggestion-item">
                  <FaSearch className="suggestion-icon" />
                  <span>{item}</span>
                </div>
              ))}
            {suggestions.filter(item => 
              item.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 && (
              <div className="no-results">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

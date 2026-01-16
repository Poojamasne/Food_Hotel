import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

import {
  FaShoppingCart,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaLeaf,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const { cartCount } = useCart();

  const foodCategories = [
    { name: "Vegetarian", icon: <FaLeaf />, slug: "veg" },
    { name: "Non-Vegetarian", icon: <FaLeaf />, slug: "non-veg" },
    { name: "South Indian", icon: <FaLeaf />, slug: "south-indian" },
    { name: "Starters", icon: <FaLeaf />, slug: "starters" },
    { name: "Main Course", icon: <FaLeaf />, slug: "main-course" },
    { name: "Desserts", icon: <FaLeaf />, slug: "desserts" },
    { name: "Beverages", icon: <FaLeaf />, slug: "beverages" },
  ];

  const combinedCategories = [
    { name: "Veg Starters", slug: "veg-starters" },
    { name: "Non-Veg Main Course", slug: "non-veg-main-course" },
    { name: "South Indian Meals", slug: "south-indian-meals" },
  ];

  // Handle window resize and check if desktop
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 992;
      setIsDesktop(desktop);
      if (desktop) {
        setMobileDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDropdownClick = (e) => {
    // Only handle clicks on mobile/tablet
    if (!isDesktop) {
      e.preventDefault();
      setMobileDropdownOpen(!mobileDropdownOpen);
    }
    // On desktop, let CSS hover handle it
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      {/* Top Info Bar */}
      <div className="top-info-bar">
        <div className="container">
          <div className="info-items">
            <div className="info-item">
              <FaPhone /> +91 98765 43210
            </div>
            <div className="info-item">
              <FaMapMarkerAlt /> Main Road, City Center
            </div>
            <div className="info-item">
              <FaClock /> 8:00 AM - 11:00 PM
            </div>
          </div>
          <div className="social-links">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              FB
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              IG
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              TW
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <div className="logo-brand">
            <Link to="/" className="logo-link">
              <div className="logo">
                <span className="logo-icon">
                  <FaLeaf />
                </span>
                <div className="brand-text">
                  <h1>Zonixtec</h1>
                  <p className="tagline">
                    Pure Veg • Authentic Taste • Since 1995
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="header-search">
            <SearchBar />
          </div>

          <div className="header-actions">
            <Link to="/menu" className="order-btn">
              <span className="btn-icon">
                <FaShoppingCart />
              </span>
              Order Online
            </Link>
            <Link to="/cart" className="cart-btn">
              <FaShoppingCart className="cart-icon" />
              <span className="cart-text">Cart</span>
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
            <Link to="/login" className="user-btn">
              <FaUser />
            </Link>

            {/* Hamburger Icon */}
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`main-nav ${mobileMenuOpen ? "open" : ""}`}>
        <div className="container">
          <ul className="nav-menu">
            <li>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" onClick={() => setMobileMenuOpen(false)}>
                Menu
              </Link>
            </li>

            {/* Food Categories Dropdown */}
            <li className={`dropdown ${mobileDropdownOpen ? "open" : ""}`}>
              <button
                className="dropdown-toggle"
                onClick={handleDropdownClick}
                aria-haspopup="true"
                aria-expanded={mobileDropdownOpen}
              >
                Food Categories <FaChevronDown className="dropdown-arrow" />
              </button>
              <div className="dropdown-menu">
                {foodCategories.map((cat, idx) => (
                  <Link 
                    key={idx} 
                    to={`/category/${cat.slug}`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileDropdownOpen(false);
                    }}
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
                <hr />
                {combinedCategories.map((cat, idx) => (
                  <Link 
                    key={`combo-${idx}`} 
                    to={`/category/${cat.slug}`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileDropdownOpen(false);
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </li>

            <li>
              <Link to="/offers" onClick={() => setMobileMenuOpen(false)}>
                Today's Offers
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
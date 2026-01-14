import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaLeaf, 
  FaChevronDown 
} from "react-icons/fa";
import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
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
            <span>Follow us:</span>
            <a href="#" className="social-icon">FB</a>
            <a href="#" className="social-icon">IG</a>
            <a href="#" className="social-icon">TW</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          {/* Logo and Branding */}
          <div className="logo-brand">
            <div className="logo">
              <span className="logo-icon"><FaLeaf /></span>
              <div className="brand-text">
                <h1>Zonixtec</h1>
                <p className="tagline">Pure Veg • Authentic Taste • Since 1995</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="header-search">
            <SearchBar />
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            <Link to="/order" className="order-btn">
              <span className="btn-icon"><FaShoppingCart /></span>
              Order Online
            </Link>
            <Link to="/cart" className="cart-btn">
              <FaShoppingCart />
              <span className="cart-count">0</span>
              <span className="cart-text">Cart</span>
            </Link>
            <Link to="/login" className="user-btn">
              <FaUser />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="container">
          <ul className="nav-menu">
            <li><Link to="/" className="active">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li className="dropdown">
              <a href="#">
                Categories <FaChevronDown className="dropdown-arrow" />
              </a>
              <div className="dropdown-menu">
                <Link to="/category/pure-veg"><FaLeaf /> Pure Veg</Link>
                <Link to="/category/north-indian"><FaLeaf /> North Indian</Link>
                <Link to="/category/south-indian"><FaLeaf /> South Indian</Link>
                <Link to="/category/chinese"><FaLeaf /> Chinese</Link>
                <Link to="/category/italian"><FaLeaf /> Italian</Link>
                <Link to="/category/desserts"><FaLeaf /> Desserts</Link>
              </div>
            </li>
            <li><Link to="/offers">Today's Offers</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;

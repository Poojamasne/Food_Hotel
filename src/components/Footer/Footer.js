import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope, FaLeaf, FaCcVisa, FaCcMastercard, FaCcPaypal, FaRupeeSign } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-section logo-section">
          <div className="footer-logo">
            <span className="logo-icon"><FaLeaf /></span>
            <div className="logo-text">
              <h3>Zonixtec</h3>
              <p>Pure Veg Restaurant</p>
            </div>
          </div>
          <p className="footer-description">
            Serving authentic vegetarian cuisine since 1995. 
            Experience the taste of tradition with modern hospitality.
          </p>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/offers">Offers</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>

        {/* Food Categories */}
        <div className="footer-section">
          <h4>Food Categories</h4>
          <ul>
            <li><a href="/category/north-indian">North Indian</a></li>
            <li><a href="/category/south-indian">South Indian</a></li>
            <li><a href="/category/chinese">Chinese</a></li>
            <li><a href="/category/italian">Italian</a></li>
            <li><a href="/category/desserts">Desserts</a></li>
            <li><a href="/category/beverages">Beverages</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact-section">
          <h4>Contact Us</h4>
          <div className="contact-info">
            <p><FaMapMarkerAlt /> Main Road, City Center, PIN: 123456</p>
            <p><FaPhone /> +91 98765 43210</p>
            <p><FaEnvelope /> info@poojahotel.com</p>
            <p><FaClock /> 8:00 AM - 11:00 PM</p>
          </div>
          <div className="payment-methods">
            <FaCcVisa size={24} />
            <FaCcMastercard size={24} />
            <FaCcPaypal size={24} />
            <FaRupeeSign size={24} />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Zonixtec. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms & Conditions</a>
            <a href="/sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import "./Home.css";
import "../../components/ScrollToTop.jsx";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import Categories from "../../components/Categories/Categories";


import {
  FaLeaf,
  FaUserTie,
  FaTruck,
  FaRupeeSign,
  FaShieldAlt,
  FaCogs,
  FaPhone,
  FaClock,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      {/* Hero Banner/Slider */}
      <Hero />

      {/* Food Categories Display */}
      <Categories />

      {/* Special Features Section */}
      <section className="special-features">
        <div className="container">
          <div className="features-header">
            <h2>Why Choose Zonixtec?</h2>
            <p>We're committed to providing the best dining experience</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaLeaf />
              </div>
              <h3>100% Pure Vegetarian</h3>
              <p>
                All dishes made with fresh vegetables and no artificial colors
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaUserTie />
              </div>
              <h3>Expert Chefs</h3>
              <p>
                25+ years of culinary experience in traditional Indian cooking
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaTruck />
              </div>
              <h3>Fast Delivery</h3>
              <p>Hot and fresh food delivered within 30 minutes</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaRupeeSign />
              </div>
              <h3>Best Price</h3>
              <p>Quality food at affordable prices with regular discounts</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Hygienic Kitchen</h3>
              <p>Maintained with highest standards of cleanliness</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaCogs />
              </div>
              <h3>Custom Orders</h3>
              <p>Special dishes prepared as per your preferences</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section
        className="cta-section"
        style={{
          backgroundImage: `url(/images/cta-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Taste Excellence?</h2>
            <p>Order now and get 20% off on your first order above ₹500</p>
            <div className="cta-buttons">
  <button className="cta-btn primary" onClick={() => navigate("/cart")}>
    Order Online Now
  </button>
  <button className="cta-btn secondary" onClick={() => navigate("/menu")}>
    View Menu
  </button>
</div>

            <div className="cta-info">
              <span>
                <span>
  <FaPhone style={{ transform: "rotate(98deg)" }} /> Call: +91 98765 43210
</span>

              </span>
              <span>
                <FaClock /> Open: 8:00 AM - 11:00 PM
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import "./OffersPage.css";
import {
  FaFire,
  FaClock,
  FaTag,
  FaPercent,
  FaStar,
  FaShoppingCart
} from "react-icons/fa";
import OfferCard from "../../components/OfferCard/OfferCard";
import OfferFilters from "../../components/OfferFilters/OfferFilters";

const OffersPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Sample offers data
  const allOffers = [
    {
      id: 1,
      title: "Family Feast Combo",
      description: "Complete meal for 4 people with 4 starters, 2 main course, rice, naan, and desserts.",
      originalPrice: 2499,
      discountedPrice: 1899,
      discountPercent: 24,
      category: "combo",
      tags: ["Popular", "Family"],
      timeLeft: "3:45:21",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      rating: 4.7,
      totalOrders: 254
    },
    {
      id: 2,
      title: "Weekend Special Buffet",
      description: "Unlimited buffet with live counters, desserts, and beverages. Saturday-Sunday only.",
      originalPrice: 899,
      discountedPrice: 699,
      discountPercent: 22,
      category: "buffet",
      tags: ["Weekend", "Buffet"],
      timeLeft: "12:30:45",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      rating: 4.9,
      totalOrders: 189
    },
    {
      id: 3,
      title: "Happy Hour Drinks",
      description: "Buy 1 get 1 free on all mocktails and beverages. 4 PM - 7 PM daily.",
      originalPrice: 399,
      discountedPrice: 199,
      discountPercent: 50,
      category: "beverages",
      tags: ["Happy Hour", "BOGO"],
      timeLeft: "02:15:30",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      rating: 4.5,
      totalOrders: 312
    },
    {
      id: 4,
      title: "Lunch Special Thali",
      description: "Traditional thali with 6 items, rice, roti, salad, pickle, papad, and dessert.",
      originalPrice: 499,
      discountedPrice: 349,
      discountPercent: 30,
      category: "lunch",
      tags: ["Thali", "Lunch"],
      timeLeft: "05:20:10",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      rating: 4.6,
      totalOrders: 421
    },
    {
      id: 5,
      title: "Student Discount Meal",
      description: "Special meal combo for students with valid ID. Includes main course + drink + dessert.",
      originalPrice: 399,
      discountedPrice: 299,
      discountPercent: 25,
      category: "combo",
      tags: ["Student", "Exclusive"],
      timeLeft: "08:45:15",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      rating: 4.4,
      totalOrders: 156
    },
    {
      id: 6,
      title: "Early Bird Breakfast",
      description: "Complete breakfast platter with juice, coffee, sandwiches, and pastries before 9 AM.",
      originalPrice: 449,
      discountedPrice: 329,
      discountPercent: 27,
      category: "breakfast",
      tags: ["Breakfast", "Early Bird"],
      timeLeft: "00:45:30",
      image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      rating: 4.8,
      totalOrders: 278
    },
    {
      id: 7,
      title: "Dinner Date Package",
      description: "Romantic dinner for 2 with candlelight, starters, main course, wine, and dessert.",
      originalPrice: 1999,
      discountedPrice: 1499,
      discountPercent: 25,
      category: "dinner",
      tags: ["Romantic", "Premium"],
      timeLeft: "06:30:00",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      rating: 4.9,
      totalOrders: 134
    },
  ];

  const filteredOffers = activeFilter === "all" 
    ? allOffers 
    : allOffers.filter(offer => offer.category === activeFilter);


  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

 
  const featuredOffers = allOffers.slice(0, 3);

  return (
    <div className="offers-page">
      {/* Hero Section */}
      <div className="offers-hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              <FaFire className="fire-icon" />
              Today's Hot Deals
            </h1>
            <p className="hero-subtitle">
              Exclusive discounts and offers available only today! Grab them before they're gone.
            </p>
            <div className="countdown-banner">
              <div className="countdown-item">
                <span className="countdown-number">12</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-number">45</span>
                <span className="countdown-label">Minutes</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-number">30</span>
                <span className="countdown-label">Seconds</span>
              </div>
              <div className="countdown-text">Left for Today's Offers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured Offers */}
        <section className="featured-offers">
          <h2>
            <FaStar className="section-icon" />
            Featured Offers
          </h2>
          <p className="section-subtitle">Most popular deals chosen by our customers</p>
          <div className="featured-cards">
            {featuredOffers.map((offer, index) => (
              <div key={offer.id} className="featured-card">
                <div className="featured-badge">#{index + 1} Top Offer</div>
                <div className="featured-image">
                  <img src={offer.image} alt={offer.title} />
                  <div className="featured-overlay">
                    <span className="discount-badge">{offer.discountPercent}% OFF</span>
                  </div>
                </div>
                <div className="featured-content">
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <div className="price-section">
                    <span className="original-price">₹{offer.originalPrice}</span>
                    <span className="discounted-price">₹{offer.discountedPrice}</span>
                    <span className="save-amount">
                      Save ₹{offer.originalPrice - offer.discountedPrice}
                    </span>
                  </div>
                  <div className="featured-meta">
                    <span className="rating">
                      <FaStar /> {offer.rating}
                    </span>
                    <span className="orders">
                      <FaShoppingCart /> {offer.totalOrders} orders
                    </span>
                    <span className="time-left">
                      <FaClock /> {offer.timeLeft}
                    </span>
                  </div>
                  <button className="featured-button">
                    <FaShoppingCart /> Grab This Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Offers Section */}
        <section className="all-offers-section">
          <div className="section-header">
            <div className="header-left">
              <h2>
                <FaTag className="section-icon" />
                All Available Offers
              </h2>
              <p className="results-count">
                Showing {filteredOffers.length} offers ({allOffers.length} total)
              </p>
            </div>
            <div className="header-right">
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid View
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  List View
                </button>
              </div>
            </div>
          </div>

          {/* Filters Component */}
          <OfferFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />

          {/* Offers Grid */}
          <div className={`offers-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {filteredOffers.map((offer) => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* No Results Message */}
          {filteredOffers.length === 0 && (
            <div className="no-results">
              <FaTag className="no-results-icon" />
              <h3>No offers found for this category</h3>
              <p>Try selecting a different filter or check back later for new offers.</p>
              <button 
                className="reset-filter-btn"
                onClick={() => setActiveFilter("all")}
              >
                Show All Offers
              </button>
            </div>
          )}
        </section>

        {/* Special Promo Banner */}
        <div className="special-promo">
          <div className="promo-content">
            <div className="promo-text">
              <h3>
                <FaPercent className="promo-icon" />
                Extra 10% Off on First Order!
              </h3>
              <p>Use code: <span className="promo-code">ZONIX10</span> at checkout</p>
              <p className="promo-details">Valid for online orders only. Minimum order ₹500.</p>
            </div>
            <div className="promo-actions">
              <button className="copy-code-btn">
                Copy Code
              </button>
              <button className="order-now-btn">
                Order Now
              </button>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="terms-section">
          <h3>Offer Terms & Conditions</h3>
          <ul className="terms-list">
            <li>All offers are valid only for today (until midnight).</li>
            <li>Discounts cannot be combined with other offers.</li>
            <li>Offers are applicable for dine-in, takeaway, and delivery unless specified.</li>
            <li>Vegetarian symbol indicates 100% vegetarian dishes.</li>
            <li>Restaurant reserves the right to modify or cancel offers without prior notice.</li>
            <li>Taxes and service charges apply as per standard rates.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
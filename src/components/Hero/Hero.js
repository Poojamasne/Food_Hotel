import React, { useState, useEffect } from "react";
import "./Hero.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  const banners = [
    {
      id: 1,
      title: "30% OFF on All Chinese Dishes",
      description: "Limited time offer. Order your favorite Chinese food now!",
      image: "/images/dishes/banners/banner1.jpg",
      buttonText: "Order Now",
      color: "#FF6B6B",
      link: "/offers", // Add navigation link
      query: "category=chinese", // Optional query params
    },
    {
      id: 2,
      title: "Weekend Special: South Indian Thali",
      description: "Complete meal with 10+ items. Only ₹299",
      image: "/images/dishes/banners/banner2.jpg",
      buttonText: "Explore Menu",
      color: "#4ECDC4",
      link: "/category/south-indian", // Direct to category
    },
    {
      id: 3,
      title: "Family Combo Deal",
      description: "Serves 4 people. Mix of Veg & Non-Veg dishes",
      image: "/images/dishes/banners/banner3.jpg",
      buttonText: "View Deal",
      color: "#45B7D1",
      link: "/menu", // Menu page
      query: "section=combo-deals", // Optional: specific section
    },
    {
      id: 4,
      title: "New Arrival: Italian Pasta",
      description: "Try our authentic Italian pasta range",
      image: "/images/dishes/banners/banner4.jpg",
      buttonText: "Try Now",
      color: "#96CEB4",
      link: "/category/italian", // Direct to Italian category
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  const handleButtonClick = (banner) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Navigate to the specified link
    let navigatePath = banner.link;
    
    // Add query parameters if they exist
    if (banner.query) {
      navigatePath += `?${banner.query}`;
    }
    
    navigate(navigatePath);
  };

  return (
    <div className="hero-slider">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          style={{
            backgroundImage: `url(${banner.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="slide-overlay"></div>
          <div className="slide-content">
            <h2>{banner.title}</h2>
            <p>{banner.description}</p>
            <button 
              className="slide-button"
              onClick={() => handleButtonClick(banner)}
              style={{ backgroundColor: banner.color }}
            >
              {banner.buttonText}
            </button>
          </div>
        </div>
      ))}

      <button className="slider-btn prev" onClick={prevSlide}>
        <FaChevronLeft />
      </button>
      <button className="slider-btn next" onClick={nextSlide}>
        <FaChevronRight />
      </button>

      <div className="slider-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
import React from "react";
import "./Categories.css";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Pure Veg Special",
      count: 45,
      description: "100% vegetarian dishes",
      image: "/images/dishes/popular/Pure Veg Special.jpg",
    },
    {
      id: 2,
      name: "North Indian",
      count: 38,
      description: "Rich and creamy curries",
      image: "/images/dishes/popular/North Indian.jpg",
    },
    {
      id: 3,
      name: "South Indian",
      count: 32,
      description: "Traditional dosas & idlis",
      image: "/images/dishes/popular/South Indian.jpg",
    },
    {
      id: 4,
      name: "Chinese",
      count: 28,
      description: "Indo-Chinese fusion",
      image: "/images/dishes/popular/Chinese.jpg",
    },
    {
      id: 5,
      name: "Italian",
      count: 18,
      description: "Pasta & pizza varieties",
      image: "/images/dishes/popular/Italian.jpg",
    },
  ];

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2>Explore Our Food Categories</h2>
          <p>Discover delicious dishes from various cuisines</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              key={category.id}
              className="category-card"
            >
              <div className="category-image-container">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image-real"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `<div class="image-fallback">
                        <span class="fallback-text">${category.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}</span>
                      </div>`;
                    }}
                  />
                )}
              </div>

              <div className="card-content">
                <div className="category-title">
                  <h3>{category.name}</h3>
                  <span className="item-count">{category.count} items</span>
                </div>
                <p className="category-description">{category.description}</p>
                <div className="card-footer">
                  <span className="explore-text">Explore</span>
                  <span className="arrow">
                    <FaArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/menu" className="view-all-btn">
            View Complete Menu <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;

import React from "react";
import "./Categories.css";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Vegetarian (Veg)",
      count: 52,
      description: "Pure vegetarian dishes",
      image: "/images/dishes/categories/Vegetarian (Veg).jpg",
    },
    {
      id: 2,
      name: "Non-Vegetarian (Non-Veg)",
      count: 64,
      description: "Chicken, mutton & seafood",
      image: "/images/dishes/categories/Non-Vegetarian (Non-Veg).jpg",
    },
    {
      id: 3,
      name: "South Indian",
      count: 40,
      description: "Dosas, idlis & traditional meals",
      image: "/images/dishes/categories/south-indian-category.jpg",
    },
    {
      id: 4,
      name: "Starters",
      count: 35,
      description: "Veg & non-veg starters",
      image: "/images/dishes/categories/Veg Starters.jpg",
    },
    {
      id: 5,
      name: "Main Course",
      count: 48,
      description: "Hearty meals & curries",
      image: "/images/dishes/categories/Non-Veg Main Course.jpg",
    },
    {
      id: 6,
      name: "Desserts",
      count: 22,
      description: "Sweet treats & desserts",
      image: "/images/dishes/categories/desserts-category.jpg",
    },
    {
      id: 7,
      name: "Beverages",
      count: 18,
      description: "Juices, shakes & drinks",
      image: "/images/dishes/categories/beverages.jpg", // You need to add this image to folder
    },
    {
      id: 8,
      name: "Veg Starters",
      count: 20,
      description: "Vegetarian starter dishes",
      image: "/images/dishes/categories/Veg Starters.jpg",
    },
    {
      id: 9,
      name: "Non-Veg Main Course",
      count: 30,
      description: "Non-veg curries & meals",
      image: "/images/dishes/categories/Non-Veg Main Course.jpg",
    },
    {
      id: 10,
      name: "North Indian",
      count: 45,
      description: "Traditional North Indian meals",
      image: "/images/dishes/categories/north-indian-category.jpg",
    },
    {
      id: 11,
      name: "Italian",
      count: 28,
      description: "Pizzas, pasta & more",
      image: "/images/dishes/categories/italian-category.jpg", 
    },
    {
      id: 12,
      name: "Chinese",
      count: 32,
      description: "Noodles, Manchurian & Chinese delights",
      image: "/images/dishes/categories/chinese-category.jpg", 
    },
  ];

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2>Explore Our Food Categories</h2>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              key={category.id}
              className="category-card"
            >
              <div className="category-image">
  <div className="category-image-container">
    <img
      src={category.image}
      alt={category.name}
      className="category-image-real"
      onError={(e) => {
        e.target.onerror = null;
        e.target.style.display = "none";
        e.target.parentElement.innerHTML = `
          <div class="image-fallback" style="background: linear-gradient(135deg, #8B4513, #D2691E)">
            <span class="fallback-text">
              ${category.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
        `;
      }}
    />
    <div className="image-overlay"></div>
  </div>
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

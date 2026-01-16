import React from "react";
import "./AboutPage.css";
import {
  FaLeaf,
  FaAward,
  FaUsers,
  FaUtensils,
  FaStar,
  FaHeart,
  FaCheckCircle,
  FaCalendarAlt,
  FaSeedling,
  FaClock
} from "react-icons/fa";

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Chef Rajesh Kumar",
      role: "Head Chef",
      experience: "25+ years",
      specialty: "North Indian & Mughlai",
      image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Chef Priya Sharma",
      role: "South Indian Specialist",
      experience: "18 years",
      specialty: "Traditional South Indian",
      image: "https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Ankit Verma",
      role: "Restaurant Manager",
      experience: "15 years",
      specialty: "Guest Relations",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Meena Patel",
      role: "Pastry Chef",
      experience: "12 years",
      specialty: "Indian Desserts",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    }
  ];

  // Values data
  const values = [
    {
      icon: <FaLeaf />,
      title: "Pure Vegetarian",
      description: "100% pure vegetarian ingredients, no artificial flavors or colors."
    },
    {
      icon: <FaSeedling />,
      title: "Fresh Ingredients",
      description: "Daily fresh produce sourced from local organic farms."
    },
    {
      icon: <FaHeart />,
      title: "Authentic Taste",
      description: "Traditional recipes passed down through generations."
    },
    {
      icon: <FaClock />,
      title: "Consistent Quality",
      description: "Same great taste and quality since 1995."
    },
    {
      icon: <FaUsers />,
      title: "Family Values",
      description: "Treating every guest like family with warm hospitality."
    },
    {
      icon: <FaCheckCircle />,
      title: "Hygiene First",
      description: "Highest standards of cleanliness and food safety."
    }
  ];

  // Milestones data
  const milestones = [
    { year: "1995", event: "Zonixtec founded by Mr. Sharma family", icon: <FaCalendarAlt /> },
    { year: "2000", event: "Expanded to 100-seater restaurant", icon: <FaUsers /> },
    { year: "2005", event: "Awarded 'Best Vegetarian Restaurant'", icon: <FaAward /> },
    { year: "2010", event: "Launched online ordering system", icon: <FaUtensils /> },
    { year: "2015", event: "20th Anniversary Celebration", icon: <FaStar /> },
    { year: "2023", event: "Complete renovation & modernization", icon: <FaCheckCircle /> }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Our Story Since 1995</h1>
            <p className="hero-subtitle">
              Serving authentic vegetarian cuisine with love, tradition, and modern hospitality
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">28+</span>
                <span className="stat-label">Years of Excellence</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">200+</span>
                <span className="stat-label">Menu Items</span>
              </div>
              <div className="stat">
                <span className="stat-number">25+</span>
                <span className="stat-label">Expert Chefs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Our Story Section */}
        <section className="story-section">
          <div className="story-content">
            <div className="story-text">
              <h2>Welcome to Zonixtec</h2>
              <div className="highlight-line"></div>
              <p className="lead">
                Founded in 1995 by the Sharma family, Zonixtec began as a small 20-seater restaurant 
                with a simple mission: to serve authentic vegetarian food that tastes like home.
              </p>
              <p>
                What started as a family dream has now become a culinary landmark in the city. 
                Over the years, we've grown in size but never compromised on our core values - 
                purity, authenticity, and hospitality.
              </p>
              <p>
                Our recipes are traditional family secrets, passed down through generations. 
                Each dish is prepared with the same love and care that our grandmothers used 
                in their kitchens. We believe that great food isn't just about taste, but about 
                the emotions and memories it creates.
              </p>
              <blockquote className="story-quote">
                <FaLeaf />
                <p>
                  "Food is not just fuel, it's an experience. At Zonixtec, 
                  we create memories one plate at a time."
                </p>
                <cite>- Mr. Rajesh Sharma, Founder</cite>
              </blockquote>
            </div>
            <div className="story-image">
              <div className="image-frame">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Zonixtec Restaurant Interior"
                />
                <div className="image-badge">
                  <span>Since 1995</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="values-section">
          <div className="section-header">
            <h2>Our Core Values</h2>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Journey */}
        <section className="journey-section">
          <div className="section-header">
            <h2>Our Journey</h2>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <div className="timeline-icon">{milestone.icon}</div>
                  <div className="timeline-event">{milestone.event}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section className="team-section">
          <div className="section-header">
            <h2>Meet Our Experts</h2>
            {/* <p>The talented team behind your favorite dishes</p> */}
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                  <div className="team-overlay">
                    <span>{member.experience} Experience</span>
                  </div>
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-specialty">
                    <FaUtensils /> {member.specialty}
                  </p>
                  <div className="team-bio">
                    Passionate about creating authentic vegetarian cuisine with modern techniques.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="choose-us-section">
          <div className="choose-content">
            <div className="choose-image">
              <img 
                src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Delicious Food"
              />
            </div>
            <div className="choose-text">
              <h2>Why Choose Zonixtec?</h2>
              <ul className="choose-list">
                <li>
                  <FaCheckCircle />
                  <span>Traditional recipes with 28+ years of perfection</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>100% pure vegetarian - no artificial colors or flavors</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Fresh ingredients sourced daily from local farms</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Experienced chefs trained in authentic cooking methods</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Modern amenities with traditional hospitality</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Hygiene and cleanliness as top priority</span>
                </li>
              </ul>
              <div className="choose-cta">
                <p>Come experience the taste of tradition with us!</p>
                <a href="/reservation" className="reservation-btn">
                  Book a Table
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
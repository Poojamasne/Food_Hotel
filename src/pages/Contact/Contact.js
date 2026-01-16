import React, { useState } from "react";
import "./Contact.css";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaPaperPlane
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="contact-page">
      {/* Hero Banner */}
      <div className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Reach out for reservations, feedback, or just to say hello!</p>
        </div>
      </div>

      <div className="container">
        {/* Contact Content */}
        <div className="contact-content">
          {/* Contact Info Cards */}
          <div className="contact-info-section">
            <div className="contact-info-cards">
              {/* Card 1: Location */}
              <div className="info-card">
                <div className="info-icon location">
                  <FaMapMarkerAlt />
                </div>
                <h3>Our Location</h3>
                <p>Main Road, City Center</p>
                <p>Near Central Park, PIN: 123456</p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  View on Google Maps
                </a>
              </div>

              {/* Card 2: Phone */}
              <div className="info-card">
                <div className="info-icon phone">
                  <FaPhone />
                </div>
                <h3>Phone Numbers</h3>
                <p>Main: +91 98765 43210</p>
                <p>Reservations: +91 98765 43211</p>
                <p>24/7 Support: +91 98765 43212</p>
              </div>

              {/* Card 3: Email */}
              <div className="info-card">
                <div className="info-icon email">
                  <FaEnvelope />
                </div>
                <h3>Email Address</h3>
                <p>General: info@zonixtec.com</p>
                <p>Reservations: book@zonixtec.com</p>
                <p>Feedback: feedback@zonixtec.com</p>
              </div>

              {/* Card 4: Timing */}
              <div className="info-card">
                <div className="info-icon clock">
                  <FaClock />
                </div>
                <h3>Working Hours</h3>
                <p><strong>Monday - Friday:</strong> 8:00 AM - 11:00 PM</p>
                <p><strong>Saturday - Sunday:</strong> 8:00 AM - 12:00 AM</p>
                <p><strong>Holidays:</strong> 10:00 AM - 10:00 PM</p>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="social-section">
              <h2>Follow Us</h2>
              <p>Stay updated with our latest offers and events</p>
              <div className="social-icons-large">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                  <span>Facebook</span>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                  <span>Instagram</span>
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                  <span>Twitter</span>
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                  <FaYoutube />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>

            {submitted && (
              <div className="success-message">
                <p>Thank you! Your message has been sent successfully.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Type your message here..."
                />
              </div>

              <button type="submit" className="submit-btn">
                <FaPaperPlane />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Find Us Here</h2>
          <div className="map-container">
            {/* In a real app, you would embed Google Maps here */}
            <div className="map-placeholder">
              <div className="map-overlay">
                <h3>Zonixtec Restaurant</h3>
                <p>Main Road, City Center</p>
                <p>Open in Google Maps</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
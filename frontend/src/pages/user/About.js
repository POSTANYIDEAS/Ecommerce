import React from 'react';
import { FaRocket, FaUsers, FaHeart, FaAward, FaShieldAlt, FaGlobe } from 'react-icons/fa';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About e-Shop</h1>
          <p>Your trusted partner in online shopping since 2020</p>
        </div>
      </section>

      <div className="about-container">
        {/* Our Story Section */}
        <section className="about-section">
          <div className="section-content">
            <div className="text-content">
              <h2>Our Story</h2>
              <p>
                Founded in 2020, e-Shop began as a small startup with a big dream: to make online
                shopping accessible, affordable, and enjoyable for everyone. What started as a
                passion project has grown into a trusted platform serving thousands of customers
                worldwide.
              </p>
              <p>
                Our journey has been driven by innovation, customer satisfaction, and a commitment
                to quality. We believe that shopping should be more than just a transaction – it
                should be an experience that brings joy and convenience to your life.
              </p>
            </div>
            <div className="image-content">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
                alt="Our story"
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mission-vision">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">
                <FaRocket />
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide an exceptional online shopping experience by offering quality products,
                competitive prices, and outstanding customer service that exceeds expectations.
              </p>
            </div>
            <div className="vision-card">
              <div className="card-icon">
                <FaGlobe />
              </div>
              <h3>Our Vision</h3>
              <p>
                To become the world's most trusted and innovative e-commerce platform, connecting
                people with products they love while building lasting relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <FaUsers className="value-icon" />
              <h4>Customer First</h4>
              <p>Every decision we make is centered around our customers' needs and satisfaction.</p>
            </div>
            <div className="value-item">
              <FaHeart className="value-icon" />
              <h4>Quality & Trust</h4>
              <p>We maintain the highest standards in product quality and business integrity.</p>
            </div>
            <div className="value-item">
              <FaShieldAlt className="value-icon" />
              <h4>Security</h4>
              <p>Your data and transactions are protected with industry-leading security measures.</p>
            </div>
            <div className="value-item">
              <FaAward className="value-icon" />
              <h4>Excellence</h4>
              <p>We strive for excellence in everything we do, from products to customer service.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            Behind e-Shop is a dedicated team of professionals passionate about delivering
            the best shopping experience.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="John Smith"
              />
              <h4>John Smith</h4>
              <p>CEO & Founder</p>
            </div>
            <div className="team-member">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                alt="Sarah Johnson"
              />
              <h4>Sarah Johnson</h4>
              <p>Head of Operations</p>
            </div>
            <div className="team-member">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
                alt="Mike Davis"
              />
              <h4>Mike Davis</h4>
              <p>Technical Director</p>
            </div>
            <div className="team-member">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
                alt="Emily Chen"
              />
              <h4>Emily Chen</h4>
              <p>Customer Success Manager</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Start Shopping?</h2>
          <p>Join thousands of satisfied customers and discover amazing products today!</p>
          <div className="cta-buttons">
            <a href="/products" className="cta-button primary">Browse Products</a>
            <a href="/contact" className="cta-button secondary">Contact Us</a>
          </div>
        </section>
      </div>
    </div>
  );
}
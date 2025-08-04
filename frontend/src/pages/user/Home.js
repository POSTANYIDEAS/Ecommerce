import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // added useNavigate
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    // Fetch just 4 products for home preview
    axios.get('http://localhost:5000/api/products?limit=4')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  return (
    <main className="home-container">

      {/* Banner Section */}
      <section className="home-banner" aria-label="Promotional banner">
        <div className="banner-content">
          <h1>Discover Amazing Deals<br />Every Day</h1>
          <p>Shop from the best products across all categories.</p>
          <Link to="/products" className="banner-button" aria-label="Shop now">Shop Now</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="home-categories" aria-label="Shop by categories">
        <h2>Our Categories</h2>
        <div className="categories-grid">
          <Link to="/products?category=electronics" aria-label="Shop Electronics" className="category-card">
            <img src="https://images.unsplash.com/photo-1510552776732-03e61cf4b144?auto=format&fit=crop&w=400&q=80" alt="Electronics" />
            <div className="category-info">
              <h3>Electronics</h3>
            </div>
          </Link>
          <Link to="/products?category=clothing" aria-label="Shop Clothing" className="category-card">
            <img src="https://images.unsplash.com/photo-1520962918630-22804197b3a2?auto=format&fit=crop&w=400&q=80" alt="Clothing" />
            <div className="category-info">
              <h3>Clothing</h3>
            </div>
          </Link>
          <Link to="/products?category=home-garden" aria-label="Shop Home & Garden" className="category-card">
            <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80" alt="Home and garden" />
            <div className="category-info">
              <h3>Home & Garden</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="home-products-section" aria-label="Featured Products">
        <div className="home-products-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="home-see-more" aria-label="See more products">See More →</Link>
        </div>

        <div className="products-grid" tabIndex={-1}>
          {loading && <p>Loading products...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && products.length === 0 && <p>No products found.</p>}

          {products.map(product => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="product-link"
              aria-label={`View details of ${product.name}`}
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features" aria-label="Why shop with us">
        <h2>Why Shop With Us</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span role="img" aria-label="Delivery truck" className="feature-icon">🚚</span>
            <h3>Fast Delivery</h3>
            <p>Get your orders delivered to your doorstep quickly and reliably.</p>
          </div>
          <div className="feature-item">
            <span role="img" aria-label="Credit card" className="feature-icon">💳</span>
            <h3>Secure Payments</h3>
            <p>Safe and easy payment methods for a hassle-free checkout experience.</p>
          </div>
          <div className="feature-item">
            <span role="img" aria-label="Customer support" className="feature-icon">🤝</span>
            <h3>24/7 Support</h3>
            <p>Friendly customer service ready to help you anytime.</p>
          </div>
        </div>
      </section>

      {/* New 3D Design Sections */}

<section class="futuristic-section">
  <div class="container">
    <h2 class="section-title">Why Choose Us</h2>
    <p class="section-subtitle">Discover the cutting-edge advantages we deliver to our customers.</p>

    <div class="cards-wrapper">
      <div class="card">
        <div class="icon">🚀</div>
        <h3>Innovative Technology</h3>
        <p>We utilize the latest advancements to bring you top-quality and futuristic solutions.</p>
      </div>
      <div class="card">
        <div class="icon">🔒</div>
        <h3>Secure & Reliable</h3>
        <p>Our products are built with security and reliability as our top priorities.</p>
      </div>
      <div class="card">
        <div class="icon">⚡</div>
        <h3>Fast Performance</h3>
        <p>Experience blazing speed and seamless functionality in all our offerings.</p>
      </div>
    </div>

    <h2 class="section-title">Benefits</h2>
    <div class="benefits-list">
      <div class="benefit-item">
        <span class="benefit-icon">💡</span>
        <p>Continuous Innovation with AI-driven enhancements.</p>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">🌐</span>
        <p>Global 24/7 Support across multiple platforms.</p>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">🔋</span>
        <p>Energy-Efficient Solutions for a greener planet.</p>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">🤖</span>
        <p>Smart Automation saves you time and effort.</p>
      </div>
    </div>
  </div>
</section>

      {/* About Us Section */}
      <section className="about-us" aria-label="About us brief description">
        <div className="about-us-content">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="About us"
            className="about-us-image"
          />
          <div className="about-us-text">
            <h2>About Us</h2>
            <p>
              We are committed to delivering the best online shopping experience.
              Explore our story and learn why our customers keep coming back.
            </p>
            <button 
              className="about-us-button" 
              onClick={() => navigate('/about')}
              aria-label="Learn more about us"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="home-newsletter" aria-label="Newsletter signup">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter and get exclusive offers.</p>
        <form
          className="newsletter-form"
          onSubmit={e => {
            e.preventDefault();
            alert('Thank you for subscribing!');
          }}
        >
          <label htmlFor="newsletter-email" className="visually-hidden">Email address</label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            placeholder="Enter your email"
            required
            aria-required="true"
          />
          <button type="submit" aria-label="Subscribe to newsletter">Subscribe</button>
        </form>
      </section>
    </main>
  );
}
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // added useNavigate
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    // Fetch products and categories
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/categories')
        ]);

        // Take only first 4 products for home preview
        setProducts(productsRes.data.slice(0, 4));
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="home-container">

      {/* Hero Banner Section - Redesigned */}
      <section className="hero-banner" aria-label="Welcome to e-Shop">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to <span className="brand-highlight">e-Shop</span></h1>
            <p className="hero-subtitle">Discover amazing products at unbeatable prices</p>
            <p className="hero-description">
              From electronics to fashion, home essentials to lifestyle products -
              find everything you need in one place with fast delivery and secure payments.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="hero-btn primary" aria-label="Browse all products">
                Shop Now
              </Link>
              <Link to="/about" className="hero-btn secondary" aria-label="Learn more about us">
                Learn More
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
              alt="Shopping experience"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="home-categories" aria-label="Shop by categories">
        <h2>Our Categories</h2>
        <div className="categories-grid">
          {categories.length === 0 ? (
            <p>Loading categories...</p>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                aria-label={`Shop ${category.name}`}
                className="category-card"
              >
                {category.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${category.image}`}
                    alt={category.name}
                  />
                ) : (
                  <div className="category-placeholder">
                    <span className="category-icon">📂</span>
                  </div>
                )}
                <div className="category-info">
                  <h3>{category.name}</h3>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                </div>
              </Link>
            ))
          )}
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

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
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

      {/* Enhanced Why Choose Us Section */}
      <section className="why-choose-us-enhanced" aria-label="Why choose e-Shop">
        <div className="section-container">
          <div className="section-header">
            <h2>Why Choose e-Shop?</h2>
            <p>Experience the difference with our premium shopping platform</p>
          </div>

          <div className="features-showcase">
            <div className="feature-card premium">
              <div className="feature-icon">
                <span>🚀</span>
              </div>
              <h3>Lightning Fast Delivery</h3>
              <p>Get your orders delivered within 24-48 hours with our express shipping network across the country.</p>
              <ul className="feature-benefits">
                <li>Same-day delivery in major cities</li>
                <li>Real-time tracking</li>
                <li>Free shipping on orders over $50</li>
              </ul>
            </div>

            <div className="feature-card premium">
              <div className="feature-icon">
                <span>🛡️</span>
              </div>
              <h3>100% Secure Shopping</h3>
              <p>Shop with confidence using our bank-level security and encrypted payment processing.</p>
              <ul className="feature-benefits">
                <li>SSL encrypted transactions</li>
                <li>Multiple payment options</li>
                <li>Buyer protection guarantee</li>
              </ul>
            </div>

            <div className="feature-card premium">
              <div className="feature-icon">
                <span>💎</span>
              </div>
              <h3>Premium Quality Products</h3>
              <p>Every product is carefully curated and quality-tested to meet our high standards.</p>
              <ul className="feature-benefits">
                <li>Authentic products only</li>
                <li>Quality assurance testing</li>
                <li>30-day return guarantee</li>
              </ul>
            </div>

            <div className="feature-card premium">
              <div className="feature-icon">
                <span>🎯</span>
              </div>
              <h3>24/7 Customer Support</h3>
              <p>Our dedicated support team is always ready to help you with any questions or concerns.</p>
              <ul className="feature-benefits">
                <li>Live chat support</li>
                <li>Phone & email assistance</li>
                <li>Multilingual support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="testimonials-section" aria-label="Customer testimonials">
        <div className="section-container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Don't just take our word for it - hear from our satisfied customers</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>"Amazing shopping experience! Fast delivery and excellent customer service. I've been shopping here for over a year and never been disappointed."</p>
              </div>
              <div className="testimonial-author">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Sarah Johnson" />
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <span>Verified Customer</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>"Great variety of products and competitive prices. The website is easy to navigate and the checkout process is smooth. Highly recommended!"</p>
              </div>
              <div className="testimonial-author">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Mike Davis" />
                <div className="author-info">
                  <h4>Mike Davis</h4>
                  <span>Verified Customer</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>"Outstanding quality products and lightning-fast shipping. The customer support team is incredibly helpful and responsive. Love shopping here!"</p>
              </div>
              <div className="testimonial-author">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Emily Chen" />
                <div className="author-info">
                  <h4>Emily Chen</h4>
                  <span>Verified Customer</span>
                </div>
              </div>
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
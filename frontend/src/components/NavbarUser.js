import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './NavbarUser.css';

export default function NavbarUser() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const { cart } = useCart();

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
      if (categoriesDropdownOpen && !event.target.closest('.categories-dropdown-container')) {
        setCategoriesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, categoriesDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-logo" aria-label="Go to home page">
        e-Shop
      </Link>

      {/* Desktop Links */}
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/products" className="nav-link">Products</Link>

        {/* Categories Dropdown */}
        <div className="categories-dropdown-container">
          <button
            className="categories-button nav-link"
            onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
            aria-label="Categories menu"
          >
            Categories <FaChevronDown size={12} />
          </button>

          {categoriesDropdownOpen && (
            <div className="categories-dropdown">
              <Link
                to="/products"
                className="category-dropdown-item"
                onClick={() => setCategoriesDropdownOpen(false)}
              >
                All Products
              </Link>
              {categories.map(category => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-dropdown-item"
                  onClick={() => setCategoriesDropdownOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to="/contact" className="nav-link">Contact</Link>

        {!user ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <div className="profile-dropdown-container">
            <button
              className="profile-button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              aria-label="User profile menu"
            >
              <FaUserCircle size={24} />
              <span className="profile-name">{user.name}</span>
            </button>

            {profileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <FaUserCircle size={40} />
                  <div>
                    <p className="profile-dropdown-name">{user.name}</p>
                    <p className="profile-dropdown-email">{user.email}</p>
                  </div>
                </div>
                <div className="profile-menu">
                  <Link to="/profile" className="profile-menu-item" onClick={() => setProfileDropdownOpen(false)}>
                    <FaUser /> My Profile
                  </Link>
                  <Link to="/profile/orders" className="profile-menu-item" onClick={() => setProfileDropdownOpen(false)}>
                    <FaShoppingCart /> My Orders
                  </Link>
                  <button onClick={handleLogout} className="profile-menu-item logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <Link to="/cart" className="nav-link cart-icon">
          <div className="cart-icon-wrapper">
            <FaShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </div>
        </Link>
      </div>

      {/* Hamburger for mobile */}
      <button
        className="hamburger"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        role="menu"
      >
        <Link to="/" className="nav-link" role="menuitem" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" className="nav-link" role="menuitem" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/products" className="nav-link" role="menuitem" onClick={() => setMenuOpen(false)}>Products</Link>

        {/* Categories in mobile menu */}
        <div className="mobile-categories">
          <div className="mobile-category-header">Categories</div>
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="nav-link mobile-category-item"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </div>

        <Link to="/contact" className="nav-link" role="menuitem" onClick={() => setMenuOpen(false)}>Contact</Link>

        {!user ? (
          <>
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-link">Logout</button>
        )}

        <Link to="/cart" className="nav-link cart-icon" onClick={() => setMenuOpen(false)}>
          <div className="cart-icon-wrapper">
            <FaShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}

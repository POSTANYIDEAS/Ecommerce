// NavbarUser.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavbarUser.css';

export default function NavbarUser() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Close menu on link click (mobile)
  const handleLinkClick = () => setMenuOpen(false);

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
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>

      {/* Hamburger button */}
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

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        role="menu"
      >
        <Link to="/" className="nav-link" role="menuitem" onClick={handleLinkClick}>Home</Link>
        <Link to="/about" className="nav-link" role="menuitem" onClick={handleLinkClick}>About</Link>
        <Link to="/products" className="nav-link" role="menuitem" onClick={handleLinkClick}>Products</Link>
        <Link to="/contact" className="nav-link" role="menuitem" onClick={handleLinkClick}>Contact</Link>
      </div>
    </nav>
  );
}
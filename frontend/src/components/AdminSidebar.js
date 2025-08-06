import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/admin/dashboard", text: "🏠 Dashboard" },
    { to: "/admin/products", text: "📦 Products" },
    { to: "/admin/categories", text: "📂 Categories" },
    { to: "/admin/product-details", text: "📝 Product Details" },
    { to: "/admin/orders", text: "🛒 Orders" },
    { to: "/admin/customers", text: "👥 Customers" },
    { to: "/admin/reports", text: "📈 Reports" },
    { to: "/admin/settings", text: "⚙️ Settings" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h1 className="logo">e-Shop Admin</h1>
      </div>
      <nav className="sidebar-nav">
        {navLinks.map(({ to, text }) => (
          <Link
            key={to}
            to={to}
            className={`nav-link ${location.pathname === to ? "active" : ""}`}
          >
            {text}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;

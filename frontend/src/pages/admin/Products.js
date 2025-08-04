// ProductsDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "./AdminProductsDashboard.css";

export default function ProductsDashboard() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      if (image) formData.append("image", image);

      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/api/products", formData);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setImage(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const links = [
    { to: "/admin/dashboard", text: "🏠 Dashboard" },
    { to: "/admin/products", text: "📦 Products" },
    { to: "/admin/orders", text: "🛒 Orders" },
    { to: "/admin/customers", text: "👥 Customers" },
    { to: "/admin/reports", text: "📈 Reports" },
    { to: "/admin/settings", text: "⚙️ Settings" },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">e-Shop Admin</h1>
        </div>
        <nav className="sidebar-nav">
          {links.map(({ to, text }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${
                location.pathname === to ? "active" : ""
              }`}
            >
              {text}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <h1 className="page-title">Products</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-toggle-form"
        >
          {showForm ? "✕ Close" : "➕ Add New Product"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="product-form">
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-text"
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="input-text"
              min="0"
              step="0.01"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-text textarea"
            ></textarea>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="input-text"
            />
            <div className="form-buttons">
              <button type="submit" className="btn btn-submit">
                {editingProduct ? "Update" : "Add"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <div className="products-grid">
          {products.length === 0 && (
            <p className="no-products">No products available.</p>
          )}
          {products.map((p) => (
            <div key={p.id} className="product-card">
              {p.image && (
                <img
                  src={`http://localhost:5000/uploads/${p.image}`}
                  alt={p.name}
                  className="product-image"
                />
              )}
              <h2 className="product-name">{p.name}</h2>
              <p className="product-price">₹{p.price}</p>
              <p className="product-desc">{p.description}</p>
              <div className="product-actions">
                <button
                  onClick={() => handleEdit(p)}
                  className="btn btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
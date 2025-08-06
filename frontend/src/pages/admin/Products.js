// ProductsDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import "./AdminProductsDashboard.css";

export default function ProductsDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("stock_quantity", stockQuantity || "100");
      formData.append("category_id", categoryId || "");
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
    setStockQuantity("");
    setCategoryId("");
    setImage(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setStockQuantity(product.stock_quantity || "");
    setCategoryId(product.category_id || "");
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

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

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
              type="number"
              placeholder="Stock Quantity"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="input-text"
              min="0"
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-text"
            >
              <option value="">Select Category (Optional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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
              {p.category_name && (
                <p className="product-category">
                  Category: <span className="category-badge">{p.category_name}</span>
                </p>
              )}
              <p className="product-stock">
                Stock: <span className={p.stock_quantity < 10 ? "low-stock" : "in-stock"}>
                  {p.stock_quantity || 0} units
                </span>
              </p>
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
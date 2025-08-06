import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) formData.append("image", image);

      if (editingCategory) {
        await axios.put(
          `http://localhost:5000/api/categories/${editingCategory.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/api/categories", formData);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      alert(err.response?.data?.message || "Error saving category");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setImage(null);
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
        alert(err.response?.data?.message || "Error deleting category");
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <main className="main-content">
        <h1 className="page-title">Categories</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-toggle-form"
        >
          {showForm ? "✕ Close" : "➕ Add New Category"}
        </button>

        {showForm && (
          <div className="form-container">
            <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter category name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter category description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Category Image</label>
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="categories-grid">
            {categories.length === 0 ? (
              <p>No categories found. Add your first category!</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="category-card">
                  {category.image && (
                    <img
                      src={`http://localhost:5000/uploads/${category.image}`}
                      alt={category.name}
                      className="category-image"
                    />
                  )}
                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    {category.description && (
                      <p className="category-description">{category.description}</p>
                    )}
                    <p className="category-meta">
                      Created: {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="category-actions">
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

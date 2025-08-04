import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { Link, useLocation } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import './ProductDetails.css';

function ProductDetails() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [description, setDescription] = useState('');
  const [advantages, setAdvantages] = useState('');
  const [disadvantages, setDisadvantages] = useState('');
  const [images, setImages] = useState([]);
  const [details, setDetails] = useState([]);
  const [editingDetail, setEditingDetail] = useState(null);

  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products').then(res => setProducts(res.data));
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const res = await axios.get('http://localhost:5000/api/product-details');
    setDetails(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('product_id', selectedProduct);
    formData.append('description', description);
    formData.append('advantages', advantages);
    formData.append('disadvantages', disadvantages);
    for (let img of images) formData.append('images', img);

    if (editingDetail) {
      await axios.put(`http://localhost:5000/api/product-details/${editingDetail.id}`, formData);
    } else {
      await axios.post('http://localhost:5000/api/product-details', formData);
    }
    resetForm();
    fetchDetails();
  };

  const resetForm = () => {
    setSelectedProduct('');
    setDescription('');
    setAdvantages('');
    setDisadvantages('');
    setImages([]);
    setEditingDetail(null);
  };

  const handleEdit = (detail) => {
    setEditingDetail(detail);
    setSelectedProduct(detail.product_id);
    setDescription(detail.description);
    setAdvantages(detail.advantages);
    setDisadvantages(detail.disadvantages);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/product-details/${id}`);
    fetchDetails();
  };

  const navLinks = [
    { to: "/admin/dashboard", label: "🏠 Dashboard" },
    { to: "/admin/products", label: "📦 Products" },
    { to: "/admin/product-details", label: "📝 Product Details" },
    { to: "/admin/orders", label: "🛒 Orders" },
    { to: "/admin/customers", label: "👥 Customers" },
    { to: "/admin/reports", label: "📈 Reports" },
    { to: "/admin/settings", label: "⚙️ Settings" },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">e-Shop Admin</h1>
        </div>
        <nav className="sidebar-nav">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">Product Details</h1>

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="input-select"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {selectedProduct && (
          <form onSubmit={handleSubmit} className="details-form">
            <label>Description *</label>
            <ReactQuill value={description} onChange={setDescription} />

            <label>Advantages</label>
            <textarea
              placeholder="Advantages"
              value={advantages}
              onChange={(e) => setAdvantages(e.target.value)}
              className="textarea-input"
            />

            <label>Disadvantages</label>
            <textarea
              placeholder="Disadvantages"
              value={disadvantages}
              onChange={(e) => setDisadvantages(e.target.value)}
              className="textarea-input"
            />

            <label>Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setImages([...e.target.files])}
              className="input-file"
            />

            <div className="btn-group">
              <button type="submit" className="btn btn-submit">
                {editingDetail ? 'Update' : 'Add'} Details
              </button>
              {editingDetail && (
                <button type="button" onClick={resetForm} className="btn btn-cancel">
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <section className="details-list">
          {details.map((d) => (
            <article key={d.id} className="detail-card">
              <h2>Product ID: {d.product_id}</h2>
              <div
                className="detail-description"
                dangerouslySetInnerHTML={{ __html: d.description }}
              />
              <p><strong>Advantages:</strong> {d.advantages || '-'}</p>
              <p><strong>Disadvantages:</strong> {d.disadvantages || '-'}</p>
              <div className="images-list">
                {JSON.parse(d.images || '[]').map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000/uploads/${img}`}
                    alt={`detail-img-${i}`}
                    className="detail-image"
                  />
                ))}
              </div>
              <div className="detail-actions">
                <button onClick={() => handleEdit(d)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(d.id)} className="btn btn-delete">Delete</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default ProductDetails;
import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Example summary stats (could be fetched from API)
  const [summary, setSummary] = useState({
    totalSales: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });

  // Example recent orders data
  const [orders, setOrders] = useState([]);

  // Simulating real-time data fetching every 5 seconds
  useEffect(() => {
    function fetchData() {
      // Replace this with real API calls
      setSummary({
        totalSales: 52740,
        orders: 1680,
        customers: 1120,
        products: 320,
      });
      setOrders([
        { id: "#1001", customer: "Jane Doe", date: "2024-06-26", total: "$230.00", status: "Completed" },
        { id: "#1002", customer: "John Smith", date: "2024-06-25", total: "$150.00", status: "Pending" },
        { id: "#1003", customer: "Alice Johnson", date: "2024-06-24", total: "$120.00", status: "Cancelled" },
        { id: "#1004", customer: "Mark Wilson", date: "2024-06-23", total: "$400.00", status: "Completed" },
      ]);
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      {/* Main content */}
      <div className="main">
        <header className="header">
          <button
            className="header-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="header-right">
            <span className="user-name">Admin User</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <section className="summary-cards">
          <div className="card card-blue">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Sales</h3>
              <p>${summary.totalSales.toLocaleString()}</p>
            </div>
          </div>
          <div className="card card-teal">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <h3>Orders</h3>
              <p>{summary.orders.toLocaleString()}</p>
            </div>
          </div>
          <div className="card card-purple">
            <div className="card-icon">👥</div>
            <div className="card-content">
              <h3>Customers</h3>
              <p>{summary.customers.toLocaleString()}</p>
            </div>
          </div>
          <div className="card card-orange">
            <div className="card-icon">🛒</div>
            <div className="card-content">
              <h3>Products</h3>
              <p>{summary.products.toLocaleString()}</p>
            </div>
          </div>
        </section>

        <section className="orders-section">
          <h2>Recent Orders</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(({ id, customer, date, total, status }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{customer}</td>
                  <td>{date}</td>
                  <td>{total}</td>
                  <td className={`status status-${status.toLowerCase()}`}>
                    {status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}

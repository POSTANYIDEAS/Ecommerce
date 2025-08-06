import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");



  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status, paymentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status,
        payment_status: paymentStatus
      });
      fetchOrders(); // Refresh orders
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    if (filter === "pending") return order.status === "Pending";
    if (filter === "completed") return order.status === "Completed";
    if (filter === "cancelled") return order.status === "Cancelled";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "#f59e0b";
      case "completed": return "#10b981";
      case "cancelled": return "#ef4444";
      case "paid": return "#10b981";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <main className="main-content">
      <div className="orders-header">
        <h1>📦 Order Management</h1>
        <div className="orders-stats">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{orders.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{orders.filter(o => o.status === "Pending").length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{orders.filter(o => o.status === "Completed").length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>₹{orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="orders-filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All Orders
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={filter === "cancelled" ? "active" : ""}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Bill Number</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.bill_number || "N/A"}</td>
                <td>
                  <div className="customer-info">
                    <strong>{order.name}</strong>
                    <br />
                    <small>{order.email}</small>
                    <br />
                    <small>{order.number}</small>
                  </div>
                </td>
                <td>
                  <div className="items-preview">
                    {order.items?.length || 0} item(s)
                    <br />
                    <small>Click to view details</small>
                  </div>
                </td>
                <td className="amount">₹{parseFloat(order.total_amount || 0).toLocaleString()}</td>
                <td>
                  <div className="payment-info">
                    <span
                      className="payment-method"
                      style={{ color: getStatusColor(order.payment_status) }}
                    >
                      {order.payment_method || "N/A"}
                    </span>
                    <br />
                    <span
                      className="payment-status"
                      style={{ color: getStatusColor(order.payment_status) }}
                    >
                      {order.payment_status || "Pending"}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className="order-status"
                    style={{
                      backgroundColor: getStatusColor(order.status),
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    {order.status || "Pending"}
                  </span>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="view-btn"
                    >
                      👁️ View
                    </button>
                    <select
                      onChange={(e) => {
                        const [status, paymentStatus] = e.target.value.split("|");
                        if (status && paymentStatus) {
                          updateOrderStatus(order.id, status, paymentStatus);
                        }
                      }}
                      className="status-select"
                    >
                      <option value="">Update Status</option>
                      <option value="Pending|Pending">Mark Pending</option>
                      <option value="Completed|Paid">Mark Completed</option>
                      <option value="Cancelled|Cancelled">Mark Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Order Details - #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="close-btn"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="order-info-grid">
                <div className="info-section">
                  <h3>👤 Customer Information</h3>
                  <div className="info-details">
                    <p><strong>Name:</strong> {selectedOrder.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.number}</p>
                    {selectedOrder.alt_number && (
                      <p><strong>Alt Phone:</strong> {selectedOrder.alt_number}</p>
                    )}
                    <p><strong>Address:</strong> {selectedOrder.address}</p>
                    <p><strong>City:</strong> {selectedOrder.city}</p>
                    <p><strong>State:</strong> {selectedOrder.state}</p>
                    <p><strong>Pincode:</strong> {selectedOrder.pincode}</p>
                  </div>
                </div>

                <div className="info-section">
                  <h3>💳 Payment Information</h3>
                  <div className="info-details">
                    <p><strong>Bill Number:</strong> {selectedOrder.bill_number || "N/A"}</p>
                    <p><strong>Payment Method:</strong> {selectedOrder.payment_method || "N/A"}</p>
                    <p><strong>Payment Status:</strong>
                      <span style={{ color: getStatusColor(selectedOrder.payment_status) }}>
                        {selectedOrder.payment_status || "Pending"}
                      </span>
                    </p>
                    <p><strong>Order Status:</strong>
                      <span style={{ color: getStatusColor(selectedOrder.status) }}>
                        {selectedOrder.status || "Pending"}
                      </span>
                    </p>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="order-items-section">
                <h3>🛍️ Order Items</h3>
                <div className="items-table-container">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Image</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="product-info">
                              <strong>{item.product_name}</strong>
                              {item.product_description && (
                                <p className="product-desc">
                                  {item.product_description.slice(0, 50)}...
                                </p>
                              )}
                            </div>
                          </td>
                          <td>
                            {item.product_image && (
                              <img
                                src={`http://localhost:5000/uploads/${item.product_image}`}
                                alt={item.product_name}
                                className="product-thumbnail"
                              />
                            )}
                          </td>
                          <td>{item.quantity}</td>
                          <td>₹{parseFloat(item.price || 0).toLocaleString()}</td>
                          <td>₹{(parseFloat(item.price || 0) * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Total Items:</span>
                  <span>{selectedOrder.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{parseFloat(selectedOrder.total_amount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => window.print()}
                className="print-order-btn"
              >
                🖨️ Print Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="close-modal-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}

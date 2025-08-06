import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaDownload, FaEye, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import './UserOrders.css';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, filter]);

  const fetchUserOrders = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;
    
    switch (filter) {
      case 'pending':
        filtered = orders.filter(order => order.status === 'Pending');
        break;
      case 'completed':
        filtered = orders.filter(order => order.status === 'Completed');
        break;
      case 'cancelled':
        filtered = orders.filter(order => order.status === 'Cancelled');
        break;
      default:
        filtered = orders;
    }
    
    setFilteredOrders(filtered);
  };

  const getOrderStats = () => {
    const pending = orders.filter(order => order.status === 'Pending').length;
    const completed = orders.filter(order => order.status === 'Completed').length;
    const cancelled = orders.filter(order => order.status === 'Cancelled').length;
    const total = orders.length;
    
    return { pending, completed, cancelled, total };
  };

  const downloadBill = async (orderId, billNumber) => {
    try {
      // Create a simple bill content
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const billContent = generateBillHTML(order);
      const blob = new Blob([billContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${billNumber || `Order-${orderId}`}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading bill:", error);
      alert("Failed to download bill");
    }
  };

  const downloadAllBills = () => {
    orders.forEach(order => {
      if (order.bill_number) {
        setTimeout(() => downloadBill(order.id, order.bill_number), 100);
      }
    });
  };

  const generateBillHTML = (order) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Bill - ${order.bill_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .details { margin: 20px 0; }
          .items { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; font-size: 1.2em; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Order Bill</h1>
          <p>Bill Number: ${order.bill_number}</p>
          <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        
        <div class="details">
          <h3>Customer Details:</h3>
          <p><strong>Name:</strong> ${order.name}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Phone:</strong> ${order.number}</p>
          <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
        </div>
        
        <div class="items">
          <h3>Order Items:</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map(item => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price}</td>
                  <td>₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
        </div>
        
        <div class="total">
          <p>Payment Method: ${order.payment_method}</p>
          <p>Payment Status: ${order.payment_status}</p>
          <p>Total Amount: ₹${parseFloat(order.total_amount).toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="user-orders-container">
      <div className="orders-header">
        <div className="header-content">
          <h1><FaShoppingBag /> My Orders</h1>
          <div className="orders-stats">
            <div className="stat-card">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.cancelled}</span>
              <span className="stat-label">Cancelled</span>
            </div>
          </div>
        </div>
        
        <div className="orders-actions">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button 
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
          
          {orders.length > 0 && (
            <button className="download-all-btn" onClick={downloadAllBills}>
              <FaDownload /> Download All Bills
            </button>
          )}
        </div>
      </div>

      <div className="orders-content">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <FaShoppingBag size={64} />
            <h3>No orders found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't placed any orders yet. Start shopping!" 
                : `No ${filter} orders found.`
              }
            </p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-items-preview">
                  <div className="items-images">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <img 
                        key={index}
                        src={`http://localhost:5000/uploads/${item.product_image}`}
                        alt={item.product_name}
                        className="item-preview-image"
                      />
                    ))}
                    {order.items?.length > 3 && (
                      <div className="more-items">+{order.items.length - 3}</div>
                    )}
                  </div>
                  <div className="items-summary">
                    <p>{order.items?.length || 0} item(s)</p>
                    <p className="order-total">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="order-card-footer">
                  <div className="payment-info">
                    <span className="payment-method">{order.payment_method}</span>
                    <span className={`payment-status ${order.payment_status?.toLowerCase()}`}>
                      {order.payment_status}
                    </span>
                  </div>
                  <div className="order-actions">
                    <button 
                      className="view-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FaEye /> View Details
                    </button>
                    {order.bill_number && (
                      <button 
                        className="download-btn"
                        onClick={() => downloadBill(order.id, order.bill_number)}
                      >
                        <FaDownload /> Bill
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - #{selectedOrder.id}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="order-details-grid">
                <div className="detail-section">
                  <h3>Order Information</h3>
                  <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
                  <p><strong>Bill Number:</strong> {selectedOrder.bill_number || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge ${selectedOrder.status?.toLowerCase()}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
                
                <div className="detail-section">
                  <h3>Payment Information</h3>
                  <p><strong>Method:</strong> {selectedOrder.payment_method}</p>
                  <p><strong>Status:</strong> 
                    <span className={`payment-status ${selectedOrder.payment_status?.toLowerCase()}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </p>
                  <p><strong>Total:</strong> ₹{parseFloat(selectedOrder.total_amount).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Items Ordered</h3>
                <div className="modal-items">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="modal-item">
                      <img 
                        src={`http://localhost:5000/uploads/${item.product_image}`}
                        alt={item.product_name}
                        className="modal-item-image"
                      />
                      <div className="modal-item-details">
                        <h4>{item.product_name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price} each</p>
                        <p><strong>Subtotal: ₹{(item.price * item.quantity).toLocaleString()}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              {selectedOrder.bill_number && (
                <button 
                  className="download-bill-btn"
                  onClick={() => downloadBill(selectedOrder.id, selectedOrder.bill_number)}
                >
                  <FaDownload /> Download Bill
                </button>
              )}
              <button 
                className="close-modal-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

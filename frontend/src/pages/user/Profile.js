import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaCamera, FaShoppingBag, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    number: user.number || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    fetchUserOrders();
    loadSavedAddress();
  }, []);

  const loadSavedAddress = () => {
    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress) {
      const address = JSON.parse(savedAddress);
      setFormData(prev => ({ ...prev, ...address }));
    }
  };

  const fetchUserOrders = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      
      const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, formData);
      
      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("userAddress", JSON.stringify(formData));
      setUser(updatedUser);
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
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
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/bill`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${billNumber || `Order-${orderId}`}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading bill:", error);
      alert("Failed to download bill");
    }
  };

  const stats = getOrderStats();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser size={60} />
          <button className="avatar-edit-btn">
            <FaCamera size={16} />
          </button>
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> Profile Details
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaShoppingBag /> My Orders ({stats.total})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-details">
            <div className="section-header">
              <h2>Profile Information</h2>
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Street address"
                  />
                </div>
                
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="orders-header">
              <h2>My Orders</h2>
              <div className="orders-filters">
                <button className="filter-btn active">All ({stats.total})</button>
                <button className="filter-btn">Pending ({stats.pending})</button>
                <button className="filter-btn">Completed ({stats.completed})</button>
                <button className="filter-btn">Cancelled ({stats.cancelled})</button>
              </div>
            </div>

            <div className="orders-list">
              {orders.length === 0 ? (
                <div className="no-orders">
                  <FaShoppingBag size={48} />
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here!</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.id}</h3>
                        <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status?.toLowerCase()}`}>
                          {order.status}
                        </span>
                        <span className="order-amount">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item">
                          <img 
                            src={`http://localhost:5000/uploads/${item.product_image}`}
                            alt={item.product_name}
                            className="item-image"
                          />
                          <div className="item-details">
                            <h4>{item.product_name}</h4>
                            <p>Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-actions">
                      <div className="payment-info">
                        <span>Payment: {order.payment_method}</span>
                        <span className={`payment-status ${order.payment_status?.toLowerCase()}`}>
                          {order.payment_status}
                        </span>
                      </div>
                      {order.bill_number && (
                        <button 
                          className="download-btn"
                          onClick={() => downloadBill(order.id, order.bill_number)}
                        >
                          <FaDownload /> Download Bill
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

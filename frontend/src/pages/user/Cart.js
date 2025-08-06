import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    altNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Load user data if logged in
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [showForm]);

  // ✅ Check login before showing checkout form
  const handleCheckoutClick = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to proceed with checkout.");
      return;
    }

    // Check if user has saved address details
    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress && !showForm) {
      const address = JSON.parse(savedAddress);
      setFormData(prev => ({ ...prev, ...address }));
      setShowPayment(true);
    } else {
      setShowForm(true);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    // Save address for future use
    localStorage.setItem("userAddress", JSON.stringify(formData));
    setShowForm(false);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID not found. Please login again.");
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate bill number
      const billNumber = `BILL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      const orderResponse = await axios.post("http://localhost:5000/api/orders", {
        ...formData,
        alt_number: formData.altNumber,
        userId,
        totalAmount: total,
        items: cart,
        payment_method: paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery",
        payment_status: paymentMethod === "card" ? "Paid" : "Pending",
        bill_number: billNumber
      });

      setOrderData({
        orderId: orderResponse.data.orderId,
        billNumber,
        ...formData,
        items: cart,
        total,
        paymentMethod: paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery",
        paymentStatus: paymentMethod === "card" ? "Paid" : "Pending"
      });

      // Clear cart after successful order
      cart.forEach(item => removeFromCart(item.id));

      alert("🎉 Order placed successfully! Your bill has been generated.");
      setShowPayment(false);
      setShowForm(false);

    } catch (error) {
      console.error("Order Creation Error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">🛒 Shopping Cart</h1>
        <p className="cart-subtitle">
          {cart.length === 0
            ? "Your cart is empty"
            : `${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`}
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <a href="/products" className="continue-shopping-btn">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="cart-content">
          {/* 🛍️ Cart Items */}
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="product-image"
                  />
                </div>

                <div className="cart-item-details">
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-price">₹{item.price}</p>
                  <p className="product-description">
                    {item.description
                      ? item.description.slice(0, 80) + "..."
                      : "No description available"}
                  </p>
                </div>

                <div className="quantity-controls">
                  <label className="quantity-label">Quantity:</label>
                  <div className="quantity-buttons">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="quantity-btn decrease"
                      disabled={item.quantity === 1}
                    >
                      −
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn increase"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-subtotal">
                  <p className="subtotal-label">Subtotal:</p>
                  <p className="subtotal-amount">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                    title="Remove from cart"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🧾 Summary */}
          <div className="cart-summary">
            <div className="summary-row">
              <span>
                Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):
              </span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span className="free-shipping">Free</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button onClick={handleCheckoutClick} className="checkout-btn">
              Proceed to Checkout
            </button>

            <a href="/products" className="continue-shopping-link">
              ← Continue Shopping
            </a>
          </div>

          {/* 📝 Checkout Form */}
          {showForm && (
            <div className="checkout-form-container">
              <h3 className="checkout-form-title">Shipping Information</h3>
              <form onSubmit={handleAddressSubmit} className="checkout-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Alternate Mobile Number (Optional)"
                    value={formData.altNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, altNumber: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group form-group-full">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group form-group-full">
                  <button type="submit" className="submit-order-btn">
                    � Save Address & Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Interface */}
          {showPayment && (
            <div className="payment-container">
              <h3 className="payment-title">💳 Payment Options</h3>

              <div className="payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="card" className="payment-label">
                    <div className="payment-option">
                      <span className="payment-icon">💳</span>
                      <div>
                        <strong>Credit/Debit Card</strong>
                        <p>Pay securely with your card</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="payment-method">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="cod" className="payment-label">
                    <div className="payment-option">
                      <span className="payment-icon">💰</span>
                      <div>
                        <strong>Cash on Delivery</strong>
                        <p>Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="card-details">
                  <h4>Card Details (Demo)</h4>
                  <div className="demo-card-form">
                    <input type="text" placeholder="1234 5678 9012 3456" className="form-input" readOnly />
                    <div className="card-row">
                      <input type="text" placeholder="MM/YY" className="form-input" readOnly />
                      <input type="text" placeholder="CVV" className="form-input" readOnly />
                    </div>
                    <input type="text" placeholder="Cardholder Name" className="form-input" readOnly />
                  </div>
                </div>
              )}

              <div className="payment-summary">
                <div className="summary-row">
                  <span>Total Amount:</span>
                  <span className="total-amount">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="payment-actions">
                <button
                  onClick={() => setShowPayment(false)}
                  className="back-btn"
                >
                  ← Back to Address
                </button>
                <button
                  onClick={handlePayment}
                  className="pay-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `💳 ${paymentMethod === "card" ? "Pay Now" : "Place Order"}`}
                </button>
              </div>
            </div>
          )}

          {/* Bill Generation */}
          {orderData && (
            <div className="bill-container">
              <div className="bill-header">
                <h2>🧾 Order Bill</h2>
                <p className="bill-number">Bill No: {orderData.billNumber}</p>
                <p className="order-date">Date: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="bill-details">
                <div className="customer-details">
                  <h3>Customer Details:</h3>
                  <p><strong>Name:</strong> {orderData.name}</p>
                  <p><strong>Email:</strong> {orderData.email}</p>
                  <p><strong>Phone:</strong> {orderData.number}</p>
                  <p><strong>Address:</strong> {orderData.address}, {orderData.city}, {orderData.state} - {orderData.pincode}</p>
                </div>

                <div className="order-items">
                  <h3>Order Items:</h3>
                  <table className="bill-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                          <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bill-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{orderData.total.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total Amount:</span>
                    <span>₹{orderData.total.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Payment Method:</span>
                    <span>{orderData.paymentMethod}</span>
                  </div>
                  <div className="summary-row">
                    <span>Payment Status:</span>
                    <span className={`payment-status ${orderData.paymentStatus.toLowerCase()}`}>
                      {orderData.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bill-actions">
                <button
                  onClick={() => window.print()}
                  className="print-btn"
                >
                  🖨️ Print Bill
                </button>
                <button
                  onClick={() => setOrderData(null)}
                  className="close-bill-btn"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

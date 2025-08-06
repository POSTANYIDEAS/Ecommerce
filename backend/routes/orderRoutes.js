const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Create new order with payment and inventory management
router.post('/', async (req, res) => {
  const {
    userId, name, email, number, altNumber, address, city, state, pincode,
    totalAmount, items, payment_method, payment_status, bill_number
  } = req.body;

  try {
    // Check inventory for all items first
    for (const item of items) {
      const [product] = await db.query('SELECT stock_quantity FROM products WHERE id = ?', [item.id]);
      if (product.length === 0) {
        return res.status(400).json({ message: `Product ${item.name} not found` });
      }
      if (product[0].stock_quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Available: ${product[0].stock_quantity}, Requested: ${item.quantity}`
        });
      }
    }

    // Insert into orders table with payment info
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, name, email, number, alt_number, address, city, state, pincode, total_amount, payment_method, payment_status, bill_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, number, altNumber, address, city, state, pincode, totalAmount, payment_method, payment_status, bill_number]
    );
    const orderId = orderResult.insertId;

    // Insert order items and update inventory
    for (const item of items) {
      // Insert order item
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );

      // Update product stock
      await db.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Admin get all orders with detailed information
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    // Get order items for each order
    for (let order of orders) {
      const [items] = await db.query(`
        SELECT
          oi.*,
          p.name as product_name,
          p.image as product_image,
          p.description as product_description
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get single order details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.query(`
      SELECT
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await db.query(`
      SELECT
        oi.*,
        p.name as product_name,
        p.image as product_image,
        p.description as product_description
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    order.items = items;

    res.json(order);
  } catch (error) {
    console.error('Fetch Order Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    await db.query(
      'UPDATE orders SET status = ?, payment_status = ? WHERE id = ?',
      [status, payment_status, id]
    );

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await db.query(`
      SELECT
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    // Get order items for each order
    for (let order of orders) {
      const [items] = await db.query(`
        SELECT
          oi.*,
          p.name as product_name,
          p.image as product_image,
          p.description as product_description
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Fetch User Orders Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get bill for download
router.get('/:id/bill', async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.query(`
      SELECT
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await db.query(`
      SELECT
        oi.*,
        p.name as product_name,
        p.image as product_image,
        p.description as product_description
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    order.items = items;

    // Generate HTML bill
    const billHTML = generateBillHTML(order);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="Bill-${order.bill_number || order.id}.html"`);
    res.send(billHTML);
  } catch (error) {
    console.error('Generate Bill Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

function generateBillHTML(order) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Bill - ${order.bill_number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .details { margin: 20px 0; }
        .items { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
        .company-info { margin-bottom: 20px; }
        .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
      </style>
    </head>
    <body>
      <div class="company-info">
        <h1>E-Shop</h1>
        <p>Your Trusted Online Store</p>
      </div>

      <div class="header">
        <h2>Order Bill</h2>
        <p><strong>Bill Number:</strong> ${order.bill_number || 'N/A'}</p>
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
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
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map(item => `
              <tr>
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>₹${parseFloat(item.price).toLocaleString()}</td>
                <td>₹${(parseFloat(item.price) * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      </div>

      <div class="total">
        <p><strong>Payment Method:</strong> ${order.payment_method}</p>
        <p><strong>Payment Status:</strong> ${order.payment_status}</p>
        <p><strong>Order Status:</strong> ${order.status}</p>
        <hr>
        <p style="font-size: 1.3em;"><strong>Total Amount: ₹${parseFloat(order.total_amount).toLocaleString()}</strong></p>
      </div>

      <div class="footer">
        <p>Thank you for shopping with E-Shop!</p>
        <p>For any queries, contact us at support@eshop.com</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;

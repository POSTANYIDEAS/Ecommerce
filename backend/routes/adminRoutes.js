const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

// ✅ Admin Login (Fixed with bcrypt)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await db.query(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, role: 'admin' },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Create Admin User (for setup purposes)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if admin already exists
    const [existing] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin (only email and password columns exist)
    await db.query(
      'INSERT INTO admins (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all customers (excluding password)
router.get('/customers', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT id, name, email, number, created_at FROM users'
    );
    res.json(results);
  } catch (err) {
    console.error('Fetch Users Error:', err);
    res.status(500).send(err);
  }
});

// ✅ Delete customer
router.delete('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err);
    res.status(500).send(err);
  }
});

// ✅ Update customer (name, email, number)
router.put('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number } = req.body;
    await db.query(
      'UPDATE users SET name=?, email=?, number=? WHERE id=?',
      [name, email, number, id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).send(err);
  }
});


module.exports = router;

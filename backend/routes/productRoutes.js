const express = require('express');
const router = express.Router();
const db = require('../db'); // Make sure db is from mysql2/promise
const multer = require('multer');
const path = require('path');

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Get all products with stock information and category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT p.*,
             COALESCE(p.stock_quantity, 0) as stock_quantity,
             c.name as category_name,
             c.id as category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;

    const params = [];

    if (category) {
      query += ' WHERE c.id = ?';
      params.push(category);
    }

    query += ' ORDER BY p.name ASC';

    const [results] = await db.query(query, params);
    res.json(results);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).send(err);
  }
});

// ✅ Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('SELECT *, COALESCE(stock_quantity, 0) as stock_quantity FROM products WHERE id = ?', [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Get product by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Add product with stock quantity and category
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, stock_quantity, category_id } = req.body;
    const image = req.file ? req.file.filename : null;
    const stockQty = stock_quantity || 100; // Default stock quantity

    const [result] = await db.query(
      'INSERT INTO products (name, price, description, image, stock_quantity, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, description, image, stockQty, category_id || null]
    );

    res.json({
      id: result.insertId,
      name,
      price,
      description,
      image,
      stock_quantity: stockQty,
      category_id: category_id || null
    });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).send(err);
  }
});

// ✅ Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    let query = 'UPDATE products SET name=?, price=?, description=?, category_id=?';
    const params = [name, price, description, category_id || null];

    if (image) {
      query += ', image=?';
      params.push(image);
    }
    query += ' WHERE id=?';
    params.push(id);

    await db.query(query, params);
    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).send(err);
  }
});

// ✅ Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Multer for multiple images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Get all product details
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM product_details');
    res.json(results);
  } catch (err) {
    console.error('Get product details error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get product details by product ID
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const [results] = await db.query('SELECT * FROM product_details WHERE product_id = ?', [productId]);

    if (results.length === 0) {
      return res.json(null); // Return null if no details found
    }

    // Parse images JSON string back to array
    const productDetails = results[0];
    if (productDetails.images) {
      try {
        productDetails.images = JSON.parse(productDetails.images);
      } catch (e) {
        productDetails.images = [];
      }
    }

    res.json(productDetails);
  } catch (err) {
    console.error('Get product details by product ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Add product details
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { product_id, description, advantages, disadvantages } = req.body;
    const images = req.files.map(file => file.filename);

    const [result] = await db.query(
      'INSERT INTO product_details (product_id, description, advantages, disadvantages, images) VALUES (?, ?, ?, ?, ?)',
      [product_id, description, advantages, disadvantages, JSON.stringify(images)]
    );

    res.json({ id: result.insertId, product_id, description, advantages, disadvantages, images });
  } catch (err) {
    console.error('Add product details error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update product details
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { description, advantages, disadvantages } = req.body;
    const images = req.files.length ? JSON.stringify(req.files.map(file => file.filename)) : null;

    let query = 'UPDATE product_details SET description=?, advantages=?, disadvantages=?';
    const params = [description, advantages, disadvantages];

    if (images) {
      query += ', images=?';
      params.push(images);
    }
    query += ' WHERE id=?';
    params.push(id);

    await db.query(query, params);
    res.json({ message: 'Product details updated' });
  } catch (err) {
    console.error('Update product details error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete product details
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM product_details WHERE id=?', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete product details error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

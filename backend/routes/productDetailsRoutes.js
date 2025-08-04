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
router.get('/', (req, res) => {
  db.query('SELECT * FROM product_details', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ✅ Add product details
router.post('/', upload.array('images', 5), (req, res) => {
  const { product_id, description, advantages, disadvantages } = req.body;
  const images = req.files.map(file => file.filename);

  db.query(
    'INSERT INTO product_details (product_id, description, advantages, disadvantages, images) VALUES (?, ?, ?, ?, ?)',
    [product_id, description, advantages, disadvantages, JSON.stringify(images)],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, product_id, description, advantages, disadvantages, images });
    }
  );
});

// ✅ Update product details
router.put('/:id', upload.array('images', 5), (req, res) => {
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

  db.query(query, params, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Product details updated' });
  });
});

// ✅ Delete product details
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM product_details WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Deleted successfully' });
  });
});

module.exports = router;

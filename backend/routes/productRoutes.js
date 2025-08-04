const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Get all products
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ✅ Add product
router.post('/', upload.single('image'), (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file ? req.file.filename : null;

  db.query(
    'INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)',
    [name, price, description, image],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, name, price, description, image });
    }
  );
});

// ✅ Update product
router.put('/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  const image = req.file ? req.file.filename : null;

  let query = 'UPDATE products SET name=?, price=?, description=?';
  const params = [name, price, description];

  if (image) {
    query += ', image=?';
    params.push(image);
  }
  query += ' WHERE id=?';
  params.push(id);

  db.query(query, params, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Product updated' });
  });
});

// ✅ Delete product
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Product deleted' });
  });
});


module.exports = router;

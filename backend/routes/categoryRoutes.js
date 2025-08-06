const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Setup multer for category images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, 'category_' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Get all categories
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(results);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(results[0]);
  } catch (err) {
    console.error('Get category error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Create new category
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)',
      [name, description, image]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      image,
      message: 'Category created successfully'
    });
  } catch (err) {
    console.error('Create category error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// ✅ Update category
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Check if category exists
    const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    let query = 'UPDATE categories SET name = ?, description = ?';
    const params = [name, description];

    if (image) {
      query += ', image = ?';
      params.push(image);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error('Update category error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// ✅ Delete category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has products
    const [products] = await db.query('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]);
    if (products[0].count > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It has ${products[0].count} products assigned to it.` 
      });
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get products by category
router.get('/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [results] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.category_id = ?
      ORDER BY p.name ASC
    `, [id]);
    
    res.json(results);
  } catch (err) {
    console.error('Get products by category error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const db = require('../db');

router.get('/', getUsers);

// ✅ Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number, address, city, state, pincode } = req.body;

    await db.query(
      'UPDATE users SET name = ?, email = ?, number = ? WHERE id = ?',
      [name, email, number, id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      'SELECT id, name, email, number, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

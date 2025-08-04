const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM admins WHERE email = ? AND password = ?', 
    [email, password], 
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: results[0].id, role: 'admin' }, 'secretkey', { expiresIn: '1h' });
      res.json({ token });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config');

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const selectQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(selectQuery, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email Not Found' });
    }
    const id = rows[0].id;
    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id },'xxx', { expiresIn: '1h' });
    res.status(200).json({ user: rows[0], token });
  } catch (err) {
    next(err);
  }
});


router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const selectQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(selectQuery, [email]);
  
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: rows[0].id },'xxx', { expiresIn: '1h' });
    res.status(200).json({ user: rows[0], token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

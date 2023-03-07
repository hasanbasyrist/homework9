const { json } = require('express');
const express = require('express');
const router =express.Router();
const pool =require('../config.js');
const { verifyToken } = require('../middleware/auth');
// const usersRouter = require('./routes/users');

// app.use('/auth/users', usersRouter);

// GET all users
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// GET a users by id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Users not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST a new users
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { email, gender, password, role } = req.body;
    console.log(email);
    console.log(req.body);
    const { rows } = await pool.query('INSERT INTO users (email, gender, password, role) VALUES ($1, $2, $3, $4) RETURNING *', [email, gender, password, role]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE a users by id
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Users not found' });
    }
    res.status(200).json({ message: 'Users deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT (update) a users by id
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, gender, password, role } = req.body;
    const { rows } = await pool.query('UPDATE users SET email = $1, gender = $2, password = $3 role = $4 WHERE id = $4 RETURNING *', [email, gender, password, role]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Users not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});
// GET all users with pagination
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const limit = req.query.limit || 10; // default limit is 10
    const offset = req.query.offset || 0;

    const { rows } = await pool.query('SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
const { json } = require('express');
const express = require('express');
const router =express.Router();
const pool =require('../config.js');
const { verifyToken } = require('../middleware/auth');


// GET all movies
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM movies');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// GET a movie by id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST a new movie
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { title, year, genres } = req.body;
    const { rows } = await pool.query('INSERT INTO movies (title, year, genres) VALUES ($1, $2, $3) RETURNING *', [title, year, genres]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE a movie by id
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT (update) a movie by id
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, year, genres } = req.body;
    const { rows } = await pool.query('UPDATE movies SET title = $1, year = $2, genres = $3 WHERE id = $4 RETURNING *', [title, year, genres, id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET all movies with pagination
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const limit = req.query.limit || 10; // default limit is 10
    const offset = req.query.offset || 0;

    const { rows } = await pool.query('SELECT * FROM movies ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
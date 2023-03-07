const logger = require('../logger');

// GET all users
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id OFFSET $1 LIMIT $2', [
      offset,
      limit,
    ]);

    logger.info(`Get all users - ${rows.length} users returned`);

    res.status(200).json(rows);
  } catch (err) {
    logger.error(`Get all users - ${err.message}`);
    next(err);
  }
});


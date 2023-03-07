const express = require('express');
const router = express.Router();
const moviesRouter = require('./movies');
const authUsers = require('./authUsers')
const usersRouter = require('./users');

router.use('/users',usersRouter)
router.use('/auth', authUsers)
router.use('/movies', moviesRouter)

module.exports = router;
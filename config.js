const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'movies_database',
  password: 'mengingatMU513',
  port: 5432,
});

module.exports = pool;
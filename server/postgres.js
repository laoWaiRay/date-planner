import pg from 'pg';

const pool = new pg.Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: "dateplanner"
});

export default pool;
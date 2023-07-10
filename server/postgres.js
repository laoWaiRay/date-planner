import pg from 'pg';

const pool = new pg.Pool({
  password: "password",
  database: "dateplanner"
});

export default pool;
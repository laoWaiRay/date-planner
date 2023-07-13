import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD
});

const createDatabase = async () => {
  await client.connect();
  await client.query("CREATE DATABASE dateplanner");
  await client.end();
};

const createTables = async () => {
  const pool = new pg.Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "dateplanner"
  });

  await pool.query(`
    CREATE TABLE users(
      id serial PRIMARY KEY,
      username varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      password_salt varchar(255) NOT NULL,
      avatar_URL text
    );
  `);

  await pool.query(`
    CREATE TABLE events(
      id serial PRIMARY KEY,
      title varchar(255) NOT NULL,
      description text,
      location_id integer,
      price price_enum,
      category category_enum,
      preferred_time preferred_time_enum,
      author varchar(255),
      date_posted DATE DEFAULT CURRENT_DATE,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE locations(
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL,
      city text,
      country text
    );
  `);

  await pool.end();
};

const createSchema = async () => {
  try {
    await createDatabase();
    await createTables();
    console.log("Schema creation successful!");
  } catch (error) {
    console.error("Error creating schema:", error);
  }
};

createSchema();

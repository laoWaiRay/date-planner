import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD
})

// Create DB
await client.connect();
await client.query("CREATE DATABASE IF NOT EXISTS dateplanner");
await client.end();

// Add tables
const pool = new pg.Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: "dateplanner"
})

await pool.query("CREATE TABLE users( \
                    id serial PRIMARY KEY, \
                    username varchar(255) NOT NULL, \
                    email varchar(255) NOT NULL, \
                    password varchar(255) NOT NULL, \
                    password_salt varchar(255) NOT NULL, \
                    avatar_URL text \
                  )");

await pool.query("CREATE TABLE events( \
                    id serial PRIMARY KEY, \
                    name varchar(255) NOT NULL, \
                    description text, \
                    category varchar(255), \
                    location text, \
                    author varchar(255), \
                    date_posted DATE DEFAULT CURRENT_DATE \
                )");

// TODO: Add dates, reviews, user_history tables
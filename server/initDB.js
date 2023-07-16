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
    CREATE TABLE locations(
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL,
      city text,
      country text
    );
  `);

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
      price varchar(255),
      category varchar(255),
      preferred_time varchar(255),
      author varchar(255),
      date_posted DATE DEFAULT CURRENT_DATE,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`INSERT INTO users (username, email, password, password_salt, avatar_URL)
  VALUES ('JohnDoe', 'johndoe@example.com', 'password1', 'salt1', 'https://example.com/avatar1.jpg');
  `);

  await pool.query(`INSERT INTO users (username, email, password, password_salt, avatar_URL)
  VALUES ('JaneSmith', 'janesmith@example.com', 'password2', 'salt2', 'https://example.com/avatar2.jpg');
  `)

    const query = `
    INSERT INTO locations (name, city, country)
    VALUES
      ('Location 1', 'New York', 'United States'),
      ('Location 2', 'London', 'United Kingdom');
  `;

  await pool.query(query);

  const query2 = `
  INSERT INTO events (title, description, location_id, price, category, preferred_time, author)
  VALUES
    ('Event 1', 'Description of Event 1', 1, 'Free', 'Concert', 'Evening', 'John Doe'),
    ('Event 2', 'Description of Event 2', 2, '$10', 'Conference', 'Morning', 'Jane Smith');
`;

await pool.query(query2);



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

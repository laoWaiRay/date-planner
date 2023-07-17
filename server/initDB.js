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
      username varchar(255) NOT NULL UNIQUE,
      email varchar(255) NOT NULL UNIQUE,
      password varchar(255) NOT NULL,
      password_salt varchar(255) NOT NULL,
      avatar_URL text
    );
  `);

  await pool.query(`
    CREATE TABLE locations(
      city text,
      country text,
      detailed_address text,
      PRIMARY KEY(city, country)
    );
  `);

  await pool.query(`
    CREATE TABLE events(
      id serial PRIMARY KEY,
      title varchar(255) NOT NULL,
      description text,
      author INT,
      price varchar(255),
      category varchar(255),
      preferred_time varchar(255),
      city text,
      country text,
      date_posted DATE DEFAULT CURRENT_DATE,
      private boolean DEFAULT FALSE,
      FOREIGN KEY (author) REFERENCES users(id),
      FOREIGN KEY (city, country) REFERENCES locations(city, country) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE invitations(
      id serial PRIMARY KEY,
      sender_id int REFERENCES users(id) ON DELETE CASCADE,
      receiver_id int REFERENCES users(id) ON DELETE CASCADE,
      event_id int REFERENCES events(id) ON DELETE CASCADE,
      status text,
      date DATE,
      start_time TIME
    );
  `);

  await pool.query(`
    CREATE TABLE reviews(
      id serial PRIMARY KEY,
      event_id INT REFERENCES events(id) ON DELETE CASCADE,
      author_id INT REFERENCES users(id) ON DELETE CASCADE,
      comment TEXT,
      date DATE DEFAULT CURRENT_DATE,
      score NUMERIC
    );
  `);

  await pool.end();
};

const insertMockData = async () => {
  const pool = new pg.Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "dateplanner"
  });

  try {
    await pool.query(`
      INSERT INTO users (username, email, password, password_salt, avatar_url) VALUES 
      ('shaquille.oatmeal', 'shaquille.oatmeal@gmail.com', '123', '123', 'https://i.pravatar.cc/150?img=14'),
      ('hoosier-daddy', 'hoosier-daddy@gmail.com', '123', '123', 'https://i.pravatar.cc/150?img=67'),
      ('applebottomjeans', 'applebottomjeans@gmail.com', '123', '123', 'https://i.pravatar.cc/150?img=61'),
      ('oprahwindfury', 'oprahwindfury@gmail.com', '123', '123', 'https://i.pravatar.cc/150?img=47'),
      ('anonymouse', 'anonymouse@gmail.com', '123', '123', 'https://i.pravatar.cc/150?img=26')
    `);

    console.log("Successfully inserted users table mock data");
  } catch (error) {
    console.error("Error inserting mock data:", error);
  }

    //mock data for location table
    try{
      await pool.query(`
        INSERT INTO locations (city, country, detailed_address)
        VALUES
          ('New York City', 'United States', '123 Main Street'),
          ('London', 'United Kingdom', '456 High Street');
      `);
      console.log("Successfully inserted locations table mock data");
    } catch(e){
      console.log("Error inserting mock data:", e)
    }

  //mock data for events table
  try{
    await pool.query(`
      INSERT INTO events (title, description, author, price, category, preferred_time, city, country)
      VALUES
        ('Event 1', 'Description of Event 1', 1, 'Free', 'Concert', 'Evening', 'New York City', 'United States'),
        ('Event 2', 'Description of Event 2', 2, '$10', 'Conference', 'Morning', 'London', 'United Kingdom');
    `);

    console.log("Successfully inserted events table mock data");

  } catch(e){
    console.log("Error inserting mock data:", e)
  }

}

const createSchema = async () => {
  try {
    await createDatabase();
    await createTables();
    console.log("Schema creation successful!");
  } catch (error) {
    console.error("Error creating schema:", error);
  }
};

await createSchema();
await insertMockData();

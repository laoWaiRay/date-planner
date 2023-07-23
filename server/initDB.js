import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new pg.Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
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
    database: "dateplanner",
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
      id serial PRIMARY KEY,
      city text,
      country text,
      detailed_address text
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
      location_id INT,
      date_posted DATE DEFAULT CURRENT_DATE,
      private boolean DEFAULT FALSE,
      comments text,
      FOREIGN KEY (author) REFERENCES users(id),
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
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

  await pool.query(`
    CREATE TABLE saved (
      id serial PRIMARY KEY,
      user_id int,
      event_id int,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id)
    );
`);

  await pool.end();
};

const insertMockData = async () => {
  const pool = new pg.Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "dateplanner",
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
    console.error("Error inserting mock data for users table:", error);
  }

  // mock data for locations table
  try {
    const locationData = [
      {
        city: 'New York City',
        country: 'United States',
        detailed_address: '123 Main Street'
      },
      {
        city: 'London',
        country: 'United Kingdom',
        detailed_address: '456 High Street'
      }
    ];

    for (const location of locationData) {
      await pool.query(
        `
        INSERT INTO locations (city, country, detailed_address)
        VALUES ($1, $2, $3)
        `,
        [location.city, location.country, location.detailed_address]
      );
    }

    console.log("Successfully inserted locations table mock data");
  } catch (e) {
    console.log("Error inserting mock data for locations table:", e);
  }

  // mock data for events table
  try {
    const eventData = [
      {
        title: 'Event 1',
        description: 'Description of Event 1',
        author: 1,
        price: 'Free',
        category: 'Concert',
        preferred_time: 'Evening',
        location_city: 'New York City', // Use new location data
        location_country: 'United States' // Use new location data
      },
      {
        title: 'Event 2',
        description: 'Description of Event 2',
        author: 2,
        price: '$10',
        category: 'Conference',
        preferred_time: 'Morning',
        location_city: 'London', // Use new location data
        location_country: 'United Kingdom' // Use new location data
      }
    ];

    for (const event of eventData) {
      await pool.query(
        `
        INSERT INTO events (title, description, author, price, category, preferred_time, location_id)
        SELECT $1, $2, $3, $4, $5, $6, id
        FROM locations
        WHERE city = $7 AND country = $8
        `,
        [
          event.title,
          event.description,
          event.author,
          event.price,
          event.category,
          event.preferred_time,
          event.location_city,
          event.location_country
        ]
      );
    }

    console.log("Successfully inserted events table mock data");
  } catch (e) {
    console.log("Error inserting mock data for events table:", e);
  }
};

const createSchema = async () => {
  try {
    await createDatabase();
    await createTables();
    console.log("Schema creation successful!");
    await insertMockData();
  } catch (error) {
    console.error("Error creating schema:", error);
  }
};

createSchema();

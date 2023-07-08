import express from 'express';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const pool = new pg.Pool({
  password: "password",
  database: "dateplanner"
});

const SALT_ROUNDS = 10;

// Log in user
app.post('/users/login', async (req, res, next) => {
  const {username, password} = req.body;
  let result;

  if (username.includes("@")) {
    result = await pool.query("SELECT * FROM users WHERE email = $1", [username])
  } else {
    result = await pool.query("SELECT * FROM users WHERE username = $1", [username])
  }

  if (result.rows.length > 0) {
    const userData = result.rows[0];
    const hashedPassword =  userData.password;
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (!result) {
        // Invalid password
        res.status(401).send({error: "Invalid login credentials"});
      } else {
        res.send(userData);
      }
    })
  } else {
    res.status(401).send({error: "Invalid login credentials"});
  }
})

// Sign up user
app.post('/users/new', async (req, res, next) => {
  const { username, email, password } = req.body;
  const userExistsQuery = "SELECT * FROM users \
                              WHERE username = $1 \
                              OR email = $2";
  const userExistsResult = await pool.query(userExistsQuery, [username, email]);

  // If user already exists in DB, don't sign up
  if (userExistsResult.rows.length > 0) {
    return res.status(409).send({error: "Username/email already taken"});
  }

  const insertUserQuery = "INSERT INTO users(username, email, password, password_salt) \
                              VALUES ($1, $2, $3, $4) \
                              RETURNING (id)";

  // Create password hash using bcrypt
  bcrypt.genSalt(SALT_ROUNDS, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
      // Insert into DB and then return the newly inserted row
      const result = await pool.query(insertUserQuery, [username, email, hash, salt]);
      const id = result.rows[0].id;
      const userData = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      res.send(userData.rows[0]);
    });
  });
})

// Get list of all users
app.get('/users', async(req, res, next) => {
  const usersQuery = "SELECT username, email, avatar_url FROM users";
  const usersResult = await pool.query(usersQuery);
  res.json(usersResult.rows);
})

// Get user with matching email/username
app.get('/users/query', async(req, res, next) => {
  const {username, email} = req.query;
  console.log(username, email)
  const userExistsQuery = "SELECT * FROM users WHERE username = $1 OR email = $2";
  const result = await pool.query(userExistsQuery, [username, email]);
  if (result.rows.length)
    res.json(result.rows[0]);
  else
    res.json({error: "No user with matching username/email found"});
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})
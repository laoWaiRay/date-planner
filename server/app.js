import express from 'express';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import session from 'express-session';
import verifyToken from './VerifyGoogleToken.js';

const app = express();
const PORT = 8000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000*60*60,
    httpOnly: true   // Security concern if set to false...
  }
}));

const pool = new pg.Pool({
  password: "password",
  database: "dateplanner"
});

const SALT_ROUNDS = 10;

// Remove fields from database response user object
const createUserSession = (userData) => {
  const { username, email, avatar_url } = userData;
  return { username, email, avatar_url };
}

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
        // Login success - create a session
        const userSession = createUserSession(userData);
        req.session.regenerate((err) => {
          if (err) next(err);
          req.session.user = {...userSession};
          res.json(req.session.user);
        })
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
      const userData = (await pool.query("SELECT * FROM users WHERE id = $1", [id])).rows[0];
      const userSession = createUserSession(userData);
      req.session.user = userSession;
      res.json(userSession);
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
  const userExistsQuery = "SELECT * FROM users WHERE username = $1 OR email = $2";
  const result = await pool.query(userExistsQuery, [username, email]);
  if (result.rows.length)
    res.json(result.rows[0]);
  else
    res.json({error: "No user with matching username/email found"});
})

// Get session data if exists
app.get('/session', (req, res, next) => {
  if (req.session.user) {
    console.log("Session exists:", req.session.user);
    res.json(req.session.user);
  } else {
    console.log("Session does not exist", req.session);
    res.json({error: "No session available"});
  }
})

// Close session
app.get('/logout', (req, res, next) => {
  // regenerate wasn't working for some reason
  req.session.destroy();
  res.status(200).end();
})

// Login with google
app.post('/login/google', async (req, res, next) => {
  // Extracting Bearer Token from headers
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const email = await verifyToken(token).catch(console.log);
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const {username, avatar_url} = result.rows[0];
  req.session.user = {username, email, avatar_url};
  console.log("Logged in successfully as: ", req.session.user)
  res.status(200).end()
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})
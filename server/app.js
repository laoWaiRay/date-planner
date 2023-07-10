import express from 'express';
import cors from 'cors';
import session from 'express-session';
import userRouter from './routes/users.js'

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

app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})
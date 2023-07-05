import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const pool = new pg.Pool({
  password: "password"
});

app.post('/users', (req, res, next) => {

})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})
import pool from '../postgres.js'

const reviewController = {};

reviewController.addReview = async (req, res, next) => {
  const { id } = req.params;
  const { author_id, comment, score } = req.body;
  await pool.query(`
    INSERT INTO reviews(event_id, author_id, comment, score)
    VALUES ($1, $2, $3, $4);
  `, [id, author_id, comment, score]);
  res.status(200).end();
};

reviewController.editReview = async (req, res, next) => {
  const { id } = req.params;
  const { comment, score } = req.body;
  await pool.query(`
    UPDATE reviews
    SET comment = $1, score = $2, date = CURRENT_DATE
    WHERE id = $3;
  `, [comment, score, id])
  res.status(200).end();
};

reviewController.deleteReview = async (req, res, next) => {
  const { id } = req.params;
  const query = `
    DELETE FROM reviews
    WHERE id = $1;
  `;
  await pool.query(query, [id]);
  res.status(200).end();
};

reviewController.getReviews = async (req, res, next) => {
  const { id } = req.params;
  const query = `
    SELECT R.id, U.username, R.score, R.comment, R.date 
    FROM reviews R
      INNER JOIN events E ON R.event_id = E.id
      INNER JOIN users U ON R.author_id = U.id
    WHERE E.id = ($1)
    ORDER BY R.date;
  `;
  const result = await pool.query(query, [id]);
  res.json(result.rows);
};

reviewController.getReviewAverageScore = async (req, res, next) => {
  const { id } = req.params;
  const query = `
    SELECT AVG (score)
    FROM reviews
    WHERE event_id = $1
  `;
  const result = await pool.query(query, [id]);
  res.json(result.rows[0]);
}

export default reviewController;
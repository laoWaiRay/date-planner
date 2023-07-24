import { Router } from 'express';
import reviewController from '../controllers/reviewController.js';

const router = new Router();

// Add a new review for a given event ID
router.post("/:id", reviewController.addReview);

// Edit a review for a given review ID
router.post("/:id/edit", reviewController.editReview);

// Delete a review by review ID
router.delete("/:id", reviewController.deleteReview);

// Get a list of all reviews for a given event ID
router.get("/:id", reviewController.getReviews);

// Get the average rating for a given event ID
router.get("/:id/average", reviewController.getReviewAverageScore);

export default router
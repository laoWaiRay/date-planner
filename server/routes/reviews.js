import { Router } from 'express';
import reviewController from '../controllers/reviewController.js';
import requireAuth from "../helpers/requireAuth.js"

const router = new Router();

// Add a new review for a given event ID
router.post("/:id", requireAuth, reviewController.addReview);

// Edit a review for a given review ID
router.post("/:id/edit", requireAuth, reviewController.editReview);

// Delete a review by review ID
router.delete("/:id", requireAuth, reviewController.deleteReview);

// Get a list of all reviews for a given event ID
router.get("/:id", requireAuth, reviewController.getReviews);

// Get the average rating for a given event ID
router.get("/:id/average", requireAuth, reviewController.getReviewAverageScore);

export default router
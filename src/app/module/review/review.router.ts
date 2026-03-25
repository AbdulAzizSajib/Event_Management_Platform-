import { Router } from "express";
import { reviewController } from "./review.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewValidation } from "./review.validation";
import { Role } from "../../../generated/prisma/enums";

const reviewRouter = Router();

// Create review (only approved participants)
reviewRouter.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ReviewValidation.createReviewZodSchema),
  reviewController.createReview,
);

// Get my reviews
reviewRouter.get(
  "/my-reviews",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  reviewController.getMyReviews,
);

// Get featured reviews for homepage (public)
reviewRouter.get("/featured", reviewController.getFeaturedReviews);

// Get reviews for an event (public)
reviewRouter.get(
  "/event/:eventId",
  reviewController.getEventReviews,
);

// Update review (own only)
reviewRouter.patch(
  "/:reviewId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  reviewController.updateReview,
);

// Delete review (own or admin)
reviewRouter.delete(
  "/:reviewId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  reviewController.deleteReview,
);

export default reviewRouter;

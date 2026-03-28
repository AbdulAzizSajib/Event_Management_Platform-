import { catchAsync } from "../../shared/catchAsync.js";
import { reviewService } from "./review.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
const createReview = catchAsync(async (req, res) => {
    const result = await reviewService.createReview(req.user.userId, req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});
const updateReview = catchAsync(async (req, res) => {
    const result = await reviewService.updateReview(req.params.reviewId, req.user.userId, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Review updated successfully",
        data: result,
    });
});
const deleteReview = catchAsync(async (req, res) => {
    await reviewService.deleteReview(req.params.reviewId, req.user.userId, req.user.role);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Review deleted successfully",
    });
});
const getEventReviews = catchAsync(async (req, res) => {
    const result = await reviewService.getEventReviews(req.params.eventId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Event reviews retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getMyReviews = catchAsync(async (req, res) => {
    const result = await reviewService.getMyReviews(req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "My reviews retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getFeaturedReviews = catchAsync(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await reviewService.getFeaturedReviews(limit);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Featured reviews retrieved successfully",
        data: result,
    });
});
export const reviewController = {
    createReview,
    updateReview,
    deleteReview,
    getEventReviews,
    getMyReviews,
    getFeaturedReviews,
};
//# sourceMappingURL=review.controller.js.map
import { catchAsync } from "../../shared/catchAsync.js";
import { adminService } from "./admin.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
// ========== USER MANAGEMENT ==========
const getAllUsers = catchAsync(async (req, res) => {
    const result = await adminService.getAllUsers(req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getUserById = catchAsync(async (req, res) => {
    const result = await adminService.getUserById(req.params.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});
const updateUserStatus = catchAsync(async (req, res) => {
    const result = await adminService.updateUserStatus(req.params.userId, req.body.status);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: `User ${req.body.status.toLowerCase()} successfully`,
        data: result,
    });
});
// ========== EVENT MANAGEMENT ==========
const getAllEventsAdmin = catchAsync(async (req, res) => {
    const result = await adminService.getAllEventsAdmin(req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Events retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const deleteEvent = catchAsync(async (req, res) => {
    await adminService.deleteEvent(req.params.eventId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Event deleted successfully",
    });
});
// ========== REVIEW MANAGEMENT ==========
const getAllReviewsAdmin = catchAsync(async (req, res) => {
    const result = await adminService.getAllReviewsAdmin(req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Reviews retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const deleteReview = catchAsync(async (req, res) => {
    await adminService.deleteReview(req.params.reviewId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Review deleted successfully",
    });
});
// ========== DASHBOARD ==========
const getDashboardStats = catchAsync(async (req, res) => {
    const result = await adminService.getDashboardStats();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: result,
    });
});
export const adminController = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    getAllEventsAdmin,
    deleteEvent,
    getAllReviewsAdmin,
    deleteReview,
    getDashboardStats,
};
//# sourceMappingURL=admin.controller.js.map
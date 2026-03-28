import { catchAsync } from "../../shared/catchAsync.js";
import { eventService } from "./event.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
const createEvent = catchAsync(async (req, res) => {
    const result = await eventService.createEvent(req.user.userId, req.body, req.file);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Event created successfully",
        data: result,
    });
});
const getAllEvents = catchAsync(async (req, res) => {
    const result = await eventService.getAllEvents(req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Events retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getEventById = catchAsync(async (req, res) => {
    const result = await eventService.getEventById(req.params.id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Event retrieved successfully",
        data: result,
    });
});
const getMyEvents = catchAsync(async (req, res) => {
    const result = await eventService.getMyEvents(req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "My events retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const updateEvent = catchAsync(async (req, res) => {
    const result = await eventService.updateEvent(req.params.id, req.user.userId, req.user.role, req.body, req.file);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Event updated successfully",
        data: result,
    });
});
const deleteEvent = catchAsync(async (req, res) => {
    await eventService.deleteEvent(req.params.id, req.user.userId, req.user.role);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Event deleted successfully",
    });
});
const toggleFeatured = catchAsync(async (req, res) => {
    const result = await eventService.toggleFeatured(req.params.id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: `Event ${result.isFeatured ? "featured" : "unfeatured"} successfully`,
        data: result,
    });
});
const getPlatformStats = catchAsync(async (req, res) => {
    const result = await eventService.getPlatformStats();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Platform stats retrieved successfully",
        data: result,
    });
});
export const eventController = {
    createEvent,
    getAllEvents,
    getEventById,
    getMyEvents,
    updateEvent,
    deleteEvent,
    toggleFeatured,
    getPlatformStats,
};
//# sourceMappingURL=event.controller.js.map
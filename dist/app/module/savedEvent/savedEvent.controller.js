import { catchAsync } from "../../shared/catchAsync.js";
import { savedEventService } from "./savedEvent.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
const saveEvent = catchAsync(async (req, res) => {
    const result = await savedEventService.saveEvent(req.user.userId, req.body.eventId);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Event saved successfully",
        data: result,
    });
});
const unsaveEvent = catchAsync(async (req, res) => {
    await savedEventService.unsaveEvent(req.user.userId, req.params.eventId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Event unsaved successfully",
    });
});
const getMySavedEvents = catchAsync(async (req, res) => {
    const result = await savedEventService.getMySavedEvents(req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Saved events retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const isEventSaved = catchAsync(async (req, res) => {
    const result = await savedEventService.isEventSaved(req.user.userId, req.params.eventId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Save status retrieved successfully",
        data: { isSaved: result },
    });
});
export const savedEventController = {
    saveEvent,
    unsaveEvent,
    getMySavedEvents,
    isEventSaved,
};
//# sourceMappingURL=savedEvent.controller.js.map
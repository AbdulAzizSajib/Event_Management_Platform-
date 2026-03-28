import { catchAsync } from "../../shared/catchAsync.js";
import { participantService } from "./participant.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
const joinEvent = catchAsync(async (req, res) => {
    const result = await participantService.joinEvent(req.user.userId, req.body.eventId);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Successfully joined the event",
        data: result,
    });
});
const getEventParticipants = catchAsync(async (req, res) => {
    const result = await participantService.getEventParticipants(req.params.eventId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Participants retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getMyParticipations = catchAsync(async (req, res) => {
    const result = await participantService.getMyParticipations(req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "My participations retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const updateParticipantStatus = catchAsync(async (req, res) => {
    const result = await participantService.updateParticipantStatus(req.params.participantId, req.user.userId, req.body.status);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: `Participant ${req.body.status.toLowerCase()} successfully`,
        data: result,
    });
});
const cancelParticipation = catchAsync(async (req, res) => {
    await participantService.cancelParticipation(req.params.eventId, req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Participation cancelled successfully",
    });
});
export const participantController = {
    joinEvent,
    getEventParticipants,
    getMyParticipations,
    updateParticipantStatus,
    cancelParticipation,
};
//# sourceMappingURL=participant.controller.js.map
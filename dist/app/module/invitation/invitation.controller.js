import { catchAsync } from "../../shared/catchAsync.js";
import { invitationService } from "./invitation.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
const sendInvitation = catchAsync(async (req, res) => {
    const result = await invitationService.sendInvitation(req.user.userId, req.body.eventId, req.body.inviteeId);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Invitation sent successfully",
        data: result,
    });
});
const respondToInvitation = catchAsync(async (req, res) => {
    const result = await invitationService.respondToInvitation(req.params.invitationId, req.user.userId, req.body.status);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: `Invitation ${req.body.status.toLowerCase()} successfully`,
        data: result,
    });
});
const getMyInvitations = catchAsync(async (req, res) => {
    const result = await invitationService.getMyInvitations(req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Invitations retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getSentInvitations = catchAsync(async (req, res) => {
    const result = await invitationService.getSentInvitations(req.user.userId, req.params.eventId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Sent invitations retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const cancelInvitation = catchAsync(async (req, res) => {
    await invitationService.cancelInvitation(req.params.invitationId, req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Invitation cancelled successfully",
    });
});
export const invitationController = {
    sendInvitation,
    respondToInvitation,
    getMyInvitations,
    getSentInvitations,
    cancelInvitation,
};
//# sourceMappingURL=invitation.controller.js.map
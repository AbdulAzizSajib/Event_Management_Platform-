import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { invitationService } from "./invitation.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";

const sendInvitation = catchAsync(async (req: Request, res: Response) => {
  const result = await invitationService.sendInvitation(
    req.user.userId,
    req.body.eventId,
    req.body.inviteeId,
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Invitation sent successfully",
    data: result,
  });
});

const respondToInvitation = catchAsync(async (req: Request, res: Response) => {
  const result = await invitationService.respondToInvitation(
    req.params.invitationId as string,
    req.user.userId,
    req.body.status,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: `Invitation ${req.body.status.toLowerCase()} successfully`,
    data: result,
  });
});

const getMyInvitations = catchAsync(async (req: Request, res: Response) => {
  const result = await invitationService.getMyInvitations(
    req.user.userId,
    req.query as IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Invitations retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSentInvitations = catchAsync(async (req: Request, res: Response) => {
  const result = await invitationService.getSentInvitations(
    req.user.userId,
    req.params.eventId as string,
    req.query as IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Sent invitations retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const cancelInvitation = catchAsync(async (req: Request, res: Response) => {
  await invitationService.cancelInvitation(
    req.params.invitationId as string,
    req.user.userId,
  );

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

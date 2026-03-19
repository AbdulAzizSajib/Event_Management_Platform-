import { Router } from "express";
import { invitationController } from "./invitation.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { InvitationValidation } from "./invitation.validation";
import { Role } from "../../../generated/prisma/enums";

const invitationRouter = Router();

// Send invitation (organizer only)
invitationRouter.post(
  "/send",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(InvitationValidation.sendInvitationZodSchema),
  invitationController.sendInvitation,
);

// Get my received invitations
invitationRouter.get(
  "/my-invitations",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  invitationController.getMyInvitations,
);

// Get sent invitations for an event (organizer only)
invitationRouter.get(
  "/event/:eventId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  invitationController.getSentInvitations,
);

// Respond to invitation (accept/decline)
invitationRouter.patch(
  "/:invitationId/respond",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(InvitationValidation.respondInvitationZodSchema),
  invitationController.respondToInvitation,
);

// Cancel invitation (organizer only)
invitationRouter.delete(
  "/:invitationId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  invitationController.cancelInvitation,
);

export default invitationRouter;

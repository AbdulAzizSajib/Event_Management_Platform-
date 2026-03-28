import { Router } from "express";
import { participantController } from "./participant.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { ParticipantValidation } from "./participant.validation.js";
import { Role } from "../../../generated/prisma/enums.js";
const participantRouter = Router();
// Join an event
participantRouter.post("/join", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), validateRequest(ParticipantValidation.joinEventZodSchema), participantController.joinEvent);
// Get my participations
participantRouter.get("/my-participations", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), participantController.getMyParticipations);
// Get participants of an event (organizer or admin)
participantRouter.get("/event/:eventId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), participantController.getEventParticipants);
// Update participant status (approve/reject/ban) — only organizer
participantRouter.patch("/:participantId/status", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), validateRequest(ParticipantValidation.updateParticipantStatusZodSchema), participantController.updateParticipantStatus);
// Cancel own participation
participantRouter.delete("/cancel/:eventId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), participantController.cancelParticipation);
export default participantRouter;
//# sourceMappingURL=participant.router.js.map
import { Router } from "express";
import { savedEventController } from "./savedEvent.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { SavedEventValidation } from "./savedEvent.validation.js";
import { Role } from "../../../generated/prisma/enums.js";
const savedEventRouter = Router();
// Save an event
savedEventRouter.post("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), validateRequest(SavedEventValidation.saveEventZodSchema), savedEventController.saveEvent);
// Get my saved events
savedEventRouter.get("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), savedEventController.getMySavedEvents);
// Check if event is saved
savedEventRouter.get("/status/:eventId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), savedEventController.isEventSaved);
// Unsave an event
savedEventRouter.delete("/:eventId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), savedEventController.unsaveEvent);
export default savedEventRouter;
//# sourceMappingURL=savedEvent.router.js.map
import { Router } from "express";
import { eventController } from "./event.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { EventValidation } from "./event.validation.js";
import { Role } from "../../../generated/prisma/enums.js";
import { multerUpload } from "../../config/multer.config.js";
const eventRouter = Router();
// Public routes
eventRouter.get("/", eventController.getAllEvents);
eventRouter.get("/platform-stats", eventController.getPlatformStats);
// Authenticated routes (must be before /:id to avoid conflict)
eventRouter.get("/my-events", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), eventController.getMyEvents);
eventRouter.post("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("image"), validateRequest(EventValidation.createEventZodSchema), eventController.createEvent);
// Public - single event (after static routes)
eventRouter.get("/:id", eventController.getEventById);
eventRouter.patch("/:id", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("image"), validateRequest(EventValidation.updateEventZodSchema), eventController.updateEvent);
eventRouter.delete("/:id", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), eventController.deleteEvent);
// Admin only
eventRouter.patch("/:id/toggle-featured", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), eventController.toggleFeatured);
export default eventRouter;
//# sourceMappingURL=event.router.js.map
import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { AdminValidation } from "./admin.validation.js";
import { Role } from "../../../generated/prisma/enums.js";
const adminRouter = Router();
// All routes require ADMIN or SUPER_ADMIN
// ========== DASHBOARD ==========
adminRouter.get("/dashboard", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getDashboardStats);
// ========== USER MANAGEMENT ==========
adminRouter.get("/users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAllUsers);
adminRouter.get("/users/:userId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getUserById);
adminRouter.patch("/users/:userId/status", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(AdminValidation.updateUserStatusZodSchema), adminController.updateUserStatus);
// ========== EVENT MANAGEMENT ==========
adminRouter.get("/events", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAllEventsAdmin);
adminRouter.delete("/events/:eventId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.deleteEvent);
// ========== REVIEW MANAGEMENT ==========
adminRouter.get("/reviews", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAllReviewsAdmin);
adminRouter.delete("/reviews/:reviewId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.deleteReview);
export default adminRouter;
//# sourceMappingURL=admin.router.js.map
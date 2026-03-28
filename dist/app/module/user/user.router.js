import { Router } from "express";
import { userController } from "./user.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { UserValidation } from "./user.validation.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { multerUpload } from "../../config/multer.config.js";
const userRouter = Router();
// Dashboard
userRouter.get("/dashboard", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), userController.getMyDashboard);
// Update profile (form-data with optional image file)
userRouter.patch("/profile", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("image"), validateRequest(UserValidation.updateProfileZodSchema), userController.updateProfile);
// Create admin (SUPER_ADMIN or ADMIN only)
userRouter.post("/create-admin", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), validateRequest(UserValidation.createAdminZodSchema), userController.createAdmin);
export default userRouter;
//# sourceMappingURL=user.router.js.map
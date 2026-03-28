import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { CategoryValidation } from "./category.validation.js";
import { Role } from "../../../generated/prisma/enums.js";
const categoryRouter = Router();
// Public - get all categories
categoryRouter.get("/", categoryController.getAllCategories);
// Admin only - create, update, delete
categoryRouter.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(CategoryValidation.createCategoryZodSchema), categoryController.createCategory);
categoryRouter.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(CategoryValidation.updateCategoryZodSchema), categoryController.updateCategory);
categoryRouter.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), categoryController.deleteCategory);
export default categoryRouter;
//# sourceMappingURL=category.router.js.map
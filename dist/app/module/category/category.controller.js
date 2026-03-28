import { catchAsync } from "../../shared/catchAsync.js";
import { categoryService } from "./category.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
const createCategory = catchAsync(async (req, res) => {
    const result = await categoryService.createCategory(req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
const getAllCategories = catchAsync(async (req, res) => {
    const result = await categoryService.getAllCategories();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
});
const updateCategory = catchAsync(async (req, res) => {
    const result = await categoryService.updateCategory(req.params.id, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
});
const deleteCategory = catchAsync(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Category deleted successfully",
    });
});
export const categoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=category.controller.js.map
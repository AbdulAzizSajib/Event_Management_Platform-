import { Category } from "../../../generated/prisma/client";
export declare const categoryService: {
    createCategory: (payload: {
        name: string;
        icon?: string;
    }) => Promise<Category>;
    getAllCategories: () => Promise<Category[]>;
    updateCategory: (id: string, payload: {
        name?: string;
        icon?: string;
    }) => Promise<Category>;
    deleteCategory: (id: string) => Promise<Category>;
};
//# sourceMappingURL=category.service.d.ts.map
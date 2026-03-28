import z from "zod";
export declare const createCategoryZodSchema: z.ZodObject<{
    name: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateCategoryZodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CategoryValidation: {
    createCategoryZodSchema: z.ZodObject<{
        name: z.ZodString;
        icon: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    updateCategoryZodSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
//# sourceMappingURL=category.validation.d.ts.map
import z from "zod";
export declare const updateUserStatusZodSchema: z.ZodObject<{
    status: z.ZodEnum<{
        BLOCKED: "BLOCKED";
        DELETED: "DELETED";
        ACTIVE: "ACTIVE";
    }>;
}, z.core.$strip>;
export declare const AdminValidation: {
    updateUserStatusZodSchema: z.ZodObject<{
        status: z.ZodEnum<{
            BLOCKED: "BLOCKED";
            DELETED: "DELETED";
            ACTIVE: "ACTIVE";
        }>;
    }, z.core.$strip>;
};
//# sourceMappingURL=admin.validation.d.ts.map
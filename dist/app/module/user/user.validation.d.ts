import z from "zod";
export declare const createAdminZodSchema: z.ZodObject<{
    password: z.ZodString;
    admin: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodEmail;
        contactNumber: z.ZodOptional<z.ZodString>;
        profilePhoto: z.ZodOptional<z.ZodURL>;
    }, z.core.$strip>;
    role: z.ZodEnum<{
        SUPER_ADMIN: "SUPER_ADMIN";
        ADMIN: "ADMIN";
    }>;
}, z.core.$strip>;
export declare const updateProfileZodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UserValidation: {
    createAdminZodSchema: z.ZodObject<{
        password: z.ZodString;
        admin: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodEmail;
            contactNumber: z.ZodOptional<z.ZodString>;
            profilePhoto: z.ZodOptional<z.ZodURL>;
        }, z.core.$strip>;
        role: z.ZodEnum<{
            SUPER_ADMIN: "SUPER_ADMIN";
            ADMIN: "ADMIN";
        }>;
    }, z.core.$strip>;
    updateProfileZodSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
//# sourceMappingURL=user.validation.d.ts.map
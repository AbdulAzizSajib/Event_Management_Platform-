import z from "zod";
export declare const createReviewZodSchema: z.ZodObject<{
    eventId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodString;
}, z.core.$strip>;
export declare const updateReviewZodSchema: z.ZodObject<{
    rating: z.ZodOptional<z.ZodNumber>;
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ReviewValidation: {
    createReviewZodSchema: z.ZodObject<{
        eventId: z.ZodString;
        rating: z.ZodNumber;
        comment: z.ZodString;
    }, z.core.$strip>;
    updateReviewZodSchema: z.ZodObject<{
        rating: z.ZodOptional<z.ZodNumber>;
        comment: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
//# sourceMappingURL=review.validation.d.ts.map
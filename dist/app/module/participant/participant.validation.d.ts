import z from "zod";
export declare const joinEventZodSchema: z.ZodObject<{
    eventId: z.ZodString;
}, z.core.$strip>;
export declare const updateParticipantStatusZodSchema: z.ZodObject<{
    status: z.ZodEnum<{
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        BANNED: "BANNED";
    }>;
}, z.core.$strip>;
export declare const ParticipantValidation: {
    joinEventZodSchema: z.ZodObject<{
        eventId: z.ZodString;
    }, z.core.$strip>;
    updateParticipantStatusZodSchema: z.ZodObject<{
        status: z.ZodEnum<{
            APPROVED: "APPROVED";
            REJECTED: "REJECTED";
            BANNED: "BANNED";
        }>;
    }, z.core.$strip>;
};
//# sourceMappingURL=participant.validation.d.ts.map
import z from "zod";
export declare const sendInvitationZodSchema: z.ZodObject<{
    eventId: z.ZodString;
    inviteeId: z.ZodString;
}, z.core.$strip>;
export declare const respondInvitationZodSchema: z.ZodObject<{
    status: z.ZodEnum<{
        ACCEPTED: "ACCEPTED";
        DECLINED: "DECLINED";
    }>;
}, z.core.$strip>;
export declare const InvitationValidation: {
    sendInvitationZodSchema: z.ZodObject<{
        eventId: z.ZodString;
        inviteeId: z.ZodString;
    }, z.core.$strip>;
    respondInvitationZodSchema: z.ZodObject<{
        status: z.ZodEnum<{
            ACCEPTED: "ACCEPTED";
            DECLINED: "DECLINED";
        }>;
    }, z.core.$strip>;
};
//# sourceMappingURL=invitation.validation.d.ts.map
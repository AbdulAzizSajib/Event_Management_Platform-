import z from "zod";
export declare const ChatValidation: {
    startConversationZodSchema: z.ZodObject<{
        eventId: z.ZodString;
    }, z.core.$strip>;
    sendMessageZodSchema: z.ZodObject<{
        content: z.ZodString;
    }, z.core.$strip>;
};
//# sourceMappingURL=chat.validation.d.ts.map
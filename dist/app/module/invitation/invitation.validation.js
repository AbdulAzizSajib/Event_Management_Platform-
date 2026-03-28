import z from "zod";
export const sendInvitationZodSchema = z.object({
    eventId: z.string("Event ID is required").uuid("Invalid event ID"),
    inviteeId: z.string("Invitee ID is required"),
});
export const respondInvitationZodSchema = z.object({
    status: z.enum(["ACCEPTED", "DECLINED"], "Status must be ACCEPTED or DECLINED"),
});
export const InvitationValidation = {
    sendInvitationZodSchema,
    respondInvitationZodSchema,
};
//# sourceMappingURL=invitation.validation.js.map
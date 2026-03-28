import z from "zod";
export declare const createEventZodSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    date: z.ZodString;
    time: z.ZodString;
    venue: z.ZodOptional<z.ZodString>;
    eventLink: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        PUBLIC: "PUBLIC";
        PRIVATE: "PRIVATE";
    }>>;
    fee: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxAttendees: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    categoryId: z.ZodString;
}, z.core.$strip>;
export declare const updateEventZodSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    time: z.ZodOptional<z.ZodString>;
    venue: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    eventLink: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodOptional<z.ZodEnum<{
        PUBLIC: "PUBLIC";
        PRIVATE: "PRIVATE";
    }>>;
    fee: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxAttendees: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const EventValidation: {
    createEventZodSchema: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        date: z.ZodString;
        time: z.ZodString;
        venue: z.ZodOptional<z.ZodString>;
        eventLink: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<{
            PUBLIC: "PUBLIC";
            PRIVATE: "PRIVATE";
        }>>;
        fee: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        maxAttendees: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        categoryId: z.ZodString;
    }, z.core.$strip>;
    updateEventZodSchema: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        date: z.ZodOptional<z.ZodString>;
        time: z.ZodOptional<z.ZodString>;
        venue: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        eventLink: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodOptional<z.ZodEnum<{
            PUBLIC: "PUBLIC";
            PRIVATE: "PRIVATE";
        }>>;
        fee: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        maxAttendees: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        categoryId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
//# sourceMappingURL=event.validation.d.ts.map
export const validateRequest = (zodSchema) => {
    return (req, res, next) => {
        const parsedResult = zodSchema.safeParse(req.body);
        if (!parsedResult.success) {
            next(parsedResult.error);
        }
        //sanitizing the data
        req.body = parsedResult.data;
        next();
    };
};
//# sourceMappingURL=validateRequest.js.map
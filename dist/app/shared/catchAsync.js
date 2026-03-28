export const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            // console.error(error);
            // res.status(500).json({
            //   success: false,
            //   message: "An unexpected error occurred",
            //   error: error instanceof Error ? error.message : String(error),
            // });
            next(error);
        }
    };
};
//# sourceMappingURL=catchAsync.js.map
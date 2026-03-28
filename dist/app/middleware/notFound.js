import status from "http-status";
export const notFoundMiddleware = (req, res) => {
    res.status(status.NOT_FOUND).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};
//# sourceMappingURL=notFound.js.map
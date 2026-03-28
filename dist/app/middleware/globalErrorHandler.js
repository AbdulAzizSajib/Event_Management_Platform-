import { envVars } from "../config/env.js";
import { handleZodError } from "../errorHelpers/handleZodError.js";
import z from "zod";
import { status } from "http-status";
import AppError from "../errorHelpers/AppError.js";
import { deleteUploadedFilesFromGlobalErrorHandler } from "../utils/deleteUploadedFilesFromGlobalErrorHandler.js";
import { Prisma } from "../../generated/prisma/client.js";
import { handlePrismaClientKnownRequestError, handlePrismaClientUnknownError, handlePrismaClientValidationError, handlerPrismaClientInitializationError, handlerPrismaClientRustPanicError, } from "../errorHelpers/handlePrismaErrors.js";
//  global error handler
export const globalErrorHandler = async (err, req, res, next) => {
    //   console.error("Global error handler:", err);
    if (envVars.NODE_ENV === "development") {
        console.error("Error from Global Error Handler:", err);
    }
    // Cleanup uploaded files from Cloudinary if error occurs
    await deleteUploadedFilesFromGlobalErrorHandler(req);
    // handle different types of errors and send appropriate response
    let errorSources = [];
    let statusCode = status.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    let stack = undefined;
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = handlePrismaClientKnownRequestError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        const simplifiedError = handlePrismaClientUnknownError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof Prisma.PrismaClientValidationError) {
        const simplifiedError = handlePrismaClientValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        const simplifiedError = handlerPrismaClientRustPanicError();
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        const simplifiedError = handlerPrismaClientInitializationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    const errorResponse = {
        success: false,
        message: message,
        errorSources,
        error: envVars.NODE_ENV === "development" ? err : undefined,
        stack: envVars.NODE_ENV === "development" ? stack : undefined,
    };
    res.status(statusCode).json(errorResponse);
};
//# sourceMappingURL=globalErrorHandler.js.map
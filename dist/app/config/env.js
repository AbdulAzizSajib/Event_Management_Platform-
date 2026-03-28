import dotenv from "dotenv";
import AppError from "../errorHelpers/AppError.js";
import status from "http-status";
dotenv.config();
const loadEnvVariables = () => {
    const requiredEnvVariable = [
        "PORT",
        "NODE_ENV",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRES_IN",
        "REFRESH_TOKEN_EXPIRES_IN",
        "EMAIL_SENDER_SMTP_USER",
        "EMAIL_SENDER_SMTP_PASS",
        "EMAIL_SENDER_SMTP_HOST",
        "EMAIL_SENDER_SMTP_PORT",
        "EMAIL_SENDER_SMTP_FROM",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "FRONTEND_URL",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "ADMIN_NAME",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
    ];
    requiredEnvVariable.forEach((variable) => {
        if (!process.env[variable]) {
            throw new AppError(status.INTERNAL_SERVER_ERROR, `Missing required environment variable: ${variable}`);
        }
    });
    return {
        PORT: Number(process.env.PORT),
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
        EMAIL_SENDER: {
            SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
            SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
            SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
            SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
            SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM,
        },
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        },
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        ADMIN_NAME: process.env.ADMIN_NAME,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    };
};
export const envVars = loadEnvVariables();
//# sourceMappingURL=env.js.map
interface EnvConfig {
    PORT: number;
    NODE_ENV: string;
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    EMAIL_SENDER: {
        SMTP_USER: string;
        SMTP_PASS: string;
        SMTP_HOST: string;
        SMTP_PORT: string;
        SMTP_FROM: string;
    };
    FRONTEND_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    };
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    ADMIN_NAME: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
}
export declare const envVars: EnvConfig;
export {};
//# sourceMappingURL=env.d.ts.map
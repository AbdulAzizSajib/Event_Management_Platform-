export declare const auth: import("better-auth").Auth<{
    baseURL: string | undefined;
    secret: string;
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    plugins: [{
        id: "oauth-proxy";
        options: NoInfer<import("better-auth/plugins").OAuthProxyOptions>;
        endpoints: {
            oAuthProxy: import("better-auth").StrictEndpoint<"/oauth-proxy-callback", {
                method: "GET";
                operationId: string;
                query: import("zod").ZodObject<{
                    callbackURL: import("zod").ZodString;
                    profile: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        parameters: ({
                            in: "query";
                            name: string;
                            required: true;
                            description: string;
                        } | {
                            in: "query";
                            name: string;
                            required: false;
                            description: string;
                        })[];
                        responses: {
                            302: {
                                description: string;
                                headers: {
                                    Location: {
                                        description: string;
                                        schema: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, never>;
        };
        hooks: {
            before: {
                matcher(context: import("better-auth").HookEndpointContext): boolean;
                handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>;
            }[];
            after: {
                matcher(context: import("better-auth").HookEndpointContext): boolean;
                handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>;
            }[];
        };
    }, {
        id: "bearer";
        hooks: {
            before: {
                matcher(context: import("better-auth").HookEndpointContext): boolean;
                handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    context: {
                        headers: Headers;
                    };
                } | undefined>;
            }[];
            after: {
                matcher(context: import("better-auth").HookEndpointContext): true;
                handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>;
            }[];
        };
        options: import("better-auth/plugins").BearerOptions | undefined;
    }, {
        id: "email-otp";
        init(ctx: import("better-auth").AuthContext): {
            options: {
                emailVerification: {
                    sendVerificationEmail(data: {
                        user: import("better-auth").User;
                        url: string;
                        token: string;
                    }, request: Request | undefined): Promise<void>;
                };
            };
        } | undefined;
        endpoints: {
            sendVerificationOTP: import("better-auth").StrictEndpoint<"/email-otp/send-verification-otp", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    type: import("zod").ZodEnum<{
                        "sign-in": "sign-in";
                        "change-email": "change-email";
                        "email-verification": "email-verification";
                        "forget-password": "forget-password";
                    }>;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            createVerificationOTP: import("better-auth").StrictEndpoint<string, {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    type: import("zod").ZodEnum<{
                        "sign-in": "sign-in";
                        "change-email": "change-email";
                        "email-verification": "email-verification";
                        "forget-password": "forget-password";
                    }>;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "string";
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, string>;
            getVerificationOTP: import("better-auth").StrictEndpoint<string, {
                method: "GET";
                query: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    type: import("zod").ZodEnum<{
                        "sign-in": "sign-in";
                        "change-email": "change-email";
                        "email-verification": "email-verification";
                        "forget-password": "forget-password";
                    }>;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                otp: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                otp: null;
            } | {
                otp: string;
            }>;
            checkVerificationOTP: import("better-auth").StrictEndpoint<"/email-otp/check-verification-otp", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    type: import("zod").ZodEnum<{
                        "sign-in": "sign-in";
                        "change-email": "change-email";
                        "email-verification": "email-verification";
                        "forget-password": "forget-password";
                    }>;
                    otp: import("zod").ZodString;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            verifyEmailOTP: import("better-auth").StrictEndpoint<"/email-otp/verify-email", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    otp: import("zod").ZodString;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                    description: string;
                                                    enum: boolean[];
                                                };
                                                token: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                status: boolean;
                token: string;
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                } & Record<string, any>;
            } | {
                status: boolean;
                token: null;
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                } & Record<string, any>;
            }>;
            signInEmailOTP: import("better-auth").StrictEndpoint<"/sign-in/email-otp", {
                method: "POST";
                body: import("zod").ZodIntersection<import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    otp: import("zod").ZodString;
                    name: import("zod").ZodOptional<import("zod").ZodString>;
                    image: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("better-auth").$strip>, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                    description: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                token: string;
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                };
            }>;
            requestPasswordResetEmailOTP: import("better-auth").StrictEndpoint<"/email-otp/request-password-reset", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            forgetPasswordEmailOTP: import("better-auth").StrictEndpoint<"/forget-password/email-otp", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            resetPasswordEmailOTP: import("better-auth").StrictEndpoint<"/email-otp/reset-password", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    otp: import("zod").ZodString;
                    password: import("zod").ZodString;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            requestEmailChangeEmailOTP: import("better-auth").StrictEndpoint<"/email-otp/request-email-change", {
                method: "POST";
                body: import("zod").ZodObject<{
                    newEmail: import("zod").ZodString;
                    otp: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            changeEmailEmailOTP: import("better-auth").StrictEndpoint<"/email-otp/change-email", {
                method: "POST";
                body: import("zod").ZodObject<{
                    newEmail: import("zod").ZodString;
                    otp: import("zod").ZodString;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
        };
        hooks: {
            after: {
                matcher(context: import("better-auth").HookEndpointContext): boolean;
                handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>;
            }[];
        };
        rateLimit: ({
            pathMatcher(path: string): path is "/email-otp/send-verification-otp";
            window: number;
            max: number;
        } | {
            pathMatcher(path: string): path is "/email-otp/check-verification-otp";
            window: number;
            max: number;
        } | {
            pathMatcher(path: string): path is "/email-otp/verify-email";
            window: number;
            max: number;
        } | {
            pathMatcher(path: string): path is "/sign-in/email-otp";
            window: number;
            max: number;
        } | {
            pathMatcher(path: string): path is "/email-otp/request-password-reset";
            window: number;
            max: number;
        } | {
            pathMatcher(path: string): path is "/email-otp/reset-password";
            window: number;
            max: number;
        } | {
            pathMatcher(path: string): path is "/forget-password/email-otp";
            window: number;
            max: number;
        } | {
            pathMatcher(path: string): path is "/email-otp/request-email-change";
            window: number;
            max: number;
        } | {
            pathMatcher(path: string): path is "/email-otp/change-email";
            window: number;
            max: number;
        })[];
        options: import("better-auth/plugins").EmailOTPOptions;
        $ERROR_CODES: {
            OTP_EXPIRED: import("better-auth").RawError<"OTP_EXPIRED">;
            INVALID_OTP: import("better-auth").RawError<"INVALID_OTP">;
            TOO_MANY_ATTEMPTS: import("better-auth").RawError<"TOO_MANY_ATTEMPTS">;
        };
    }];
    emailAndPassword: {
        enabled: true;
    };
    emailVerification: {
        sendOnSignUp: true;
        sendOnSignIn: true;
        autoSignInAfterVerification: true;
    };
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
            accessType: "offline";
            prompt: "select_account consent";
            mapProfileToUser: () => {
                role: "USER";
                status: "ACTIVE";
                needPasswordChange: boolean;
                emailVerified: true;
                isDeleted: boolean;
                deletedAt: null;
            };
        };
    };
    user: {
        additionalFields: {
            role: {
                type: "string";
                required: true;
                defaultValue: "USER";
            };
            phone: {
                type: "string";
                required: false;
                defaultValue: string;
            };
            status: {
                type: "string";
                required: true;
                defaultValue: "ACTIVE";
            };
            needPasswordChange: {
                type: "boolean";
                required: true;
                defaultValue: false;
            };
            isDeleted: {
                type: "boolean";
                required: true;
                defaultValue: false;
            };
            deletedAt: {
                type: "date";
                required: false;
                defaultValue: null;
            };
        };
    };
    redirectURLs: {
        signIn: string;
    };
    trustedOrigins: string[];
    session: {
        expiresIn: number;
        updateAge: number;
        cookieCache: {
            enabled: true;
            maxAge: number;
        };
    };
    advanced: {
        useSecureCookies: false;
        cookies: {
            state: {
                name: string;
                attributes: {
                    sameSite: "none";
                    secure: true;
                    httpOnly: true;
                    path: string;
                };
            };
            sessionToken: {
                name: string;
                attributes: {
                    sameSite: "none";
                    secure: true;
                    httpOnly: true;
                    path: string;
                };
            };
        };
    };
}>;
//# sourceMappingURL=auth.d.ts.map
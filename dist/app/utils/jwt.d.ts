import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
export declare const jwtUtils: {
    createToken: (payload: JwtPayload, secret: string, options: SignOptions) => string;
    verifyToken: (token: string, secret: string) => {
        success: boolean;
        data: jwt.JwtPayload;
        message?: never;
        error?: never;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: never;
    };
    decodeToken: (token: string) => {
        success: boolean;
        message: string;
        data?: never;
    } | {
        success: boolean;
        data: jwt.JwtPayload;
        message?: never;
    };
};
//# sourceMappingURL=jwt.d.ts.map
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
const createToken = (payload, secret, options) => {
    const token = jwt.sign(payload, secret, options.expiresIn ? { expiresIn: options.expiresIn } : {});
    return token;
};
const verifyToken = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        return {
            success: true,
            data: decoded,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "An error occurred while verifying the token.",
            error,
        };
    }
};
const decodeToken = (token) => {
    const decoded = jwt.decode(token);
    if (!decoded) {
        return {
            success: false,
            message: "Failed to decode token.",
        };
    }
    return {
        success: true,
        data: decoded,
    };
};
export const jwtUtils = {
    createToken,
    verifyToken,
    decodeToken,
};
//# sourceMappingURL=jwt.js.map
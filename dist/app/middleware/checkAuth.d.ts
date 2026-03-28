import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
export declare const checkAuth: (...authRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=checkAuth.d.ts.map
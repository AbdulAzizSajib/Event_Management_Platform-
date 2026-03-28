import { Request, Response } from "express";
export declare const invitationController: {
    sendInvitation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    respondToInvitation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyInvitations: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getSentInvitations: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    cancelInvitation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=invitation.controller.d.ts.map
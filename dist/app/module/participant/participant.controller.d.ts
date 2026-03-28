import { Request, Response } from "express";
export declare const participantController: {
    joinEvent: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getEventParticipants: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyParticipations: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateParticipantStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    cancelParticipation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=participant.controller.d.ts.map
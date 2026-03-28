import { Request, Response } from "express";
export declare const savedEventController: {
    saveEvent: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    unsaveEvent: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMySavedEvents: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    isEventSaved: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=savedEvent.controller.d.ts.map
import { Request, Response } from "express";
export declare const eventController: {
    createEvent: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllEvents: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getEventById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyEvents: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateEvent: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteEvent: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    toggleFeatured: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getPlatformStats: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=event.controller.d.ts.map
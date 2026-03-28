import { Request, Response } from "express";
export declare const adminController: {
    getAllUsers: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getUserById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateUserStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllEventsAdmin: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteEvent: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllReviewsAdmin: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getDashboardStats: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=admin.controller.d.ts.map
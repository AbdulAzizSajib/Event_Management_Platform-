import { Request, Response } from "express";
export declare const reviewController: {
    createReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getEventReviews: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyReviews: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getFeaturedReviews: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=review.controller.d.ts.map
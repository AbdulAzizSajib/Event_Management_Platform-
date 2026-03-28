import { Request, Response } from "express";
export declare const paymentController: {
    createCheckoutSession: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    handleStripeWebhookEvent: (req: Request, res: Response) => Promise<void>;
    getPaymentsByEvent: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyPayments: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    verifyPayment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getPaymentReceipt: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=payment.controller.d.ts.map
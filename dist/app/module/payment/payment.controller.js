import { catchAsync } from "../../shared/catchAsync.js";
import { paymentService } from "./payment.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
import { stripe } from "../../lib/stripe.js";
import { envVars } from "../../config/env.js";
const createCheckoutSession = catchAsync(async (req, res) => {
    const result = await paymentService.createCheckoutSession(req.user.userId, req.body.eventId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Checkout session created successfully",
        data: result,
    });
});
const handleStripeWebhookEvent = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    try {
        const event = stripe.webhooks.constructEvent(req.body, signature, envVars.STRIPE_WEBHOOK_SECRET);
        const result = await paymentService.handleStripeWebhookEvent(event);
        res.status(200).json(result);
    }
    catch {
        res.status(400).json({ error: "Webhook processing failed" });
    }
};
const getPaymentsByEvent = catchAsync(async (req, res) => {
    const result = await paymentService.getPaymentsByEvent(req.params.eventId, req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Payments retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getMyPayments = catchAsync(async (req, res) => {
    const result = await paymentService.getMyPayments(req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "My payments retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const verifyPayment = catchAsync(async (req, res) => {
    const result = await paymentService.verifyPayment(req.params.sessionId, req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Payment verified successfully",
        data: result,
    });
});
const getPaymentReceipt = catchAsync(async (req, res) => {
    const result = await paymentService.getPaymentReceipt(req.params.paymentId, req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Payment receipt retrieved successfully",
        data: result,
    });
});
export const paymentController = {
    createCheckoutSession,
    handleStripeWebhookEvent,
    getPaymentsByEvent,
    getMyPayments,
    verifyPayment,
    getPaymentReceipt,
};
//# sourceMappingURL=payment.controller.js.map
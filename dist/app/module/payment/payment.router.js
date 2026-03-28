import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { PaymentValidation } from "./payment.validation.js";
import { Role } from "../../../generated/prisma/enums.js";
const paymentRouter = Router();
// Create Stripe checkout session
paymentRouter.post("/create-checkout-session", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), validateRequest(PaymentValidation.createCheckoutSessionZodSchema), paymentController.createCheckoutSession);
// Get my payments
paymentRouter.get("/my-payments", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), paymentController.getMyPayments);
// Verify payment by session ID (after Stripe checkout)
paymentRouter.get("/verify/:sessionId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), paymentController.verifyPayment);
// Get payment receipt by payment ID (anytime)
paymentRouter.get("/receipt/:paymentId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), paymentController.getPaymentReceipt);
// Get payments for a specific event (organizer only)
paymentRouter.get("/event/:eventId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), paymentController.getPaymentsByEvent);
export default paymentRouter;
//# sourceMappingURL=payment.router.js.map
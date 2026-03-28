import Stripe from "stripe";
import { Payment } from "../../../generated/prisma/client";
import { PaymentMethod, PaymentStatus, ParticipantStatus } from "../../../generated/prisma/enums";
import { IQueryParams, IQueryResult } from "../../interfaces/query.interface";
export declare const paymentService: {
    createCheckoutSession: (userId: string, eventId: string) => Promise<{
        sessionId: string;
        url: string;
    }>;
    handleStripeWebhookEvent: (event: Stripe.Event) => Promise<{
        message: string;
    }>;
    getPaymentsByEvent: (eventId: string, userId: string, query: IQueryParams) => Promise<IQueryResult<Payment>>;
    getMyPayments: (userId: string, query: IQueryParams) => Promise<IQueryResult<Payment>>;
    verifyPayment: (sessionId: string, userId: string) => Promise<{
        paymentId: string;
        transactionId: string | null;
        amount: import("@prisma/client/runtime/client").Decimal;
        method: PaymentMethod;
        status: PaymentStatus;
        paidAt: Date;
        ticket: {
            participantStatus: ParticipantStatus | null;
            joinedAt: Date | null;
        };
        event: {
            date: Date;
            type: import("../../../generated/prisma/enums").EventType;
            id: string;
            image: string | null;
            time: string;
            title: string;
            description: string;
            venue: string | null;
            eventLink: string | null;
            fee: import("@prisma/client/runtime/client").Decimal;
            organizer: {
                name: string;
                email: string;
                id: string;
                image: string | null;
            };
        };
        user: {
            name: string;
            email: string;
            id: string;
            image: string | null;
        };
    }>;
    getPaymentReceipt: (paymentId: string, userId: string) => Promise<{
        paymentId: string;
        transactionId: string | null;
        amount: import("@prisma/client/runtime/client").Decimal;
        method: PaymentMethod;
        status: PaymentStatus;
        paidAt: Date;
        ticket: {
            participantStatus: ParticipantStatus | null;
            joinedAt: Date | null;
        };
        event: {
            date: Date;
            type: import("../../../generated/prisma/enums").EventType;
            id: string;
            image: string | null;
            time: string;
            title: string;
            description: string;
            venue: string | null;
            eventLink: string | null;
            fee: import("@prisma/client/runtime/client").Decimal;
            organizer: {
                name: string;
                email: string;
                id: string;
                image: string | null;
            };
        };
        user: {
            name: string;
            email: string;
            id: string;
            image: string | null;
        };
    }>;
};
//# sourceMappingURL=payment.service.d.ts.map
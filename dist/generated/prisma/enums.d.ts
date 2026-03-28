export declare const Role: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly ADMIN: "ADMIN";
    readonly USER: "USER";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const UserStatus: {
    readonly BLOCKED: "BLOCKED";
    readonly DELETED: "DELETED";
    readonly ACTIVE: "ACTIVE";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const Gender: {
    readonly MALE: "MALE";
    readonly FEMALE: "FEMALE";
};
export type Gender = (typeof Gender)[keyof typeof Gender];
export declare const EventType: {
    readonly PUBLIC: "PUBLIC";
    readonly PRIVATE: "PRIVATE";
};
export type EventType = (typeof EventType)[keyof typeof EventType];
export declare const ParticipantStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly BANNED: "BANNED";
};
export type ParticipantStatus = (typeof ParticipantStatus)[keyof typeof ParticipantStatus];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly SUCCESS: "SUCCESS";
    readonly FAILED: "FAILED";
    readonly CANCELLED: "CANCELLED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const PaymentMethod: {
    readonly STRIPE: "STRIPE";
    readonly SSLCOMMERZ: "SSLCOMMERZ";
    readonly SHURJOPAY: "SHURJOPAY";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const InvitationStatus: {
    readonly PENDING: "PENDING";
    readonly ACCEPTED: "ACCEPTED";
    readonly DECLINED: "DECLINED";
};
export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus];
//# sourceMappingURL=enums.d.ts.map
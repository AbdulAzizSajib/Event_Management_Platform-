import { UserStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { IChangePasswordPayload } from "./auth.interface";
interface IRegisterUserPayload {
    name: string;
    email: string;
    password: string;
}
interface ILoginUserPayload {
    email: string;
    password: string;
}
export declare const authService: {
    registerUser: (payload: IRegisterUserPayload) => Promise<{
        accessToken: string;
        refreshToken: string;
        token: null;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            role: string;
            status: string;
            needPasswordChange: boolean;
            isDeleted: boolean;
            phone: string | null | undefined;
            deletedAt?: Date | null | undefined;
        };
    } | {
        accessToken: string;
        refreshToken: string;
        token: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            role: string;
            status: string;
            needPasswordChange: boolean;
            isDeleted: boolean;
            phone: string | null | undefined;
            deletedAt?: Date | null | undefined;
        };
    }>;
    loginUser: (payload: ILoginUserPayload) => Promise<{
        accessToken: string;
        refreshToken: string;
        redirect: boolean;
        token: string;
        url?: string | undefined;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            role: string;
            status: string;
            needPasswordChange: boolean;
            isDeleted: boolean;
            phone: string | null | undefined;
            deletedAt?: Date | null | undefined;
        };
    }>;
    getMe: (user: IRequestUser) => Promise<{
        admin: {
            name: string;
            email: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profilePhoto: string | null;
            contactNumber: string | null;
            address: string | null;
            gender: import("../../../generated/prisma/enums").Gender | null;
        } | null;
        organizedEvents: {
            date: Date;
            type: import("../../../generated/prisma/enums").EventType;
            id: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            time: string;
            organizerId: string;
            title: string;
            description: string;
            venue: string | null;
            eventLink: string | null;
            fee: import("@prisma/client/runtime/client").Decimal;
            maxAttendees: number | null;
            isFeatured: boolean;
            categoryId: string | null;
        }[];
        participants: ({
            event: {
                date: Date;
                type: import("../../../generated/prisma/enums").EventType;
                id: string;
                image: string | null;
                createdAt: Date;
                updatedAt: Date;
                time: string;
                organizerId: string;
                title: string;
                description: string;
                venue: string | null;
                eventLink: string | null;
                fee: import("@prisma/client/runtime/client").Decimal;
                maxAttendees: number | null;
                isFeatured: boolean;
                categoryId: string | null;
            };
        } & {
            status: import("../../../generated/prisma/enums").ParticipantStatus;
            id: string;
            updatedAt: Date;
            userId: string;
            eventId: string;
            joinedAt: Date;
        })[];
        invitations: {
            status: import("../../../generated/prisma/enums").InvitationStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            inviteeId: string;
            eventId: string;
            inviterId: string;
        }[];
        invitedTo: {
            status: import("../../../generated/prisma/enums").InvitationStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            inviteeId: string;
            eventId: string;
            inviterId: string;
        }[];
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            eventId: string;
            rating: number;
            comment: string;
        }[];
    } & {
        name: string;
        email: string;
        role: import("../../../generated/prisma/enums").Role;
        status: UserStatus;
        needPasswordChange: boolean;
        emailVerified: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        id: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    }>;
    getNewToken: (refreshToken: string, sessionToken: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        sessionToken: string;
    }>;
    changePassword: (payload: IChangePasswordPayload, sessionToken: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        token: string | null;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        } & Record<string, any> & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        };
    }>;
    logoutUser: (sessionToken: string) => Promise<{
        success: boolean;
    }>;
    verifyEmail: (email: string, otp: string) => Promise<void>;
    forgetPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
    resendOTP: (email: string, type: "email-verification" | "forget-password") => Promise<void>;
    googleLoginSuccess: (session: Record<string, any>) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map
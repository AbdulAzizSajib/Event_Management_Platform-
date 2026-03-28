import { User } from "../../../generated/prisma/client";
import { ICreateAdmin } from "./user.interface";
export declare const userService: {
    createAdmin: (payload: ICreateAdmin) => Promise<{
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
    }>;
    updateProfile: (userId: string, payload: {
        name?: string;
        phone?: string;
    }, file?: Express.Multer.File) => Promise<User>;
    getMyDashboard: (userId: string) => Promise<{
        counts: {
            organizedEvents: number;
            participations: number;
            pendingInvitations: number;
            reviews: number;
            savedEvents: number;
            totalSpent: number;
        };
        upcoming: {
            organizedEvents: number;
            participatingEvents: number;
        };
        participationBreakdown: {
            pending: number;
            approved: number;
            rejected: number;
        };
        recentOrganizedEvents: {
            date: Date;
            type: import("../../../generated/prisma/enums").EventType;
            id: string;
            _count: {
                participants: number;
                reviews: number;
            };
            title: string;
            fee: import("@prisma/client/runtime/client").Decimal;
            isFeatured: boolean;
        }[];
        recentParticipations: ({
            event: {
                date: Date;
                type: import("../../../generated/prisma/enums").EventType;
                id: string;
                title: string;
                venue: string | null;
            };
        } & {
            status: import("../../../generated/prisma/enums").ParticipantStatus;
            id: string;
            updatedAt: Date;
            userId: string;
            eventId: string;
            joinedAt: Date;
        })[];
        pendingInvitations: ({
            event: {
                date: Date;
                id: string;
                title: string;
            };
            inviter: {
                name: string;
                id: string;
            };
        } & {
            status: import("../../../generated/prisma/enums").InvitationStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            inviteeId: string;
            eventId: string;
            inviterId: string;
        })[];
        recentReviews: ({
            event: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            eventId: string;
            rating: number;
            comment: string;
        })[];
        recentSavedEvents: ({
            event: {
                date: Date;
                type: import("../../../generated/prisma/enums").EventType;
                id: string;
                title: string;
                venue: string | null;
                fee: import("@prisma/client/runtime/client").Decimal;
            };
        } & {
            id: string;
            userId: string;
            eventId: string;
            savedAt: Date;
        })[];
    }>;
};
//# sourceMappingURL=user.service.d.ts.map